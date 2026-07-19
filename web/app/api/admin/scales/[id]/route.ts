import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';
import {
  adminUpdateScaleSchema,
  toAdminScale,
  EDITABLE_STATUSES,
  RETIRABLE_STATUSES,
  APPROVABLE_STATUSES,
} from '@/lib/admin-scales';
import type { ScaleRow } from '@/lib/daily-selector';

/**
 * PATCH /api/admin/scales/[id]
 * Lifecycle transitions on a draft/approved scale:
 *   - edit    apply content patch (draft/approved only)
 *   - approve draft → approved (stamps approved_at)
 *   - retire  draft/approved → retired
 * Published rows are IMMUTABLE from this surface (a published scale is public).
 */
export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const { id } = await ctx.params;

    const body = await request.json();
    const { action, patch } = adminUpdateScaleSchema.parse(body);

    const { data: existing, error: readErr } = await adminClient
      .from('daily_scales')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (readErr) throw readErr;
    if (!existing) return err('not_found', 'Scale not found.', 404);

    const current = existing as ScaleRow;

    if (action === 'edit') {
      if (!(EDITABLE_STATUSES as readonly string[]).includes(current.status)) {
        return err('conflict', `A ${current.status} scale cannot be edited.`, 409);
      }
      if (!patch || Object.keys(patch).length === 0) {
        return err('validation_error', 'Nothing to edit.', 400);
      }
      const { seed_votes_a, seed_votes_b, ...content } = patch;
      const update: Record<string, unknown> = { ...content };
      if (seed_votes_a !== undefined) update.votes_a = seed_votes_a;
      if (seed_votes_b !== undefined) update.votes_b = seed_votes_b;

      const { data, error } = await adminClient
        .from('daily_scales')
        .update(update)
        .eq('id', id)
        .in('status', EDITABLE_STATUSES as unknown as string[])
        .select('*')
        .single();
      if (error) throw error;
      return ok({ scale: toAdminScale(data as ScaleRow & { created_at?: string }) });
    }

    if (action === 'approve') {
      if (!(APPROVABLE_STATUSES as readonly string[]).includes(current.status)) {
        return err('conflict', `Only a draft can be approved (this is ${current.status}).`, 409);
      }
      const { data, error } = await adminClient
        .from('daily_scales')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', id)
        .eq('status', 'draft')
        .select('*')
        .single();
      if (error) throw error;
      return ok({ scale: toAdminScale(data as ScaleRow & { created_at?: string }) });
    }

    // action === 'retire'
    if (!(RETIRABLE_STATUSES as readonly string[]).includes(current.status)) {
      return err('conflict', `A ${current.status} scale cannot be retired here.`, 409);
    }
    const { data, error } = await adminClient
      .from('daily_scales')
      .update({ status: 'retired' })
      .eq('id', id)
      .in('status', RETIRABLE_STATUSES as unknown as string[])
      .select('*')
      .single();
    if (error) throw error;
    return ok({ scale: toAdminScale(data as ScaleRow & { created_at?: string }) });
  } catch (e) {
    return handleError(e);
  }
}
