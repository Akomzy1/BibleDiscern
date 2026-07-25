import { describe, it, expect } from 'vitest';
import { effectiveTier, hasPremiumAccess, isLaunchFreePeriod, LAUNCH_FREE_UNTIL } from '@librato/shared';

const DURING = Date.parse(LAUNCH_FREE_UNTIL) - 1000; // inside the window
const AFTER = Date.parse(LAUNCH_FREE_UNTIL) + 1000; // window closed

describe('entitlements — the single tier resolver', () => {
  it('isLaunchFreePeriod tracks LAUNCH_FREE_UNTIL', () => {
    expect(isLaunchFreePeriod(DURING)).toBe(true);
    expect(isLaunchFreePeriod(AFTER)).toBe(false);
  });

  it('during the launch window everyone is premium regardless of subscription', () => {
    expect(effectiveTier({ tier: 'free', status: 'trialing' }, DURING)).toBe('premium');
    expect(effectiveTier(null, DURING)).toBe('premium');
    expect(effectiveTier({ tier: 'free', status: 'active' }, DURING)).toBe('premium');
  });

  it('after the window it falls back to tier-based logic exactly', () => {
    expect(effectiveTier({ tier: 'free', status: 'trialing' }, AFTER)).toBe('free');
    expect(effectiveTier({ tier: 'free', status: 'active' }, AFTER)).toBe('free');
    expect(effectiveTier({ tier: 'premium', status: 'active' }, AFTER)).toBe('premium');
    expect(effectiveTier(null, AFTER)).toBe('free');
  });

  it('hasPremiumAccess mirrors effectiveTier', () => {
    expect(hasPremiumAccess({ tier: 'free' }, DURING)).toBe(true);
    expect(hasPremiumAccess({ tier: 'free' }, AFTER)).toBe(false);
    expect(hasPremiumAccess({ tier: 'premium' }, AFTER)).toBe(true);
  });
});
