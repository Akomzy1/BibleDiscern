import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { adminClient } from '@/lib/supabase/admin';
import { ok, handleError } from '@/lib/response';
import { adminCreateScaleSchema, toAdminScale, ALL_STATUSES } from '@/lib/admin-scales';
import { computeInventory } from '@/lib/admin-metrics';
import type { ScaleRow } from '@/lib/daily-selector';

/**
 * GET /api/admin/scales?status=draft
 * Returns the full admin list (optionally filtered by status) plus an inventory
 * summary: approved runway, territory distribution, and the next 7 dated scales.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const statusParam = new URL(request.url).searchParams.get('status');
    const status =
      statusParam && (ALL_STATUSES as readonly string[]).includes(statusParam) ? statusParam : null;

    let query = adminClient
      .from('daily_scales')
      .select('*')
      .order('published_date', { ascending: false, nullsFirst: false })
      .order('approved_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data: rows, error } = await query;
    if (error) throw error;
    const scales = ((rows ?? []) as (ScaleRow & { created_at?: string })[]).map(toAdminScale);

    // Inventory computed by the shared definition (same one the /admin overview
    // uses) so the two surfaces can never drift. When the list is status-filtered
    // the counts reflect that filter — the overview always reads unfiltered.
    const inventory = computeInventory(scales);

    return ok({ scales, inventory });
  } catch (e) {
    return handleError(e);
  }
}

/**
 * POST /api/admin/scales
 * Create a manual scale. source='manual'. Never published directly — a manual
 * scale enters as draft (or draft+approved) and only the selector ever stamps a
 * published_date, preserving the structural no-repeat guarantee.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const input = adminCreateScaleSchema.parse(body);

    const nowIso = new Date().toISOString();
    const { seed_votes_a, seed_votes_b, status, ...content } = input;

    const insert = {
      ...content,
      votes_a: seed_votes_a,
      votes_b: seed_votes_b,
      status,
      source: 'manual',
      published_date: null,
      approved_at: status === 'approved' ? nowIso : null,
    };

    const { data, error } = await adminClient
      .from('daily_scales')
      .insert(insert)
      .select('*')
      .single();
    if (error) throw error;

    return ok({ scale: toAdminScale(data as ScaleRow & { created_at?: string }) }, 201);
  } catch (e) {
    return handleError(e);
  }
}
