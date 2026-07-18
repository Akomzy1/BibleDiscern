import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { adminClient } from '@/lib/supabase/admin';

// Hourly Vercel cron: sends the Daily Scale reminder to each user whose chosen
// time (profiles.daily_scale_time, in their profile timezone) matches the
// current hour. Opt-in = having a stored Web Push subscription. Auth: Bearer
// CRON_SECRET, same as /api/follow-up.

export const maxDuration = 60;

function localHour(timeZone: string): number {
  try {
    return Number(
      new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', hour12: false }).format(
        new Date(),
      ),
    );
  } catch {
    return new Date().getUTCHours();
  }
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('Authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'vapid_not_configured' }, { status: 500 });
  }

  webpush.setVapidDetails(
    'mailto:support@biblediscern.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );

  const { data: subs, error } = await adminClient
    .from('push_subscriptions')
    .select('id, user_id, endpoint, p256dh, auth');
  if (error || !subs?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const userIds = Array.from(new Set(subs.map((s) => s.user_id)));
  const { data: profiles } = await adminClient
    .from('profiles')
    .select('id, daily_scale_time, timezone')
    .in('id', userIds);

  const due = new Set(
    (profiles ?? [])
      .filter((p) => {
        const hour = Number((p.daily_scale_time ?? '08:00').split(':')[0]);
        return localHour(p.timezone ?? 'UTC') === hour;
      })
      .map((p) => p.id),
  );

  const payload = JSON.stringify({
    title: 'The Daily Scale',
    body: "Today's question is waiting. Weigh it with wisdom.",
    url: '/today',
  });

  let sent = 0;
  const stale: string[] = [];
  await Promise.all(
    subs
      .filter((s) => due.has(s.user_id))
      .map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
          );
          sent++;
        } catch (e) {
          const status = (e as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) stale.push(s.id);
        }
      }),
  );

  if (stale.length) {
    await adminClient.from('push_subscriptions').delete().in('id', stale);
  }

  return NextResponse.json({ sent, pruned: stale.length });
}
