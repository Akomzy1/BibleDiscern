import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeBuilder, jsonRequest } from './helpers';

const requireAuthMock = vi.fn();
vi.mock('@/lib/auth', () => ({
  requireAuth: (...a: unknown[]) => requireAuthMock(...a),
  AuthError: class AuthError extends Error {
    constructor(
      message: string,
      public readonly status = 401,
    ) {
      super(message);
    }
  },
}));

const insertMock = vi.fn((..._a: unknown[]) => {});
const fromMock = vi.fn((..._t: unknown[]) => {
  const b = makeBuilder({ data: null, error: null });
  b.insert = (...a: unknown[]) => {
    insertMock(...a);
    return makeBuilder({ data: null, error: null });
  };
  return b;
});
vi.mock('@/lib/supabase/admin', () => ({ adminClient: { from: (...a: unknown[]) => fromMock(...a) } }));

import { POST } from '@/app/api/feedback/route';

describe('/api/feedback contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAuthMock.mockResolvedValue({ user: { id: 'user-1' }, token: 't' });
  });

  it('accepts a rating + message and attributes it to the user', async () => {
    const res = await POST(
      jsonRequest('http://test/api/feedback', { source: 'post_journey', rating: 4, message: 'Peaceful.' }) as never,
    );
    expect(res.status).toBe(201);
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', source: 'post_journey', rating: 4, message: 'Peaceful.' }),
    );
  });

  it('accepts a rating-only submission', async () => {
    const res = await POST(jsonRequest('http://test/api/feedback', { source: 'settings', rating: 5 }) as never);
    expect(res.status).toBe(201);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ rating: 5, message: null }));
  });

  it('rejects an empty submission (no rating, no message) with 400', async () => {
    const res = await POST(jsonRequest('http://test/api/feedback', { source: 'settings' }) as never);
    expect(res.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid source and an out-of-range rating', async () => {
    const bad1 = await POST(jsonRequest('http://test/api/feedback', { source: 'nope', rating: 3 }) as never);
    expect(bad1.status).toBe(400);
    const bad2 = await POST(jsonRequest('http://test/api/feedback', { source: 'settings', rating: 9 }) as never);
    expect(bad2.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });
});
