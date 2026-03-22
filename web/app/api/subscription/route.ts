import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    const { data: subscription, error } = await adminClient
      .from('subscriptions')
      .select(
        'id, tier, billing_interval, source, status, sessions_used_this_month, sessions_limit, current_period_start, current_period_end, created_at',
      )
      .eq('user_id', user.id)
      .single();

    if (error || !subscription) {
      return err('not_found', 'Subscription not found.', 404);
    }

    return ok({ subscription });
  } catch (e) {
    return handleError(e);
  }
}
