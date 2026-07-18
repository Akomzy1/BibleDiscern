'use client';

// Discern hub — past journeys + the quiet entry into a new one.
// (Empty-state frame refined in Stage 8.)

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Session } from '@librato/shared';
import { Eyebrow, GiltButton, Panel, StatusChip, VellumGrain } from '@/components/selah';
import { getAuthedClient } from '@/lib/api';

export default function DiscernHubPage() {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unauthenticated'>(
    'loading',
  );

  useEffect(() => {
    void (async () => {
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
    })();
  }, []);

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

      {status === 'ready' && sessions && sessions.length === 0 && (
        <Panel tone="navy" className="mt-8 p-6 text-center">
          <p className="font-scripture text-[17px] italic text-vellum-200/80">
            No journeys yet. The first step is naming what you carry.
          </p>
        </Panel>
      )}

      {status === 'error' && (
        <p className="mt-8 text-center font-body text-sm text-vellum-200/60">
          We couldn&apos;t reach the server. Your words are saved — try again in a moment.
        </p>
      )}
    </main>
  );
}
