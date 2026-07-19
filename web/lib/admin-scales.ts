// Admin-only Daily Scale shapes + validation. Web-local by design: the admin
// surface is internal tooling that will NOT exist in the native app, so these
// types stay out of @librato/shared (which holds only the portable client
// contract). The content constraints mirror the pipeline spec §5 so a
// hand-curated scale and a generated one obey the same shape.

import { z } from 'zod';
import { TERRITORIES, SCALE_STATUSES } from '@librato/shared';
import type { ScaleRow } from '@/lib/daily-selector';

const territoryEnum = z.enum(TERRITORIES as unknown as [string, ...string[]]);

const atMostWords = (n: number) => (s: string) =>
  s.trim().split(/\s+/).filter(Boolean).length <= n;

/** The editable content of a scale (pipeline spec §5 limits). */
export const adminScaleContentSchema = z.object({
  question: z.string().trim().min(8, 'Too short.').max(90, 'Keep the question to 90 characters.'),
  territory: territoryEnum,
  side_a_label: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .refine(atMostWords(5), 'Label must be 5 words or fewer.'),
  side_a_argument: z.string().trim().min(20, 'Make the strongest honest case.').max(600),
  side_b_label: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .refine(atMostWords(5), 'Label must be 5 words or fewer.'),
  side_b_argument: z.string().trim().min(20, 'Make the strongest honest case.').max(600),
  scripture_reference: z.string().trim().min(2).max(120),
  scripture_text: z.string().trim().min(10).max(600),
  scripture_lens: z
    .string()
    .trim()
    .min(30, 'The lens holds both truths — 3–4 sentences.')
    .max(900),
  prayer: z.string().trim().min(10).max(500),
  // Seeded baseline so a freshly-published scale is never an empty room.
  seed_votes_a: z.number().int().min(0).max(1_000_000).optional().default(0),
  seed_votes_b: z.number().int().min(0).max(1_000_000).optional().default(0),
});

/** POST /api/admin/scales — create a manual scale as draft, or draft + approve. */
export const adminCreateScaleSchema = adminScaleContentSchema.extend({
  status: z.enum(['draft', 'approved']).default('draft'),
});

/** PATCH /api/admin/scales/[id] — a transition, optionally carrying content edits. */
export const adminUpdateScaleSchema = z.object({
  action: z.enum(['edit', 'approve', 'retire']),
  patch: adminScaleContentSchema.partial().optional(),
});

export type AdminCreateScaleInput = z.infer<typeof adminCreateScaleSchema>;
export type AdminUpdateScaleInput = z.infer<typeof adminUpdateScaleSchema>;

/**
 * The admin view of a scale — the FULL row, including the internal lifecycle
 * fields and the Scripture Lens content that the public client contract hides
 * until a user has voted. Only ever returned behind the ADMIN_EMAILS check.
 */
export interface AdminScale {
  id: string;
  status: string;
  territory: string | null;
  source: string;
  published_date: string | null;
  approved_at: string | null;
  created_at: string | null;
  slug: string | null;
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
}

export function toAdminScale(row: ScaleRow & { created_at?: string | null }): AdminScale {
  return {
    id: row.id,
    status: row.status,
    territory: row.territory,
    source: row.source,
    published_date: row.published_date,
    approved_at: row.approved_at,
    created_at: row.created_at ?? null,
    slug: row.slug,
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

// Which lifecycle transitions the UI/routes permit. Published & retired rows are
// immutable from the admin surface (a published scale is a public artifact).
export const EDITABLE_STATUSES = ['draft', 'approved'] as const;
export const RETIRABLE_STATUSES = ['draft', 'approved'] as const;
export const APPROVABLE_STATUSES = ['draft'] as const;

export const ALL_STATUSES = SCALE_STATUSES;
