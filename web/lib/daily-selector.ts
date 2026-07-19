// The Daily Scale selector — the structural no-repeat guarantee (PRD §4.1).
//
// For a target date with no published scale, it promotes exactly one scale to
// `published` by stamping `published_date`. Because it only ever draws from rows
// whose `published_date IS NULL`, and `published_date` is UNIQUE, a question can
// never surface twice — the guarantee is a query constraint, not a policy.
//
// Order of operations for a date:
//   1. already published for the date → return it (idempotent)
//   2. a `scheduled` row pinned to the date → promote it
//   3. else pick from the `approved` pool with territory spacing:
//        - refuse the territory published the previous day (relax before skipping a day)
//        - rotate least-recently-used territories, then FIFO by approved_at
// Runs lazily inside GET /api/daily-scale (no cron required).

import { Resend } from 'resend';
import { SCALE_INVENTORY } from '@librato/shared';
import type { DailyScale } from '@librato/shared';
import { adminClient } from '@/lib/supabase/admin';
import { scaleSlug } from '@/lib/slug';

export type ScaleRow = {
  id: string;
  published_date: string | null;
  question: string;
  side_a_label: string;
  side_a_argument: string;
  side_b_label: string;
  side_b_argument: string;
  scripture_reference: string;
  scripture_text: string;
  scripture_lens: string;
  prayer: string;
  votes_a: number;
  votes_b: number;
  status: string;
  territory: string | null;
  source: string;
  approved_at: string | null;
  slug: string | null;
};

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

/** Map an internal row to the frozen client DailyScale shape (published_date → date;
 *  internal lifecycle fields never leave the server). */
export function toClientScale(row: ScaleRow): DailyScale {
  return {
    id: row.id,
    date: row.published_date ?? '',
    question: row.question,
    side_a_label: row.side_a_label,
    side_a_argument: row.side_a_argument,
    side_b_label: row.side_b_label,
    side_b_argument: row.side_b_argument,
    scripture_reference: row.scripture_reference,
    scripture_text: row.scripture_text,
    scripture_lens: row.scripture_lens,
    prayer: row.prayer,
    votes_a: row.votes_a,
    votes_b: row.votes_b,
  };
}

/** Pure selection: pick the best approved candidate. Exported for tests. */
export function chooseApproved(
  approved: Pick<ScaleRow, 'id' | 'territory' | 'approved_at'>[],
  prevTerritory: string | null,
  lastPublishedByTerritory: Record<string, string>,
): string | null {
  if (approved.length === 0) return null;

  // Prefer candidates NOT in yesterday's territory; relax (use all) if none remain.
  const eligible = prevTerritory
    ? approved.filter((c) => c.territory !== prevTerritory)
    : approved;
  const pool = eligible.length > 0 ? eligible : approved;

  // LRU territory first (a territory never/least-recently published wins), then
  // FIFO by approved_at (oldest approved candidate first).
  const sorted = [...pool].sort((a, b) => {
    const la = lastPublishedByTerritory[a.territory ?? ''] ?? '';
    const lb = lastPublishedByTerritory[b.territory ?? ''] ?? '';
    if (la !== lb) return la < lb ? -1 : 1; // earlier last-publish (or never) first
    return (a.approved_at ?? '') < (b.approved_at ?? '') ? -1 : 1;
  });
  return sorted[0]?.id ?? null;
}

/** Ensure a scale is published for `targetDate` (default: today). Returns the row or null. */
export async function ensureDayPublished(targetDate?: string): Promise<ScaleRow | null> {
  const date = targetDate ?? isoDate(new Date());

  // 1. Idempotent: already published for the date.
  const pub = await adminClient
    .from('daily_scales')
    .select('*')
    .eq('published_date', date)
    .eq('status', 'published')
    .maybeSingle();
  if (pub.data) return pub.data as ScaleRow;

  // 2. A scheduled row pinned to this date → promote it.
  const sched = await adminClient
    .from('daily_scales')
    .select('*')
    .eq('published_date', date)
    .eq('status', 'scheduled')
    .maybeSingle();
  if (sched.data) {
    const row = sched.data as ScaleRow;
    const { data } = await adminClient
      .from('daily_scales')
      .update({ status: 'published', slug: row.slug ?? scaleSlug(row.question, date) })
      .eq('id', row.id)
      .eq('status', 'scheduled')
      .select()
      .single();
    void alertInventoryIfLow();
    return (data as ScaleRow) ?? row;
  }

  // 3. Pick from the approved pool with territory spacing.
  const prevDate = new Date(`${date}T00:00:00Z`);
  prevDate.setUTCDate(prevDate.getUTCDate() - 1);
  const prev = await adminClient
    .from('daily_scales')
    .select('territory')
    .eq('published_date', isoDate(prevDate))
    .eq('status', 'published')
    .maybeSingle();
  const prevTerritory = (prev.data?.territory as string | null) ?? null;

  const { data: publishedRows } = await adminClient
    .from('daily_scales')
    .select('territory, published_date')
    .eq('status', 'published')
    .not('published_date', 'is', null);
  const lastPublishedByTerritory: Record<string, string> = {};
  for (const r of publishedRows ?? []) {
    const t = (r.territory as string) ?? '';
    const d = r.published_date as string;
    if (!lastPublishedByTerritory[t] || d > lastPublishedByTerritory[t]) {
      lastPublishedByTerritory[t] = d;
    }
  }

  const { data: approved } = await adminClient
    .from('daily_scales')
    .select('*')
    .eq('status', 'approved')
    .is('published_date', null);
  if (!approved?.length) {
    void alertInventoryIfLow();
    return null; // no inventory — the alert fires; the day may be a gap (never a repeat)
  }

  const chosenId = chooseApproved(approved as ScaleRow[], prevTerritory, lastPublishedByTerritory);
  if (!chosenId) return null;
  const chosen = (approved as ScaleRow[]).find((c) => c.id === chosenId)!;

  // Stamp. The `.is(published_date, null)` guard + UNIQUE(published_date) make
  // double-selection impossible under a race.
  const { data } = await adminClient
    .from('daily_scales')
    .update({
      status: 'published',
      published_date: date,
      slug: chosen.slug ?? scaleSlug(chosen.question, date),
    })
    .eq('id', chosen.id)
    .is('published_date', null)
    .select()
    .single();

  if (!data) {
    // Lost the race — another request published for this date. Read the winner.
    const again = await adminClient
      .from('daily_scales')
      .select('*')
      .eq('published_date', date)
      .eq('status', 'published')
      .maybeSingle();
    return (again.data as ScaleRow) ?? null;
  }

  void alertInventoryIfLow();
  return data as ScaleRow;
}

/**
 * Alert the admin when unpublished runway (approved + scheduled) runs low.
 * We count approved + scheduled rather than approved-only so the seeded launch
 * calendar doesn't trip a false critical on day one; once the calendar is spent,
 * the count equals the approved pool — the signal the AI pipeline is meant to feed.
 */
let lastAlertDate: string | null = null;
export async function alertInventoryIfLow(): Promise<void> {
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  if (!admins.length || !process.env.RESEND_API_KEY) return;

  const today = isoDate(new Date());
  if (lastAlertDate === today) return; // at most one alert per process per day

  const { count } = await adminClient
    .from('daily_scales')
    .select('*', { count: 'exact', head: true })
    .in('status', ['approved', 'scheduled']);
  const runway = count ?? 0;

  const level =
    runway < SCALE_INVENTORY.critical ? 'critical' : runway < SCALE_INVENTORY.warning ? 'warning' : null;
  if (!level) return;

  lastAlertDate = today;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject =
    level === 'critical'
      ? `🔴 BibleDiscern: Daily Scale inventory CRITICAL — ${runway} left`
      : `🟡 BibleDiscern: Daily Scale inventory low — ${runway} left`;
  await resend.emails
    .send({
      from: 'BibleDiscern <noreply@biblediscern.com>',
      to: admins,
      subject,
      html: `<p>Only <strong>${runway}</strong> unpublished Daily Scales remain (approved + scheduled).</p>
             <p>${
               level === 'critical'
                 ? 'This is critical — generate and review a batch now, or the feed will gap.'
                 : 'Generate and review a batch this week to keep the feed ahead.'
             }</p>
             <p>Territory spacing and the no-repeat guarantee are automatic; only supply is manual until the AI pipeline ships.</p>`,
    })
    .catch(() => undefined);
}
