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

export const TIER_CONFIG: Record<string, TierConfig> = {
  free: {
    sessions_limit: 1,
    has_fruit_diagnostic: false,
    has_follow_ups: false,
    has_full_journal: false,
    has_scripture_sharing: false,
    journal_visible_count: 3,
  },
  premium: {
    sessions_limit: 9999,
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
  annual: { price: 49.99, label: '$49.99/year', perMonth: '$7.99/month', savings: '48%' },
} as const;

export const IAP_PRODUCTS = {
  monthly: 'librato_premium_monthly',
  annual: 'librato_premium_annual',
} as const;

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
  discern: 30_000,   // 30s — Claude AI processing
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
