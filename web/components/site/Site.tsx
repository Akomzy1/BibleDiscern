// Shared marketing-site chrome + building blocks, translated from
// docs/prototypes/website.html. Marketing pages read like a nave, not a
// brochure: single content column, navy breathing wide.

import Link from 'next/link';
import { Eyebrow, Wordmark, VellumGrain } from '@/components/selah';
import { computePercents, scaleDate, type PublicScale } from '@/lib/scales';

export function Sec({
  children,
  bg,
  className,
  pad,
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
  pad?: string;
}) {
  return (
    <section
      className={`${bg ?? 'bg-nave-900'} ${pad ?? 'px-5 py-[60px] md:px-[5%] md:py-[88px]'} ${className ?? ''}`}
    >
      <div className="mx-auto max-w-[720px]">{children}</div>
    </section>
  );
}

export function SiteH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-[29px] font-medium leading-[1.15] text-vellum-100 md:text-[40px] ${className ?? ''}`}
    >
      {children}
    </h2>
  );
}

export function SiteNav() {
  return (
    <nav className="flex min-h-[60px] items-center justify-between gap-6 border-b border-gilt-edge bg-nave-950 px-5 md:min-h-[72px] md:px-[5%]">
      <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500">
        <Wordmark />
      </Link>
      <div className="hidden gap-7 font-body text-[15px] md:flex">
        <Link href="/#how-it-works" className="text-gilt-300 hover:text-gilt-500">How it works</Link>
        <Link href="/#daily-scale" className="text-gilt-300 hover:text-gilt-500">Daily scale</Link>
        <Link href="/scale" className="text-gilt-300 hover:text-gilt-500">Archive</Link>
        <Link href="/pricing" className="text-gilt-300 hover:text-gilt-500">Pricing</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden font-body text-sm font-semibold text-vellum-200/70 hover:text-vellum-100 md:inline"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="inline-flex min-h-[40px] items-center rounded-panel border border-gilt-500 px-4 font-body text-sm font-semibold text-gilt-500 transition-colors duration-whisper ease-selah hover:bg-gilt-500/10"
        >
          Start free
        </Link>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-gilt-edge bg-nave-950 px-5 py-9 md:px-[5%] md:py-11">
      <div className="mx-auto flex max-w-[720px] flex-wrap items-center justify-between gap-5">
        <div className="grid gap-1.5">
          <Wordmark />
          <span className="font-scripture text-[15px] italic text-vellum-200/60">
            Weigh it with wisdom.
          </span>
        </div>
        <div className="flex flex-wrap gap-5 font-body text-sm">
          <Link href="/pricing" className="text-gilt-300 hover:text-gilt-500">Pricing</Link>
          <Link href="/scale" className="text-gilt-300 hover:text-gilt-500">Scale Archive</Link>
          <Link href="/privacy" className="text-gilt-300 hover:text-gilt-500">Privacy</Link>
          <Link href="/terms" className="text-gilt-300 hover:text-gilt-500">Terms</Link>
          <Link href="/delete-account" className="text-gilt-300 hover:text-gilt-500">Delete Account</Link>
        </div>
      </div>
    </footer>
  );
}

export function CtaBand({
  title = 'Weigh it with wisdom.',
  cta = 'Start free',
  micro = 'Works on any phone — add it to your home screen.',
}: {
  title?: string;
  cta?: string;
  micro?: string;
}) {
  return (
    <Sec bg="bg-nave-950" className="text-center">
      <div className="grid justify-items-center gap-5">
        <span aria-hidden className="relative inline-block h-[22px] w-3.5">
          <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-gilt-500" />
          <span className="absolute left-0 top-[26%] h-[1.5px] w-full bg-gilt-500" />
        </span>
        <h2 className="font-display text-3xl font-medium leading-[1.12] text-vellum-100 md:text-[44px]">
          {title}
        </h2>
        <Link
          href="/signup"
          className="inline-flex min-h-[48px] items-center rounded-panel bg-gilt-500 px-7 font-body text-base font-semibold text-nave-900 transition duration-whisper ease-selah hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 focus-visible:ring-offset-2 focus-visible:ring-offset-nave-950"
        >
          {cta}
        </Link>
        <span className="font-body text-[13px] text-vellum-200/60">{micro}</span>
      </div>
    </Sec>
  );
}

export function PageHead({
  eyebrow,
  title,
  sub,
  scripture = false,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  scripture?: boolean;
}) {
  return (
    <Sec bg="bg-nave-950" pad="px-5 pb-14 pt-[72px] md:px-[5%]" className="text-center">
      <div className="grid justify-items-center gap-3.5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className={`mx-auto max-w-[640px] font-medium leading-[1.15] text-vellum-100 ${
            scripture
              ? 'font-scripture text-[30px] italic md:text-[46px]'
              : 'font-display text-[34px] md:text-[52px]'
          }`}
        >
          {title}
        </h1>
        {sub && (
          <p className="mx-auto max-w-[520px] font-body text-[17px] leading-[1.6] text-vellum-200/60">
            {sub}
          </p>
        )}
      </div>
    </Sec>
  );
}

export function MiniBar({ a, b }: { a: number; b: number }) {
  const leadA = a >= b;
  return (
    <div className="flex items-center gap-3 font-body">
      <span className={`w-12 flex-none text-xs ${leadA ? 'font-bold text-ink-900' : 'font-semibold text-ink-500'}`}>
        A · {a}%
      </span>
      <div className="flex h-1.5 flex-1 gap-0.5">
        <div className={`rounded-pill ${leadA ? 'bg-nave-800' : 'bg-ink-900/15'}`} style={{ width: `${a}%` }} />
        <div className={`rounded-pill ${!leadA ? 'bg-nave-800' : 'bg-ink-900/15'}`} style={{ width: `${b}%` }} />
      </div>
      <span className={`w-12 flex-none text-right text-xs ${!leadA ? 'font-bold text-ink-900' : 'font-semibold text-ink-500'}`}>
        {b}% · B
      </span>
    </div>
  );
}

export function ScaleCard({ s, compact = false }: { s: PublicScale; compact?: boolean }) {
  const p = computePercents(s);
  return (
    <div
      className={`relative overflow-hidden rounded-panel border border-ink-900/10 bg-vellum-100 shadow-glow ${
        compact ? 'px-[18px] py-4' : 'px-6 py-5'
      }`}
    >
      <VellumGrain />
      <div className="relative">
        <p className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          {scaleDate(s.date)}
        </p>
        <p
          className={`font-scripture font-medium italic leading-[1.35] text-ink-900 ${
            compact ? 'text-[17px]' : 'text-[19px] md:text-[21px]'
          }`}
        >
          {s.question}
        </p>
        <div className="mb-3 mt-3.5">
          <MiniBar a={p.a} b={p.b} />
        </div>
        {s.slug && (
          <Link
            href={`/scale/${s.slug}`}
            className="font-body text-[13.5px] font-semibold text-gilt-700 hover:underline"
          >
            Read the Scripture Lens →
          </Link>
        )}
      </div>
    </div>
  );
}
