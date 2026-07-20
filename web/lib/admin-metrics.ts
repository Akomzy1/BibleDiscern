// Operator-dashboard aggregates for /admin. Server-only: every function uses the
// service-role client and MUST be called behind the ADMIN_EMAILS guard.
//
// HARD RULE (safety): aggregate/counts only. Never select or return any user's
// situation text, journal content, or prayer content. Nothing here reads those
// columns.

import 'server-only';
import { PRICING } from '@librato/shared';
import { adminClient } from '@/lib/supabase/admin';

const DAY = 24 * 60 * 60 * 1000;
const nowMs = () => Date.now();
const isoAgo = (days: number) => new Date(nowMs() - days * DAY).toISOString();
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

async function countWhere(
  table: string,
  build: (q: ReturnType<ReturnType<typeof adminClient.from>['select']>) => unknown,
): Promise<number> {
  const q = adminClient.from(table).select('*', { count: 'exact', head: true });
  const { count } = (await build(q)) as { count: number | null };
  return count ?? 0;
}

// ─── USERS ───────────────────────────────────────────────────────────────────

export interface UserMetrics {
  total: number;
  new7d: number;
  prev7d: number;
  new30d: number;
  prev30d: number;
  onboarded: number;
  onboardingRate: number;
  seasons: { label: string; count: number }[];
  votedUsers1d: number;
  votedUsers7d: number;
  votedUsers30d: number;
}

export async function getUserMetrics(): Promise<UserMetrics> {
  const [total, new7d, prev7d, new30d, prev30d, onboarded] = await Promise.all([
    countWhere('profiles', (q) => q),
    countWhere('profiles', (q) => (q as any).gte('created_at', isoAgo(7))),
    countWhere('profiles', (q) => (q as any).gte('created_at', isoAgo(14)).lt('created_at', isoAgo(7))),
    countWhere('profiles', (q) => (q as any).gte('created_at', isoAgo(30))),
    countWhere('profiles', (q) => (q as any).gte('created_at', isoAgo(60)).lt('created_at', isoAgo(30))),
    countWhere('profiles', (q) => (q as any).eq('onboarding_completed', true)),
  ]);

  // Season distribution — one small column read, tallied in memory.
  const { data: seasonRows } = await adminClient.from('profiles').select('onboarding_season');
  const seasonTally: Record<string, number> = {};
  for (const r of seasonRows ?? []) {
    const key = (r.onboarding_season as string | null) ?? 'Not set';
    seasonTally[key] = (seasonTally[key] ?? 0) + 1;
  }
  const seasons = Object.entries(seasonTally)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  // "Voted users" — distinct voters per window (honest engagement proxy; we have
  // no analytics events). One read of the last 30d of votes, deduped in memory.
  const { data: voteRows } = await adminClient
    .from('daily_scale_votes')
    .select('user_id, created_at')
    .gte('created_at', isoAgo(30));
  const distinctSince = (days: number) => {
    const cutoff = nowMs() - days * DAY;
    const set = new Set<string>();
    for (const v of voteRows ?? []) {
      if (new Date(v.created_at as string).getTime() >= cutoff) set.add(v.user_id as string);
    }
    return set.size;
  };

  return {
    total,
    new7d,
    prev7d,
    new30d,
    prev30d,
    onboarded,
    onboardingRate: total > 0 ? onboarded / total : 0,
    seasons,
    votedUsers1d: distinctSince(1),
    votedUsers7d: distinctSince(7),
    votedUsers30d: distinctSince(30),
  };
}

// ─── REVENUE ─────────────────────────────────────────────────────────────────

export interface RevenueMetrics {
  activeMonthly: number;
  activeAnnual: number;
  activePremium: number;
  trialing: number;
  pastDue: number;
  cancelled: number;
  monthlyPrice: number;
  annualMonthlyEquiv: number;
  mrr: number;
  arr: number;
  trialsStarted30d: number;
  conversions: number;
  cancellations30d: number;
}

export async function getRevenueMetrics(): Promise<RevenueMetrics> {
  // Small table (one row per user). Read the billing-relevant columns and
  // compute in memory — NEVER any content columns.
  const { data: subs } = await adminClient
    .from('subscriptions')
    .select('tier, status, billing_interval, created_at');
  const rows = subs ?? [];

  // Real Premium subscribers only — the signup trigger seeds every free user as
  // status 'trialing', so tier === 'premium' is what isolates paying/real-trial.
  const premium = rows.filter((s) => s.tier === 'premium');
  const active = premium.filter((s) => s.status === 'active');
  const activeMonthly = active.filter((s) => s.billing_interval === 'month').length;
  const activeAnnual = active.filter((s) => s.billing_interval === 'year').length;
  const trialing = premium.filter((s) => s.status === 'trialing').length;
  const pastDue = premium.filter((s) => s.status === 'past_due').length;
  const cancelled = premium.filter((s) => s.status === 'cancelled').length;

  const monthlyPrice = PRICING.monthly.price; // 7.99
  const annualMonthlyEquiv = PRICING.annual.price / 12; // 49.99 / 12
  const mrr = activeMonthly * monthlyPrice + activeAnnual * annualMonthlyEquiv;
  const arr = mrr * 12;

  const since30 = nowMs() - 30 * DAY;
  const trialsStarted30d = premium.filter((s) => new Date(s.created_at as string).getTime() >= since30).length;
  const cancellations30d = premium.filter(
    (s) => s.status === 'cancelled' && new Date(s.created_at as string).getTime() >= since30,
  ).length;

  return {
    activeMonthly,
    activeAnnual,
    activePremium: active.length,
    trialing,
    pastDue,
    cancelled,
    monthlyPrice,
    annualMonthlyEquiv,
    mrr,
    arr,
    trialsStarted30d,
    conversions: active.length, // premium subs past trial and paying
    cancellations30d,
  };
}

// ─── ENGAGEMENT ──────────────────────────────────────────────────────────────

export interface EngagementMetrics {
  todayScale: { question: string; votesA: number; votesB: number; percentA: number } | null;
  votesPerDay: { day: string; count: number }[];
  journeysStarted30d: number;
  journeysCompleted30d: number;
  journalEntries30d: number;
}

export async function getEngagementMetrics(): Promise<EngagementMetrics> {
  const today = isoDay(new Date());

  const [{ data: todayRow }, { data: vote14 }, journeysStarted30d, journeysCompleted30d, journalEntries30d] =
    await Promise.all([
      adminClient
        .from('daily_scales')
        .select('question, votes_a, votes_b')
        .eq('status', 'published')
        .eq('published_date', today)
        .maybeSingle(),
      adminClient.from('daily_scale_votes').select('created_at').gte('created_at', isoAgo(14)),
      countWhere('sessions', (q) => (q as any).gte('created_at', isoAgo(30))),
      countWhere('sessions', (q) => (q as any).eq('status', 'completed').gte('created_at', isoAgo(30))),
      countWhere('journal_entries', (q) => (q as any).gte('created_at', isoAgo(30))),
    ]);

  let todayScale: EngagementMetrics['todayScale'] = null;
  if (todayRow) {
    const a = (todayRow.votes_a as number) ?? 0;
    const b = (todayRow.votes_b as number) ?? 0;
    const tot = a + b;
    todayScale = {
      question: todayRow.question as string,
      votesA: a,
      votesB: b,
      percentA: tot > 0 ? Math.round((a / tot) * 100) : 50,
    };
  }

  // Votes per day for the last 14 days — tally then fill gaps with zero.
  const tally: Record<string, number> = {};
  for (const v of vote14 ?? []) {
    const d = (v.created_at as string).slice(0, 10);
    tally[d] = (tally[d] ?? 0) + 1;
  }
  const votesPerDay: { day: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = isoDay(new Date(nowMs() - i * DAY));
    votesPerDay.push({ day: d, count: tally[d] ?? 0 });
  }

  return {
    todayScale,
    votesPerDay,
    journeysStarted30d,
    journeysCompleted30d,
    journalEntries30d,
  };
}

// ─── SCALE INVENTORY (shared with /api/admin/scales) ─────────────────────────

export interface InventoryRow {
  status: string;
  territory: string | null;
  published_date: string | null;
  question: string;
}

export interface Inventory {
  approved: number;
  scheduled: number;
  draft: number;
  published: number;
  retired: number;
  runway: number;
  byTerritory: Record<string, number>;
  upcoming: { date: string | null; status: string; territory: string | null; question: string }[];
}

/** Pure inventory computation — the single definition used by both the admin
 *  overview and /api/admin/scales, so the two can never drift. */
export function computeInventory(rows: InventoryRow[]): Inventory {
  const runwayRows = rows.filter((s) => s.status === 'approved' || s.status === 'scheduled');
  const byTerritory: Record<string, number> = {};
  for (const s of runwayRows) {
    const key = s.territory ?? 'untagged';
    byTerritory[key] = (byTerritory[key] ?? 0) + 1;
  }
  const today = isoDay(new Date());
  const upcoming = rows
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

  return {
    approved: rows.filter((s) => s.status === 'approved').length,
    scheduled: rows.filter((s) => s.status === 'scheduled').length,
    draft: rows.filter((s) => s.status === 'draft').length,
    published: rows.filter((s) => s.status === 'published').length,
    retired: rows.filter((s) => s.status === 'retired').length,
    runway: runwayRows.length,
    byTerritory,
    upcoming,
  };
}

/** Inventory for the overview — reads the minimal columns, reuses computeInventory. */
export async function getScaleInventorySummary(): Promise<Inventory> {
  const { data } = await adminClient
    .from('daily_scales')
    .select('status, territory, published_date, question');
  return computeInventory((data ?? []) as InventoryRow[]);
}
