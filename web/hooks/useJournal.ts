'use client';

// Journal behavior — timeline list + entry detail (with its session), follow-up
// saving, edit, delete. Pure logic; components render.

import { useCallback, useEffect, useState } from 'react';
import type { JournalEntry, Session } from '@librato/shared';
import { getAuthedClient } from '@/lib/api';

type ListStatus = 'loading' | 'ready' | 'error' | 'unauthenticated';

export function useJournalList() {
  const [status, setStatus] = useState<ListStatus>('loading');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const client = await getAuthedClient();
      if (!client) {
        setStatus('unauthenticated');
        return;
      }
      setEntries(await client.getJournal());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { status, entries, reload: load };
}

export function useJournalEntry(entryId: string) {
  const [status, setStatus] = useState<ListStatus>('loading');
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const client = await getAuthedClient();
        if (!client) {
          setStatus('unauthenticated');
          return;
        }
        const e = await client.getJournalEntry(entryId);
        setEntry(e);
        if (e.session_id) {
          try {
            setSession(await client.getSession(e.session_id));
          } catch {
            // session unavailable — the entry still renders
          }
        }
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    })();
  }, [entryId]);

  /** "How did it turn out?" — saved into the first open follow-up slot. */
  const saveFollowUp = useCallback(
    async (text: string) => {
      if (!session || !text.trim()) return false;
      setBusy(true);
      try {
        const client = await getAuthedClient();
        if (!client) return false;
        const slot = !session.follow_up_1w_response
          ? 'follow_up_1w_response'
          : !session.follow_up_1m_response
            ? 'follow_up_1m_response'
            : 'follow_up_3m_response';
        const updated = await client.updateSession(session.id, { [slot]: text });
        setSession(updated);
        return true;
      } catch {
        return false;
      } finally {
        setBusy(false);
      }
    },
    [session],
  );

  const updateEntry = useCallback(
    async (patch: { title?: string; content?: string }) => {
      if (!entry) return false;
      setBusy(true);
      try {
        const client = await getAuthedClient();
        if (!client) return false;
        const updated = await client.updateJournalEntry(entry.id, patch);
        setEntry(updated);
        return true;
      } catch {
        return false;
      } finally {
        setBusy(false);
      }
    },
    [entry],
  );

  const deleteEntry = useCallback(async () => {
    if (!entry) return false;
    setBusy(true);
    try {
      const client = await getAuthedClient();
      if (!client) return false;
      await client.deleteJournalEntry(entry.id);
      return true;
    } catch {
      return false;
    } finally {
      setBusy(false);
    }
  }, [entry]);

  return { status, entry, session, busy, saveFollowUp, updateEntry, deleteEntry };
}
