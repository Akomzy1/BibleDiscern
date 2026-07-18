'use client';

// Journal timeline — full (Premium), free-tier (3 crisp + blurred rest under
// the upgrade card), and empty states. (docs/prototypes/journal.html)

import Link from 'next/link';
import type { JournalEntry } from '@librato/shared';
import { TRIAL_LINE } from '@librato/shared';
import { Eyebrow, GiltButton, VellumGrain } from '@/components/selah';
import { Timeline, EntryCard, Stone } from '@/components/journal/Timeline';
import { InstallCard } from '@/components/common/InstallCard';
import { useJournalList } from '@/hooks/useJournal';
import { useSubscription } from '@/hooks/useSubscription';

function Header({ entries }: { entries: JournalEntry[] }) {
  const n = entries.length;
  const oldest = entries[entries.length - 1];
  const since = oldest
    ? new Date(oldest.created_at).toLocaleDateString('en-US', { month: 'long' })
    : null;
  const words = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve',
  ];
  const count = n <= 12 ? words[n] : String(n);
  return (
    <div className="px-0.5 pb-3.5 pt-2">
      <Eyebrow>Journal</Eyebrow>
      <h1 className="mt-2 font-display text-[26px] font-medium leading-[1.15] text-vellum-100">
        Your Ebenezer Stones
      </h1>
      {n > 0 && (
        <p className="mt-1.5 font-body text-[12.5px] text-vellum-200/60">
          {count} stone{n === 1 ? '' : 's'} set{since ? ` since ${since}` : ''}. Thus far the Lord
          has helped us.
        </p>
      )}
    </div>
  );
}

// Blurred placeholders behind the free-tier upgrade card (real entries beyond
// three are withheld by the API for free accounts).
const LOCKED_PLACEHOLDERS = [
  {
    id: 'locked-1',
    user_id: '',
    session_id: null,
    title: 'A stone kept for you',
    content: 'Every scripture, every stillness, every answer.',
    entry_type: 'discernment',
    tags: ['Psalm 37:5'],
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'locked-2',
    user_id: '',
    session_id: null,
    title: 'Another stone waits here',
    content: 'Set the stone before the answer felt settled.',
    entry_type: 'reflection',
    tags: ['Psalm 46:10'],
    created_at: new Date(0).toISOString(),
  },
] as JournalEntry[];

function FreeTierLock() {
  const sub = useSubscription();
  return (
    <div className="relative mt-3 min-h-[240px] pl-[26px]">
      <div className="absolute bottom-0 left-[6.5px] top-0 w-px bg-vellum-100/15" aria-hidden />
      <div className="flex flex-col gap-3" aria-hidden>
        {LOCKED_PLACEHOLDERS.map((e) => (
          <EntryCard key={e.id} e={e} blur />
        ))}
      </div>
      <div
        className="absolute -inset-x-1 -inset-y-1.5 flex items-center justify-center"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,33,58,0) 0%, rgba(20,33,58,.55) 26%, rgba(20,33,58,.72) 100%)',
        }}
      >
        <div className="relative mx-[18px] overflow-hidden rounded-panel border border-gilt-500/25 bg-vellum-200 px-5 py-[18px] text-center shadow-glow">
          <VellumGrain />
          <div className="relative">
            <span className="inline-flex justify-center text-gilt-700">
              <Stone size={18} />
            </span>
            <p className="mt-2 font-scripture text-[17px] font-medium italic leading-[1.4] text-ink-900">
              Your full spiritual autobiography is waiting.
            </p>
            <p className="mt-1.5 font-body text-[12.5px] leading-normal text-ink-500">
              More stones — every scripture, every stillness, every answer.
            </p>
            <div className="mt-3.5">
              <GiltButton fullWidth disabled={sub.busy} onClick={() => void sub.startCheckout('annual')}>
                Start free trial
              </GiltButton>
            </div>
            <p className="mt-2 font-body text-[11.5px] text-ink-500">{TRIAL_LINE}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-7 pb-16 pt-10 text-center">
      <span className="text-gilt-300">
        <Stone size={34} strokeWidth={1} />
      </span>
      <p className="mt-[22px] max-w-[280px] font-scripture text-[21px] font-medium italic leading-[1.45] text-vellum-100">
        Your first stone hasn&apos;t been set yet. It will be.
      </p>
      <p className="mt-2.5 max-w-[280px] font-body text-[13px] leading-[1.55] text-vellum-200/60">
        When a decision settles, you&apos;ll set a stone here — a record of where God met you.
      </p>
      <div className="mt-[22px]">
        <Link href="/discern/new">
          <GiltButton variant="secondary">Begin a discernment</GiltButton>
        </Link>
      </div>
    </div>
  );
}

export default function JournalPage() {
  const list = useJournalList();
  const sub = useSubscription();
  const isFreeCapped = sub.status === 'ready' && !sub.isPremium && list.entries.length >= 3;

  if (list.status === 'loading' || sub.status === 'loading') {
    return (
      <main aria-busy>
        <Header entries={[]} />
        <div className="mt-4 grid gap-3">
          <div className="h-24 animate-pulse rounded-panel bg-nave-800" />
          <div className="h-24 animate-pulse rounded-panel bg-nave-800" />
        </div>
      </main>
    );
  }

  if (list.status === 'error') {
    return (
      <main>
        <Header entries={[]} />
        <p className="mt-8 text-center font-body text-sm text-vellum-200/60">
          We couldn&apos;t reach the server. Your words are saved — try again in a moment.
        </p>
        <div className="mx-auto mt-4 max-w-[200px]">
          <GiltButton variant="secondary" fullWidth onClick={() => void list.reload()}>
            Try again
          </GiltButton>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] flex-col">
      <Header entries={list.entries} />
      {list.entries.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Timeline entries={list.entries.slice(0, isFreeCapped ? 3 : undefined)} spineGold={!isFreeCapped} />
          {isFreeCapped && <FreeTierLock />}
          {/* Install affordance — after the first journey has set a stone */}
          <InstallCard className="mt-6" />
        </>
      )}
    </main>
  );
}
