import { create } from 'zustand';
import type { Subscription } from '@librato/shared';
import { apiClient } from '@/lib/api';

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;

  fetchSubscription: () => Promise<void>;

  // Derived helpers
  get isPremium(): boolean;
  get isTrial(): boolean;
  get sessionsUsed(): number;
  get sessionsLimit(): number;
  get sessionsRemaining(): number;
  get isAtLimit(): boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
  subscription: null,
  isLoading: false,

  fetchSubscription: async () => {
    set({ isLoading: true });
    try {
      const sub = await apiClient.getSubscription();
      set({ subscription: sub });
    } catch (e) {
      // Silently fail — subscription state is non-critical on first load
    } finally {
      set({ isLoading: false });
    }
  },

  get isPremium() {
    const sub = get().subscription;
    return sub?.tier === 'premium' || sub?.status === 'trialing';
  },

  get isTrial() {
    return get().subscription?.status === 'trialing';
  },

  get sessionsUsed() {
    return get().subscription?.sessions_used_this_month ?? 0;
  },

  get sessionsLimit() {
    const sub = get().subscription;
    if (!sub) return 1;
    return sub.tier === 'premium' ? 9999 : sub.sessions_limit;
  },

  get sessionsRemaining() {
    const store = get();
    return Math.max(0, store.sessionsLimit - store.sessionsUsed);
  },

  get isAtLimit() {
    const sub = get().subscription;
    if (!sub || sub.status === 'trialing') return false;
    return sub.tier === 'free' && sub.sessions_used_this_month >= sub.sessions_limit;
  },
}));
