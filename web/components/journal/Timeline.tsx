// Journal timeline — hairline gilt spine, stone glyph per entry, entry cards
// (date eyebrow, OUTLINE type chip so gold stays singular, title, reference
// badge, one-line preview). (docs/prototypes/journal.html)

import Link from 'next/link';
import type { JournalEntry } from '@librato/shared';
import { VellumGrain } from '@/components/selah';

export function Stone({
  size = 14,
  className,
  strokeWidth = 1.3,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 0.86}
      viewBox="0 0 14 12"
      className={`block ${className ?? ''}`}
      aria-hidden
    >
      <path
        d="M3 10.6 C1.3 10.6 .7 8.7 1.4 7.2 L3.2 3.5 C3.9 2.1 5.2 1.4 7 1.4 C8.8 1.4 10.1 2.1 10.8 3.5 L12.6 7.2 C13.3 8.7 12.7 10.6 11 10.6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

const TYPES: Record<JournalEntry['entry_type'], { label: string; chip: string }> = {
  discernment: { label: 'Discernment', chip: 'border-nave-800/35 text-nave-800' },
  reflection: { label: 'Reflection', chip: 'border-olive-500/55 text-olive-ink' },
  answered_prayer: { label: 'Answered prayer', chip: 'border-gilt-500/65 text-gilt-700' },
  god_showed_up: { label: 'God showed up', chip: 'border-gilt-500/35 text-gilt-700' },
};

export function TypeChip({ type }: { type: JournalEntry['entry_type'] }) {
  const t = TYPES[type] ?? TYPES.discernment;
  return (
    <span
      className={`ml-auto inline-flex items-center rounded-pill border bg-transparent px-[9px] py-0.5 font-body text-[11px] font-semibold tracking-[0.04em] ${t.chip}`}
    >
      {t.label}
    </span>
  );
}

function entryDate(e: JournalEntry) {
  return new Date(e.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function EntryCard({ e, blur = false }: { e: JournalEntry; blur?: boolean }) {
  const isQuestion = e.entry_type === 'discernment';
  const ref = e.tags?.[0];
  const body = (
    <div
      className={`relative overflow-hidden rounded-panel border border-ink-900/10 bg-vellum-100 px-[15px] py-[13px] ${
        blur ? 'blur-[4px]' : ''
      }`}
    >
      <VellumGrain />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            {entryDate(e)}
          </span>
          <TypeChip type={e.entry_type} />
        </div>
        <p
          className={`mt-2 ${
            isQuestion
              ? 'font-scripture text-[16.5px] font-medium italic leading-[1.35] text-ink-900'
              : 'font-body text-[15px] font-semibold leading-[1.35] text-ink-900'
          }`}
        >
          {e.title ?? 'Untitled stone'}
        </p>
        <div className="mt-[7px] flex items-center gap-2.5">
          {ref && (
            <span className="whitespace-nowrap font-body text-[10.5px] font-semibold uppercase tracking-[0.16em] text-gilt-700">
              {ref}
            </span>
          )}
          {e.content && (
            <span className="truncate font-body text-[12.5px] leading-[1.4] text-ink-500">
              {e.content}
            </span>
          )}
        </div>
      </div>
    </div>
  );
  if (blur) return body;
  return (
    <Link
      href={`/journal/${e.id}`}
      className="block rounded-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
    >
      {body}
    </Link>
  );
}

export function Timeline({
  entries,
  spineGold = true,
  children,
}: {
  entries: JournalEntry[];
  spineGold?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative pl-[26px]">
      <div
        className={`absolute bottom-1 left-[6.5px] top-1 w-px ${
          spineGold ? 'bg-gilt-500/40' : 'bg-vellum-100/15'
        }`}
        aria-hidden
      />
      <div className="flex flex-col gap-3">
        {entries.map((e) => (
          <div key={e.id} className="relative">
            <span
              className={`absolute -left-[26px] top-3.5 bg-nave-900 py-[3px] ${
                spineGold ? 'text-gilt-300' : 'text-vellum-100/35'
              }`}
            >
              <Stone />
            </span>
            <EntryCard e={e} />
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}
