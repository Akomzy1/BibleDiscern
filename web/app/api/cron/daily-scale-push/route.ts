import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { adminClient } from '@/lib/supabase/admin';

// Daily Vercel cron: sends the Daily Scale reminder to every opted-in user
// (opt-in = a stored Web Push subscription). Auth: Bearer CRON_SECRET.
//
// NOTE: Vercel's Hobby plan only permits once-per-day crons, so this fires
// once daily for everyone rather than hourly per user's chosen daily_scale_time.
// To honor each user's chosen hour, upgrade to Vercel Pro and restore an hourly
// schedule (0 * * * *) in vercel.json plus the per-hour filter (git history).

export const maxDuration = 60;

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
    .select('id, endpoint, p256dh, auth');
  if (error || !subs?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const payload = JSON.stringify({
    title: 'The Daily Scale',
    body: "Today's question is waiting. Weigh it with wisdom.",
    url: '/today',
  });

  let sent = 0;
  const stale: string[] = [];
  await Promise.all(
    subs.map(async (s) => {
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
