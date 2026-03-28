import { API_TIMEOUT } from './constants';
import type {
  Profile,
  Session,
  JournalEntry,
  Subscription,
  DailyMoment,
  DailyScaleResponse,
  DailyScaleHistoryEntry,
  DiscernmentResponse,
  DiscernSessionRequest,
  UpdateSessionRequest,
  CreateJournalEntryRequest,
  UpdateProfileRequest,
  ValidateReceiptRequest,
  ApiError,
} from './types';

// ─────────────────────────────────────────────
// Error types
// ─────────────────────────────────────────────

export class LibratoApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'LibratoApiError';
  }

  get isAuthError(): boolean {
    return this.status === 401;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isSessionLimit(): boolean {
    return this.status === 403 && this.code === 'limit_reached';
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// ─────────────────────────────────────────────
// Fetch helper
// ─────────────────────────────────────────────

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  timeoutMs?: number;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timerId);
  }
}

// ─────────────────────────────────────────────
// API Client
// ─────────────────────────────────────────────

export class LibratoApiClient {
  private readonly baseUrl: string;
  private authToken: string | null;

  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // strip trailing slash
    this.authToken = authToken ?? null;
  }

  /** Update the auth token (e.g. after a Supabase session refresh) */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // ─── Core request ───────────────────────────

  private async request<T>(
    path: string,
    { method = 'GET', body, timeoutMs = API_TIMEOUT.default }: FetchOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetchWithTimeout(
      `${this.baseUrl}${path}`,
      {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      timeoutMs,
    );

    // No-content responses
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const json = await response.json().catch(() => ({
      error: 'parse_error',
      message: 'Failed to parse server response.',
    }));

    if (!response.ok) {
      const err = json as ApiError;
      throw new LibratoApiError(
        err.error ?? 'unknown_error',
        err.message ?? 'An unexpected error occurred.',
        response.status,
        err.details,
      );
    }

    return (json.data ?? json) as T;
  }

  // ─── Discernment ────────────────────────────

  /** Submit a new discernment session. Uses extended 30s timeout for Claude. */
  async discern(
    situation: string,
    tone: DiscernSessionRequest['tone'],
  ): Promise<{ sessionId: string; response: DiscernmentResponse }> {
    return this.request('/api/discern', {
      method: 'POST',
      body: { situation, tone } satisfies DiscernSessionRequest,
      timeoutMs: API_TIMEOUT.discern,
    });
  }

  // ─── Sessions ───────────────────────────────

  async getSessions(): Promise<Session[]> {
    return this.request<Session[]>('/api/sessions');
  }

  async getSession(id: string): Promise<Session> {
    return this.request<Session>(`/api/sessions/${id}`);
  }

  async updateSession(id: string, data: UpdateSessionRequest): Promise<Session> {
    return this.request<Session>(`/api/sessions/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  // ─── Journal ────────────────────────────────

  async getJournal(): Promise<JournalEntry[]> {
    return this.request<JournalEntry[]>('/api/journal');
  }

  async getJournalEntry(id: string): Promise<JournalEntry> {
    return this.request<JournalEntry>(`/api/journal/${id}`);
  }

  async createJournalEntry(data: CreateJournalEntryRequest): Promise<JournalEntry> {
    return this.request<JournalEntry>('/api/journal', {
      method: 'POST',
      body: data,
    });
  }

  // ─── Profile ────────────────────────────────

  async getProfile(): Promise<Profile> {
    return this.request<Profile>('/api/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<Profile> {
    return this.request<Profile>('/api/profile', {
      method: 'PATCH',
      body: data,
    });
  }

  // ─── Subscription ───────────────────────────

  async getSubscription(): Promise<Subscription> {
    return this.request<Subscription>('/api/subscription');
  }

  /** Validate an Apple or Google receipt and upgrade the subscription if valid */
  async validateReceipt(
    receipt: string,
    platform: ValidateReceiptRequest['platform'],
    product_id: string,
  ): Promise<Subscription> {
    return this.request<Subscription>('/api/subscription/validate-receipt', {
      method: 'POST',
      body: { receipt, platform, product_id } satisfies ValidateReceiptRequest,
    });
  }

  // ─── Daily Moment ───────────────────────────

  async getDailyMoment(): Promise<DailyMoment> {
    return this.request<DailyMoment>('/api/daily-moment');
  }

  // ─── Daily Scale ─────────────────────────────

  async getDailyScale(): Promise<DailyScaleResponse> {
    return this.request<DailyScaleResponse>('/api/daily-scale');
  }

  async castScaleVote(scaleId: string, vote: 'a' | 'b'): Promise<DailyScaleResponse> {
    return this.request<DailyScaleResponse>('/api/daily-scale/vote', {
      method: 'POST',
      body: { scale_id: scaleId, vote },
    });
  }

  async getScaleHistory(): Promise<DailyScaleHistoryEntry[]> {
    return this.request<DailyScaleHistoryEntry[]>('/api/daily-scale/history');
  }
}

// ─────────────────────────────────────────────
// Factory (convenience for simple instantiation)
// ─────────────────────────────────────────────

export function createApiClient(baseUrl: string, authToken?: string): LibratoApiClient {
  return new LibratoApiClient(baseUrl, authToken);
}
