"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  API_TIMEOUT: () => API_TIMEOUT,
  BRAND: () => BRAND,
  BiblicalNarrativeSchema: () => BiblicalNarrativeSchema,
  CACHE_TTL: () => CACHE_TTL,
  COLORS: () => COLORS,
  CRISIS_KEYWORDS: () => CRISIS_KEYWORDS,
  CRISIS_RESOURCES: () => CRISIS_RESOURCES,
  CheckoutRequestSchema: () => CheckoutRequestSchema,
  CreateJournalEntryRequestSchema: () => CreateJournalEntryRequestSchema,
  DISCLAIMER: () => DISCLAIMER,
  DiscernSessionRequestSchema: () => DiscernSessionRequestSchema,
  DiscernSessionResponseSchema: () => DiscernSessionResponseSchema,
  DiscernmentResponseSchema: () => DiscernmentResponseSchema,
  FRUIT_LABELS: () => FRUIT_LABELS,
  FruitDiagnosticSchema: () => FruitDiagnosticSchema,
  IAP_PRODUCTS: () => IAP_PRODUCTS,
  JOURNEY_STEPS: () => JOURNEY_STEPS,
  LOADING_MESSAGES: () => LOADING_MESSAGES,
  LibratoApiClient: () => LibratoApiClient,
  LibratoApiError: () => LibratoApiError,
  PRICING: () => PRICING,
  PushSubscribeRequestSchema: () => PushSubscribeRequestSchema,
  SCALE_INVENTORY: () => SCALE_INVENTORY,
  SCALE_STATUSES: () => SCALE_STATUSES,
  STILLNESS: () => STILLNESS,
  ScriptureSchema: () => ScriptureSchema,
  TERRITORIES: () => TERRITORIES,
  TIER_CONFIG: () => TIER_CONFIG,
  TONES: () => TONES,
  TRIAL_LINE: () => TRIAL_LINE,
  UpdateProfileRequestSchema: () => UpdateProfileRequestSchema,
  UpdateSessionRequestSchema: () => UpdateSessionRequestSchema,
  ValidateReceiptRequestSchema: () => ValidateReceiptRequestSchema,
  color: () => color,
  containsCrisisKeywords: () => containsCrisisKeywords,
  createApiClient: () => createApiClient,
  font: () => font,
  giltBorderOnNavy: () => giltBorderOnNavy,
  glowOnNavy: () => glowOnNavy,
  motion: () => motion,
  radius: () => radius
});
module.exports = __toCommonJS(index_exports);

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
  annual: { price: 49.99, label: "$49.99/year", perMonth: "$4.17/month", savings: "48%" }
};
var DISCLAIMER = "This tool supports reflection \u2014 it does not replace God, Scripture, or wise counsel.";
var TRIAL_LINE = "Free for 7 days. Cancel anytime.";
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
var TERRITORIES = [
  "peace-vs-truth",
  "forgiveness",
  "money-stewardship",
  "ambition-calling",
  "faith-vs-planning",
  "mercy-vs-justice",
  "community-vs-conviction",
  "rest-vs-diligence",
  "contentment-vs-growth",
  "boldness-vs-patience",
  "suffering-healing",
  "doubt-certainty",
  "family-boundaries",
  "witness-relationships"
];
var SCALE_STATUSES = ["draft", "approved", "scheduled", "published", "retired"];
var SCALE_INVENTORY = { warning: 21, critical: 7 };
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
var import_zod = require("zod");
var toneSchema = import_zod.z.enum(["reflective", "urgent", "encouragement", "lament"]);
var entryTypeSchema = import_zod.z.enum([
  "discernment",
  "reflection",
  "answered_prayer",
  "god_showed_up"
]);
var BiblicalNarrativeSchema = import_zod.z.object({
  character: import_zod.z.string().min(1),
  reference: import_zod.z.string().min(1),
  connection: import_zod.z.string().min(1),
  lesson: import_zod.z.string().min(1)
});
var ScriptureSchema = import_zod.z.object({
  reference: import_zod.z.string().min(1),
  text: import_zod.z.string().min(1),
  context: import_zod.z.string().min(1)
});
var FruitValueSchema = import_zod.z.union([
  import_zod.z.string().min(1),
  import_zod.z.object({
    score: import_zod.z.number().min(0).max(10),
    note: import_zod.z.string().min(1)
  })
]);
var FruitDiagnosticSchema = import_zod.z.object({
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
var DiscernmentResponseSchema = import_zod.z.object({
  summary: import_zod.z.string().min(1),
  biblicalNarratives: import_zod.z.array(BiblicalNarrativeSchema).min(1).max(4),
  scriptures: import_zod.z.array(ScriptureSchema).min(1).max(6),
  examination: import_zod.z.array(import_zod.z.string().min(1)).min(3).max(7),
  fruitDiagnostic: FruitDiagnosticSchema,
  prayer: import_zod.z.string().min(1),
  closingWord: import_zod.z.string().min(1)
});
var DiscernSessionRequestSchema = import_zod.z.object({
  situation: import_zod.z.string().min(10, "Please share a bit more about your situation (at least 10 characters).").max(2e3, "Please keep your situation to 2000 characters or less."),
  tone: toneSchema
});
var DiscernSessionResponseSchema = import_zod.z.object({
  sessionId: import_zod.z.string().uuid(),
  response: DiscernmentResponseSchema
});
var UpdateSessionRequestSchema = import_zod.z.object({
  stillness_note: import_zod.z.string().max(2e3).optional(),
  follow_up_1w_response: import_zod.z.string().max(2e3).optional(),
  follow_up_1m_response: import_zod.z.string().max(2e3).optional(),
  follow_up_3m_response: import_zod.z.string().max(2e3).optional(),
  status: import_zod.z.enum(["active", "completed", "archived"]).optional(),
  completed_at: import_zod.z.string().datetime().optional()
});
var CreateJournalEntryRequestSchema = import_zod.z.object({
  session_id: import_zod.z.string().uuid().optional(),
  title: import_zod.z.string().max(200).optional(),
  content: import_zod.z.string().max(1e4).optional(),
  entry_type: entryTypeSchema.optional().default("discernment"),
  tags: import_zod.z.array(import_zod.z.string().max(50)).max(10).optional().default([])
});
var UpdateProfileRequestSchema = import_zod.z.object({
  full_name: import_zod.z.string().min(1).max(100).optional(),
  display_name: import_zod.z.string().min(1).max(50).optional(),
  timezone: import_zod.z.string().min(1).max(50).optional(),
  onboarding_completed: import_zod.z.boolean().optional(),
  onboarding_season: import_zod.z.string().min(1).max(100).optional(),
  expo_push_token: import_zod.z.string().max(500).optional(),
  daily_moment_time: import_zod.z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format").optional(),
  daily_scale_time: import_zod.z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format").optional()
});
var ValidateReceiptRequestSchema = import_zod.z.object({
  receipt: import_zod.z.string().min(1),
  platform: import_zod.z.enum(["apple", "google"]),
  product_id: import_zod.z.string().min(1)
});
var CheckoutRequestSchema = import_zod.z.object({
  plan: import_zod.z.enum(["monthly", "annual"])
});
var PushSubscribeRequestSchema = import_zod.z.object({
  endpoint: import_zod.z.string().url().max(1e3),
  keys: import_zod.z.object({
    p256dh: import_zod.z.string().min(1).max(500),
    auth: import_zod.z.string().min(1).max(500)
  })
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
  async updateJournalEntry(id, data) {
    const res = await this.request(`/api/journal/${id}`, {
      method: "PATCH",
      body: data
    });
    return res.entry;
  }
  async deleteJournalEntry(id) {
    await this.request(`/api/journal/${id}`, { method: "DELETE" });
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
  // ─── Stripe (v2 PWA — Checkout + Customer Portal) ───
  /** Create a Stripe Checkout session (7-day trial). Returns the redirect URL. */
  async createCheckoutSession(plan) {
    return this.request("/api/stripe/checkout", {
      method: "POST",
      body: { plan }
    });
  }
  /** Create a Stripe Customer Portal session. Returns the redirect URL. */
  async createPortalSession() {
    return this.request("/api/stripe/portal", { method: "POST" });
  }
  // ─── Web Push (v2 PWA) ──────────────────────
  /** Store a Web Push subscription for daily-scale reminders. */
  async subscribePush(subscription) {
    await this.request("/api/push/subscribe", {
      method: "POST",
      body: subscription
    });
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

// src/tokens.ts
var color = {
  nave950: "#0D1520",
  // deepest ground — Stillness, immersive
  nave900: "#14213A",
  // app chrome background
  nave800: "#1B2A4A",
  // brand navy, primary surfaces
  nave700: "#2D4166",
  // raised surfaces, hover
  vellum100: "#FDF6EC",
  // page panels (never full-bleed)
  vellum200: "#F5ECD7",
  // inset panels, quotes
  gilt500: "#C8A45E",
  // gold — the ONE emphasis per screen
  gilt300: "#E8D5A3",
  // gold text/glow on navy
  gilt700: "#8A6D35",
  // gold ink — accessible gold text on vellum (links, refs)
  olive700: "#5C6B53",
  // olive ink — accessible olive text on vellum
  ink900: "#2C2418",
  // text on vellum
  ink500: "#5C5144",
  // secondary text on vellum
  olive500: "#7A8B6F",
  // success, affirmation
  ember600: "#C0392B"
  // errors, crisis accents (rare)
};
var font = {
  display: '"Playfair Display", Georgia, serif',
  // display ONLY
  scripture: '"Cormorant Garamond", Georgia, serif',
  // scripture/prayer/questions, italic
  body: '"Source Sans 3", system-ui, sans-serif'
  // all UI + body
};
var radius = { panel: 14, control: 10, pill: 999 };
var motion = {
  easeSelah: "cubic-bezier(0.22, 0.8, 0.24, 1)",
  durWhisper: 250,
  // hovers, focus, small reveals
  durSettle: 450,
  // beam settle, card commit
  durBreath: 700
  // page/panel transitions (fade + 8px rise)
};
var giltBorderOnNavy = "rgba(200,164,94,0.12)";
var glowOnNavy = "rgba(200,164,94,0.06)";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  API_TIMEOUT,
  BRAND,
  BiblicalNarrativeSchema,
  CACHE_TTL,
  COLORS,
  CRISIS_KEYWORDS,
  CRISIS_RESOURCES,
  CheckoutRequestSchema,
  CreateJournalEntryRequestSchema,
  DISCLAIMER,
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
  PushSubscribeRequestSchema,
  SCALE_INVENTORY,
  SCALE_STATUSES,
  STILLNESS,
  ScriptureSchema,
  TERRITORIES,
  TIER_CONFIG,
  TONES,
  TRIAL_LINE,
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
});
