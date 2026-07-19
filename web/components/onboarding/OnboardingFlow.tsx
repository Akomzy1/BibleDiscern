'use client';

// The 6-screen onboarding flow — faithful translation of
// docs/prototypes/onboarding.html. Shared shell: nave800, 6 progress dots,
// no tab bar. Screens 1 & 6 are orchestrated (staged entrances). No skip on
// screens 1–5; the S6 skip link is delayed 2000ms but ALWAYS present.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OnboardingSeason } from '@librato/shared';
import {
  Beam,
  CrossGlyph,
  Eyebrow,
  GiltButton,
  Panel,
  ProgressDots,
  TimePills,
  VellumGrain,
} from '@/components/selah';
import { PlanCards, ValueRow, TRIAL_LINE } from '@/components/paywall/PlanCards';
import { DailyScale } from '@/components/scale/DailyScale';
import { useDailyScale } from '@/hooks/useDailyScale';
import { getAuthedClient } from '@/lib/api';
import { useSubscription } from '@/hooks/useSubscription';
import { usePush } from '@/hooks/usePush';

function Shell({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-nave-800 text-vellum-100">
      <div className="pt-safe" />
      <ProgressDots count={6} active={step} className="mt-4" />
      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-6 pb-8 pt-3">
        {children}
      </div>
    </div>
  );
}

// ─── 1 · The Hook ────────────────────────────────────────────────────────────

function HookScreen({ onNext }: { onNext: () => void }) {
  const d = (ms: number) => ({ animationDelay: `${ms}ms` });
  return (
    <Shell step={0}>
      <div className="flex flex-1 flex-col justify-center text-center">
        <div className="stage" style={d(0)}>
          <CrossGlyph muted />
        </div>
        <h1
          className="stage mt-[34px] font-display text-[26px] font-medium leading-[1.4] text-gilt-300 [text-wrap:pretty]"
          style={d(500)}
        >
          Have you ever laid awake at night, unsure if you&apos;re making the right decision?
        </h1>
        <p
          className="stage mt-[22px] px-3 font-scripture text-[19px] font-medium italic leading-[1.55] text-gilt-300"
          style={d(1000)}
        >
          You&apos;re not alone. And you don&apos;t have to figure it out by yourself.
        </p>
      </div>
      <div className="stage" style={d(1500)}>
        <GiltButton fullWidth onClick={onNext}>
          That&apos;s why I&apos;m here
        </GiltButton>
      </div>
    </Shell>
  );
}

// ─── 2 · Season ──────────────────────────────────────────────────────────────

const SEASONS = [
  { t: 'Career crossroads', s: 'A job, a calling, a move' },
  { t: 'Relationship decision', s: 'Marriage, family, friendship' },
  { t: 'Financial uncertainty', s: 'Debt, giving, provision' },
  { t: 'Spiritual dryness', s: 'When God feels far away' },
] as const;
const SEASON_FULL = {
  t: 'I just want to grow in discernment',
  s: 'No urgent decision — just practice',
} as const;
// Catch-all for a real decision that resists a category. Stored value is the
// code 'unnamed' (see @librato/shared ONBOARDING_SEASONS), not the card title.
const SEASON_UNNAMED = {
  t: "A crossroads I can't quite name",
  s: 'A quiet unease you can’t yet place',
  value: 'unnamed' satisfies OnboardingSeason,
} as const;

function SeasonCard({
  t,
  s,
  selected,
  full,
  onClick,
}: {
  t: string;
  s: string;
  selected: boolean;
  full?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex w-full flex-col justify-center gap-1 overflow-hidden rounded-control text-left transition-all duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
        full ? 'min-h-[64px]' : 'min-h-[96px]'
      } ${
        selected
          ? 'border border-ink-900/10 border-l-[3px] border-l-gilt-500 bg-vellum-200 p-3.5 shadow-[0_6px_18px_rgba(200,164,94,0.18)]'
          : 'border border-ink-900/10 bg-vellum-100 px-4 py-3.5 shadow-glow'
      }`}
    >
      <VellumGrain />
      <span className="relative block font-body text-[14.5px] font-semibold leading-[1.3] text-ink-900">
        {t}
      </span>
      <span className="relative block font-body text-xs leading-[1.4] text-ink-500">{s}</span>
    </button>
  );
}

function SeasonScreen({ onPick }: { onPick: (season: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  const pick = (season: string) => {
    setPicked(season);
    // brief beat so the selection state is seen, then advance
    setTimeout(() => onPick(season), 450);
  };

  return (
    <Shell step={1}>
      <h1 className="mx-2 mt-[26px] text-center font-display text-2xl font-medium leading-[1.35] text-vellum-100 [text-wrap:pretty]">
        What best describes where you are right now?
      </h1>
      <div className="mt-[30px] grid grid-cols-2 gap-2.5">
        {SEASONS.map((c) => (
          <SeasonCard
            key={c.t}
            t={c.t}
            s={c.s}
            selected={picked === c.t}
            onClick={() => pick(c.t)}
          />
        ))}
      </div>
      <div className="mt-2.5">
        <SeasonCard
          t={SEASON_FULL.t}
          s={SEASON_FULL.s}
          full
          selected={picked === SEASON_FULL.t}
          onClick={() => pick(SEASON_FULL.t)}
        />
      </div>
      <div className="mt-2.5">
        <SeasonCard
          t={SEASON_UNNAMED.t}
          s={SEASON_UNNAMED.s}
          full
          selected={picked === SEASON_UNNAMED.value}
          onClick={() => pick(SEASON_UNNAMED.value)}
        />
      </div>
      <p className="mt-[18px] text-center font-body text-[12.5px] text-vellum-200/60">
        This shapes your first scales. You can change it anytime.
      </p>
    </Shell>
  );
}

// ─── 3 · Micro-discernment ───────────────────────────────────────────────────

function CountRing({ secondsLeft, done }: { secondsLeft: number; done: boolean }) {
  const R = 37;
  const C = 2 * Math.PI * R;
  const progress = done ? 0 : (secondsLeft / 5) * C;
  return (
    <div className="relative mx-auto h-20 w-20">
      <svg width="80" height="80" viewBox="0 0 80 80" className="block -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="var(--nave-700)" strokeWidth="3" />
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke="var(--gilt)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - progress}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        {done ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--gilt-300)" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        ) : (
          <span className="font-display text-3xl font-medium text-vellum-100">{secondsLeft}</span>
        )}
      </span>
    </div>
  );
}

function MicroScreen({ onNext }: { onNext: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const done = secondsLeft <= 0;

  useEffect(() => {
    if (done) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setSecondsLeft(0);
      return;
    }
    const id = setInterval(() => setSecondsLeft((n) => n - 1), 1000);
    return () => clearInterval(id);
  }, [done]);

  return (
    <Shell step={2}>
      <div className="flex flex-1 flex-col justify-center text-center">
        <Eyebrow className="justify-center">Try this</Eyebrow>
        <p className="mx-2.5 mt-[18px] font-scripture text-[19px] font-medium italic leading-[1.55] text-vellum-100 [text-wrap:pretty]">
          {done
            ? 'Five seconds of stillness. Did a decision rise to the surface?'
            : "Be still for five seconds. Let one decision you've been carrying rise to the surface."}
        </p>
        <div className="mt-9">
          <CountRing secondsLeft={secondsLeft} done={done} />
        </div>
        {!done && (
          <p className="mt-3.5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
            seconds
          </p>
        )}
      </div>
      {done && (
        <div className="grid gap-2.5">
          <GiltButton fullWidth onClick={onNext}>
            I noticed something
          </GiltButton>
          <GiltButton variant="secondary" fullWidth onClick={onNext}>
            I&apos;m not sure yet
          </GiltButton>
        </div>
      )}
    </Shell>
  );
}

// ─── 4 · Your time (+ iOS install branch) ────────────────────────────────────

const TIME_OPTIONS = ['7:00 AM', '8:00 AM', '9:00 AM'] as const;
const TIME_VALUES: Record<string, string> = {
  '7:00 AM': '07:00',
  '8:00 AM': '08:00',
  '9:00 AM': '09:00',
};

function isIosSafariNotInstalled() {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(ua);
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  return isIos && !standalone;
}

function InstallStep({ n, icon, children }: { n: number; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-pill bg-nave-800 font-display text-[13px] text-vellum-100">
        {n}
      </span>
      <span className="inline-flex text-ink-900">{icon}</span>
      <span className="font-body text-sm leading-[1.4] text-ink-900">{children}</span>
    </div>
  );
}

function YourTimeScreen({
  onDone,
}: {
  onDone: (time: string) => void;
}) {
  const [value, setValue] = useState<string>('8:00 AM');
  const [showInstall, setShowInstall] = useState(false);
  const { subscribe } = usePush();

  const begin = async () => {
    if (isIosSafariNotInstalled()) {
      setShowInstall(true);
      return;
    }
    await subscribe(); // request Web Push; degrades silently if declined
    onDone(TIME_VALUES[value]);
  };

  return (
    <Shell step={3}>
      <h1 className="mx-2 mt-[26px] text-center font-display text-[26px] font-medium leading-[1.3] text-vellum-100">
        Your Daily Scale is ready
      </h1>
      {!showInstall ? (
        <>
          <p className="mx-5 mt-3 text-center font-body text-sm leading-normal text-vellum-200/60">
            One question each morning, weighed with wisdom. Choose when it finds you.
          </p>
          <TimePills
            options={TIME_OPTIONS}
            value={value}
            onChange={setValue}
            className="mt-[34px]"
          />
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => void begin()}
            className="min-h-[48px] w-full rounded-panel bg-nave-700 font-body text-[15px] font-semibold text-vellum-100 transition-colors duration-whisper ease-selah hover:bg-nave-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
          >
            Begin my journey
          </button>
        </>
      ) : (
        <>
          <Panel className="mt-[30px] px-5 py-[22px]">
            <p className="font-body text-[15.5px] font-semibold leading-[1.4] text-ink-900">
              Add BibleDiscern to your Home Screen
            </p>
            <p className="mt-1.5 font-scripture text-base font-medium italic leading-[1.45] text-ink-500">
              — so your Daily Scale can find you.
            </p>
            <div className="mt-5 grid gap-3.5">
              <InstallStep
                n={1}
                icon={
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                    <path d="M12 3v12M8 7l4-4 4 4" />
                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
                  </svg>
                }
              >
                Tap the <b>Share</b> button in Safari
              </InstallStep>
              <InstallStep
                n={2}
                icon={
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                    <path d="M12 9v6M9 12h6" />
                  </svg>
                }
              >
                Choose <b>Add to Home Screen</b>
              </InstallStep>
            </div>
          </Panel>
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => onDone(TIME_VALUES[value])}
              className="font-body text-sm font-semibold text-gilt-500 underline-offset-4 transition-colors duration-whisper ease-selah hover:text-gilt-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
            >
              Continue
            </button>
          </div>
          <div className="flex-1" />
        </>
      )}
    </Shell>
  );
}

// ─── 5 · First Daily Scale ───────────────────────────────────────────────────

function FirstScaleScreen({ onNext }: { onNext: () => void }) {
  const s = useDailyScale();

  // Voting advances to the paywall; an already-voted account moves straight on.
  useEffect(() => {
    if (s.phase === 'see' || (s.status === 'ready' && s.phase === 'completed')) {
      const id = setTimeout(onNext, s.phase === 'see' ? 1200 : 0);
      return () => clearTimeout(id);
    }
  }, [s.phase, s.status, onNext]);

  return (
    <Shell step={4}>
      <p className="mx-5 mt-2.5 text-center font-scripture text-[17px] font-medium italic leading-[1.5] text-gilt-300">
        Trust that nudge. Here&apos;s your first scale:
      </p>
      {s.status === 'ready' ? (
        <DailyScale s={s} />
      ) : s.status === 'loading' ? (
        <div className="mt-6">
          <Beam sway />
          <Panel tone="navy" className="mt-4 h-56 animate-pulse" aria-hidden>
            <div />
          </Panel>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="font-body text-sm text-vellum-200/70">
            We couldn&apos;t reach the server. Your words are saved — try again in a moment.
          </p>
          <div className="mt-5 flex gap-3">
            <GiltButton variant="secondary" onClick={() => void s.reload()}>
              Try again
            </GiltButton>
            <GiltButton variant="link" onClick={onNext}>
              Continue
            </GiltButton>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ─── 6 · Soft paywall ────────────────────────────────────────────────────────

function PaywallScreen({
  onStartTrial,
  onSkip,
  busy,
}: {
  onStartTrial: (plan: 'monthly' | 'annual') => void;
  onSkip: () => void;
  busy: boolean;
}) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');
  const d = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <Shell step={5}>
      <div className="text-center">
        <div className="stage" style={d(0)}>
          <CrossGlyph size={22} muted />
        </div>
        <h1 className="stage mt-3 font-display text-2xl font-medium leading-[1.3] text-vellum-100" style={d(200)}>
          You just experienced discernment.
        </h1>
        <p
          className="stage mt-2 font-scripture text-[17px] font-medium italic leading-[1.45] text-gilt-300"
          style={d(200)}
        >
          Imagine going deeper — every single day.
        </p>
      </div>

      <div className="mx-1 mt-[18px] grid gap-[9px]">
        <ValueRow delay={500}>Every Deep Discernment journey</ValueRow>
        <ValueRow delay={560}>The Stillness Engine</ValueRow>
        <ValueRow delay={620}>Fruit of the Spirit diagnostic</ValueRow>
        <ValueRow delay={680}>Your full spiritual history</ValueRow>
      </div>

      <PlanCards plan={plan} onSelect={setPlan} stagedDelays={{ annual: 800, monthly: 1100 }} />

      <div className="flex-1" />

      <div className="stage" style={d(1400)}>
        <GiltButton fullWidth onClick={() => onStartTrial(plan)} disabled={busy}>
          {busy ? 'One moment…' : 'Start my 7-day free trial'}
        </GiltButton>
      </div>
      <div className="stage mt-3.5 text-center" style={d(2000)}>
        <button
          type="button"
          onClick={onSkip}
          disabled={busy}
          className="font-body text-sm font-semibold text-gilt-500 underline underline-offset-[3px] transition-colors duration-whisper ease-selah hover:text-gilt-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          Continue with free plan
        </button>
      </div>
      <p className="mt-2.5 text-center font-body text-xs text-vellum-200/60">{TRIAL_LINE}</p>
    </Shell>
  );
}

// ─── Flow ────────────────────────────────────────────────────────────────────

export function OnboardingFlow() {
  const router = useRouter();
  const { createCheckoutUrl } = useSubscription();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const checkedRef = useRef(false);

  // Guard: signed out → login; already onboarded → Today (paywall never re-shows)
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    void (async () => {
      const client = await getAuthedClient();
      if (!client) {
        router.replace('/login');
        return;
      }
      try {
        const profile = await client.getProfile();
        if (profile.onboarding_completed) router.replace('/today');
      } catch {
        // profile fetch failed — allow onboarding to proceed
      }
    })();
  }, [router]);

  const saveProfile = useCallback(async (patch: Record<string, unknown>) => {
    try {
      const client = await getAuthedClient();
      await client?.updateProfile(patch);
    } catch {
      // non-blocking — onboarding continues regardless
    }
  }, []);

  const markCompleted = useCallback(
    () => saveProfile({ onboarding_completed: true }),
    [saveProfile],
  );

  switch (step) {
    case 0:
      return <HookScreen onNext={() => setStep(1)} />;
    case 1:
      return (
        <SeasonScreen
          onPick={(season) => {
            void saveProfile({ onboarding_season: season });
            setStep(2);
          }}
        />
      );
    case 2:
      return <MicroScreen onNext={() => setStep(3)} />;
    case 3:
      return (
        <YourTimeScreen
          onDone={(time) => {
            void saveProfile({ daily_scale_time: time });
            setStep(4);
          }}
        />
      );
    case 4:
      return <FirstScaleScreen onNext={() => setStep(5)} />;
    default:
      return (
        <PaywallScreen
          busy={busy}
          onStartTrial={(plan) => {
            setBusy(true);
            void (async () => {
              // Persist completion and create the Stripe session concurrently,
              // then redirect once — markCompleted must land before the external
              // redirect (which would cancel an in-flight PATCH).
              const [, url] = await Promise.all([markCompleted(), createCheckoutUrl(plan)]);
              if (url) window.location.href = url;
              else setBusy(false);
            })();
          }}
          onSkip={() => {
            // Optimistic: navigate immediately; the completion PATCH runs in the
            // background (a client-side push keeps the request alive).
            setBusy(true);
            void markCompleted();
            router.push('/today');
          }}
        />
      );
  }
}
