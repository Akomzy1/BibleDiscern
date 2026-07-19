import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { adminClient } from '@/lib/supabase/admin';
import { ok, handleError } from '@/lib/response';
import { adminCreateScaleSchema, toAdminScale, ALL_STATUSES } from '@/lib/admin-scales';
import type { ScaleRow } from '@/lib/daily-selector';

function isoToday(): string {
  return new Date().toISOString().split('T')[0];
}

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

    // Inventory: the unpublished runway (approved + scheduled) is what feeds the
    // feed; territory distribution over that runway drives what to write next.
    const runwayRows = scales.filter((s) => s.status === 'approved' || s.status === 'scheduled');
    const byTerritory: Record<string, number> = {};
    for (const s of runwayRows) {
      const key = s.territory ?? 'untagged';
      byTerritory[key] = (byTerritory[key] ?? 0) + 1;
    }

    const today = isoToday();
    const upcoming = scales
      .filter((s) => s.published_date && s.published_date >= today)
      .filter((s) => s.status === 'published' || s.status === 'scheduled')
      .sort((a, b) => (a.published_date! < b.published_date! ? -1 : 1))
      .slice(0, 7)
      .map((s) => ({
        date: s.published_date,
        status: s.status,
        territory: s.territory,
        question: s.question,
      }));

    const inventory = {
      approved: scales.filter((s) => s.status === 'approved').length,
      scheduled: scales.filter((s) => s.status === 'scheduled').length,
      draft: scales.filter((s) => s.status === 'draft').length,
      published: scales.filter((s) => s.status === 'published').length,
      retired: scales.filter((s) => s.status === 'retired').length,
      runway: runwayRows.length,
      byTerritory,
      upcoming,
    };

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
