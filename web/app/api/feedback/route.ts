import { NextRequest } from 'next/server';
import { FeedbackRequestSchema } from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, handleError } from '@/lib/response';

// POST /api/feedback — capture a rating and/or short message. Additive route.
// Writes are attributed to the authenticated user; no content beyond the
// feedback itself is stored.
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();
    const { source, rating, message } = FeedbackRequestSchema.parse(body);

    const { error } = await adminClient.from('feedback').insert({
      user_id: user.id,
      source,
      rating: rating ?? null,
      message: message && message.length > 0 ? message : null,
    });
    if (error) throw error;

    return ok({ received: true }, 201);
  } catch (e) {
    return handleError(e);
  }
}
