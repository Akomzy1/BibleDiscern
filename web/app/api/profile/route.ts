import { NextRequest } from 'next/server';
import { UpdateProfileRequestSchema } from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    // Return profile + subscription in one call to minimize round-trips
    const [profileResult, subResult] = await Promise.all([
      adminClient.from('profiles').select('*').eq('id', user.id).single(),
      adminClient
        .from('subscriptions')
        .select('tier, status, sessions_used_this_month, sessions_limit, current_period_end, billing_interval')
        .eq('user_id', user.id)
        .single(),
    ]);

    if (profileResult.error || !profileResult.data) {
      return err('not_found', 'Profile not found.', 404);
    }

    return ok({
      profile: profileResult.data,
      subscription: subResult.data ?? null,
    });
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    const body = await request.json();
    const updates = UpdateProfileRequestSchema.parse(body);

    const { data: profile, error } = await adminClient
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[profile PATCH]', error);
      return err('server_error', 'Failed to update profile.', 500);
    }

    return ok({ profile });
  } catch (e) {
    return handleError(e);
  }
}
