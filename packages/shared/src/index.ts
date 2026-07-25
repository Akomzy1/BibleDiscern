// Types
export type {
  Profile,
  Session,
  DiscernmentResponse,
  FruitValue,
  JournalEntry,
  Subscription,
  DailyMoment,
  DailyScale,
  DailyScaleResults,
  DailyScaleResponse,
  DailyScaleHistoryEntry,
  DailyScalePhase,
  TierConfig,
  ApiError,
  ApiSuccess,
  ApiResponse,
  DiscernSessionRequest,
  UpdateSessionRequest,
  CreateJournalEntryRequest,
  UpdateProfileRequest,
  ValidateReceiptRequest,
  CheckoutRequest,
  PushSubscribeRequest,
  FeedbackRequest,
  FeedbackSource,
  Feedback,
} from './types';

// Constants
export {
  BRAND,
  DISCLAIMER,
  TRIAL_LINE,
  COLORS,
  TIER_CONFIG,
  PRICING,
  IAP_PRODUCTS,
  TONES,
  JOURNEY_STEPS,
  FRUIT_LABELS,
  CRISIS_KEYWORDS,
  CRISIS_RESOURCES,
  TERRITORIES,
  SCALE_STATUSES,
  SCALE_INVENTORY,
  ONBOARDING_SEASONS,
  LAUNCH_FREE_UNTIL,
  LAUNCH_BANNER_LINE,
  isLaunchFreePeriod,
  CACHE_TTL,
  API_TIMEOUT,
  STILLNESS,
  LOADING_MESSAGES,
} from './constants';

export type { ToneId, JourneyStepId, Territory, ScaleStatus, OnboardingSeason } from './constants';

// Entitlements — the single tier/access resolver (UI + API read this)
export { effectiveTier, hasPremiumAccess } from './entitlements';
export type { EffectiveTier, EntitlementInput } from './entitlements';

// Validation schemas
export {
  BiblicalNarrativeSchema,
  ScriptureSchema,
  FruitDiagnosticSchema,
  DiscernmentResponseSchema,
  DiscernSessionRequestSchema,
  DiscernSessionResponseSchema,
  UpdateSessionRequestSchema,
  CreateJournalEntryRequestSchema,
  UpdateProfileRequestSchema,
  ValidateReceiptRequestSchema,
  CheckoutRequestSchema,
  PushSubscribeRequestSchema,
  FeedbackRequestSchema,
  containsCrisisKeywords,
} from './validation';

export type {
  DiscernSessionRequestInput,
  UpdateSessionRequestInput,
  CreateJournalEntryRequestInput,
  UpdateProfileRequestInput,
  ValidateReceiptRequestInput,
  DiscernmentResponseOutput,
  CheckoutRequestInput,
  PushSubscribeRequestInput,
  FeedbackRequestInput,
} from './validation';

// API Client
export {
  LibratoApiClient,
  LibratoApiError,
  createApiClient,
} from './api-client';

// Selah design tokens
export {
  color,
  font,
  radius,
  motion,
  giltBorderOnNavy,
  glowOnNavy,
} from './tokens';
