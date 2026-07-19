'use client';

// Upgrade — free-user pitch + existing-subscriber view, translated from
// docs/prototypes/upgrade-settings-auth.html (Frame A / A2).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CrossGlyph, Eyebrow, GiltButton, Panel, StatusChip } from '@/components/selah';
import { PlanCards, ValueRow, CompareTable, TRIAL_LINE } from '@/components/paywall/PlanCards';
import { useSubscription } from '@/hooks/useSubscription';

function FreeUpgrade() {
  const router = useRouter();
  const sub = useSubscription();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  return (
    <main className="flex min-h-[80vh] flex-col">
      <div className="mt-1.5 text-center">
        <CrossGlyph size={22} muted />
        <h1 className="mt-3 font-display text-2xl font-medium leading-[1.3] text-vellum-100">
          Go deeper in discernment.
        </h1>
        <p className="mt-2 font-scripture text-[17px] font-medium italic leading-[1.45] text-gilt-300">
          Every journey, every stone, every day.
        </p>
      </div>

      <div className="mx-1 mt-[18px] grid gap-[9px]">
        <ValueRow>Every Deep Discernment journey</ValueRow>
        <ValueRow>The Stillness Engine</ValueRow>
        <ValueRow>Fruit of the Spirit diagnostic</ValueRow>
        <ValueRow>Your full spiritual history</ValueRow>
      </div>

      <PlanCards plan={plan} onSelect={setPlan} />

      <div className="mt-6">
        <GiltButton fullWidth disabled={sub.busy} onClick={() => void sub.startCheckout(plan)}>
          {sub.busy ? 'One moment…' : 'Start my 7-day free trial'}
        </GiltButton>
        <div className="mt-3.5 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-1 py-1.5 font-body text-sm font-semibold text-vellum-200/60 underline underline-offset-[3px] transition-colors duration-whisper ease-selah hover:text-vellum-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
          >
            Not now
          </button>
        </div>
        <p className="mt-2 text-center font-body text-xs text-vellum-200/60">{TRIAL_LINE}</p>
      </div>

      <div className="mt-10 pb-4">
        <Eyebrow className="justify-center text-center">What&apos;s included</Eyebrow>
        <div className="mt-3.5">
          <CompareTable />
        </div>
        <p className="mt-4 text-center font-body text-xs leading-normal text-vellum-200/60">
          Your journey is private — between you and the Lord.
        </p>
      </div>
    </main>
  );
}

function Subscriber() {
  const sub = useSubscription();
  const s = sub.subscription;
  const renews = s?.current_period_end
    ? new Date(s.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  const memberSince = s?.created_at
    ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;
  const planLabel =
    s?.billing_interval === 'year'
      ? { chip: 'Premium Annual', price: '$49.99/year' }
      : { chip: 'Premium Monthly', price: '$7.99/month' };

  return (
    <main className="flex min-h-[80vh] flex-col">
      <div className="mt-[26px] text-center">
        <CrossGlyph size={22} />
        <h1 className="mt-3 font-display text-2xl font-medium leading-[1.3] text-vellum-100">
          Your subscription
        </h1>
        <p className="mt-2 font-scripture text-base font-medium italic leading-normal text-vellum-200/60">
          Thank you for walking this road with us.
        </p>
      </div>

      <Panel className="mt-7 p-5">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow on="vellum">Your plan</Eyebrow>
          <StatusChip tone="success">{planLabel.chip}</StatusChip>
        </div>
        <p className="mt-3.5 font-display text-2xl font-medium leading-[1.1] text-ink-900">
          {planLabel.price}
        </p>
        {renews && (
          <p className="mt-1.5 font-body text-[13.5px] text-ink-500">
            {s?.status === 'trialing' ? 'Trial ends' : 'Renews'} {renews}
          </p>
        )}
        {memberSince && (
          <div className="mt-4 flex justify-between border-t border-ink-900/10 pt-3.5 font-body text-[13px]">
            <span className="text-ink-500">Member since</span>
            <span className="font-semibold text-ink-900">{memberSince}</span>
          </div>
        )}
      </Panel>

      <div className="mt-3.5">
        <GiltButton variant="secondary" fullWidth disabled={sub.busy} onClick={() => void sub.openPortal()}>
          Manage billing
        </GiltButton>
      </div>

      <div className="flex-1" />
      <p className="pb-2 text-center font-body text-xs leading-normal text-vellum-200/60">
        Billing is handled securely by Stripe.
      </p>
    </main>
  );
}

export default function UpgradePage() {
  const sub = useSubscription();
  if (sub.status === 'loading') {
    return <main className="min-h-[60vh] animate-pulse" aria-busy />;
  }
  return sub.isPremium ? <Subscriber /> : <FreeUpgrade />;
}
