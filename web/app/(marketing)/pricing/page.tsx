import type { Metadata } from 'next';
import { APP_STORE_URL, BASE_URL, breadcrumbSchema, faqSchema } from '@/lib/seo';
import { BillingToggle } from '../components/BillingToggle';

export const metadata: Metadata = {
  title: 'Pricing — BibleDiscern',
  description:
    'BibleDiscern is free to download with 1 session/month. Premium is $7.99/month or $49.99/year. 7-day free trial, no credit card required.',
  alternates: { canonical: `${BASE_URL}/pricing` },
};

const FAQS = [
  {
    question: 'How much does BibleDiscern cost?',
    answer: 'BibleDiscern has a free plan available at no cost. Premium is $7.99/month or $49.99/year (save 48%). A 7-day free Premium trial is included — no credit card required.',
  },
  {
    question: "What's included in the free plan?",
    answer: '1 full discernment session per month, the complete 7-step journey, Biblical Narrative Matching, The Daily Scale (daily vote + community results), and access to your 3 most recent journal entries.',
  },
  {
    question: 'Does BibleDiscern offer a free trial?',
    answer: 'Yes — all new users receive a 7-day free trial of Premium. No credit card is required to start. The trial begins when you create your account.',
  },
  {
    question: "What's the difference between monthly and annual?",
    answer: 'Annual saves 48% — $49.99/year compared to $95.88/year on the monthly plan ($7.99 × 12). Both plans include exactly the same Premium features.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. Cancel through your App Store (iOS) or Google Play (Android) subscription settings at any time. You will retain access through the end of your current billing period.',
  },
  {
    question: 'Is my spiritual data private?',
    answer: 'Yes. We never sell your prayer data, decisions, or journal entries. Your data is encrypted in transit and at rest, accessible only to you. We will never use your discernment sessions to train AI models.',
  },
  {
    question: 'What AI model powers BibleDiscern?',
    answer: "BibleDiscern is powered by Anthropic's Claude AI. Premium users receive responses from Claude Opus (the most capable model). Free users receive responses from Claude Sonnet.",
  },
];

const FREE_FEATURES = [
  { label: '1 discernment session per month', included: true },
  { label: 'Complete 7-step journey', included: true },
  { label: 'Biblical Narrative Matching', included: true },
  { label: 'The Daily Scale (vote + community results)', included: true },
  { label: 'Basic journal (last 3 entries)', included: true },
  { label: 'Fruit of the Spirit diagnostic', included: false },
  { label: 'Full journal history', included: false },
  { label: 'Daily Scale history (last 7 days)', included: false },
  { label: 'Decision follow-up reminders', included: false },
  { label: 'Scripture card sharing', included: false },
];

const PREMIUM_FEATURES = [
  { label: 'Unlimited discernment sessions', included: true },
  { label: 'Complete 7-step journey', included: true },
  { label: 'Biblical Narrative Matching', included: true },
  { label: 'The Daily Scale (vote + community results)', included: true },
  { label: 'Full spiritual journal history', included: true },
  { label: 'Daily Scale history (last 7 days)', included: true },
  { label: 'Fruit of the Spirit diagnostic', included: true },
  { label: 'Decision follow-up reminders (1wk, 1mo, 3mo)', included: true },
  { label: 'Scripture card sharing', included: true },
  { label: 'Ebenezer pattern insights', included: true },
];

export default function PricingPage() {
  const jsonLd = [
    faqSchema(FAQS),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Pricing', url: '/pricing' },
    ]),
  ];

  return (
    <>
      {jsonLd.map((s, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Hero */}
      <section className="bg-navy py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Pricing</p>
          <h1 className="font-display text-4xl text-cream">
            Begin free. Go deeper with Premium.
          </h1>
          <p className="text-cream/60">
            Download world's 1st Christian discernment app today. No credit card required.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-parchment border border-border rounded-2xl p-8 space-y-6">
              <div>
                <p className="font-display text-2xl text-navy">Free</p>
                <p className="text-4xl font-bold text-navy mt-2">$0</p>
                <p className="text-sm text-text-light">forever</p>
              </div>
              <ul className="space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-base">
                    <span className={f.included ? 'text-sage' : 'text-border'}>
                      {f.included ? '✓' : '✕'}
                    </span>
                    <span className={f.included ? 'text-text-dark' : 'text-text-light line-through'}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
              <a href={APP_STORE_URL}
                className="block text-center py-3 rounded-full border-2 border-navy text-navy font-semibold text-sm hover:bg-navy hover:text-cream transition-colors">
                Download Free
              </a>
            </div>

            {/* Premium */}
            <div className="bg-navy border-2 border-gold rounded-2xl p-8 space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                Most popular
              </div>
              <p className="font-display text-2xl text-cream mb-4">Premium</p>
              <BillingToggle />
              <ul className="space-y-3 mt-4">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-base">
                    <span className="text-gold">✓</span>
                    <span className="text-cream/80">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-parchment">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-3xl text-navy text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="bg-cream rounded-xl border border-border p-6">
                <h3 className="font-semibold text-navy mb-2">{faq.question}</h3>
                <p className="text-base text-text-medium leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
