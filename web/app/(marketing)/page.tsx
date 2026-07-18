// Landing — faithful translation of the Home frames (mobile 390 / desktop
// 1440) in docs/prototypes/website.html. Section order: hero · live scale
// teaser · problem · 7 steps on a beam spine (the Stillness emphasized) ·
// Stillness band · journal feature · community proof · pricing summary ·
// vellum FAQ · CTA band. No multi-column feature grids — a nave, not a
// brochure.

import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE_URL } from '@/lib/seo';
import { Eyebrow, Panel, ScriptureBlock, StatusChip } from '@/components/selah';
import { Sec, SiteH2, CtaBand } from '@/components/site/Site';
import { SiteAccordion } from '@/components/site/SiteAccordion';
import { PricingSummary } from '@/components/site/PricingSummary';
import { TRIAL_LINE } from '@librato/shared';
import { getTodayTeaser, getProofStats, computePercents, scaleDate } from '@/lib/scales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'BibleDiscern — Weigh it with wisdom',
  description:
    'A guided, Scripture-rooted journey for real decisions — not a devotional, not a chatbot. Weigh today’s Daily Scale with the whole church, free.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'BibleDiscern — Weigh it with wisdom',
    description: 'A guided, Scripture-rooted journey for real decisions.',
    url: BASE_URL,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630 }],
  },
};

// ─── Hero ────────────────────────────────────────────────────────────────────

function PanBeam() {
  const Pan = ({ side, label }: { side: 'left' | 'right'; label: string }) => (
    <div className="absolute top-0 w-0" style={{ [side]: '13%' } as React.CSSProperties}>
      <div className="absolute -left-px top-0 h-[22px] w-px bg-gilt-500/55" />
      <div
        className="absolute -left-[18px] top-[22px] h-[11px] w-9 border border-t-0 border-gilt-500 bg-gilt-500/10"
        style={{ borderRadius: '0 0 36px 36px' }}
      />
      <div className="absolute -left-[55px] top-[42px] w-[110px] text-center font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-vellum-200/60 md:text-[10px]">
        {label}
      </div>
    </div>
  );
  return (
    <div aria-hidden className="relative h-[94px] w-full max-w-[560px] md:h-[102px]">
      <div
        className="beam-rotor absolute left-0 right-0 top-[22px]"
        style={{ animation: 'beam-sway 7s var(--ease-selah) infinite', transformOrigin: '50% 50%' }}
      >
        <div
          className="h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(200,164,94,.55) 8%, rgba(200,164,94,.55) 92%, transparent)',
          }}
        />
        <Pan side="left" label="wisdom" />
        <Pan side="right" label="your decision" />
      </div>
      <div
        className="absolute left-1/2 top-[27px] h-0 w-0 -translate-x-1/2"
        style={{
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: '11px solid var(--gilt)',
        }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-[52px] pt-[60px] md:px-[5%] md:pb-[84px] md:pt-[104px]"
      style={{ background: 'linear-gradient(180deg, var(--nave-950) 0%, var(--nave-800) 100%)' }}
    >
      {/* the page's single glow lives on the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 30%, var(--glow), transparent 70%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[720px] justify-items-center gap-4 text-center md:gap-5">
        <Eyebrow>The world&apos;s first Christian discernment app</Eyebrow>
        <h1 className="font-display text-[42px] font-medium leading-[1.06] tracking-[-0.01em] text-vellum-100 md:text-[72px]">
          Weigh it with wisdom.
        </h1>
        <PanBeam />
        <p className="max-w-[520px] font-body text-base leading-[1.6] text-vellum-200/60 md:text-[19px]">
          A guided, Scripture-rooted journey for real decisions — not a devotional, not a chatbot.
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-[22px]">
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center rounded-panel bg-gilt-500 px-7 font-body text-base font-semibold text-nave-900 transition duration-whisper ease-selah hover:brightness-105"
          >
            Start free
          </Link>
          <a href="#daily-scale" className="font-body text-[15px] font-semibold text-gilt-300 hover:text-gilt-500">
            See today&apos;s question
          </a>
        </div>
        <span className="font-body text-[13px] text-vellum-200/60">{TRIAL_LINE}</span>
      </div>
    </section>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

async function ScaleTeaser() {
  const scale = await getTodayTeaser();
  const Arg = ({ id, title, body }: { id: string; title: string; body: string }) => (
    <div className="relative overflow-hidden rounded-control border border-ink-900/10 bg-vellum-200 p-[15px] md:p-[18px]">
      <div className="mb-[7px] font-body text-[11px] font-bold tracking-[0.14em] text-ink-500">{id}</div>
      <b className="mb-[5px] block font-body text-[15px] text-ink-900">{title}</b>
      <span className="font-body text-sm leading-[1.55] text-ink-500">{body}</span>
    </div>
  );
  return (
    <Sec bg="bg-nave-800">
      <div id="daily-scale" className="grid scroll-mt-20 justify-items-center gap-[18px] md:gap-6">
        <div className="grid justify-items-center gap-2 text-center">
          <Eyebrow>Today&apos;s scale — live</Eyebrow>
          <span className="font-body text-[12.5px] text-vellum-200/60">
            {scale ? scaleDate(scale.date) : 'Every morning'}
          </span>
        </div>
        <Panel className="w-full px-[18px] py-[22px] md:p-9">
          <p className="text-center font-scripture text-[22px] font-medium italic leading-[1.35] text-ink-900 md:text-[29px]">
            {scale?.question ?? 'One honest question, weighed by the whole church.'}
          </p>
          {scale && (
            <div className="mt-[18px] grid gap-2.5 md:mt-[26px] md:grid-cols-2 md:gap-4">
              <Arg id="A" title={scale.side_a_label} body={scale.side_a_argument} />
              <Arg id="B" title={scale.side_b_label} body={scale.side_b_argument} />
            </div>
          )}
          <div className="mt-[18px] grid justify-items-center md:mt-6">
            <Link
              href="/signup"
              className="inline-flex min-h-[44px] items-center rounded-panel bg-nave-800 px-6 font-body text-[15px] font-semibold text-vellum-100 transition-colors duration-whisper ease-selah hover:bg-nave-700"
            >
              Weigh in — free
            </Link>
          </div>
        </Panel>
      </div>
    </Sec>
  );
}

function Problems() {
  const lines = [
    "Random verses don't help real decisions.",
    'AI chatbots give generic spiritual advice.',
    'You deserve more than a devotional.',
  ];
  return (
    <Sec>
      <div className="grid justify-items-center gap-6 text-center md:gap-8">
        {lines.map((l, i) => (
          <p
            key={l}
            className={`max-w-[560px] font-scripture text-[23px] font-medium italic leading-[1.3] md:text-[32px] ${
              i === 2 ? 'text-gilt-300' : 'text-vellum-100'
            }`}
          >
            {l}
          </p>
        ))}
      </div>
    </Sec>
  );
}

function HowItWorks() {
  const steps: [string, string][] = [
    ['Crossroads', 'Name the decision weighing on your heart.'],
    ['The Word', 'Receive Scripture chosen for your situation — read it slowly.'],
    ['Those Who Walked Before', 'See how saints faced the same fork.'],
    ['The Examination', 'Honest questions to weigh both sides.'],
    ['The Stillness', '90 seconds of guided silence. Built in.'],
    ['The Fruit', 'Test the choice against the fruit of the Spirit.'],
    ['The Prayer', 'Lay it down, and set your Ebenezer Stone.'],
  ];
  return (
    <Sec className="border-t border-gilt-edge">
      <div id="how-it-works" className="grid scroll-mt-20 justify-items-center gap-3 text-center">
        <Eyebrow>How it works</Eyebrow>
        <SiteH2>Seven steps. One journey.</SiteH2>
      </div>
      <ol className="relative mx-auto mt-9 max-w-[560px] list-none pl-[30px]">
        <div aria-hidden className="absolute bottom-4 left-2 top-4 w-px bg-gilt-500/55" />
        {steps.map(([t, d], i) => {
          const hot = i === 4;
          return (
            <li
              key={t}
              className={`relative flex items-baseline gap-4 px-1 py-3.5 ${
                i < 6 ? 'border-b border-gilt-500/10' : ''
              } ${hot ? 'rounded-[10px] bg-gilt-500/5' : ''}`}
            >
              <span
                aria-hidden
                className={`absolute rounded-pill ${
                  hot
                    ? '-left-[27px] top-[18px] h-[11px] w-[11px] bg-gilt-500 shadow-[0_0_10px_rgba(200,164,94,0.45)]'
                    : '-left-[25px] top-5 h-[7px] w-[7px] border border-gilt-500/55'
                }`}
              />
              <span
                className={`w-6 flex-none text-right font-display text-lg font-medium md:text-[21px] ${
                  hot ? 'text-gilt-300' : 'text-vellum-200/60'
                }`}
              >
                {i + 1}
              </span>
              <span>
                <b
                  className={`font-body text-[15.5px] font-semibold md:text-[17px] ${
                    hot ? 'text-gilt-300' : 'text-vellum-100'
                  }`}
                >
                  {t}
                </b>
                <span className="mt-0.5 block font-body text-[13.5px] leading-normal text-vellum-200/60 md:text-[14.5px]">
                  {d}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </Sec>
  );
}

function StillnessBand() {
  return (
    <section className="relative overflow-hidden bg-nave-950 px-5 py-[60px] md:px-[5%] md:py-[88px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 30%, var(--glow), transparent 70%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[720px] items-center justify-items-center gap-7 text-center md:grid-cols-[auto_1fr] md:gap-14 md:text-left">
        <div
          className="breathe-disc relative h-[170px] w-[170px] rounded-pill md:h-[210px] md:w-[210px]"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(200,164,94,.13), rgba(200,164,94,.02) 72%)',
            animation: 'breathe 10s var(--ease-selah) infinite',
          }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--gilt-300)" strokeWidth="1.5" strokeLinecap="round" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <path d="M12 3v18" />
            <path d="M6.5 9.5h11" />
          </svg>
        </div>
        <div className="grid justify-items-center gap-3.5 md:justify-items-start">
          <Eyebrow>Spotlight — the Stillness</Eyebrow>
          <div className="text-left">
            <ScriptureBlock onNavy className="text-[20px] md:text-[24px]">
              Be still, and know that I am God.
            </ScriptureBlock>
            <p className="mt-1 font-body text-sm text-vellum-200/40">— Psalm 46:10</p>
          </div>
          <p className="font-body text-[15px] text-vellum-200/60 md:text-[17px]">
            90 seconds of guided silence. Built into the app.
          </p>
        </div>
      </div>
    </section>
  );
}

function JournalFeature() {
  const rows: [string, string, string, string][] = [
    ['March 7, 2026', 'Discernment', 'Should I take the job in Denver?', 'Proverbs 3:5-6'],
    ['February 22, 2026', 'Answered prayer', 'The lease fell through — and it was mercy', 'Psalm 37:4'],
    ['January 9, 2026', 'Ebenezer Stone', 'We said yes to fostering', '1 Samuel 7:12'],
  ];
  return (
    <Sec>
      <div className="grid justify-items-center gap-3 text-center">
        <Eyebrow>The Spiritual Journal</Eyebrow>
        <SiteH2>Set your Ebenezer Stones.</SiteH2>
        <p className="max-w-[520px] font-body text-[15px] leading-[1.6] text-vellum-200/60 md:text-[17px]">
          Every decision you bring before God becomes a stone of remembrance — your spiritual
          autobiography, one entry at a time.
        </p>
      </div>
      <div className="relative mx-auto mt-[34px] max-w-[560px] pl-[26px]">
        <div aria-hidden className="absolute bottom-3 left-1.5 top-3 w-px bg-gilt-500/55" />
        <div className="grid gap-3.5">
          {rows.map(([d, t, q, r]) => (
            <div key={d} className="relative">
              <span aria-hidden className="absolute -left-[23px] top-6 h-[7px] w-[7px] rounded-pill bg-gilt-500" />
              <Panel className="px-4 py-3.5 md:px-5 md:py-4">
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <span className="font-body text-xs text-ink-500">{d}</span>
                  <StatusChip tone="outline" className="border-ink-900/20 !text-ink-500">
                    {t}
                  </StatusChip>
                  <span className="ml-auto font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-gilt-700">
                    {r}
                  </span>
                </div>
                <p className="font-scripture text-[17px] font-medium italic text-ink-900 md:text-[19px]">
                  {q}
                </p>
              </Panel>
            </div>
          ))}
        </div>
      </div>
    </Sec>
  );
}

async function CommunityProof() {
  const stats = await getProofStats();
  const trio: [string, string][] = stats
    ? [
        [stats.latestTotal.toLocaleString('en-US'), 'believers weighed the last scale'],
        [`${stats.totalVotes.toLocaleString('en-US')}+`, 'weigh-ins together'],
        [stats.avgSplit, 'the average split — rarely a landslide'],
      ]
    : [
        ['—', 'believers weighing in daily'],
        ['—', 'scales answered together'],
        ['—', 'the average split'],
      ];
  const y = stats?.yesterday;
  const p = y ? computePercents(y) : null;
  return (
    <Sec className="border-t border-gilt-edge">
      <div className="grid gap-8 md:gap-11">
        <div className="grid gap-[26px] text-center md:grid-cols-3 md:gap-8">
          {trio.map(([n, l]) => (
            <div key={l} className="grid gap-1.5">
              <span className="font-display text-4xl font-medium text-vellum-100 md:text-[44px]">
                {n}
              </span>
              <span className="font-body text-sm text-vellum-200/60">{l}</span>
            </div>
          ))}
        </div>
        {y && p && (
          <Panel className="w-full px-4 py-[18px] md:p-6">
            <Eyebrow on="vellum" className="mb-1.5">
              Yesterday&apos;s scale
            </Eyebrow>
            <p className="mb-4 font-scripture text-base font-medium italic text-ink-900 md:text-lg">
              {y.question}
            </p>
            <div className="grid gap-2">
              <div className="flex items-baseline justify-between font-body text-sm">
                <span className="font-semibold text-ink-900">A</span>
                <span className="font-display text-xl text-ink-900">{p.a}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-pill bg-ink-900/[0.08]">
                <div className="h-full rounded-pill bg-nave-800" style={{ width: `${p.a}%` }} />
              </div>
              <div className="flex items-baseline justify-between font-body text-sm">
                <span className="font-semibold text-ink-900">B</span>
                <span className="font-display text-xl text-ink-900">{p.b}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-pill bg-ink-900/[0.08]">
                <div className="h-full rounded-pill bg-gilt-500" style={{ width: `${p.b}%` }} />
              </div>
            </div>
          </Panel>
        )}
      </div>
    </Sec>
  );
}

function HomeFaq() {
  const qs: [string, string][] = [
    ['Is this a chatbot?', 'No. BibleDiscern is a guided journey with fixed, Scripture-rooted steps. Nothing improvises spiritual counsel at you.'],
    ['Does the AI speak for God?', 'Never. The Scripture Lens never declares a winner — it holds up the Word and leaves the discernment between you and the Lord.'],
    ['What denominations is this for?', 'Any believer who takes Scripture seriously. We stay on the broad, historic center of the faith.'],
    ['Is my data private?', 'Your journal is a confession — held in confidence. No trackers, no ad networks, no selling data.'],
    ["What's free vs Premium?", 'Free: one journey a month, the Daily Scale, your last three journal entries, the Stillness. Premium removes the limits.'],
    ['How does the trial work?', '7 days of Premium, free. We remind you 2 days before it ends. Cancel anytime.'],
  ];
  return (
    <Sec>
      <div className="grid gap-[22px] md:gap-7">
        <SiteH2 className="text-center">Questions, answered plainly.</SiteH2>
        <SiteAccordion items={qs} />
      </div>
    </Sec>
  );
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ScaleTeaser />
      <Problems />
      <HowItWorks />
      <StillnessBand />
      <JournalFeature />
      <CommunityProof />
      <PricingSummary />
      <HomeFaq />
      <CtaBand />
    </>
  );
}
