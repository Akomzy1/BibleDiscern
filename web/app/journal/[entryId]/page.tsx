'use client';

// Entry detail — situation panel, drop-cap scriptures, olive stillness note,
// gilt-top prayer card, "How did it turn out?" follow-up, secondary actions
// (Share scripture = Premium, Edit, Delete = ember). No tab bar. (Frame B)

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eyebrow, GiltButton, Panel, PrayerCard, ScriptureBlock, TextArea } from '@/components/selah';
import { TypeChip } from '@/components/journal/Timeline';
import { useJournalEntry } from '@/hooks/useJournal';
import { useSubscription } from '@/hooks/useSubscription';

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-0.5 mb-2 mt-5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-vellum-200/60">
      {children}
    </p>
  );
}

export default function JournalEntryPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = use(params);
  const router = useRouter();
  const d = useJournalEntry(entryId);
  const sub = useSubscription();
  const [followUp, setFollowUp] = useState('');
  const [followUpSaved, setFollowUpSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (d.status === 'loading') {
    return <div className="min-h-screen animate-pulse bg-nave-900" aria-busy />;
  }
  if (d.status !== 'ready' || !d.entry) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-nave-900 px-6 text-center">
        <p className="font-body text-sm text-vellum-200/70">
          We couldn&apos;t find that stone. It may have been removed.
        </p>
        <Link href="/journal" className="mt-4 font-body text-sm font-semibold text-gilt-500 underline underline-offset-4">
          Back to Journal
        </Link>
      </div>
    );
  }

  const e = d.entry;
  const ai = d.session?.ai_response ?? null;
  const date = new Date(e.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const shareScripture = async () => {
    if (!sub.isPremium) {
      router.push('/upgrade');
      return;
    }
    const s = ai?.scriptures[0];
    if (!s) return;
    const text = `"${s.text}" — ${s.reference}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
    } catch {
      // cancelled — nothing to do
    }
  };

  return (
    <div className="min-h-screen bg-nave-900 text-vellum-100">
      <div className="mx-auto w-full max-w-[640px] px-4 pb-10 pt-safe">
        <Link
          href="/journal"
          className="flex min-h-[44px] items-center gap-1.5 py-0.5 font-body text-[13px] font-semibold text-vellum-200/60 transition-colors duration-whisper ease-selah hover:text-vellum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="m15 6-6 6 6 6" />
          </svg>
          Journal
        </Link>

        <div className="px-0.5 pt-3">
          <div className="flex items-center gap-2.5">
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-vellum-200/60">
              {date}
            </span>
            <TypeChip type={e.entry_type} />
          </div>
          {editing ? (
            <div className="mt-3 grid gap-3">
              <TextArea
                onNavy
                rows={2}
                aria-label="Title"
                value={editTitle}
                onChange={(ev) => setEditTitle(ev.target.value)}
              />
              <TextArea
                onNavy
                rows={4}
                aria-label="Content"
                value={editContent}
                onChange={(ev) => setEditContent(ev.target.value)}
              />
              <div className="flex gap-2.5">
                <GiltButton
                  disabled={d.busy}
                  onClick={() =>
                    void d
                      .updateEntry({ title: editTitle, content: editContent })
                      .then((ok) => ok && setEditing(false))
                  }
                >
                  Save
                </GiltButton>
                <GiltButton variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </GiltButton>
              </div>
            </div>
          ) : (
            <h1 className="mt-2.5 font-scripture text-[23px] font-medium italic leading-[1.35] text-vellum-100">
              {e.title ?? 'Untitled stone'}
            </h1>
          )}
        </div>

        {d.session && (
          <>
            <SectionEyebrow>The situation</SectionEyebrow>
            <Panel className="px-[18px] py-4">
              <p className="font-body text-sm leading-[1.6] text-ink-900">{d.session.situation}</p>
            </Panel>
          </>
        )}

        {ai && ai.scriptures.length > 0 && (
          <>
            <SectionEyebrow>Scriptures received</SectionEyebrow>
            <Panel className="px-[18px] py-4">
              {ai.scriptures.map((s, i) => (
                <div key={s.reference}>
                  {i > 0 && <div className="my-3.5 h-px bg-ink-900/10" />}
                  <ScriptureBlock>{s.text}</ScriptureBlock>
                  <p className="mt-2 font-body text-sm text-ink-500">— {s.reference}</p>
                </div>
              ))}
            </Panel>
          </>
        )}

        {d.session?.stillness_note && (
          <>
            <SectionEyebrow>From the Stillness</SectionEyebrow>
            <div className="relative overflow-hidden rounded-panel border-l-[3px] border-olive-500 bg-vellum-100 px-4 py-3.5">
              <p className="font-body text-[13.5px] italic leading-[1.6] text-ink-900">
                {d.session.stillness_note}
              </p>
            </div>
          </>
        )}

        {(ai?.prayer || (!d.session && e.content)) && (
          <>
            <SectionEyebrow>{ai?.prayer ? 'The prayer' : 'The entry'}</SectionEyebrow>
            <PrayerCard>{ai?.prayer ?? e.content ?? ''}</PrayerCard>
          </>
        )}

        {d.session && (
          <>
            <SectionEyebrow>How did it turn out?</SectionEyebrow>
            {followUpSaved ? (
              <p className="font-scripture text-base italic text-olive-500">
                Saved. The stone remembers.
              </p>
            ) : (
              <>
                <TextArea
                  onNavy
                  rows={3}
                  placeholder="Return to this stone when the road has bent. What did God do?"
                  aria-label="How did it turn out?"
                  value={followUp}
                  onChange={(ev) => setFollowUp(ev.target.value)}
                />
                <div className="mt-2.5">
                  <button
                    type="button"
                    disabled={d.busy || !followUp.trim()}
                    onClick={() =>
                      void d.saveFollowUp(followUp).then((ok) => ok && setFollowUpSaved(true))
                    }
                    className="min-h-[44px] w-full rounded-panel bg-nave-700 font-body text-[15px] font-semibold text-vellum-100 transition-colors duration-whisper ease-selah hover:bg-nave-700/80 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
                  >
                    Save follow-up
                  </button>
                </div>
              </>
            )}
          </>
        )}

        <div className="mt-5 flex items-center justify-center gap-[18px] pb-1.5">
          <button
            type="button"
            onClick={() => void shareScripture()}
            className="inline-flex min-h-[44px] items-center gap-1.5 font-body text-[13px] font-semibold text-vellum-200/60 transition-colors duration-whisper ease-selah hover:text-vellum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
          >
            Share scripture
            {!sub.isPremium && (
              <span className="rounded-pill border border-gilt-500/40 px-1.5 py-px font-body text-[9.5px] font-bold uppercase tracking-[0.1em] text-gilt-300">
                Premium
              </span>
            )}
          </button>
          <span className="text-vellum-100/25">·</span>
          <button
            type="button"
            onClick={() => {
              setEditTitle(e.title ?? '');
              setEditContent(e.content ?? '');
              setEditing(true);
            }}
            className="inline-flex min-h-[44px] items-center font-body text-[13px] font-semibold text-vellum-200/60 transition-colors duration-whisper ease-selah hover:text-vellum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
          >
            Edit
          </button>
          <span className="text-vellum-100/25">·</span>
          <button
            type="button"
            onClick={() => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              void d.deleteEntry().then((ok) => ok && router.push('/journal'));
            }}
            className="inline-flex min-h-[44px] items-center font-body text-[13px] font-semibold text-ember-600 transition-colors duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-600"
          >
            {confirmDelete ? 'Tap again to delete' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
