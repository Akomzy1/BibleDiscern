import type { TierConfig } from './types';

// ─────────────────────────────────────────────
// Brand
// ─────────────────────────────────────────────

export const BRAND = {
  name: 'BibleDiscern',
  tagline: 'Weigh it with wisdom',
  latinMeaning: 'From the Latin "librato" — to weigh, to balance, to ponder',
} as const;

// ─────────────────────────────────────────────
// Design system colors
// ─────────────────────────────────────────────

export const COLORS = {
  navy: '#1B2A4A',
  navyLight: '#2D4166',
  gold: '#C8A45E',
  goldLight: '#E8D5A3',
  goldMuted: '#D4BA7A',
  cream: '#FDF6EC',
  parchment: '#F5ECD7',
  warmWhite: '#FEFCF6',
  textDark: '#2C2418',
  textMedium: '#5C5144',
  textLight: '#8A7F72',
  sage: '#7A8B6F',
  border: '#E8DFD0',
  error: '#C0392B',
} as const;

// ─────────────────────────────────────────────
// Subscription tiers
// ─────────────────────────────────────────────

// The single feature-gating source of truth. Both the UI and the API read
// these — never hardcode a tier gate in a component or route.
// Trial (subscriptions.status === 'trialing') is treated as premium access.
export const TIER_CONFIG: Record<string, TierConfig> = {
  free: {
    sessions_limit: 0, // Deep Discernment journeys are Premium-only
    has_discernment_journey: false,
    has_stillness: false,
    has_fruit_diagnostic: false,
    has_follow_ups: false,
    has_full_journal: false,
    has_scripture_sharing: false,
    journal_visible_count: 3,
  },
  premium: {
    sessions_limit: 9999,
    has_discernment_journey: true,
    has_stillness: true,
    has_fruit_diagnostic: true,
    has_follow_ups: true,
    has_full_journal: true,
    has_scripture_sharing: true,
    journal_visible_count: 9999,
  },
};

// ─────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────

export const PRICING = {
  monthly: { price: 7.99, label: '$7.99/month' },
  annual: { price: 49.99, label: '$49.99/year', perMonth: '$4.17/month', savings: '48%' },
} as const;

// Canonical lines (SKILL.md §13) — never drift from these.
export const DISCLAIMER =
  'This tool supports reflection — it does not replace God, Scripture, or wise counsel.';

export const TRIAL_LINE = 'Free for 7 days. Cancel anytime.';

export const IAP_PRODUCTS = {
  monthly: 'librato_premium_monthly',
  annual: 'librato_premium_annual',
} as const;

// ─────────────────────────────────────────────
// Onboarding seasons (screen 2 — "where are you right now?")
// ─────────────────────────────────────────────
//
// Stored on profiles.onboarding_season (free TEXT — no DB CHECK / Zod enum
// constrains it, so these are the canonical values, not an enforced set).
// The five life-context cards store their display title; 'unnamed' is the
// catch-all for a real decision that doesn't fit a named category.

export const ONBOARDING_SEASONS = [
  'Career crossroads',
  'Relationship decision',
  'Financial uncertainty',
  'Spiritual dryness',
  'I just want to grow in discernment',
  'unnamed',
] as const;

export type OnboardingSeason = (typeof ONBOARDING_SEASONS)[number];

// ─────────────────────────────────────────────
// Discernment tones
// ─────────────────────────────────────────────

export const TONES = [
  { id: 'reflective', label: 'Reflective', icon: '🌊' },
  { id: 'urgent', label: 'Urgent', icon: '⚡' },
  { id: 'encouragement', label: 'Encouragement', icon: '☀️' },
  { id: 'lament', label: 'Lament', icon: '🕊️' },
] as const;

export type ToneId = (typeof TONES)[number]['id'];

// ─────────────────────────────────────────────
// Journey steps
// ─────────────────────────────────────────────

export const JOURNEY_STEPS = [
  { id: 'word', label: 'The Word', icon: '📖' },
  { id: 'narratives', label: 'Those who walked before', icon: '🪶' },
  { id: 'examination', label: 'The Examination', icon: '🔍' },
  { id: 'stillness', label: 'The Stillness', icon: '🕊️' },
  { id: 'fruit', label: 'The Fruit', icon: '🌿' },
  { id: 'prayer', label: 'The Prayer', icon: '🙏' },
] as const;

export type JourneyStepId = (typeof JOURNEY_STEPS)[number]['id'];

// ─────────────────────────────────────────────
// Fruit of the Spirit (Galatians 5:22-23)
// ─────────────────────────────────────────────

export const FRUIT_LABELS = {
  love: 'Love',
  joy: 'Joy',
  peace: 'Peace',
  patience: 'Patience',
  kindness: 'Kindness',
  goodness: 'Goodness',
  faithfulness: 'Faithfulness',
  gentleness: 'Gentleness',
  selfControl: 'Self-Control',
} as const;

// ─────────────────────────────────────────────
// Crisis detection
// ─────────────────────────────────────────────

export const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'self-harm',
  'cutting myself',
  'hurting myself',
  'abuse',
  'being abused',
  'domestic violence',
  'molest',
  'rape',
  'assault',
] as const;

export const CRISIS_RESOURCES = [
  { name: '988 Suicide & Crisis Lifeline', action: 'tel:988', type: 'call' },
  { name: 'Crisis Text Line', action: 'sms:741741&body=HOME', type: 'text' },
  { name: 'RAINN', action: 'tel:18006564673', type: 'call' },
] as const;

// ─────────────────────────────────────────────
// Daily Scale — territory taxonomy (scale-pipeline-spec §9)
// Fixed vocabulary; keep tags stable once used. The selector spaces
// consecutive days by territory; the AI pipeline targets least-represented.
// ─────────────────────────────────────────────

export const TERRITORIES = [
  'peace-vs-truth',
  'forgiveness',
  'money-stewardship',
  'ambition-calling',
  'faith-vs-planning',
  'mercy-vs-justice',
  'community-vs-conviction',
  'rest-vs-diligence',
  'contentment-vs-growth',
  'boldness-vs-patience',
  'suffering-healing',
  'doubt-certainty',
  'family-boundaries',
  'witness-relationships',
] as const;

export type Territory = (typeof TERRITORIES)[number];

// daily_scales publishing lifecycle
export const SCALE_STATUSES = ['draft', 'approved', 'scheduled', 'published', 'retired'] as const;
export type ScaleStatus = (typeof SCALE_STATUSES)[number];

// Approved-pool inventory thresholds for admin alerts
export const SCALE_INVENTORY = { warning: 21, critical: 7 } as const;

// ─────────────────────────────────────────────
// Cache TTLs (milliseconds)
// ─────────────────────────────────────────────

export const CACHE_TTL = {
  dailyMoment: 24 * 60 * 60 * 1000,  // 24 hours
  sessions: 5 * 60 * 1000,           // 5 minutes
  profile: 30 * 60 * 1000,           // 30 minutes
} as const;

// ─────────────────────────────────────────────
// API timeouts (milliseconds)
// ─────────────────────────────────────────────

export const API_TIMEOUT = {
  discern: 60_000,   // 60s — Claude AI processing (matches Vercel maxDuration)
  default: 10_000,   // 10s — all other requests
} as const;

// ─────────────────────────────────────────────
// Stillness Engine
// ─────────────────────────────────────────────

export const STILLNESS = {
  totalDurationMs: 90_000,       // 90 seconds
  phaseTransitionMs: 45_000,     // Phase 1 → Phase 2 at 45s
  inhaleMs: 4_000,
  holdMs: 2_000,
  exhaleMs: 4_000,
  pauseMs: 1_000,
  phase1Prompt: 'Be still, and know that I am God.',
  phase2Prompt: 'Listen. What is He saying to you now?',
} as const;

// ─────────────────────────────────────────────
// Loading messages (shown during AI processing)
// ─────────────────────────────────────────────

export const LOADING_MESSAGES = [
  'Searching the Scriptures...',
  'Listening for wisdom...',
  'Walking with those who came before...',
  'Weighing what matters...',
  'Preparing your path...',
  'Gathering ancient wisdom...',
] as const;
