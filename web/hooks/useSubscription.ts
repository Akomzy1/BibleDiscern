'use client';

// Subscription state + Stripe actions. Tier gating reads from here.

import { useCallback, useEffect, useState } from 'react';
import { LibratoApiError } from '@librato/shared';
import type { Subscription } from '@librato/shared';
import { getAuthedClient } from '@/lib/api';

export type SubscriptionStatus = 'loading' | 'ready' | 'error' | 'unauthenticated';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  /** Create a Stripe Checkout session and return its URL WITHOUT redirecting —
   *  lets callers run other work (e.g. marking onboarding complete) in parallel
   *  and redirect once. Returns null on failure (and sets `error`). */
  const createCheckoutUrl = useCallback(async (plan: 'monthly' | 'annual') => {
    setError(null);
    try {
      const client = await getAuthedClient();
      if (!client) return null;
      const { url } = await client.createCheckoutSession(plan);
      return url;
    } catch {
      setError('We couldn’t start checkout. Please try again.');
      return null;
    }
  }, []);

  /** Send the user to Stripe Checkout (7-day trial). */
  const startCheckout = useCallback(
    async (plan: 'monthly' | 'annual') => {
      setBusy(true);
      const url = await createCheckoutUrl(plan);
      if (url) {
        window.location.href = url;
        return true;
      }
      setBusy(false);
      return false;
    },
    [createCheckoutUrl],
  );

  /** Open the Stripe Customer Portal ("Manage billing"). */
  const openPortal = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const client = await getAuthedClient();
      if (!client) {
        setBusy(false);
        return false;
      }
      const { url } = await client.createPortalSession();
      window.location.href = url;
      return true;
    } catch (e) {
      // A 404 means no Stripe customer is linked yet (e.g. Premium set without a
      // real checkout) — distinct from a transient/portal-config failure.
      setError(
        e instanceof LibratoApiError && e.status === 404
          ? 'No billing account is linked to this profile yet. If you subscribed through Stripe, contact support.'
          : 'We couldn’t open billing right now. Please try again in a moment.',
      );
      setBusy(false);
      return false;
    }
  }, []);

  return {
    status,
    subscription,
    isPremium,
    busy,
    error,
    startCheckout,
    createCheckoutUrl,
    openPortal,
    reload: load,
  };
}
