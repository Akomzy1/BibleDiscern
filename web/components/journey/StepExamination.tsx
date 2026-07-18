'use client';

// Step 4 · The Examination — five numbered expandable fields inside one vellum
// panel; answers are private (kept locally, never sent to the server). (Frame D)

import { useState } from 'react';
import type { DiscernmentResponse } from '@librato/shared';
import { GiltButton, Panel } from '@/components/selah';
import type { UseJourney } from '@/hooks/useJourney';

export function StepExamination({
  ai,
  j,
  onContinue,
}: {
  ai: DiscernmentResponse;
  j: UseJourney;
  onContinue: () => void;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <p className="mx-2.5 mb-3.5 mt-1.5 text-center font-body text-[13px] leading-normal text-vellum-200/60">
        Five questions. Answer plainly — no one reads these but you.
      </p>
      <Panel className="px-[18px] py-1.5">
        {ai.examination.map((q, i) => {
          const isOpen = open === i;
          const saved = j.answers[i];
          return (
            <div key={i} className={`py-[15px] ${i ? 'border-t border-ink-900/15' : ''}`}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
              >
                <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-pill border border-gilt-500 font-display text-sm font-medium text-ink-900">
                  {i + 1}
                </span>
                <span className="flex-1 pt-0.5 font-scripture text-[17px] font-medium italic leading-[1.4] text-ink-900">
                  {q}
                </span>
                <span className="inline-flex pt-1.5 text-ink-500" aria-hidden>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    {isOpen ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
                  </svg>
                </span>
              </button>
              {!isOpen && saved && (
                <p className="ml-10 mt-2 overflow-hidden text-ellipsis whitespace-nowrap font-body text-[13px] italic text-ink-500">
                  {saved}
                </p>
              )}
              {isOpen && (
                <div className="mb-1 ml-10 mt-3">
                  <textarea
                    rows={4}
                    value={saved ?? ''}
                    onChange={(e) => j.saveAnswer(i, e.target.value)}
                    aria-label={`Answer ${i + 1}`}
                    className="w-full resize-y rounded-control border border-ink-900/15 bg-vellum-100 px-3.5 py-3 font-body text-sm leading-[1.55] text-ink-900 focus:outline-none focus:ring-2 focus:ring-gilt-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </Panel>
      <div className="flex-1" />
      <div className="mt-3.5">
        <GiltButton fullWidth onClick={onContinue}>
          Continue to the Fruit
        </GiltButton>
      </div>
    </>
  );
}
