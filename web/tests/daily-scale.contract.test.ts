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

import { GET } from '@/app/api/daily-scale/route';

const SCALE_ROW = {
  id: '2e9f0a53-1111-4222-8333-444455556666',
  date: '2026-07-18',
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

describe('/api/daily-scale contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAuthMock.mockResolvedValue({ user: { id: 'user-1' }, token: 't' });
  });

  it('hides the Scripture Lens fields until the user has voted', async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === 'daily_scales') return makeBuilder({ data: SCALE_ROW, error: null });
      if (table === 'daily_scale_votes')
        return makeBuilder({ data: null, error: { code: 'PGRST116' } });
      throw new Error(`unexpected table ${table}`);
    });

    const res = await GET(jsonRequest('http://test/api/daily-scale', undefined, 'GET') as never);
    expect(res.status).toBe(200);
    const { data } = await res.json();

    expect(data.hasVoted).toBe(false);
    expect(data.scale.question).toBe(SCALE_ROW.question);
    expect(data.scale.scripture_reference).toBeUndefined();
    expect(data.scale.scripture_text).toBeUndefined();
    expect(data.scale.scripture_lens).toBeUndefined();
    expect(data.scale.prayer).toBeUndefined();
    expect(data.results).toBeUndefined();
  });

  it('returns the full scale + results once the user has voted', async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === 'daily_scales') return makeBuilder({ data: SCALE_ROW, error: null });
      if (table === 'daily_scale_votes')
        return makeBuilder({ data: { vote: 'b' }, error: null });
      throw new Error(`unexpected table ${table}`);
    });

    const res = await GET(jsonRequest('http://test/api/daily-scale', undefined, 'GET') as never);
    expect(res.status).toBe(200);
    const { data } = await res.json();

    expect(data.hasVoted).toBe(true);
    expect(data.userVote).toBe('b');
    expect(data.scale.scripture_lens).toBe(SCALE_ROW.scripture_lens);
    expect(data.results.total).toBe(397);
    expect(data.results.percent_a + data.results.percent_b).toBeGreaterThanOrEqual(99);
  });
});
