'use client';

// Trial-ending banner + payment-failed screen. (legal-system-states F/G)

import { useState } from 'react';
import Link from 'next/link';
import { CrossGlyph, Eyebrow, GiltButton, Panel, StatusChip } from '@/components/selah';
import { useSubscription } from '@/hooks/useSubscription';

function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

const TRIAL_DISMISS_KEY = 'bd-trial-banner-dismissed';
const PAYMENT_DISMISS_KEY = 'bd-payment-failed-dismissed';

function sessionFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function setSessionFlag(key: string) {
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    // storage unavailable
  }
}

/** Quiet fixed banner above the tab bar while the trial is about to end. */
export function TrialEndingBanner() {
  const sub = useSubscription();
  const [dismissed, setDismissed] = useState(() => sessionFlag(TRIAL_DISMISS_KEY));

  if (dismissed || sub.status !== 'ready') return null;
  const s = sub.subscription;
  // Only a real Premium trial shows the ending banner — not the free-signup
  // default ('trialing' with tier 'free').
  if (!s || s.tier !== 'premium' || s.status !== 'trialing') return null;
  const days = daysUntil(s.current_period_end);
  if (days === null || days > 2 || days < 0) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-30 mx-auto max-w-[608px]">
      <div className="flex min-h-[52px] items-center gap-3 rounded-control border border-gilt-500/35 bg-nave-800 py-2.5 pl-4 pr-2">
        <span className="flex-1 font-body text-[13.5px] leading-[1.35] text-vellum-100">
          Your trial ends {days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`}
        </span>
        <Link
          href="/upgrade"
          className="whitespace-nowrap px-2 py-2 font-body text-[13.5px] font-bold text-gilt-300 hover:text-gilt-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          Keep Premium
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setSessionFlag(TRIAL_DISMISS_KEY);
            setDismissed(true);
          }}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-vellum-200/60 hover:text-vellum-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Full payment-failed state; renders instead of the day's content when past_due. */
export function PaymentFailedScreen({ onLater }: { onLater: () => void }) {
  const sub = useSubscription();
  const s = sub.subscription;
  const plan = s?.billing_interval === 'year' ? 'Premium Annual' : 'Premium Monthly';

  return (
    <div className="flex min-h-[80vh] flex-col justify-center pb-8">
      <div className="text-center">
        <CrossGlyph size={22} muted />
        <h1 className="mt-3.5 font-display text-2xl font-medium leading-[1.3] text-vellum-100">
          We couldn&apos;t process your payment.
        </h1>
        <p className="mt-2.5 font-scripture text-[17px] font-medium italic leading-[1.45] text-vellum-200/60">
          Your journal is safe.
        </p>
      </div>
      <Panel className="mt-7 p-5">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow on="vellum">{plan}</Eyebrow>
          <StatusChip tone="danger">Payment failed</StatusChip>
        </div>
        <p className="mt-4 border-t border-ink-900/10 pt-3.5 font-body text-[12.5px] leading-[1.55] text-ink-500">
          Everything you&apos;ve written stays right where it is. If payment doesn&apos;t go
          through, your plan moves to Free — nothing is deleted.
        </p>
      </Panel>
      <div className="mt-4">
        <GiltButton fullWidth disabled={sub.busy} onClick={() => void sub.openPortal()}>
          Update payment
        </GiltButton>
      </div>
      <div className="mt-3">
        <GiltButton variant="secondary" fullWidth onClick={onLater}>
          Remind me later
        </GiltButton>
      </div>
      <p className="mt-6 text-center font-body text-xs text-vellum-200/60">
        Billing is handled securely by Stripe.
      </p>
    </div>
  );
}

export function usePaymentFailedGate() {
  const sub = useSubscription();
  const [dismissed, setDismissed] = useState(() => sessionFlag(PAYMENT_DISMISS_KEY));
  const failed =
    sub.status === 'ready' && sub.subscription?.status === 'past_due' && !dismissed;
  return {
    failed,
    dismiss: () => {
      setSessionFlag(PAYMENT_DISMISS_KEY);
      setDismissed(true);
    },
  };
}
