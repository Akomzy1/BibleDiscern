import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);
    const offset = Number(searchParams.get('offset') ?? 0);

    const { data: sessions, error, count } = await adminClient
      .from('sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[sessions GET]', error);
      return err('server_error', 'Failed to fetch sessions.', 500);
    }

    return ok({ sessions, total: count ?? 0, limit, offset });
  } catch (e) {
    return handleError(e);
  }
}
