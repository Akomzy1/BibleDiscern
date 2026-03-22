import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminClient } from '@/lib/supabase/admin';
import { sendPushNotification } from '@/lib/push';

const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel Cron — secured with CRON_SECRET (set in Vercel environment variables)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = { sent_1w: 0, sent_1m: 0, sent_3m: 0, errors: 0 };

  try {
    // ─── 1-week follow-up ─────────────────────────────────────────────────────
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: sessions1w } = await adminClient
      .from('sessions')
      .select('id, user_id, situation, created_at')
      .eq('status', 'completed')
      .eq('follow_up_1w_sent', false)
      .gte('created_at', new Date(oneWeekAgo.getTime() - 60 * 60 * 1000).toISOString())  // ±1 hour window
      .lte('created_at', new Date(oneWeekAgo.getTime() + 60 * 60 * 1000).toISOString());

    for (const session of sessions1w ?? []) {
      const sent = await sendFollowUpEmail(session, '1w', 'One Week Later');
      if (sent) {
        await adminClient
          .from('sessions')
          .update({ follow_up_1w_sent: true })
          .eq('id', session.id);
        results.sent_1w++;
      } else {
        results.errors++;
      }
    }

    // ─── 1-month follow-up ────────────────────────────────────────────────────
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const { data: sessions1m } = await adminClient
      .from('sessions')
      .select('id, user_id, situation, created_at')
      .eq('status', 'completed')
      .eq('follow_up_1m_sent', false)
      .gte('created_at', new Date(oneMonthAgo.getTime() - 60 * 60 * 1000).toISOString())
      .lte('created_at', new Date(oneMonthAgo.getTime() + 60 * 60 * 1000).toISOString());

    for (const session of sessions1m ?? []) {
      const sent = await sendFollowUpEmail(session, '1m', 'One Month Later');
      if (sent) {
        await adminClient
          .from('sessions')
          .update({ follow_up_1m_sent: true })
          .eq('id', session.id);
        results.sent_1m++;
      } else {
        results.errors++;
      }
    }

    // ─── 3-month follow-up ────────────────────────────────────────────────────
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    const { data: sessions3m } = await adminClient
      .from('sessions')
      .select('id, user_id, situation, created_at')
      .eq('status', 'completed')
      .eq('follow_up_3m_sent', false)
      .gte('created_at', new Date(threeMonthsAgo.getTime() - 60 * 60 * 1000).toISOString())
      .lte('created_at', new Date(threeMonthsAgo.getTime() + 60 * 60 * 1000).toISOString());

    for (const session of sessions3m ?? []) {
      const sent = await sendFollowUpEmail(session, '3m', 'Three Months Later');
      if (sent) {
        await adminClient
          .from('sessions')
          .update({ follow_up_3m_sent: true })
          .eq('id', session.id);
        results.sent_3m++;
      } else {
        results.errors++;
      }
    }

    console.info('[follow-up cron] Results:', results);
    return NextResponse.json({ ok: true, ...results });
  } catch (err) {
    console.error('[follow-up cron] Fatal error:', err);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

// ─── Email sender ─────────────────────────────────────────────────────────────

async function sendFollowUpEmail(
  session: { id: string; user_id: string; situation: string },
  period: '1w' | '1m' | '3m',
  periodLabel: string,
): Promise<boolean> {
  try {
    // Get user email from auth
    const { data: userData } = await adminClient.auth.admin.getUserById(session.user_id);
    if (!userData.user?.email) return false;

    const { data: profile } = await adminClient
      .from('profiles')
      .select('display_name, expo_push_token')
      .eq('id', session.user_id)
      .single();

    const name = profile?.display_name ?? 'Friend';
    const pushToken = profile?.expo_push_token as string | undefined;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://librato.ai';
    const deepLink = `${appUrl}/app/journal/${session.id}`;
    const situationPreview = session.situation.slice(0, 100) + (session.situation.length > 100 ? '...' : '');

    const subjectMap = {
      '1w': `How did it go? — ${periodLabel}`,
      '1m': `A month of wisdom — checking in`,
      '3m': `Looking back: three months of discernment`,
    };

    const introMap = {
      '1w': `A week ago, you brought something to God through LibratoAi. We wanted to gently check in.`,
      '1m': `A month has passed since you sought wisdom through LibratoAi. How has God moved?`,
      '3m': `Three months ago, you were weighing something important. Looking back, what do you see now?`,
    };

    const { error } = await resend.emails.send({
      from: 'LibratoAi <noreply@librato.ai>',
      to: userData.user.email,
      subject: subjectMap[period],
      html: buildEmailHtml({
        name,
        intro: introMap[period],
        situationPreview,
        deepLink,
        periodLabel,
      }),
    });

    if (error) {
      console.error('[follow-up email] Resend error:', error);
      return false;
    }

    // Also send a push notification if the user has a token
    if (pushToken) {
      const pushBodyMap = {
        '1w': `A week ago you were weighing something. How did God move?`,
        '1m': `A month has passed. Open your journal to record what God showed you.`,
        '3m': `Three months later — how has God been faithful?`,
      };
      await sendPushNotification(
        pushToken,
        'How did it turn out? ✝',
        pushBodyMap[period],
        { type: 'follow_up', entryId: session.id },
      );
    }

    return true;
  } catch (err) {
    console.error('[follow-up email] Unexpected error:', err);
    return false;
  }
}

function buildEmailHtml({
  name,
  intro,
  situationPreview,
  deepLink,
  periodLabel,
}: {
  name: string;
  intro: string;
  situationPreview: string;
  deepLink: string;
  periodLabel: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#FDF6EC;font-family:'Source Sans 3',Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:#FEFCF6;border:1px solid #E8DFD0;border-radius:8px;overflow:hidden;">

    <!-- Header -->
    <div style="background:#1B2A4A;padding:32px;text-align:center;">
      <div style="color:#C8A45E;font-size:13px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">LibratoAi</div>
      <div style="color:#E8D5A3;font-size:22px;font-style:italic;">${periodLabel}</div>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <p style="color:#2C2418;font-size:16px;margin:0 0 16px;">Dear ${name},</p>
      <p style="color:#5C5144;font-size:16px;line-height:1.7;margin:0 0 24px;">${intro}</p>

      <!-- Session preview -->
      <div style="background:#F5ECD7;border-left:3px solid #C8A45E;border-radius:4px;padding:16px 20px;margin:0 0 24px;">
        <div style="color:#8A7F72;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">You were weighing</div>
        <p style="color:#2C2418;font-size:15px;font-style:italic;line-height:1.6;margin:0;">"${situationPreview}"</p>
      </div>

      <p style="color:#5C5144;font-size:15px;line-height:1.7;margin:0 0 32px;">
        Open your journal to record what God has shown you. Your Ebenezer stone is waiting.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${deepLink}"
           style="display:inline-block;background:linear-gradient(135deg,#C8A45E,#D4BA7A);color:#1B2A4A;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.5px;">
          Open My Journal
        </a>
      </div>

      <p style="color:#8A7F72;font-size:13px;font-style:italic;text-align:center;margin:0;">
        "Thus far the Lord has helped us." — 1 Samuel 7:12
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #E8DFD0;padding:20px 32px;text-align:center;">
      <p style="color:#8A7F72;font-size:11px;margin:0;">
        LibratoAi — Weigh it with wisdom<br>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color:#8A7F72;">Unsubscribe from follow-up emails</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}
