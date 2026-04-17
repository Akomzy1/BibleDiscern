import { create } from 'zustand';
import type { Subscription } from '@librato/shared';
import { apiClient } from '@/lib/api';

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;

  isPremium: boolean;
  isTrial: boolean;
  sessionsUsed: number;
  sessionsLimit: number;
  sessionsRemaining: number;
  isAtLimit: boolean;

  fetchSubscription: () => Promise<void>;
}

function deriveFlags(sub: Subscription | null) {
  const isPremium = sub?.tier === 'premium' || sub?.status === 'trialing';
  const isTrial = sub?.status === 'trialing';
  const sessionsUsed = sub?.sessions_used_this_month ?? 0;
  const sessionsLimit = !sub ? 1 : sub.tier === 'premium' ? 9999 : sub.sessions_limit;
  const sessionsRemaining = Math.max(0, sessionsLimit - sessionsUsed);
  const isAtLimit =
    !!sub && sub.status !== 'trialing' && sub.tier === 'free' &&
    sub.sessions_used_this_month >= sub.sessions_limit;

  return { isPremium, isTrial, sessionsUsed, sessionsLimit, sessionsRemaining, isAtLimit };
}

export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  subscription: null,
  isLoading: false,
  ...deriveFlags(null),

  fetchSubscription: async () => {
    set({ isLoading: true });
    try {
      const sub = await apiClient.getSubscription();
      set({ subscription: sub, ...deriveFlags(sub) });
    } catch {
      // Silently fail — subscription state is non-critical on first load
    } finally {
      set({ isLoading: false });
    }
  },
}));
