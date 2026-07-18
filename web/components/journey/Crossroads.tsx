'use client';

// Step 1 · The Crossroads — situation + tone selector. (Frame A)

import { useEffect, useState } from 'react';
import { LOADING_MESSAGES, TONES } from '@librato/shared';
import { GiltButton, TextArea } from '@/components/selah';
import type { UseJourney } from '@/hooks/useJourney';

function LoadingVeil() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % LOADING_MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center" aria-live="polite">
      <p className="font-scripture text-[19px] italic leading-relaxed text-gilt-300">
        {LOADING_MESSAGES[i]}
      </p>
    </div>
  );
}

export function Crossroads({ j }: { j: UseJourney }) {
  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState<string>(TONES[0].id);
  const canBegin = situation.trim().length >= 10 && j.status !== 'submitting';

  if (j.status === 'submitting') return <LoadingVeil />;

  const remaining = j.journeysRemaining;

  return (
    <>
      <h1 className="mx-1 mb-3.5 mt-2.5 text-center font-display text-[28px] font-medium leading-tight text-vellum-100">
        What&apos;s weighing on you?
      </h1>
      <TextArea
        rows={8}
        placeholder="Describe the decision you're facing…"
        aria-label="Your decision"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        maxLength={2000}
        className="mt-0.5"
      />
      <p className="mx-0.5 mb-2 mt-[18px] font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-vellum-200/60">
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
                  : 'border border-gilt-500/20 text-vellum-200/70 hover:text-vellum-200'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1" />
      {j.errorMessage && (
        <p className="mb-3 text-center font-body text-sm text-ember-600">{j.errorMessage}</p>
      )}
      <GiltButton fullWidth disabled={!canBegin} onClick={() => void j.begin(situation, tone)}>
        Begin my journey
      </GiltButton>
      <p className="mt-3 text-center font-body text-[12.5px] text-vellum-200/60">
        {remaining === null
          ? ' '
          : remaining === Infinity
            ? 'Unlimited journeys with Premium'
            : `${remaining} journey${remaining === 1 ? '' : 's'} remaining this month`}
      </p>
    </>
  );
}
