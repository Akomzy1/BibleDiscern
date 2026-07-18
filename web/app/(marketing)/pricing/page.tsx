// Pricing — "One price. Every journey." Two plan cards, the free tier stated
// plainly on vellum-200 (an inset page, not a third plan), billing FAQ, CTA.
// (website.html Frame set B)

import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/seo';
import { TRIAL_LINE } from '@librato/shared';
import { Eyebrow } from '@/components/selah';
import { Sec, SiteH2, CtaBand, PageHead } from '@/components/site/Site';
import { SiteAccordion } from '@/components/site/SiteAccordion';
import { PlanCardsRow } from '@/components/site/PricingSummary';

export const metadata: Metadata = {
  title: 'Pricing',
  description: `BibleDiscern Premium is $7.99/month or $49.99/year (save 48%). ${TRIAL_LINE} The free tier is generous, forever.`,
  alternates: { canonical: `${BASE_URL}/pricing` },
};

const FREE_TIER = [
  'One Deep Discernment journey each month',
  'The Daily Scale, every morning',
  'Your three most recent journal entries',
  'The Stillness — always free',
];

const BILLING_FAQ: [string, string][] = [
  ['How does the trial work?', '7 days of Premium, free. We remind you 2 days before it ends. Cancel anytime.'],
  ['What happens when the trial ends?', 'You move to the free tier automatically. No surprise charge — the reminder comes first.'],
  ['Can I cancel anytime?', 'Yes. Two taps in Settings. Your journal remains yours, and you can export it.'],
  ['Do you offer refunds?', 'Annual plans: a full refund within 30 days. Just write to us — no forms.'],
  ['Is there a church or family plan?', "Not yet. If your congregation wants one, we'd like to hear from you."],
];

export default function PricingPage() {
  return (
    <>
      <PageHead eyebrow="Pricing" title="One price. Every journey." sub={TRIAL_LINE} />
      <Sec pad="px-5 py-16 md:px-[5%]">
        <div className="grid justify-items-center gap-9">
          <PlanCardsRow />
          <div className="w-full rounded-panel border border-ink-900/10 bg-vellum-200 px-6 py-[26px] md:px-7">
            <Eyebrow on="vellum" className="mb-2">
              The free tier
            </Eyebrow>
            <p className="mb-3.5 font-display text-2xl font-medium text-ink-900">
              Generous, forever.
            </p>
            <ul className="grid gap-2.5 md:grid-cols-2 md:gap-x-7">
              {FREE_TIER.map((f) => (
                <li key={f} className="flex gap-2.5 font-body text-[15px] leading-[1.45] text-ink-900">
                  <span aria-hidden className="font-bold text-olive-500">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-3.5 font-body text-[13.5px] text-ink-500">
              Yours from the moment you sign up.
            </p>
          </div>
          <p className="font-body text-sm text-vellum-200/60">
            {TRIAL_LINE} We remind you 2 days before the trial ends.
          </p>
        </div>
      </Sec>
      <Sec pad="px-5 pb-[88px] pt-6 md:px-[5%]">
        <div className="grid gap-6">
          <SiteH2 className="text-center !text-[32px]">Billing, answered plainly.</SiteH2>
          <SiteAccordion items={BILLING_FAQ} />
        </div>
      </Sec>
      <CtaBand />
    </>
  );
}
