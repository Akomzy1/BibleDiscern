import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_STORE_URL, BASE_URL, PLAY_STORE_URL, appSchema, faqSchema, orgSchema } from '@/lib/seo';
import { BillingToggle } from './components/BillingToggle';

export const metadata: Metadata = {
  title: 'BibleDiscern — Weigh Your Decisions with Biblical Wisdom',
  description:
    'BibleDiscern is an AI-powered Christian discernment app that guides you through a structured 7-step biblical journey to weigh your decisions with Scripture, silence, and wisdom. Free on iOS & Android.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'BibleDiscern — Weigh it with wisdom',
    description:
      'A 7-step biblical discernment journey powered by AI. Free on iOS and Android.',
    url: BASE_URL,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630 }],
  },
};

const STEPS = [
  { n: 1, icon: '⚖️', name: 'The Crossroads', desc: 'Name your situation and bring it honestly before God.' },
  { n: 2, icon: '📖', name: 'The Word', desc: 'Receive three Scripture passages that speak directly to your situation.' },
  { n: 3, icon: '👣', name: 'Those Who Walked Before', desc: 'Meet biblical figures who faced your same crossroads.' },
  { n: 4, icon: '🔍', name: 'The Examination', desc: 'Answer five Ignatian-style questions about your interior movements.' },
  { n: 5, icon: '🕊️', name: 'The Stillness', desc: 'Enter 90 seconds of guided contemplative silence.' },
  { n: 6, icon: '🍇', name: 'The Fruit', desc: 'Diagnose your decision against all nine Fruits of the Spirit.' },
  { n: 7, icon: '🙏', name: 'The Prayer', desc: 'Receive a personalized prayer and set your Ebenezer stone.' },
];

const PAIN_POINTS = [
  {
    icon: '📱',
    title: 'Random verse lookups don\'t help real decisions',
    desc: 'A devotional verse for the day is beautiful — but it doesn\'t tell you whether to take the job, end the relationship, or follow the calling.',
  },
  {
    icon: '🤖',
    title: 'Generic AI gives generic spiritual advice',
    desc: 'ChatGPT can tell you what the Bible says in general. It can\'t walk with you through a structured discernment process rooted in 500 years of Christian wisdom.',
  },
  {
    icon: '🙏',
    title: 'You deserve more than a daily devotional',
    desc: 'When you\'re standing at a real crossroads, you need structure, Scripture, silence, and guidance — not a 60-second inspiration.',
  },
];

const FEATURES_FREE = [
  '1 full discernment session per month',
  '7-step biblical journey',
  'Biblical Narrative Matching',
  'The Daily Scale (vote + community results)',
  '3 journal entries',
];

const FEATURES_PREMIUM = [
  'Unlimited discernment sessions',
  'The Daily Scale (vote + community results)',
  'Daily Scale history (last 7 days)',
  'Fruit of the Spirit diagnostic',
  'Full spiritual journal history',
  'Decision follow-up reminders (1wk, 1mo, 3mo)',
  'Scripture card sharing',
  'Ebenezer pattern insights',
];

const FAQS = [
  {
    question: 'What is BibleDiscern?',
    answer: 'BibleDiscern is an AI-powered Christian discernment companion that guides you through a structured 7-step biblical decision-making process. It combines Ignatian spiritual exercises with Scripture-based reflection, powered by Anthropic\'s Claude AI.',
  },
  {
    question: 'Is BibleDiscern free?',
    answer: 'Yes — BibleDiscern has a free plan that includes 1 full discernment session per month. Premium is $7.99/month or $49.99/year with a 7-day free trial.',
  },
  {
    question: 'Does it replace my pastor or spiritual director?',
    answer: 'No. BibleDiscern is a companion for discernment — it supports reflection but does not replace God, Scripture, the Holy Spirit, or wise human counsel. We strongly encourage sharing your journey with a trusted pastor or mentor.',
  },
  {
    question: 'What is the Stillness Engine?',
    answer: 'The Stillness Engine is a 90-second guided contemplative silence built into every discernment journey — the only feature of its kind in any spiritual app. It draws on the biblical and contemplative tradition that God speaks in silence (1 Kings 19:12).',
  },
];

export default function LandingPage() {
  const jsonLd = [orgSchema(), appSchema(), faqSchema(FAQS)];

  return (
    <>
      {/* JSON-LD */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ─────────────────────────────────────────────────────── HERO */}
      <section className="relative overflow-hidden bg-navy text-cream">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(200,164,94,0.15),transparent)]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-20 text-center">
          {/* Cross */}
          <div className="text-gold text-5xl mb-6">✝</div>

          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
            Biblical Discernment, Reimagined
          </p>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream leading-tight max-w-3xl mx-auto mb-6">
            Weigh your decisions with{' '}
            <span className="text-gold">biblical wisdom</span>
          </h1>

          {/* Sub */}
          <p className="text-lg sm:text-xl text-cream/70 leading-relaxed max-w-2xl mx-auto mb-10">
            BibleDiscern guides you through a structured 7-step discernment journey rooted in
            Scripture, powered by AI, and grounded in centuries of Christian tradition.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href={APP_STORE_URL}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold text-navy font-bold text-sm hover:bg-gold-muted transition-colors"
            >
              🍎 Download on App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-cream/30 text-cream text-sm font-semibold hover:border-gold hover:text-gold transition-colors"
            >
              🤖 Get it on Google Play
            </a>
          </div>

          {/* Trust */}
          <p className="text-xs text-cream/40 font-scripture italic">
            Free plan available · No credit card required · 7-day Premium trial
          </p>

          {/* Phone mockup placeholder */}
          <div className="mt-14 mx-auto max-w-xs">
            <div className="aspect-[9/19] rounded-[2.5rem] border-2 border-gold/30 bg-navy-light/60 flex flex-col items-center justify-center gap-4 p-6">
              <div className="text-gold text-4xl">✝</div>
              <div className="text-sm text-cream/60 text-center font-scripture italic">
                "What decision are you bringing before God today?"
              </div>
              <div className="w-full bg-cream/10 rounded-xl p-3 text-xs text-cream/40 text-center">
                The Crossroads
              </div>
              <div className="flex gap-1.5">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-gold w-5' : 'bg-cream/20'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── PROBLEM */}
      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl text-navy mb-4">
              Every other app gives you a verse.
            </h2>
            <p className="text-xl font-scripture italic text-gold">
              BibleDiscern gives you a journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.title}
                className="bg-parchment border border-border rounded-2xl p-7 space-y-3"
              >
                <div className="text-3xl">{p.icon}</div>
                <h3 className="font-display text-lg text-navy">{p.title}</h3>
                <p className="text-base text-text-medium leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── 7 STEPS */}
      <section className="py-20 bg-navy" id="journey">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">
              The Journey
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-cream mb-4">
              7 steps to weigh what matters
            </h2>
            <p className="text-base text-cream/60 max-w-xl mx-auto">
              Each step draws on a different dimension of the Christian discernment tradition.
              Together they form a complete process for hearing God&apos;s voice in your specific situation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="bg-navy-light/50 border border-gold/20 rounded-2xl p-6 space-y-3 hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold/60 tabular-nums">{String(step.n).padStart(2, '0')}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="font-display text-cream text-base">{step.name}</h3>
                <p className="text-base text-cream/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
            {/* CTA card */}
            <div className="bg-gold/10 border border-gold/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
              <div className="text-gold text-3xl">✝</div>
              <p className="font-scripture italic text-gold text-sm leading-relaxed">
                "If any of you lacks wisdom, let him ask God."
              </p>
              <p className="text-xs text-cream/40">James 1:5</p>
              <Link href="/blog/7-steps-biblical-discernment-complete-guide"
                className="text-xs text-gold underline underline-offset-2 hover:text-gold-light transition-colors">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── NARRATIVE */}
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">
              Step 3 — Those Who Walked Before
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy mb-4">
              You&apos;re not the first to face this.
            </h2>
            <p className="text-base text-text-medium max-w-xl mx-auto">
              BibleDiscern connects your situation to biblical figures who faced the same crossroads.
              Their stories become a mirror for yours.
            </p>
          </div>

          {/* Demo */}
          <div className="bg-cream rounded-2xl border border-border p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
            <div className="border-l-4 border-gold pl-4 py-2">
              <p className="text-xs text-text-light uppercase tracking-widest mb-1">Your situation</p>
              <p className="text-text-dark italic font-scripture text-base leading-relaxed">
                "I feel called to something new, but everyone around me says I&apos;m qualified for
                where I already am. I don&apos;t know if this is God or just restlessness."
              </p>
            </div>

            <div className="flex items-start gap-4 bg-parchment rounded-xl p-4">
              <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center text-gold font-display text-lg flex-shrink-0">
                M
              </div>
              <div className="flex-1">
                <p className="font-display text-navy text-base">Moses</p>
                <p className="text-xs text-gold uppercase tracking-widest mb-2">Exodus 3–4</p>
                <p className="text-base text-text-medium leading-relaxed">
                  Moses felt unqualified for his calling and offered five objections. God
                  answered each one — not by removing the difficulty, but by promising his presence.
                </p>
                <div className="mt-3 bg-gold/10 border-l-2 border-sage rounded-sm p-3 text-sm italic font-scripture text-navy">
                  The magnitude of the calling is not evidence you&apos;re the wrong person — it&apos;s
                  evidence God intends to do something through you that you cannot do alone.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── STILLNESS */}
      <section className="py-20 bg-navy text-cream overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">
            Step 5 — The Stillness Engine
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mb-6">
            In a world of noise, we built silence into the app.
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            After Scripture, narrative, and examination — every discernment journey pauses for
            90 seconds of guided contemplative silence. Not a notification. Not a prompt. Silence.
            Because God spoke to Elijah not in the wind or earthquake or fire, but in the sound
            of thin silence. (1 Kings 19:12)
          </p>

          {/* Animated breathing indicator */}
          <div className="mx-auto w-40 h-40 relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full bg-gold/5 border border-gold/20 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-gold/8 border border-gold/30 animate-pulse [animation-delay:0.5s]" />
            <div className="absolute inset-8 rounded-full bg-gold/10 border border-gold/40" />
            <span className="text-gold text-3xl">🕊️</span>
          </div>

          <p className="text-sm text-cream/40 font-scripture italic">
            "The feature no other spiritual app has built."
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── PRICING */}
      <section className="py-20 bg-cream" id="pricing">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">
              Pricing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy mb-3">
              Begin free. Go deeper with Premium.
            </h2>
            <p className="text-base text-text-medium">
              Download the world's 1st Christian discernment app today — no credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-parchment border border-border rounded-2xl p-7 space-y-5">
              <div>
                <p className="font-display text-2xl text-navy">Free</p>
                <p className="text-3xl font-bold text-navy mt-1">$0</p>
                <p className="text-sm text-text-light">forever</p>
              </div>
              <ul className="space-y-2.5">
                {FEATURES_FREE.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-base text-text-medium">
                    <span className="text-sage mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={APP_STORE_URL}
                className="block text-center py-3 rounded-full border border-navy text-navy text-sm font-semibold hover:bg-navy hover:text-cream transition-colors"
              >
                Download Free
              </a>
            </div>

            {/* Premium */}
            <div className="bg-navy border-2 border-gold rounded-2xl p-7 space-y-5">
              <p className="font-display text-2xl text-cream">Premium</p>
              <BillingToggle />
              <ul className="space-y-2.5">
                {FEATURES_PREMIUM.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-base text-cream/80">
                    <span className="text-gold mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── TRUST */}
      <section className="py-16 bg-parchment border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-6">
          <p className="text-3xl text-navy">🛡️</p>
          <h2 className="font-display text-2xl text-navy">Trust &amp; Safety</h2>
          <div className="space-y-4 text-base text-text-medium leading-relaxed">
            <p className="font-scripture italic text-base text-navy">
              "This tool supports reflection — it does not replace God, Scripture, or wise counsel."
            </p>
            <p>
              We never sell your prayers or decisions. Your spiritual journey is yours alone.
              All data is encrypted in transit and at rest. We will never use your discernment
              sessions to train AI models.
            </p>
            <p>
              Built on Anthropic&apos;s Claude AI — designed with Constitutional AI principles for
              safety and honesty. BibleDiscern adds an additional layer of biblical theological
              review to every response.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── FAQ */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-2xl text-navy text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="border-b border-border pb-6">
                <h3 className="font-semibold text-navy mb-2">{faq.question}</h3>
                <p className="text-base text-text-medium leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── FINAL CTA */}
      <section className="py-20 bg-navy text-center">
        <div className="mx-auto max-w-xl px-4 sm:px-6 space-y-6">
          <div className="text-gold text-5xl">✝</div>
          <h2 className="font-display text-3xl sm:text-4xl text-cream">
            Bring your next crossroads to God.
          </h2>
          <p className="text-cream/60 font-scripture italic text-lg">
            "If any of you lacks wisdom, let him ask God, who gives generously to all
            without reproach, and it will be given him." — James 1:5
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={APP_STORE_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gold text-navy font-bold hover:bg-gold-muted transition-colors"
            >
              🍎 App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold transition-colors"
            >
              🤖 Google Play
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
