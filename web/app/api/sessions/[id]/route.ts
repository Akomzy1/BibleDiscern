import { NextRequest } from 'next/server';
import { z } from 'zod';
import { UpdateSessionRequestSchema } from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

async function getOwnedSession(userId: string, sessionId: string) {
  const { data, error } = await adminClient
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await requireAuth(request);

    const session = await getOwnedSession(user.id, params.id);
    if (!session) {
      return err('not_found', 'Session not found.', 404);
    }

    return ok({ session });
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user } = await requireAuth(request);

    const session = await getOwnedSession(user.id, params.id);
    if (!session) {
      return err('not_found', 'Session not found.', 404);
    }

    const body = await request.json();
    const updates = UpdateSessionRequestSchema.parse(body);

    // If completing the session, set completed_at
    const finalUpdates = {
      ...updates,
      ...(updates.status === 'completed' && !session.completed_at
        ? { completed_at: new Date().toISOString() }
        : {}),
    };

    const { data: updated, error } = await adminClient
      .from('sessions')
      .update(finalUpdates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[sessions PATCH]', error);
      return err('server_error', 'Failed to update session.', 500);
    }

    return ok({ session: updated });
  } catch (e) {
    return handleError(e);
  }
}
