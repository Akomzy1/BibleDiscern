import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeBuilder, jsonRequest } from './helpers';

// ADMIN_EMAILS gates every route; set it before the modules import.
process.env.ADMIN_EMAILS = 'admin@biblediscern.com';

// requireAuth is the identity check requireAdmin builds on; stub it per-test.
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

// Queue of results, one per adminClient.from() call in route order.
const resultQueue: { data: unknown; error: unknown }[] = [];
const fromMock = vi.fn((..._a: unknown[]) => makeBuilder(resultQueue.shift() ?? { data: null, error: null }));
vi.mock('@/lib/supabase/admin', () => ({ adminClient: { from: (...a: unknown[]) => fromMock(...a) } }));

import { GET, POST } from '@/app/api/admin/scales/route';
import { PATCH } from '@/app/api/admin/scales/[id]/route';

const ADMIN = { user: { id: 'u1', email: 'admin@biblediscern.com' }, token: 't' };
const DRAFT_ROW = {
  id: 'aaaaaaaa-1111-4222-8333-444455556666',
  status: 'draft',
  territory: 'forgiveness',
  source: 'manual',
  published_date: null,
  approved_at: null,
  created_at: '2026-07-01T00:00:00Z',
  slug: null,
  question: 'Forgive before an apology, or wait for repentance?',
  side_a_label: 'Forgive now',
  side_a_argument: 'A '.repeat(15),
  side_b_label: 'Wait for repentance',
  side_b_argument: 'B '.repeat(15),
  scripture_reference: 'Luke 17:3-4',
  scripture_text: 'If your brother sins, rebuke him; and if he repents, forgive him.',
  scripture_lens: 'Scripture holds both the free grace of Colossians and the accountability of Luke 17.',
  prayer: 'Lord, teach me both mercy and truth in this. Amen.',
  votes_a: 0,
  votes_b: 0,
};

const VALID_BODY = {
  question: DRAFT_ROW.question,
  territory: 'forgiveness',
  side_a_label: DRAFT_ROW.side_a_label,
  side_a_argument: 'This is the strongest honest case for forgiving first.',
  side_b_label: DRAFT_ROW.side_b_label,
  side_b_argument: 'This is the strongest honest case for waiting for repentance.',
  scripture_reference: DRAFT_ROW.scripture_reference,
  scripture_text: DRAFT_ROW.scripture_text,
  scripture_lens: DRAFT_ROW.scripture_lens,
  prayer: DRAFT_ROW.prayer,
};

describe('/api/admin/scales — allowlist + lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resultQueue.length = 0;
    requireAuthMock.mockResolvedValue(ADMIN);
  });

  it('returns 404 to a signed-in non-admin (never advertises the route)', async () => {
    requireAuthMock.mockResolvedValue({ user: { id: 'u2', email: 'nope@x.com' }, token: 't' });
    const res = await GET(jsonRequest('http://test/api/admin/scales', undefined, 'GET') as never);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('not_found');
  });

  it('returns 404 when unauthenticated', async () => {
    requireAuthMock.mockRejectedValue(new Error('no token'));
    const res = await GET(jsonRequest('http://test/api/admin/scales', undefined, 'GET') as never);
    expect(res.status).toBe(404);
  });

  it('lists scales with an inventory summary for admins', async () => {
    resultQueue.push({
      data: [
        { ...DRAFT_ROW, status: 'approved', approved_at: '2026-07-02T00:00:00Z' },
        { ...DRAFT_ROW, id: 'bbbb', status: 'published', published_date: '2026-07-19' },
      ],
      error: null,
    });
    const res = await GET(jsonRequest('http://test/api/admin/scales', undefined, 'GET') as never);
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(data.scales).toHaveLength(2);
    expect(data.inventory.approved).toBe(1);
    expect(data.inventory.published).toBe(1);
    expect(data.inventory.runway).toBe(1); // approved + scheduled
    expect(data.inventory.byTerritory.forgiveness).toBe(1);
  });

  it('creates a manual draft (source=manual, no published_date)', async () => {
    resultQueue.push({ data: { ...DRAFT_ROW }, error: null });
    const res = await POST(jsonRequest('http://test/api/admin/scales', VALID_BODY) as never);
    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data.scale.source).toBe('manual');
    expect(data.scale.status).toBe('draft');
    expect(data.scale.published_date).toBeNull();
  });

  it('rejects malformed create input with 400', async () => {
    const res = await POST(
      jsonRequest('http://test/api/admin/scales', { ...VALID_BODY, question: 'x' }) as never,
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('validation_error');
  });

  it('approves a draft → approved with approved_at', async () => {
    resultQueue.push({ data: DRAFT_ROW, error: null }); // read existing
    resultQueue.push({
      data: { ...DRAFT_ROW, status: 'approved', approved_at: '2026-07-19T00:00:00Z' },
      error: null,
    }); // update
    const res = await PATCH(jsonRequest('http://test/api/admin/scales/x', { action: 'approve' }) as never, {
      params: Promise.resolve({ id: DRAFT_ROW.id }),
    });
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(data.scale.status).toBe('approved');
    expect(data.scale.approved_at).toBeTruthy();
  });

  it('refuses to edit a published scale (409, immutable)', async () => {
    resultQueue.push({ data: { ...DRAFT_ROW, status: 'published', published_date: '2026-07-19' }, error: null });
    const res = await PATCH(
      jsonRequest('http://test/api/admin/scales/x', {
        action: 'edit',
        patch: { question: 'A reworded but still valid question here.' },
      }) as never,
      { params: Promise.resolve({ id: DRAFT_ROW.id }) },
    );
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('conflict');
  });
});
