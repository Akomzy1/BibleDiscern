import { z } from 'zod';

interface Profile {
    id: string;
    full_name: string | null;
    display_name: string | null;
    timezone: string;
    onboarding_completed: boolean;
    subscription_tier: 'free' | 'premium';
    subscription_source: 'stripe' | 'apple' | 'google';
    stripe_customer_id: string | null;
    apple_receipt: string | null;
    google_purchase_token: string | null;
    expo_push_token: string | null;
    daily_moment_time: string;
    trial_started_at: string | null;
    trial_ended: boolean;
    created_at: string;
    updated_at: string;
}
interface Session {
    id: string;
    user_id: string;
    situation: string;
    tone: 'reflective' | 'urgent' | 'encouragement' | 'lament';
    ai_response: DiscernmentResponse | null;
    stillness_note: string | null;
    status: 'active' | 'completed' | 'archived';
    follow_up_1w_sent: boolean;
    follow_up_1m_sent: boolean;
    follow_up_3m_sent: boolean;
    follow_up_1w_response: string | null;
    follow_up_1m_response: string | null;
    follow_up_3m_response: string | null;
    created_at: string;
    completed_at: string | null;
}
interface DiscernmentResponse {
    summary: string;
    biblicalNarratives: {
        character: string;
        reference: string;
        connection: string;
        lesson: string;
    }[];
    scriptures: {
        reference: string;
        text: string;
        context: string;
    }[];
    examination: string[];
    fruitDiagnostic: {
        love: string;
        joy: string;
        peace: string;
        patience: string;
        kindness: string;
        goodness: string;
        faithfulness: string;
        gentleness: string;
        selfControl: string;
    };
    prayer: string;
    closingWord: string;
}
interface JournalEntry {
    id: string;
    user_id: string;
    session_id: string | null;
    title: string | null;
    content: string | null;
    entry_type: 'discernment' | 'reflection' | 'answered_prayer' | 'god_showed_up';
    tags: string[];
    created_at: string;
}
interface Subscription {
    id: string;
    user_id: string;
    stripe_subscription_id: string | null;
    apple_transaction_id: string | null;
    google_order_id: string | null;
    tier: 'free' | 'premium';
    billing_interval: 'month' | 'year';
    source: 'stripe' | 'apple' | 'google';
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    current_period_start: string | null;
    current_period_end: string | null;
    sessions_used_this_month: number;
    sessions_limit: number;
    created_at: string;
}
interface DailyMoment {
    id: string;
    date: string;
    scripture_reference: string;
    scripture_text: string;
    reflection_prompt: string;
    prayer: string;
}
interface DailyScale {
    id: string;
    date: string;
    question: string;
    side_a_label: string;
    side_a_argument: string;
    side_b_label: string;
    side_b_argument: string;
    scripture_reference?: string;
    scripture_text?: string;
    scripture_lens?: string;
    prayer?: string;
    votes_a: number;
    votes_b: number;
}
interface DailyScaleResults {
    votes_a: number;
    votes_b: number;
    percent_a: number;
    percent_b: number;
    total: number;
}
interface DailyScaleResponse {
    scale: DailyScale;
    hasVoted: boolean;
    userVote?: 'a' | 'b';
    results?: DailyScaleResults;
}
interface DailyScaleHistoryEntry {
    scale: DailyScale;
    hasVoted: boolean;
    userVote?: 'a' | 'b';
    results: DailyScaleResults;
}
type DailyScalePhase = 'weigh' | 'see' | 'learn';
type TierConfig = {
    sessions_limit: number;
    has_fruit_diagnostic: boolean;
    has_follow_ups: boolean;
    has_full_journal: boolean;
    has_scripture_sharing: boolean;
    journal_visible_count: number;
};
interface ApiError {
    error: string;
    message: string;
    details?: unknown;
}
interface ApiSuccess<T> {
    data: T;
}
type ApiResponse<T> = ApiSuccess<T> | ApiError;
interface DiscernSessionRequest {
    situation: string;
    tone: Session['tone'];
}
interface UpdateSessionRequest {
    stillness_note?: string;
    follow_up_1w_response?: string;
    follow_up_1m_response?: string;
    follow_up_3m_response?: string;
    status?: Session['status'];
    completed_at?: string;
}
interface CreateJournalEntryRequest {
    session_id?: string;
    title?: string;
    content?: string;
    entry_type?: JournalEntry['entry_type'];
    tags?: string[];
}
interface UpdateProfileRequest {
    full_name?: string;
    display_name?: string;
    timezone?: string;
    onboarding_completed?: boolean;
    onboarding_season?: string;
    expo_push_token?: string;
    daily_moment_time?: string;
    daily_scale_time?: string;
}
interface ValidateReceiptRequest {
    receipt: string;
    platform: 'apple' | 'google';
    product_id: string;
}

declare const BRAND: {
    readonly name: "BibleDiscern";
    readonly tagline: "Weigh it with wisdom";
    readonly latinMeaning: "From the Latin \"librato\" — to weigh, to balance, to ponder";
};
declare const COLORS: {
    readonly navy: "#1B2A4A";
    readonly navyLight: "#2D4166";
    readonly gold: "#C8A45E";
    readonly goldLight: "#E8D5A3";
    readonly goldMuted: "#D4BA7A";
    readonly cream: "#FDF6EC";
    readonly parchment: "#F5ECD7";
    readonly warmWhite: "#FEFCF6";
    readonly textDark: "#2C2418";
    readonly textMedium: "#5C5144";
    readonly textLight: "#8A7F72";
    readonly sage: "#7A8B6F";
    readonly border: "#E8DFD0";
    readonly error: "#C0392B";
};
declare const TIER_CONFIG: Record<string, TierConfig>;
declare const PRICING: {
    readonly monthly: {
        readonly price: 7.99;
        readonly label: "$7.99/month";
    };
    readonly annual: {
        readonly price: 49.99;
        readonly label: "$49.99/year";
        readonly perMonth: "$7.99/month";
        readonly savings: "48%";
    };
};
declare const IAP_PRODUCTS: {
    readonly monthly: "librato_premium_monthly";
    readonly annual: "librato_premium_annual";
};
declare const TONES: readonly [{
    readonly id: "reflective";
    readonly label: "Reflective";
    readonly icon: "🌊";
}, {
    readonly id: "urgent";
    readonly label: "Urgent";
    readonly icon: "⚡";
}, {
    readonly id: "encouragement";
    readonly label: "Encouragement";
    readonly icon: "☀️";
}, {
    readonly id: "lament";
    readonly label: "Lament";
    readonly icon: "🕊️";
}];
type ToneId = (typeof TONES)[number]['id'];
declare const JOURNEY_STEPS: readonly [{
    readonly id: "word";
    readonly label: "The Word";
    readonly icon: "📖";
}, {
    readonly id: "narratives";
    readonly label: "Those who walked before";
    readonly icon: "🪶";
}, {
    readonly id: "examination";
    readonly label: "The Examination";
    readonly icon: "🔍";
}, {
    readonly id: "stillness";
    readonly label: "The Stillness";
    readonly icon: "🕊️";
}, {
    readonly id: "fruit";
    readonly label: "The Fruit";
    readonly icon: "🌿";
}, {
    readonly id: "prayer";
    readonly label: "The Prayer";
    readonly icon: "🙏";
}];
type JourneyStepId = (typeof JOURNEY_STEPS)[number]['id'];
declare const FRUIT_LABELS: {
    readonly love: "Love";
    readonly joy: "Joy";
    readonly peace: "Peace";
    readonly patience: "Patience";
    readonly kindness: "Kindness";
    readonly goodness: "Goodness";
    readonly faithfulness: "Faithfulness";
    readonly gentleness: "Gentleness";
    readonly selfControl: "Self-Control";
};
declare const CRISIS_KEYWORDS: readonly ["suicide", "kill myself", "end my life", "want to die", "self-harm", "cutting myself", "hurting myself", "abuse", "being abused", "domestic violence", "molest", "rape", "assault"];
declare const CRISIS_RESOURCES: readonly [{
    readonly name: "988 Suicide & Crisis Lifeline";
    readonly action: "tel:988";
    readonly type: "call";
}, {
    readonly name: "Crisis Text Line";
    readonly action: "sms:741741&body=HOME";
    readonly type: "text";
}, {
    readonly name: "RAINN";
    readonly action: "tel:18006564673";
    readonly type: "call";
}];
declare const CACHE_TTL: {
    readonly dailyMoment: number;
    readonly sessions: number;
    readonly profile: number;
};
declare const API_TIMEOUT: {
    readonly discern: 30000;
    readonly default: 10000;
};
declare const STILLNESS: {
    readonly totalDurationMs: 90000;
    readonly phaseTransitionMs: 45000;
    readonly inhaleMs: 4000;
    readonly holdMs: 2000;
    readonly exhaleMs: 4000;
    readonly pauseMs: 1000;
    readonly phase1Prompt: "Be still, and know that I am God.";
    readonly phase2Prompt: "Listen. What is He saying to you now?";
};
declare const LOADING_MESSAGES: readonly ["Searching the Scriptures...", "Listening for wisdom...", "Walking with those who came before...", "Weighing what matters...", "Preparing your path...", "Gathering ancient wisdom..."];

declare const BiblicalNarrativeSchema: z.ZodObject<{
    character: z.ZodString;
    reference: z.ZodString;
    connection: z.ZodString;
    lesson: z.ZodString;
}, "strip", z.ZodTypeAny, {
    character: string;
    reference: string;
    connection: string;
    lesson: string;
}, {
    character: string;
    reference: string;
    connection: string;
    lesson: string;
}>;
declare const ScriptureSchema: z.ZodObject<{
    reference: z.ZodString;
    text: z.ZodString;
    context: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    reference: string;
    context: string;
}, {
    text: string;
    reference: string;
    context: string;
}>;
declare const FruitDiagnosticSchema: z.ZodObject<{
    love: z.ZodString;
    joy: z.ZodString;
    peace: z.ZodString;
    patience: z.ZodString;
    kindness: z.ZodString;
    goodness: z.ZodString;
    faithfulness: z.ZodString;
    gentleness: z.ZodString;
    selfControl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    love: string;
    joy: string;
    peace: string;
    patience: string;
    kindness: string;
    goodness: string;
    faithfulness: string;
    gentleness: string;
    selfControl: string;
}, {
    love: string;
    joy: string;
    peace: string;
    patience: string;
    kindness: string;
    goodness: string;
    faithfulness: string;
    gentleness: string;
    selfControl: string;
}>;
declare const DiscernmentResponseSchema: z.ZodObject<{
    summary: z.ZodString;
    biblicalNarratives: z.ZodArray<z.ZodObject<{
        character: z.ZodString;
        reference: z.ZodString;
        connection: z.ZodString;
        lesson: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        character: string;
        reference: string;
        connection: string;
        lesson: string;
    }, {
        character: string;
        reference: string;
        connection: string;
        lesson: string;
    }>, "many">;
    scriptures: z.ZodArray<z.ZodObject<{
        reference: z.ZodString;
        text: z.ZodString;
        context: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        reference: string;
        context: string;
    }, {
        text: string;
        reference: string;
        context: string;
    }>, "many">;
    examination: z.ZodArray<z.ZodString, "many">;
    fruitDiagnostic: z.ZodObject<{
        love: z.ZodString;
        joy: z.ZodString;
        peace: z.ZodString;
        patience: z.ZodString;
        kindness: z.ZodString;
        goodness: z.ZodString;
        faithfulness: z.ZodString;
        gentleness: z.ZodString;
        selfControl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        love: string;
        joy: string;
        peace: string;
        patience: string;
        kindness: string;
        goodness: string;
        faithfulness: string;
        gentleness: string;
        selfControl: string;
    }, {
        love: string;
        joy: string;
        peace: string;
        patience: string;
        kindness: string;
        goodness: string;
        faithfulness: string;
        gentleness: string;
        selfControl: string;
    }>;
    prayer: z.ZodString;
    closingWord: z.ZodString;
}, "strip", z.ZodTypeAny, {
    examination: string[];
    prayer: string;
    summary: string;
    biblicalNarratives: {
        character: string;
        reference: string;
        connection: string;
        lesson: string;
    }[];
    scriptures: {
        text: string;
        reference: string;
        context: string;
    }[];
    fruitDiagnostic: {
        love: string;
        joy: string;
        peace: string;
        patience: string;
        kindness: string;
        goodness: string;
        faithfulness: string;
        gentleness: string;
        selfControl: string;
    };
    closingWord: string;
}, {
    examination: string[];
    prayer: string;
    summary: string;
    biblicalNarratives: {
        character: string;
        reference: string;
        connection: string;
        lesson: string;
    }[];
    scriptures: {
        text: string;
        reference: string;
        context: string;
    }[];
    fruitDiagnostic: {
        love: string;
        joy: string;
        peace: string;
        patience: string;
        kindness: string;
        goodness: string;
        faithfulness: string;
        gentleness: string;
        selfControl: string;
    };
    closingWord: string;
}>;
declare const DiscernSessionRequestSchema: z.ZodObject<{
    situation: z.ZodString;
    tone: z.ZodEnum<["reflective", "urgent", "encouragement", "lament"]>;
}, "strip", z.ZodTypeAny, {
    tone: "reflective" | "urgent" | "encouragement" | "lament";
    situation: string;
}, {
    tone: "reflective" | "urgent" | "encouragement" | "lament";
    situation: string;
}>;
declare const DiscernSessionResponseSchema: z.ZodObject<{
    sessionId: z.ZodString;
    response: z.ZodObject<{
        summary: z.ZodString;
        biblicalNarratives: z.ZodArray<z.ZodObject<{
            character: z.ZodString;
            reference: z.ZodString;
            connection: z.ZodString;
            lesson: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            character: string;
            reference: string;
            connection: string;
            lesson: string;
        }, {
            character: string;
            reference: string;
            connection: string;
            lesson: string;
        }>, "many">;
        scriptures: z.ZodArray<z.ZodObject<{
            reference: z.ZodString;
            text: z.ZodString;
            context: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            text: string;
            reference: string;
            context: string;
        }, {
            text: string;
            reference: string;
            context: string;
        }>, "many">;
        examination: z.ZodArray<z.ZodString, "many">;
        fruitDiagnostic: z.ZodObject<{
            love: z.ZodString;
            joy: z.ZodString;
            peace: z.ZodString;
            patience: z.ZodString;
            kindness: z.ZodString;
            goodness: z.ZodString;
            faithfulness: z.ZodString;
            gentleness: z.ZodString;
            selfControl: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            love: string;
            joy: string;
            peace: string;
            patience: string;
            kindness: string;
            goodness: string;
            faithfulness: string;
            gentleness: string;
            selfControl: string;
        }, {
            love: string;
            joy: string;
            peace: string;
            patience: string;
            kindness: string;
            goodness: string;
            faithfulness: string;
            gentleness: string;
            selfControl: string;
        }>;
        prayer: z.ZodString;
        closingWord: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        examination: string[];
        prayer: string;
        summary: string;
        biblicalNarratives: {
            character: string;
            reference: string;
            connection: string;
            lesson: string;
        }[];
        scriptures: {
            text: string;
            reference: string;
            context: string;
        }[];
        fruitDiagnostic: {
            love: string;
            joy: string;
            peace: string;
            patience: string;
            kindness: string;
            goodness: string;
            faithfulness: string;
            gentleness: string;
            selfControl: string;
        };
        closingWord: string;
    }, {
        examination: string[];
        prayer: string;
        summary: string;
        biblicalNarratives: {
            character: string;
            reference: string;
            connection: string;
            lesson: string;
        }[];
        scriptures: {
            text: string;
            reference: string;
            context: string;
        }[];
        fruitDiagnostic: {
            love: string;
            joy: string;
            peace: string;
            patience: string;
            kindness: string;
            goodness: string;
            faithfulness: string;
            gentleness: string;
            selfControl: string;
        };
        closingWord: string;
    }>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    response: {
        examination: string[];
        prayer: string;
        summary: string;
        biblicalNarratives: {
            character: string;
            reference: string;
            connection: string;
            lesson: string;
        }[];
        scriptures: {
            text: string;
            reference: string;
            context: string;
        }[];
        fruitDiagnostic: {
            love: string;
            joy: string;
            peace: string;
            patience: string;
            kindness: string;
            goodness: string;
            faithfulness: string;
            gentleness: string;
            selfControl: string;
        };
        closingWord: string;
    };
}, {
    sessionId: string;
    response: {
        examination: string[];
        prayer: string;
        summary: string;
        biblicalNarratives: {
            character: string;
            reference: string;
            connection: string;
            lesson: string;
        }[];
        scriptures: {
            text: string;
            reference: string;
            context: string;
        }[];
        fruitDiagnostic: {
            love: string;
            joy: string;
            peace: string;
            patience: string;
            kindness: string;
            goodness: string;
            faithfulness: string;
            gentleness: string;
            selfControl: string;
        };
        closingWord: string;
    };
}>;
declare const UpdateSessionRequestSchema: z.ZodObject<{
    stillness_note: z.ZodOptional<z.ZodString>;
    follow_up_1w_response: z.ZodOptional<z.ZodString>;
    follow_up_1m_response: z.ZodOptional<z.ZodString>;
    follow_up_3m_response: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["active", "completed", "archived"]>>;
    completed_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "completed" | "archived" | undefined;
    stillness_note?: string | undefined;
    follow_up_1w_response?: string | undefined;
    follow_up_1m_response?: string | undefined;
    follow_up_3m_response?: string | undefined;
    completed_at?: string | undefined;
}, {
    status?: "active" | "completed" | "archived" | undefined;
    stillness_note?: string | undefined;
    follow_up_1w_response?: string | undefined;
    follow_up_1m_response?: string | undefined;
    follow_up_3m_response?: string | undefined;
    completed_at?: string | undefined;
}>;
declare const CreateJournalEntryRequestSchema: z.ZodObject<{
    session_id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    entry_type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["discernment", "reflection", "answered_prayer", "god_showed_up"]>>>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    entry_type: "discernment" | "reflection" | "answered_prayer" | "god_showed_up";
    tags: string[];
    session_id?: string | undefined;
    title?: string | undefined;
    content?: string | undefined;
}, {
    entry_type?: "discernment" | "reflection" | "answered_prayer" | "god_showed_up" | undefined;
    session_id?: string | undefined;
    title?: string | undefined;
    content?: string | undefined;
    tags?: string[] | undefined;
}>;
declare const UpdateProfileRequestSchema: z.ZodObject<{
    full_name: z.ZodOptional<z.ZodString>;
    display_name: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
    onboarding_completed: z.ZodOptional<z.ZodBoolean>;
    onboarding_season: z.ZodOptional<z.ZodString>;
    expo_push_token: z.ZodOptional<z.ZodString>;
    daily_moment_time: z.ZodOptional<z.ZodString>;
    daily_scale_time: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    full_name?: string | undefined;
    display_name?: string | undefined;
    timezone?: string | undefined;
    onboarding_completed?: boolean | undefined;
    onboarding_season?: string | undefined;
    expo_push_token?: string | undefined;
    daily_moment_time?: string | undefined;
    daily_scale_time?: string | undefined;
}, {
    full_name?: string | undefined;
    display_name?: string | undefined;
    timezone?: string | undefined;
    onboarding_completed?: boolean | undefined;
    onboarding_season?: string | undefined;
    expo_push_token?: string | undefined;
    daily_moment_time?: string | undefined;
    daily_scale_time?: string | undefined;
}>;
declare const ValidateReceiptRequestSchema: z.ZodObject<{
    receipt: z.ZodString;
    platform: z.ZodEnum<["apple", "google"]>;
    product_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    receipt: string;
    platform: "apple" | "google";
    product_id: string;
}, {
    receipt: string;
    platform: "apple" | "google";
    product_id: string;
}>;
type DiscernSessionRequestInput = z.infer<typeof DiscernSessionRequestSchema>;
type UpdateSessionRequestInput = z.infer<typeof UpdateSessionRequestSchema>;
type CreateJournalEntryRequestInput = z.infer<typeof CreateJournalEntryRequestSchema>;
type UpdateProfileRequestInput = z.infer<typeof UpdateProfileRequestSchema>;
type ValidateReceiptRequestInput = z.infer<typeof ValidateReceiptRequestSchema>;
type DiscernmentResponseOutput = z.infer<typeof DiscernmentResponseSchema>;
declare function containsCrisisKeywords(text: string): boolean;

declare class LibratoApiError extends Error {
    readonly code: string;
    readonly status: number;
    readonly details?: unknown | undefined;
    constructor(code: string, message: string, status: number, details?: unknown | undefined);
    get isAuthError(): boolean;
    get isRateLimited(): boolean;
    get isSessionLimit(): boolean;
    get isServerError(): boolean;
}
declare class LibratoApiClient {
    private readonly baseUrl;
    private authToken;
    constructor(baseUrl: string, authToken?: string);
    /** Update the auth token (e.g. after a Supabase session refresh) */
    setAuthToken(token: string | null): void;
    private request;
    /** Submit a new discernment session. Uses extended 30s timeout for Claude. */
    discern(situation: string, tone: DiscernSessionRequest['tone']): Promise<{
        sessionId: string;
        response: DiscernmentResponse;
    }>;
    getSessions(): Promise<Session[]>;
    getSession(id: string): Promise<Session>;
    updateSession(id: string, data: UpdateSessionRequest): Promise<Session>;
    getJournal(): Promise<JournalEntry[]>;
    getJournalEntry(id: string): Promise<JournalEntry>;
    createJournalEntry(data: CreateJournalEntryRequest): Promise<JournalEntry>;
    getProfile(): Promise<Profile>;
    updateProfile(data: UpdateProfileRequest): Promise<Profile>;
    getSubscription(): Promise<Subscription>;
    /** Validate an Apple or Google receipt and upgrade the subscription if valid */
    validateReceipt(receipt: string, platform: ValidateReceiptRequest['platform'], product_id: string): Promise<Subscription>;
    getDailyMoment(): Promise<DailyMoment>;
    getDailyScale(): Promise<DailyScaleResponse>;
    castScaleVote(scaleId: string, vote: 'a' | 'b'): Promise<DailyScaleResponse>;
    getScaleHistory(): Promise<DailyScaleHistoryEntry[]>;
}
declare function createApiClient(baseUrl: string, authToken?: string): LibratoApiClient;

export { API_TIMEOUT, type ApiError, type ApiResponse, type ApiSuccess, BRAND, BiblicalNarrativeSchema, CACHE_TTL, COLORS, CRISIS_KEYWORDS, CRISIS_RESOURCES, type CreateJournalEntryRequest, type CreateJournalEntryRequestInput, CreateJournalEntryRequestSchema, type DailyMoment, type DailyScale, type DailyScaleHistoryEntry, type DailyScalePhase, type DailyScaleResponse, type DailyScaleResults, type DiscernSessionRequest, type DiscernSessionRequestInput, DiscernSessionRequestSchema, DiscernSessionResponseSchema, type DiscernmentResponse, type DiscernmentResponseOutput, DiscernmentResponseSchema, FRUIT_LABELS, FruitDiagnosticSchema, IAP_PRODUCTS, JOURNEY_STEPS, type JournalEntry, type JourneyStepId, LOADING_MESSAGES, LibratoApiClient, LibratoApiError, PRICING, type Profile, STILLNESS, ScriptureSchema, type Session, type Subscription, TIER_CONFIG, TONES, type TierConfig, type ToneId, type UpdateProfileRequest, type UpdateProfileRequestInput, UpdateProfileRequestSchema, type UpdateSessionRequest, type UpdateSessionRequestInput, UpdateSessionRequestSchema, type ValidateReceiptRequest, type ValidateReceiptRequestInput, ValidateReceiptRequestSchema, containsCrisisKeywords, createApiClient };
