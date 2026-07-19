import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeBuilder, jsonRequest } from './helpers';

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

// The selector is exercised by its own unit test; here we stub it and verify the
// route's contract (published_date → date mapping, Scripture-Lens gating).
const { ensureMock } = vi.hoisted(() => ({ ensureMock: vi.fn() }));
vi.mock('@/lib/daily-selector', () => ({
  ensureDayPublished: (...a: unknown[]) => ensureMock(...a),
  toClientScale: (row: Record<string, unknown>) => ({
    id: row.id,
    date: row.published_date,
    question: row.question,
    side_a_label: row.side_a_label,
    side_a_argument: row.side_a_argument,
    side_b_label: row.side_b_label,
    side_b_argument: row.side_b_argument,
    scripture_reference: row.scripture_reference,
    scripture_text: row.scripture_text,
    scripture_lens: row.scripture_lens,
    prayer: row.prayer,
    votes_a: row.votes_a,
    votes_b: row.votes_b,
  }),
}));

import { GET } from '@/app/api/daily-scale/route';

const PUBLISHED_ROW = {
  id: '2e9f0a53-1111-4222-8333-444455556666',
  published_date: '2026-07-19',
  status: 'published',
  territory: 'doubt-certainty',
  source: 'seeded',
  approved_at: '2026-07-01',
  slug: 'is-restlessness-2026-07-19',
  question: 'Is restlessness anxiety — or holy discomfort?',
  side_a_label: 'Anxiety',
  side_a_argument: 'A',
  side_b_label: 'Holy discomfort',
  side_b_argument: 'B',
  scripture_reference: 'Philippians 4:6-7',
  scripture_text: 'Do not be anxious about anything...',
  scripture_lens: 'Scripture holds both...',
  prayer: 'Lord, I bring You this restlessness. Amen.',
  votes_a: 214,
  votes_b: 183,
};

describe('/api/daily-scale contract (publishing lifecycle)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAuthMock.mockResolvedValue({ user: { id: 'user-1' }, token: 't' });
    ensureMock.mockResolvedValue(PUBLISHED_ROW);
  });

  it('publishes/selects today via the selector and hides the Lens until voted', async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === 'daily_scale_votes') return makeBuilder({ data: null, error: null });
      throw new Error(`unexpected table ${table}`);
    });

    const res = await GET(jsonRequest('http://test/api/daily-scale', undefined, 'GET') as never);
    expect(res.status).toBe(200);
    const { data } = await res.json();

    expect(ensureMock).toHaveBeenCalled(); // lazy selection ran
    expect(data.hasVoted).toBe(false);
    expect(data.scale.date).toBe('2026-07-19'); // published_date mapped to date
    expect(data.scale.question).toBe(PUBLISHED_ROW.question);
    expect(data.scale.scripture_reference).toBeUndefined();
    expect(data.scale.scripture_lens).toBeUndefined();
    expect(data.scale.prayer).toBeUndefined();
    // internal lifecycle fields never leak to clients
    expect(data.scale.status).toBeUndefined();
    expect(data.scale.territory).toBeUndefined();
    expect(data.results).toBeUndefined();
  });

  it('returns the full scale + results once the user has voted', async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === 'daily_scale_votes') return makeBuilder({ data: { vote: 'b' }, error: null });
      throw new Error(`unexpected table ${table}`);
    });

    const res = await GET(jsonRequest('http://test/api/daily-scale', undefined, 'GET') as never);
    const { data } = await res.json();

    expect(data.hasVoted).toBe(true);
    expect(data.userVote).toBe('b');
    expect(data.scale.scripture_lens).toBe(PUBLISHED_ROW.scripture_lens);
    expect(data.results.total).toBe(397);
    expect(data.results.percent_a + data.results.percent_b).toBeGreaterThanOrEqual(99);
  });
});
