import { NextRequest } from 'next/server';
import { PushSubscribeRequestSchema } from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

// Store a Web Push (VAPID) subscription for the daily-scale reminder at the
// user's chosen time (profiles.daily_scale_time).
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();
    const sub = PushSubscribeRequestSchema.parse(body);

    const { error } = await adminClient.from('push_subscriptions').upsert(
      {
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
      { onConflict: 'endpoint' },
    );

    if (error) {
      console.error('[push subscribe]', error.code);
      return err('server_error', 'Failed to save push subscription.', 500);
    }

    return ok({ subscribed: true }, 201);
  } catch (e) {
    return handleError(e);
  }
}

// Allow a client to remove its subscription (e.g. notifications toggled off).
export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json().catch(() => ({}));
    const endpoint = typeof body?.endpoint === 'string' ? body.endpoint : null;

    const query = adminClient.from('push_subscriptions').delete().eq('user_id', user.id);
    const { error } = endpoint ? await query.eq('endpoint', endpoint) : await query;

    if (error) {
      console.error('[push unsubscribe]', error.code);
      return err('server_error', 'Failed to remove push subscription.', 500);
    }
    return new Response(null, { status: 204 });
  } catch (e) {
    return handleError(e);
  }
}
