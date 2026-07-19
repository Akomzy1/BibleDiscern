// Pricing cards shared by the landing summary and the Pricing page.
// Gold is spent on the annual card's badge + CTA. (website.html frames)

import Link from 'next/link';
import { Eyebrow } from '@/components/selah';
import { Sec, SiteH2 } from '@/components/site/Site';
import { TRIAL_LINE } from '@librato/shared';

export const PLAN_FEATURES = [
  'Every Deep Discernment journey',
  'The Stillness Engine',
  'Fruit of the Spirit diagnostic',
  'Full journal history',
  'Daily Scale history & follow-ups',
];

export function SitePlanCard({
  highlighted = false,
  name,
  price,
  per,
  note,
  badge,
  features,
}: {
  highlighted?: boolean;
  name: string;
  price: string;
  per: string;
  note: string;
  badge?: string;
  features: string[];
}) {
  return (
    <div
      className={`relative rounded-panel bg-vellum-100 px-[22px] py-6 ${
        highlighted ? 'border-2 border-gilt-500 shadow-glow' : 'border border-ink-900/10'
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-3.5 rounded-pill bg-gilt-500 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-ink-900">
          {badge}
        </span>
      )}
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
        {name}
      </p>
      <p className="mt-2 font-display text-[32px] font-medium leading-none text-ink-900">
        {price}
        <span className="font-body text-base text-ink-500">{per}</span>
      </p>
      <p className="mt-1.5 font-body text-sm text-ink-500">{note}</p>
      <ul className="mt-4 grid gap-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5 font-body text-sm text-ink-900">
            <span className="text-olive-500" aria-hidden>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Link
          href="/signup"
          className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-panel font-body text-[15px] font-semibold transition duration-whisper ease-selah ${
            highlighted
              ? 'bg-gilt-500 text-nave-900 hover:brightness-105'
              : 'border border-ink-900/20 text-ink-900 hover:bg-ink-900/5'
          }`}
        >
          Start my 7-day free trial
        </Link>
      </div>
    </div>
  );
}

export function PlanCardsRow() {
  return (
    <div className="grid w-full items-start gap-[26px] pt-3 md:grid-cols-2 md:gap-6">
      <SitePlanCard
        highlighted
        name="Annual"
        price="$49.99"
        per="/year"
        note="$4.17/month — save 48%"
        badge="Best value"
        features={PLAN_FEATURES}
      />
      <SitePlanCard
        name="Monthly"
        price="$7.99"
        per="/month"
        note="Cancel anytime."
        features={PLAN_FEATURES.slice(0, 2)}
      />
    </div>
  );
}

export function PricingSummary({ eyebrow = 'Pricing' }: { eyebrow?: string }) {
  return (
    <Sec bg="bg-nave-800">
      <div className="grid justify-items-center gap-6 md:gap-8">
        <div className="grid justify-items-center gap-3 text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SiteH2>One price. Every journey.</SiteH2>
        </div>
        <PlanCardsRow />
        <p className="font-body text-sm text-vellum-200/60">{TRIAL_LINE}</p>
      </div>
    </Sec>
  );
}
