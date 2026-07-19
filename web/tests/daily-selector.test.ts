import { describe, it, expect, vi } from 'vitest';

// chooseApproved is pure, but its module imports the admin client (which needs
// env at import time) — stub it so the import doesn't throw.
vi.mock('@/lib/supabase/admin', () => ({ adminClient: {} }));

import { chooseApproved } from '@/lib/daily-selector';

// The pure selection logic behind the no-repeat guarantee + territory spacing.
type C = { id: string; territory: string | null; approved_at: string };

describe('chooseApproved — territory spacing + LRU + FIFO', () => {
  it('returns null when the approved pool is empty', () => {
    expect(chooseApproved([], null, {})).toBeNull();
  });

  it("avoids yesterday's territory when an alternative exists", () => {
    const pool: C[] = [
      { id: 'money', territory: 'money-stewardship', approved_at: '2026-01-01' },
      { id: 'peace', territory: 'peace-vs-truth', approved_at: '2026-01-02' },
    ];
    // prev day was money-stewardship → must not pick 'money'
    expect(chooseApproved(pool, 'money-stewardship', {})).toBe('peace');
  });

  it("relaxes territory rather than skip a day when only yesterday's territory remains", () => {
    const pool: C[] = [{ id: 'money', territory: 'money-stewardship', approved_at: '2026-01-01' }];
    // no alternative → must still pick (a territory repeat beats a gap)
    expect(chooseApproved(pool, 'money-stewardship', {})).toBe('money');
  });

  it('prefers a least-recently-used (never-published) territory', () => {
    const pool: C[] = [
      { id: 'recent', territory: 'forgiveness', approved_at: '2026-01-01' },
      { id: 'never', territory: 'doubt-certainty', approved_at: '2026-01-05' },
    ];
    // forgiveness was published yesterday-ish; doubt-certainty never → pick 'never'
    const last = { forgiveness: '2026-06-01' };
    expect(chooseApproved(pool, null, last)).toBe('never');
  });

  it('breaks ties by FIFO (oldest approved_at first) within equal territory recency', () => {
    const pool: C[] = [
      { id: 'newer', territory: 'forgiveness', approved_at: '2026-02-01' },
      { id: 'older', territory: 'money-stewardship', approved_at: '2026-01-01' },
    ];
    // neither territory published before → equal recency → oldest approved wins
    expect(chooseApproved(pool, null, {})).toBe('older');
  });
});
