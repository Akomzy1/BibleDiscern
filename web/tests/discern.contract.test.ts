import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeBuilder, jsonRequest } from './helpers';

// ─── Mocks (declared before importing the route) ─────────────────────────────

const { anthropicCreate } = vi.hoisted(() => ({ anthropicCreate: vi.fn() }));
vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = { create: anthropicCreate };
  },
}));

const requireAuthMock = vi.fn();
vi.mock('@/lib/auth', () => ({
  requireAuth: (...args: unknown[]) => requireAuthMock(...args),
  AuthError: class AuthError extends Error {
    constructor(
      message: string,
      public readonly status: number = 401,
    ) {
      super(message);
      this.name = 'AuthError';
    }
  },
}));

const fromMock = vi.fn();
vi.mock('@/lib/supabase/admin', () => ({
  adminClient: { from: (...args: unknown[]) => fromMock(...args) },
}));

import { POST } from '@/app/api/discern/route';

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('/api/discern contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAuthMock.mockResolvedValue({ user: { id: 'user-1' }, token: 't' });
  });

  it('returns crisis resources and NEVER calls Claude on crisis keywords', async () => {
    const res = await POST(
      jsonRequest('http://test/api/discern', {
        situation: 'I have been thinking about suicide and I do not know what to do',
        tone: 'lament',
      }) as never,
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.crisis).toBe(true);
    expect(json.data.resources.length).toBeGreaterThan(0);
    expect(anthropicCreate).not.toHaveBeenCalled();
    // Crisis screening happens before any subscription lookup or DB write
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("blocks a free user's session past the monthly limit (403 limit_reached)", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === 'subscriptions') {
        return makeBuilder({
          data: {
            tier: 'free',
            sessions_used_this_month: 1,
            sessions_limit: 1,
            status: 'active',
          },
          error: null,
        });
      }
      throw new Error(`unexpected table ${table}`);
    });

    const res = await POST(
      jsonRequest('http://test/api/discern', {
        situation: 'Should I take the new job in another city or stay near family?',
        tone: 'reflective',
      }) as never,
    );
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('limit_reached');
    expect(anthropicCreate).not.toHaveBeenCalled();
  });

  it('rejects invalid input with a validation error before any Claude call', async () => {
    const res = await POST(
      jsonRequest('http://test/api/discern', { situation: 'too short', tone: 'reflective' }) as never,
    );
    expect(res.status).toBe(400);
    expect(anthropicCreate).not.toHaveBeenCalled();
  });
});
