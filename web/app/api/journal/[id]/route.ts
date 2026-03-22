import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

const UpdateJournalSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().max(10_000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

async function getOwnedEntry(userId: string, entryId: string) {
  const { data, error } = await adminClient
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await params;
    const entry = await getOwnedEntry(user.id, id);
    if (!entry) {
      return err('not_found', 'Journal entry not found.', 404);
    }
    return ok({ entry });
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await params;
    const entry = await getOwnedEntry(user.id, id);
    if (!entry) {
      return err('not_found', 'Journal entry not found.', 404);
    }
    const body = await request.json();
    const updates = UpdateJournalSchema.parse(body);
    const { data: updated, error } = await adminClient
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) {
      console.error('[journal PATCH]', error);
      return err('server_error', 'Failed to update journal entry.', 500);
    }
    return ok({ entry: updated });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireAuth(request);
    const { id } = await params;
    const entry = await getOwnedEntry(user.id, id);
    if (!entry) {
      return err('not_found', 'Journal entry not found.', 404);
    }
    const { error } = await adminClient
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      console.error('[journal DELETE]', error);
      return err('server_error', 'Failed to delete journal entry.', 500);
    }
    return new Response(null, { status: 204 });
  } catch (e) {
    return handleError(e);
  }
}