'use client';

// Plan cards + value rows shared by the onboarding soft paywall (S6) and the
// Upgrade screen. Annual is highlighted: 2px gilt border, BEST VALUE pill,
// $49.99/yr, $4.17/mo effective, struck $7.99, Save 48%. (Prototype frames)

import { PRICING, TRIAL_LINE } from '@librato/shared';
import { VellumGrain } from '@/components/selah';

export { TRIAL_LINE };

export function ValueRow({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className={delay !== undefined ? 'stage' : undefined}
      style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="flex items-center gap-3 font-body text-[14.5px] leading-[1.4] text-vellum-100">
        <span className="inline-flex flex-none text-gilt-500" aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        {children}
      </div>
    </div>
  );
}

type PlanCardsProps = {
  plan: 'monthly' | 'annual';
  onSelect: (plan: 'monthly' | 'annual') => void;
  /** Staged entrance delays (onboarding S6). Omit for the static Upgrade page. */
  stagedDelays?: { annual: number; monthly: number };
};

export function PlanCards({ plan, onSelect, stagedDelays }: PlanCardsProps) {
  return (
    <>
      {/* Annual — highlighted */}
      <button
        type="button"
        onClick={() => onSelect('annual')}
        aria-pressed={plan === 'annual'}
        className={`${stagedDelays ? 'stage-scale' : ''} relative mt-[22px] block w-full overflow-visible rounded-panel bg-vellum-100 px-[18px] py-4 text-left shadow-glow transition-colors duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
          plan === 'annual' ? 'border-2 border-gilt-500' : 'border border-ink-900/10'
        }`}
        style={stagedDelays ? { animationDelay: `${stagedDelays.annual}ms` } : undefined}
      >
        <span className="absolute -top-2.5 right-3.5 rounded-pill bg-gilt-500 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-ink-900">
          Best value
        </span>
        <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          Annual
        </span>
        <span className="mt-1.5 block font-display text-2xl font-medium leading-[1.1] text-ink-900">
          {PRICING.annual.label.replace('/year', '')}/year
        </span>
        <span className="mt-1 flex items-baseline gap-2 font-body text-[13.5px]">
          <span className="font-semibold text-ink-900">{PRICING.annual.perMonth}</span>
          <span className="text-ink-500 line-through">$7.99</span>
          <span className="font-bold text-olive-500">Save {PRICING.annual.savings}</span>
        </span>
      </button>

      {/* Monthly */}
      <button
        type="button"
        onClick={() => onSelect('monthly')}
        aria-pressed={plan === 'monthly'}
        className={`${stagedDelays ? 'stage' : ''} relative mt-2.5 flex w-full items-baseline justify-between overflow-hidden rounded-panel bg-vellum-100 px-[18px] py-3.5 text-left transition-colors duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
          plan === 'monthly' ? 'border-2 border-gilt-500' : 'border border-ink-900/10'
        }`}
        style={stagedDelays ? { animationDelay: `${stagedDelays.monthly}ms` } : undefined}
      >
        <VellumGrain />
        <span className="relative">
          <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            Monthly
          </span>
          <span className="mt-1 block font-display text-lg font-medium text-ink-900">
            {PRICING.monthly.label}
          </span>
        </span>
        <span className="relative font-body text-[12.5px] text-ink-500">Cancel anytime</span>
      </button>
    </>
  );
}

const COMPARE: [string, string | boolean, string | boolean][] = [
  ['Deep Discernment', false, 'Unlimited'],
  ['The Stillness', false, true],
  ['Daily Scale', true, true],
  ['Scale history', '7 days', 'Full archive'],
  ['Journal', '3 stones', 'Unlimited'],
  ['Fruit diagnostic', false, true],
  ['Follow-ups', false, true],
  ['Sharing', false, true],
];

function Cell({ v, strong }: { v: string | boolean; strong?: boolean }) {
  if (v === true) {
    return (
      <span className={`inline-flex justify-center ${strong ? 'text-ink-900' : 'text-ink-500'}`} aria-label="Included">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (v === false) {
    return <span className="text-center text-ink-900/30">—</span>;
  }
  return (
    <span
      className={`text-center font-body text-[12.5px] ${strong ? 'font-semibold text-ink-900' : 'text-ink-500'}`}
    >
      {v}
    </span>
  );
}

export function CompareTable() {
  const grid = 'grid grid-cols-[1fr_70px_84px] items-center';
  return (
    <div className="relative overflow-hidden rounded-panel border border-ink-900/10 bg-vellum-100 px-4 pb-2.5 pt-1.5 shadow-glow">
      <VellumGrain />
      <div className={`${grid} relative border-b border-ink-900/10 pb-2.5 pt-3`}>
        <span />
        <span className="text-center font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
          Free
        </span>
        <span className="justify-self-center border-b-2 border-gilt-500 pb-[3px] text-center font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900">
          Premium
        </span>
      </div>
      {COMPARE.map(([f, a, b], i) => (
        <div
          key={f}
          className={`${grid} relative min-h-[44px] ${i < COMPARE.length - 1 ? 'border-b border-ink-900/5' : ''}`}
        >
          <span className="font-body text-[13.5px] text-ink-900">{f}</span>
          <Cell v={a} />
          <Cell v={b} strong />
        </div>
      ))}
    </div>
  );
}
