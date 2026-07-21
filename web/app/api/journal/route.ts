import { NextRequest } from 'next/server';
import { CreateJournalEntryRequestSchema } from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    // Get subscription tier for access control
    const { data: sub } = await adminClient
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .single();

    // Free = anything but a real Premium tier ('trialing' is the free-signup
    // default, not a Premium trial). Free tier sees only the last 3 entries.
    const isFreeAndNotTrial = !sub || sub.tier !== 'premium';

    // Get total count first
    const { count: totalCount } = await adminClient
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Fetch entries — limit free tier to 3
    const limit = isFreeAndNotTrial ? 3 : 1000;

    const { data: entries, error } = await adminClient
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[journal GET]', error);
      return err('server_error', 'Failed to fetch journal entries.', 500);
    }

    return ok({
      entries,
      total: totalCount ?? 0,
      // Let the client know how many are locked/hidden
      locked: isFreeAndNotTrial ? Math.max(0, (totalCount ?? 0) - 3) : 0,
    });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    const body = await request.json();
    const data = CreateJournalEntryRequestSchema.parse(body);

    // If linking to a session, verify ownership
    if (data.session_id) {
      const { data: session } = await adminClient
        .from('sessions')
        .select('id')
        .eq('id', data.session_id)
        .eq('user_id', user.id)
        .single();

      if (!session) {
        return err('not_found', 'Session not found.', 404);
      }
    }

    const { data: entry, error } = await adminClient
      .from('journal_entries')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('[journal POST]', error);
      return err('server_error', 'Failed to create journal entry.', 500);
    }

    return ok({ entry }, 201);
  } catch (e) {
    return handleError(e);
  }
}
