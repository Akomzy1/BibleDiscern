'use client';

// Subscription state + Stripe actions. Tier gating reads from here.

import { useCallback, useEffect, useState } from 'react';
import type { Subscription } from '@librato/shared';
import { getAuthedClient } from '@/lib/api';

export type SubscriptionStatus = 'loading' | 'ready' | 'error' | 'unauthenticated';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const client = await getAuthedClient();
      if (!client) {
        setStatus('unauthenticated');
        return;
      }
      setSubscription(await client.getSubscription());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const isPremium =
    !!subscription && (subscription.tier === 'premium' || subscription.status === 'trialing');

  /** Send the user to Stripe Checkout (7-day trial). */
  const startCheckout = useCallback(async (plan: 'monthly' | 'annual') => {
    setBusy(true);
    try {
      const client = await getAuthedClient();
      if (!client) return false;
      const { url } = await client.createCheckoutSession(plan);
      window.location.href = url;
      return true;
    } catch {
      setBusy(false);
      return false;
    }
  }, []);

  /** Open the Stripe Customer Portal ("Manage billing"). */
  const openPortal = useCallback(async () => {
    setBusy(true);
    try {
      const client = await getAuthedClient();
      if (!client) return false;
      const { url } = await client.createPortalSession();
      window.location.href = url;
      return true;
    } catch {
      setBusy(false);
      return false;
    }
  }, []);

  return { status, subscription, isPremium, busy, startCheckout, openPortal, reload: load };
}
