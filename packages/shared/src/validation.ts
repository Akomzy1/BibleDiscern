import { z } from 'zod';

// ─────────────────────────────────────────────
// Reusable field schemas
// ─────────────────────────────────────────────

const toneSchema = z.enum(['reflective', 'urgent', 'encouragement', 'lament']);

const entryTypeSchema = z.enum([
  'discernment',
  'reflection',
  'answered_prayer',
  'god_showed_up',
]);

// ─────────────────────────────────────────────
// DiscernmentResponse (AI output shape)
// ─────────────────────────────────────────────

export const BiblicalNarrativeSchema = z.object({
  character: z.string().min(1),
  reference: z.string().min(1),
  connection: z.string().min(1),
  lesson: z.string().min(1),
});

export const ScriptureSchema = z.object({
  reference: z.string().min(1),
  text: z.string().min(1),
  context: z.string().min(1),
});

// Accept a legacy string (observation-only) OR a structured {score, note}.
// Front-end coerces both into {score:number, note:string} before rendering.
const FruitValueSchema = z.union([
  z.string().min(1),
  z.object({
    score: z.number().min(0).max(10),
    note: z.string().min(1),
  }),
]);

export const FruitDiagnosticSchema = z.object({
  love: FruitValueSchema,
  joy: FruitValueSchema,
  peace: FruitValueSchema,
  patience: FruitValueSchema,
  kindness: FruitValueSchema,
  goodness: FruitValueSchema,
  faithfulness: FruitValueSchema,
  gentleness: FruitValueSchema,
  selfControl: FruitValueSchema,
});

export const DiscernmentResponseSchema = z.object({
  summary: z.string().min(1),
  biblicalNarratives: z.array(BiblicalNarrativeSchema).min(1).max(4),
  scriptures: z.array(ScriptureSchema).min(1).max(6),
  examination: z.array(z.string().min(1)).min(3).max(7),
  fruitDiagnostic: FruitDiagnosticSchema,
  prayer: z.string().min(1),
  closingWord: z.string().min(1),
});

// ─────────────────────────────────────────────
// API request schemas
// ─────────────────────────────────────────────

export const DiscernSessionRequestSchema = z.object({
  situation: z
    .string()
    .min(10, 'Please share a bit more about your situation (at least 10 characters).')
    .max(2000, 'Please keep your situation to 2000 characters or less.'),
  tone: toneSchema,
});

export const DiscernSessionResponseSchema = z.object({
  sessionId: z.string().uuid(),
  response: DiscernmentResponseSchema,
});

export const UpdateSessionRequestSchema = z.object({
  stillness_note: z.string().max(2000).optional(),
  follow_up_1w_response: z.string().max(2000).optional(),
  follow_up_1m_response: z.string().max(2000).optional(),
  follow_up_3m_response: z.string().max(2000).optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  completed_at: z.string().datetime().optional(),
});

export const CreateJournalEntryRequestSchema = z.object({
  session_id: z.string().uuid().optional(),
  title: z.string().max(200).optional(),
  content: z.string().max(10_000).optional(),
  entry_type: entryTypeSchema.optional().default('discernment'),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
});

export const UpdateProfileRequestSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  display_name: z.string().min(1).max(50).optional(),
  timezone: z.string().min(1).max(50).optional(),
  onboarding_completed: z.boolean().optional(),
  onboarding_season: z.string().min(1).max(100).optional(),
  expo_push_token: z.string().max(500).optional(),
  daily_moment_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
    .optional(),
  daily_scale_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
    .optional(),
});

export const ValidateReceiptRequestSchema = z.object({
  receipt: z.string().min(1),
  platform: z.enum(['apple', 'google']),
  product_id: z.string().min(1),
});

// v2 (PWA) additive contracts

export const CheckoutRequestSchema = z.object({
  plan: z.enum(['monthly', 'annual']),
});

export const PushSubscribeRequestSchema = z.object({
  endpoint: z.string().url().max(1000),
  keys: z.object({
    p256dh: z.string().min(1).max(500),
    auth: z.string().min(1).max(500),
  }),
});

// ─────────────────────────────────────────────
// Inferred types from schemas
// ─────────────────────────────────────────────

export type DiscernSessionRequestInput = z.infer<typeof DiscernSessionRequestSchema>;
export type UpdateSessionRequestInput = z.infer<typeof UpdateSessionRequestSchema>;
export type CreateJournalEntryRequestInput = z.infer<typeof CreateJournalEntryRequestSchema>;
export type UpdateProfileRequestInput = z.infer<typeof UpdateProfileRequestSchema>;
export type ValidateReceiptRequestInput = z.infer<typeof ValidateReceiptRequestSchema>;
export type DiscernmentResponseOutput = z.infer<typeof DiscernmentResponseSchema>;
export type CheckoutRequestInput = z.infer<typeof CheckoutRequestSchema>;
export type PushSubscribeRequestInput = z.infer<typeof PushSubscribeRequestSchema>;

// ─────────────────────────────────────────────
// Crisis detection helper
// ─────────────────────────────────────────────

import { CRISIS_KEYWORDS } from './constants';

export function containsCrisisKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}
