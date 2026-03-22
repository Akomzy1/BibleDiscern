// ─────────────────────────────────────────────
// Core domain types for LibratoAi
// ─────────────────────────────────────────────

export interface Profile {
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

export interface Session {
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

export interface DiscernmentResponse {
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

export interface JournalEntry {
  id: string;
  user_id: string;
  session_id: string | null;
  title: string | null;
  content: string | null;
  entry_type: 'discernment' | 'reflection' | 'answered_prayer' | 'god_showed_up';
  tags: string[];
  created_at: string;
}

export interface Subscription {
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

export interface DailyMoment {
  id: string;
  date: string;
  scripture_reference: string;
  scripture_text: string;
  reflection_prompt: string;
  prayer: string;
}

export type TierConfig = {
  sessions_limit: number;
  has_fruit_diagnostic: boolean;
  has_follow_ups: boolean;
  has_full_journal: boolean;
  has_scripture_sharing: boolean;
  journal_visible_count: number;
};

// ─────────────────────────────────────────────
// API request/response envelope types
// ─────────────────────────────────────────────

export interface ApiError {
  error: string;        // Machine-readable: 'limit_reached', 'unauthorized', 'validation_error', 'server_error'
  message: string;      // Human-readable display message
  details?: unknown;    // Optional Zod validation details
}

export interface ApiSuccess<T> {
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────────
// API request types
// ─────────────────────────────────────────────

export interface DiscernSessionRequest {
  situation: string;
  tone: Session['tone'];
}

export interface UpdateSessionRequest {
  stillness_note?: string;
  follow_up_1w_response?: string;
  follow_up_1m_response?: string;
  follow_up_3m_response?: string;
  status?: Session['status'];
  completed_at?: string;
}

export interface CreateJournalEntryRequest {
  session_id?: string;
  title?: string;
  content?: string;
  entry_type?: JournalEntry['entry_type'];
  tags?: string[];
}

export interface UpdateProfileRequest {
  full_name?: string;
  display_name?: string;
  timezone?: string;
  onboarding_completed?: boolean;
  expo_push_token?: string;
  daily_moment_time?: string;
}

export interface ValidateReceiptRequest {
  receipt: string;
  platform: 'apple' | 'google';
  product_id: string;
}
