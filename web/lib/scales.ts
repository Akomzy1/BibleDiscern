// Server-side data access for the public Daily Scale surfaces (landing teaser,
// archive, /scale/[slug] SEO pages). Reads PUBLISHED rows only, via the service
// role. `published_date` is aliased back to `date` so the public shape is stable.

import { adminClient } from '@/lib/supabase/admin';
import type { DailyScale } from '@librato/shared';

export type PublicScale = DailyScale & { slug: string | null };

export const ARCHIVE_PAGE_SIZE = 10;

// published_date aliased to `date` keeps the public/client shape unchanged.
const PREVIEW_COLS = 'id, date:published_date, question, votes_a, votes_b, slug';
const CARD_COLS =
  'id, date:published_date, question, side_a_label, side_a_argument, side_b_label, side_b_argument, votes_a, votes_b, slug';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/** Today's published scale for the public landing teaser (question + arguments). */
export async function getTodayTeaser(): Promise<PublicScale | null> {
  try {
    const { data } = await adminClient
      .from('daily_scales')
      .select(CARD_COLS)
      .eq('published_date', todayStr())
      .eq('status', 'published')
      .maybeSingle();
    return (data as PublicScale) ?? null;
  } catch {
    return null;
  }
}

/** Past published scales (full Lens is public once the day is over). */
export async function listPastScales(page = 1, q?: string) {
  try {
    let query = adminClient
      .from('daily_scales')
      .select(PREVIEW_COLS, { count: 'exact' })
      .eq('status', 'published')
      .lt('published_date', todayStr())
      .order('published_date', { ascending: false });
    if (q?.trim()) query = query.ilike('question', `%${q.trim()}%`);
    const from = (page - 1) * ARCHIVE_PAGE_SIZE;
    const { data, count } = await query.range(from, from + ARCHIVE_PAGE_SIZE - 1);
    return { scales: (data ?? []) as PublicScale[], total: count ?? 0 };
  } catch {
    return { scales: [], total: 0 };
  }
}

/** All published scale slugs for the sitemap. */
export async function listAllScaleSlugs(): Promise<Pick<PublicScale, 'slug' | 'date'>[]> {
  try {
    const { data } = await adminClient
      .from('daily_scales')
      .select('slug, date:published_date')
      .eq('status', 'published')
      .lt('published_date', todayStr())
      .order('published_date', { ascending: false })
      .limit(2000);
    return (data ?? []) as Pick<PublicScale, 'slug' | 'date'>[];
  } catch {
    return [];
  }
}

export async function getScaleBySlug(slug: string): Promise<PublicScale | null> {
  try {
    const { data } = await adminClient
      .from('daily_scales')
      .select(`${CARD_COLS}, scripture_reference, scripture_text, scripture_lens, prayer`)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    return (data as PublicScale) ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedScales(excludeId: string, n = 3): Promise<PublicScale[]> {
  try {
    const { data } = await adminClient
      .from('daily_scales')
      .select(PREVIEW_COLS)
      .eq('status', 'published')
      .lt('published_date', todayStr())
      .neq('id', excludeId)
      .order('published_date', { ascending: false })
      .limit(n);
    return (data ?? []) as PublicScale[];
  } catch {
    return [];
  }
}

/** Honest community-proof aggregates for the landing page. */
export async function getProofStats() {
  try {
    const { data } = await adminClient
      .from('daily_scales')
      .select('date:published_date, question, votes_a, votes_b, slug')
      .eq('status', 'published')
      .lte('published_date', todayStr())
      .order('published_date', { ascending: false })
      .limit(400);
    const rows = (data ?? []) as PublicScale[];
    if (rows.length === 0) return null;
    const totalVotes = rows.reduce((s, r) => s + r.votes_a + r.votes_b, 0);
    const splits = rows
      .filter((r) => r.votes_a + r.votes_b > 0)
      .map((r) => Math.round((Math.max(r.votes_a, r.votes_b) / (r.votes_a + r.votes_b)) * 100));
    const avgMajor = splits.length
      ? Math.round(splits.reduce((s, v) => s + v, 0) / splits.length)
      : 50;
    const today = todayStr();
    const latest = rows.find((r) => r.date < today) ?? rows[0];
    return {
      latestTotal: latest ? latest.votes_a + latest.votes_b : 0,
      totalVotes,
      avgSplit: `${avgMajor} / ${100 - avgMajor}`,
      yesterday: latest,
    };
  } catch {
    return null;
  }
}

export function computePercents(s: Pick<DailyScale, 'votes_a' | 'votes_b'>) {
  const total = s.votes_a + s.votes_b;
  if (total === 0) return { a: 50, b: 50, total: 0 };
  const a = Math.round((s.votes_a / total) * 100);
  return { a, b: 100 - a, total };
}

export function scaleDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
