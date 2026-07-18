import {
  color,
  font,
  giltBorderOnNavy,
  glowOnNavy,
  motion,
  radius
} from "./chunk-BPL4V7IR.mjs";

// src/constants.ts
var BRAND = {
  name: "BibleDiscern",
  tagline: "Weigh it with wisdom",
  latinMeaning: 'From the Latin "librato" \u2014 to weigh, to balance, to ponder'
};
var COLORS = {
  navy: "#1B2A4A",
  navyLight: "#2D4166",
  gold: "#C8A45E",
  goldLight: "#E8D5A3",
  goldMuted: "#D4BA7A",
  cream: "#FDF6EC",
  parchment: "#F5ECD7",
  warmWhite: "#FEFCF6",
  textDark: "#2C2418",
  textMedium: "#5C5144",
  textLight: "#8A7F72",
  sage: "#7A8B6F",
  border: "#E8DFD0",
  error: "#C0392B"
};
var TIER_CONFIG = {
  free: {
    sessions_limit: 1,
    has_fruit_diagnostic: false,
    has_follow_ups: false,
    has_full_journal: false,
    has_scripture_sharing: false,
    journal_visible_count: 3
  },
  premium: {
    sessions_limit: 9999,
    has_fruit_diagnostic: true,
    has_follow_ups: true,
    has_full_journal: true,
    has_scripture_sharing: true,
    journal_visible_count: 9999
  }
};
var PRICING = {
  monthly: { price: 7.99, label: "$7.99/month" },
  annual: { price: 49.99, label: "$49.99/year", perMonth: "$7.99/month", savings: "48%" }
};
var IAP_PRODUCTS = {
  monthly: "librato_premium_monthly",
  annual: "librato_premium_annual"
};
var TONES = [
  { id: "reflective", label: "Reflective", icon: "\u{1F30A}" },
  { id: "urgent", label: "Urgent", icon: "\u26A1" },
  { id: "encouragement", label: "Encouragement", icon: "\u2600\uFE0F" },
  { id: "lament", label: "Lament", icon: "\u{1F54A}\uFE0F" }
];
var JOURNEY_STEPS = [
  { id: "word", label: "The Word", icon: "\u{1F4D6}" },
  { id: "narratives", label: "Those who walked before", icon: "\u{1FAB6}" },
  { id: "examination", label: "The Examination", icon: "\u{1F50D}" },
  { id: "stillness", label: "The Stillness", icon: "\u{1F54A}\uFE0F" },
  { id: "fruit", label: "The Fruit", icon: "\u{1F33F}" },
  { id: "prayer", label: "The Prayer", icon: "\u{1F64F}" }
];
var FRUIT_LABELS = {
  love: "Love",
  joy: "Joy",
  peace: "Peace",
  patience: "Patience",
  kindness: "Kindness",
  goodness: "Goodness",
  faithfulness: "Faithfulness",
  gentleness: "Gentleness",
  selfControl: "Self-Control"
};
var CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "want to die",
  "self-harm",
  "cutting myself",
  "hurting myself",
  "abuse",
  "being abused",
  "domestic violence",
  "molest",
  "rape",
  "assault"
];
var CRISIS_RESOURCES = [
  { name: "988 Suicide & Crisis Lifeline", action: "tel:988", type: "call" },
  { name: "Crisis Text Line", action: "sms:741741&body=HOME", type: "text" },
  { name: "RAINN", action: "tel:18006564673", type: "call" }
];
var CACHE_TTL = {
  dailyMoment: 24 * 60 * 60 * 1e3,
  // 24 hours
  sessions: 5 * 60 * 1e3,
  // 5 minutes
  profile: 30 * 60 * 1e3
  // 30 minutes
};
var API_TIMEOUT = {
  discern: 6e4,
  // 60s — Claude AI processing (matches Vercel maxDuration)
  default: 1e4
  // 10s — all other requests
};
var STILLNESS = {
  totalDurationMs: 9e4,
  // 90 seconds
  phaseTransitionMs: 45e3,
  // Phase 1 → Phase 2 at 45s
  inhaleMs: 4e3,
  holdMs: 2e3,
  exhaleMs: 4e3,
  pauseMs: 1e3,
  phase1Prompt: "Be still, and know that I am God.",
  phase2Prompt: "Listen. What is He saying to you now?"
};
var LOADING_MESSAGES = [
  "Searching the Scriptures...",
  "Listening for wisdom...",
  "Walking with those who came before...",
  "Weighing what matters...",
  "Preparing your path...",
  "Gathering ancient wisdom..."
];

// src/validation.ts
import { z } from "zod";
var toneSchema = z.enum(["reflective", "urgent", "encouragement", "lament"]);
var entryTypeSchema = z.enum([
  "discernment",
  "reflection",
  "answered_prayer",
  "god_showed_up"
]);
var BiblicalNarrativeSchema = z.object({
  character: z.string().min(1),
  reference: z.string().min(1),
  connection: z.string().min(1),
  lesson: z.string().min(1)
});
var ScriptureSchema = z.object({
  reference: z.string().min(1),
  text: z.string().min(1),
  context: z.string().min(1)
});
var FruitValueSchema = z.union([
  z.string().min(1),
  z.object({
    score: z.number().min(0).max(10),
    note: z.string().min(1)
  })
]);
var FruitDiagnosticSchema = z.object({
  love: FruitValueSchema,
  joy: FruitValueSchema,
  peace: FruitValueSchema,
  patience: FruitValueSchema,
  kindness: FruitValueSchema,
  goodness: FruitValueSchema,
  faithfulness: FruitValueSchema,
  gentleness: FruitValueSchema,
  selfControl: FruitValueSchema
});
var DiscernmentResponseSchema = z.object({
  summary: z.string().min(1),
  biblicalNarratives: z.array(BiblicalNarrativeSchema).min(1).max(4),
  scriptures: z.array(ScriptureSchema).min(1).max(6),
  examination: z.array(z.string().min(1)).min(3).max(7),
  fruitDiagnostic: FruitDiagnosticSchema,
  prayer: z.string().min(1),
  closingWord: z.string().min(1)
});
var DiscernSessionRequestSchema = z.object({
  situation: z.string().min(10, "Please share a bit more about your situation (at least 10 characters).").max(2e3, "Please keep your situation to 2000 characters or less."),
  tone: toneSchema
});
var DiscernSessionResponseSchema = z.object({
  sessionId: z.string().uuid(),
  response: DiscernmentResponseSchema
});
var UpdateSessionRequestSchema = z.object({
  stillness_note: z.string().max(2e3).optional(),
  follow_up_1w_response: z.string().max(2e3).optional(),
  follow_up_1m_response: z.string().max(2e3).optional(),
  follow_up_3m_response: z.string().max(2e3).optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
  completed_at: z.string().datetime().optional()
});
var CreateJournalEntryRequestSchema = z.object({
  session_id: z.string().uuid().optional(),
  title: z.string().max(200).optional(),
  content: z.string().max(1e4).optional(),
  entry_type: entryTypeSchema.optional().default("discernment"),
  tags: z.array(z.string().max(50)).max(10).optional().default([])
});
var UpdateProfileRequestSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  display_name: z.string().min(1).max(50).optional(),
  timezone: z.string().min(1).max(50).optional(),
  onboarding_completed: z.boolean().optional(),
  onboarding_season: z.string().min(1).max(100).optional(),
  expo_push_token: z.string().max(500).optional(),
  daily_moment_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format").optional(),
  daily_scale_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format").optional()
});
var ValidateReceiptRequestSchema = z.object({
  receipt: z.string().min(1),
  platform: z.enum(["apple", "google"]),
  product_id: z.string().min(1)
});
function containsCrisisKeywords(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

// src/api-client.ts
var LibratoApiError = class extends Error {
  constructor(code, message, status, details) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.name = "LibratoApiError";
  }
  get isAuthError() {
    return this.status === 401;
  }
  get isRateLimited() {
    return this.status === 429;
  }
  get isSessionLimit() {
    return this.status === 403 && this.code === "limit_reached";
  }
  get isServerError() {
    return this.status >= 500;
  }
};
async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timerId);
  }
}
var LibratoApiClient = class {
  baseUrl;
  authToken;
  constructor(baseUrl, authToken) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.authToken = authToken ?? null;
  }
  /** Update the auth token (e.g. after a Supabase session refresh) */
  setAuthToken(token) {
    this.authToken = token;
  }
  // ─── Core request ───────────────────────────
  async request(path, { method = "GET", body, timeoutMs = API_TIMEOUT.default } = {}) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    const response = await fetchWithTimeout(
      `${this.baseUrl}${path}`,
      {
        method,
        headers,
        body: body !== void 0 ? JSON.stringify(body) : void 0
      },
      timeoutMs
    );
    if (response.status === 204) {
      return void 0;
    }
    const json = await response.json().catch(() => ({
      error: "parse_error",
      message: "Failed to parse server response."
    }));
    if (!response.ok) {
      const err = json;
      throw new LibratoApiError(
        err.error ?? "unknown_error",
        err.message ?? "An unexpected error occurred.",
        response.status,
        err.details
      );
    }
    return json.data ?? json;
  }
  // ─── Discernment ────────────────────────────
  /** Submit a new discernment session. Uses extended 30s timeout for Claude. */
  async discern(situation, tone) {
    return this.request("/api/discern", {
      method: "POST",
      body: { situation, tone },
      timeoutMs: API_TIMEOUT.discern
    });
  }
  // ─── Sessions ───────────────────────────────
  async getSessions() {
    const res = await this.request("/api/sessions");
    return res.sessions ?? [];
  }
  async getSession(id) {
    const res = await this.request(`/api/sessions/${id}`);
    return res.session;
  }
  async updateSession(id, data) {
    const res = await this.request(`/api/sessions/${id}`, {
      method: "PATCH",
      body: data
    });
    return res.session;
  }
  // ─── Journal ────────────────────────────────
  async getJournal() {
    const res = await this.request("/api/journal");
    return res.entries ?? [];
  }
  async getJournalEntry(id) {
    const res = await this.request(`/api/journal/${id}`);
    return res.entry;
  }
  async createJournalEntry(data) {
    const res = await this.request("/api/journal", {
      method: "POST",
      body: data
    });
    return res.entry;
  }
  // ─── Profile ────────────────────────────────
  async getProfile() {
    const res = await this.request("/api/profile");
    return res.profile;
  }
  async updateProfile(data) {
    const res = await this.request("/api/profile", {
      method: "PATCH",
      body: data
    });
    return res.profile;
  }
  // ─── Subscription ───────────────────────────
  async getSubscription() {
    try {
      const res = await this.request("/api/subscription");
      return res.subscription ?? null;
    } catch (e) {
      if (e instanceof LibratoApiError && e.status === 404) return null;
      throw e;
    }
  }
  /** Validate an Apple or Google receipt and upgrade the subscription if valid */
  async validateReceipt(receipt, platform, product_id) {
    const res = await this.request(
      "/api/subscription/validate-receipt",
      {
        method: "POST",
        body: { receipt, platform, product_id }
      }
    );
    return res.subscription;
  }
  // ─── Daily Moment ───────────────────────────
  async getDailyMoment() {
    const res = await this.request("/api/daily-moment");
    return res.moment;
  }
  // ─── Daily Scale ─────────────────────────────
  async getDailyScale() {
    return this.request("/api/daily-scale");
  }
  async castScaleVote(scaleId, vote) {
    return this.request("/api/daily-scale/vote", {
      method: "POST",
      body: { scale_id: scaleId, vote }
    });
  }
  async getScaleHistory() {
    const res = await this.request(
      "/api/daily-scale/history"
    );
    return res.history ?? [];
  }
};
function createApiClient(baseUrl, authToken) {
  return new LibratoApiClient(baseUrl, authToken);
}
export {
  API_TIMEOUT,
  BRAND,
  BiblicalNarrativeSchema,
  CACHE_TTL,
  COLORS,
  CRISIS_KEYWORDS,
  CRISIS_RESOURCES,
  CreateJournalEntryRequestSchema,
  DiscernSessionRequestSchema,
  DiscernSessionResponseSchema,
  DiscernmentResponseSchema,
  FRUIT_LABELS,
  FruitDiagnosticSchema,
  IAP_PRODUCTS,
  JOURNEY_STEPS,
  LOADING_MESSAGES,
  LibratoApiClient,
  LibratoApiError,
  PRICING,
  STILLNESS,
  ScriptureSchema,
  TIER_CONFIG,
  TONES,
  UpdateProfileRequestSchema,
  UpdateSessionRequestSchema,
  ValidateReceiptRequestSchema,
  color,
  containsCrisisKeywords,
  createApiClient,
  font,
  giltBorderOnNavy,
  glowOnNavy,
  motion,
  radius
};
