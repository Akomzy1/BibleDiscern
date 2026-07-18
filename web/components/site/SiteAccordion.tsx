'use client';

// Vellum FAQ accordion (landing + pricing). One open at a time.

import { useState } from 'react';
import { Panel } from '@/components/selah';

export function SiteAccordion({
  items,
  defaultOpen = 0,
}: {
  items: [string, string][];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Panel className="px-[22px] py-1.5">
      {items.map(([q, a], i) => (
        <div key={q} className={i < items.length - 1 ? 'border-b border-ink-900/10' : ''}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className={`flex min-h-[54px] w-full items-center justify-between gap-4 py-2.5 text-left font-body text-base font-semibold transition-colors duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
              open === i ? 'text-gilt-700' : 'text-ink-900'
            }`}
          >
            {q}
            <span className="inline-flex flex-none text-ink-500" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {open === i ? <path d="M5 12h14" /> : <path d="M12 5v14M5 12h14" />}
              </svg>
            </span>
          </button>
          {open === i && (
            <p className="mb-[18px] font-body text-[15px] leading-[1.65] text-ink-500">{a}</p>
          )}
        </div>
      ))}
    </Panel>
  );
}
