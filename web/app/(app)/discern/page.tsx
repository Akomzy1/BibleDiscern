'use client';

// Discern hub — past journeys + the quiet entry into a new one.
// (Empty-state frame refined in Stage 8.)

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Session } from '@librato/shared';
import { TONES, TRIAL_LINE } from '@librato/shared';
import { Beam, Eyebrow, GiltButton, Panel, StatusChip, VellumGrain } from '@/components/selah';
import { CrisisScreen } from '@/components/common/CrisisScreen';
import { JourneyUpgradeLock } from '@/components/journey/JourneyLock';
import { useJourney } from '@/hooks/useJourney';
import { useSubscription } from '@/hooks/useSubscription';
import { getAuthedClient } from '@/lib/api';

// Empty hub (legal-system-states Frame H): level beam, invitation, and the
// crossroads inline on vellum — the first journey starts right here.
function EmptyHub() {
  const j = useJourney();
  const sub = useSubscription();
  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState<string>(TONES[0].id);
  const canBegin = situation.trim().length >= 10 && j.status !== 'submitting';

  if (j.status === 'crisis') return <CrisisScreen />;

  const invitation = (
    <div className="mx-6 mt-8 text-center">
      <Beam />
      <p className="mt-[18px] font-scripture text-[21px] font-medium italic leading-[1.45] text-vellum-100">
        Bring your first decision before God.
      </p>
      <p className="mt-2.5 font-body text-[13.5px] leading-[1.55] text-vellum-200/60">
        A guided journey in seven steps — Scripture, examination, stillness, prayer.
      </p>
    </div>
  );

  // The journey is Premium-only — free users see the upgrade lock in place of
  // the Crossroads form (server enforces the same gate).
  if (sub.status === 'ready' && !sub.isPremium) {
    return (
      <div className="flex flex-1 flex-col">
        {invitation}
        <div className="mt-[26px]">
          <JourneyUpgradeLock />
        </div>
        <div className="flex-1" />
        <p className="pt-6 text-center font-body text-xs leading-normal text-vellum-200/60">
          Your journey is private — between you and the Lord.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {invitation}
      <Panel className="mt-[26px] p-5">
        <textarea
          rows={4}
          placeholder="What's weighing on you?"
          aria-label="Your decision"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          maxLength={2000}
          className="w-full resize-none rounded-panel border border-ink-900/15 bg-vellum-100 px-4 py-3 font-body text-ink-900 placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-gilt-500"
        />
        <p className="mx-0.5 mb-2 mt-4 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          Tone of your journey
        </p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => {
            const sel = tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={sel}
                onClick={() => setTone(t.id)}
                className={`min-h-[40px] rounded-pill px-4 font-body text-sm font-semibold transition-all duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
                  sel
                    ? 'border border-gilt-500 bg-gilt-500 text-nave-900'
                    : 'border border-ink-900/20 text-ink-500 hover:text-ink-900'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {j.status === 'limit' ? (
          <div className="mt-[18px] text-center">
            <Link href="/upgrade">
              <GiltButton fullWidth>Start my 7-day free trial</GiltButton>
            </Link>
            <p className="mt-2 font-body text-xs text-ink-500">{TRIAL_LINE}</p>
          </div>
        ) : (
          <div className="mt-[18px]">
            <GiltButton
              fullWidth
              disabled={!canBegin}
              onClick={() => void j.begin(situation, tone)}
            >
              {j.status === 'submitting' ? 'Preparing your path…' : 'Begin my journey'}
            </GiltButton>
          </div>
        )}
        {j.errorMessage && (
          <p className="mt-3 text-center font-body text-sm text-ember-600">{j.errorMessage}</p>
        )}
      </Panel>
      <div className="flex-1" />
      <p className="pt-6 text-center font-body text-xs leading-normal text-vellum-200/60">
        Your journey is private — between you and the Lord.
      </p>
    </div>
  );
}

export default function DiscernHubPage() {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unauthenticated'>(
    'loading',
  );

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const client = await getAuthedClient();
      if (!client) {
        setStatus('unauthenticated');
        return;
      }
      setSessions(await client.getSessions());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === 'ready' && sessions && sessions.length === 0) {
    return (
      <main className="flex min-h-[85vh] flex-col">
        <h1 className="mx-1 mt-2 font-display text-2xl font-medium text-vellum-100">Discern</h1>
        <EmptyHub />
      </main>
    );
  }

  return (
    <main>
      <h1 className="mx-1 mb-1 mt-4 font-display text-2xl font-medium text-vellum-100">Discern</h1>
      <p className="mx-1 font-body text-sm text-vellum-200/60">
        Bring a decision of your own before God.
      </p>

      <div className="mt-5">
        <Link href="/discern/new">
          <GiltButton fullWidth>Begin a Deep Discernment</GiltButton>
        </Link>
      </div>

      {status === 'ready' && sessions && sessions.length > 0 && (
        <div className="mt-8">
          <Eyebrow>Past journeys</Eyebrow>
          <div className="mt-3 grid gap-2.5">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/discern/${s.id}`}
                className="relative block overflow-hidden rounded-panel border border-ink-900/10 bg-vellum-100 px-4 py-3.5 shadow-glow transition-transform duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 active:scale-[0.995]"
              >
                <VellumGrain />
                <span className="relative block">
                  <span className="block truncate font-scripture text-base font-medium italic text-ink-900">
                    {s.situation}
                  </span>
                  <span className="mt-2 flex items-center gap-2.5">
                    <StatusChip tone={s.status === 'completed' ? 'success' : 'outline'}>
                      {s.status === 'completed' ? 'Stone set' : 'In progress'}
                    </StatusChip>
                    <span className="font-body text-xs text-ink-500">
                      {new Date(s.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-8 text-center">
          <p className="font-body text-sm text-vellum-200/60">
            We couldn&apos;t reach the server. Your words are saved — try again in a moment.
          </p>
          <div className="mt-4 flex justify-center">
            <GiltButton variant="secondary" onClick={() => void load()}>
              Try again
            </GiltButton>
          </div>
        </div>
      )}
    </main>
  );
}
