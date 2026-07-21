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

  it('blocks a free user from the journey entirely (Premium-only, 403 limit_reached)', async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === 'subscriptions') {
        return makeBuilder({
          data: {
            tier: 'free',
            sessions_used_this_month: 0,
            sessions_limit: 0,
            // The signup trigger seeds every free user as 'trialing' — the gate
            // must NOT treat that as a Premium trial (regression guard).
            status: 'trialing',
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

  it('lets a Premium user through the gate and calls Claude', async () => {
    const validAi = {
      summary: 'A weighty decision.',
      biblicalNarratives: [
        { character: 'Ruth', reference: 'Ruth 1:16', connection: 'c', lesson: 'l' },
        { character: 'Paul', reference: 'Acts 16:9', connection: 'c', lesson: 'l' },
      ],
      scriptures: [
        { reference: 'Proverbs 3:5', text: 't', context: 'c' },
        { reference: 'Psalm 37:4', text: 't', context: 'c' },
        { reference: 'Jeremiah 29:11', text: 't', context: 'c' },
      ],
      examination: ['q1', 'q2', 'q3', 'q4', 'q5'],
      fruitDiagnostic: {
        love: { score: 7, note: 'n' },
        joy: { score: 6, note: 'n' },
        peace: { score: 5, note: 'n' },
        patience: { score: 4, note: 'n' },
        kindness: { score: 8, note: 'n' },
        goodness: { score: 7, note: 'n' },
        faithfulness: { score: 6, note: 'n' },
        gentleness: { score: 7, note: 'n' },
        selfControl: { score: 5, note: 'n' },
      },
      prayer: 'Lord, grant wisdom. Amen.',
      closingWord: 'Trust His timing.',
    };
    anthropicCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(validAi) }] });
    fromMock.mockImplementation((table: string) => {
      if (table === 'subscriptions') {
        return makeBuilder({
          data: { tier: 'premium', sessions_used_this_month: 3, sessions_limit: 9999, status: 'active' },
          error: null,
        });
      }
      if (table === 'sessions') {
        return makeBuilder({ data: { id: 'sess-1', status: 'active', ai_response: validAi }, error: null });
      }
      throw new Error(`unexpected table ${table}`);
    });

    const res = await POST(
      jsonRequest('http://test/api/discern', {
        situation: 'Should I take the new job in another city or stay near family?',
        tone: 'reflective',
      }) as never,
    );
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data.sessionId).toBe('sess-1');
    expect(anthropicCreate).toHaveBeenCalledOnce();
  });

  it('rejects invalid input with a validation error before any Claude call', async () => {
    const res = await POST(
      jsonRequest('http://test/api/discern', { situation: 'too short', tone: 'reflective' }) as never,
    );
    expect(res.status).toBe(400);
    expect(anthropicCreate).not.toHaveBeenCalled();
  });
});
