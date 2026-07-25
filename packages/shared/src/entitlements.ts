// The SINGLE place tier/entitlement is resolved — imported by both the UI
// (useSubscription) and every server gate (/api/discern, journal, scale
// history, …). Do not re-derive premium access anywhere else.
//
// During the launch free period every authenticated user is 'premium'
// regardless of their subscription row. Outside it, access is exactly the
// existing subscription logic: premium iff the tier is 'premium' (which only
// the Stripe webhook ever sets — a bare status of 'trialing' is the free-signup
// default and is NOT premium).

import { isLaunchFreePeriod } from './constants';

export type EffectiveTier = 'free' | 'premium';

export interface EntitlementInput {
  tier?: string | null;
  status?: string | null;
}

/** Resolve the tier a user should be treated as, honouring the launch window. */
export function effectiveTier(
  sub: EntitlementInput | null | undefined,
  now: number = Date.now(),
): EffectiveTier {
  if (isLaunchFreePeriod(now)) return 'premium';
  return sub?.tier === 'premium' ? 'premium' : 'free';
}

/** Convenience: does this user have Premium access right now? */
export function hasPremiumAccess(
  sub: EntitlementInput | null | undefined,
  now?: number,
): boolean {
  return effectiveTier(sub, now) === 'premium';
}
