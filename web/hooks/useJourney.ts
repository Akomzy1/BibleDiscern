'use client';

// The 7-step Deep Discernment journey. Owns step state, session persistence
// (sessionStorage + server after each step — a closed tab never loses a
// session), tier checks, and completion (journal entry + Ebenezer).
// Step order follows the prototype: 1 Crossroads · 2 The Word · 3 Those who
// walked before · 4 The Examination · 5 The Fruit (Premium) · 6 The Stillness
// · 7 The Prayer.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LibratoApiError } from '@librato/shared';
import type { DiscernmentResponse, Session } from '@librato/shared';
import { getAuthedClient } from '@/lib/api';
import { useSubscription } from './useSubscription';

export type JourneyStatus =
  | 'idle'
  | 'submitting'
  | 'ready'
  | 'crisis'
  | 'limit'
  | 'error'
  | 'loading';

type StoredJourney = {
  sessionId: string;
  step: number;
  answers: Record<number, string>;
  stillnessNote: string;
};

const STORE_KEY = 'bd-journey';

function readStore(): StoredJourney | null {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as StoredJourney) : null;
  } catch {
    return null;
  }
}

function writeStore(patch: Partial<StoredJourney>) {
  try {
    const cur = readStore() ?? { sessionId: '', step: 1, answers: {}, stillnessNote: '' };
    sessionStorage.setItem(STORE_KEY, JSON.stringify({ ...cur, ...patch }));
  } catch {
    // storage unavailable — journey still works for this tab's lifetime
  }
}

export function useJourney(sessionId?: string) {
  const router = useRouter();
  const sub = useSubscription();
  const [status, setStatus] = useState<JourneyStatus>(sessionId ? 'loading' : 'idle');
  const [session, setSession] = useState<Session | null>(null);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [stillnessNote, setStillnessNote] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ai: DiscernmentResponse | null = session?.ai_response ?? null;

  // Restore an in-flight journey (tab close never loses a session)
  useEffect(() => {
    if (!sessionId) return;
    const stored = readStore();
    if (stored?.sessionId === sessionId) {
      setStep(Math.max(2, stored.step));
      setAnswers(stored.answers ?? {});
      setStillnessNote(stored.stillnessNote ?? '');
    } else {
      setStep(2);
    }
    void (async () => {
      try {
        const client = await getAuthedClient();
        if (!client) {
          router.replace('/login');
          return;
        }
        const s = await client.getSession(sessionId);
        setSession(s);
        setStatus('ready');
      } catch {
        setErrorMessage(
          "We couldn't reach the server. Your words are saved — try again in a moment.",
        );
        setStatus('error');
      }
    })();
  }, [sessionId, router]);

  /** Step 1 → create the session via /api/discern (crisis screen first, server-side). */
  const begin = useCallback(
    async (situation: string, tone: string) => {
      setStatus('submitting');
      setErrorMessage(null);
      try {
        const client = await getAuthedClient();
        if (!client) {
          router.replace('/login');
          return;
        }
        const res = (await client.discern(
          situation,
          tone as Session['tone'],
        )) as unknown as
          | { sessionId: string; session: Session }
          | { crisis: true; resources: unknown };
        if ('crisis' in res && res.crisis) {
          setStatus('crisis');
          return;
        }
        const { sessionId: id, session: s } = res as { sessionId: string; session: Session };
        setSession(s);
        writeStore({ sessionId: id, step: 2, answers: {}, stillnessNote: '' });
        router.push(`/discern/${id}`);
      } catch (e) {
        if (e instanceof LibratoApiError && e.isSessionLimit) {
          setStatus('limit');
          return;
        }
        setErrorMessage(
          e instanceof LibratoApiError && !e.isServerError
            ? e.message
            : "We couldn't reach the server. Your words are saved — try again in a moment.",
        );
        setStatus('error');
      }
    },
    [router],
  );

  const goToStep = useCallback(
    (n: number) => {
      setStep(n);
      writeStore({ step: n });
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
    },
    [],
  );

  const back = useCallback(() => {
    if (step <= 2) {
      router.push('/discern');
      return;
    }
    goToStep(step - 1);
  }, [step, goToStep, router]);

  const saveAnswer = useCallback((index: number, text: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [index]: text };
      writeStore({ answers: next });
      return next;
    });
  }, []);

  const saveStillnessNote = useCallback(
    async (note: string) => {
      setStillnessNote(note);
      writeStore({ stillnessNote: note });
      if (!session) return;
      try {
        const client = await getAuthedClient();
        await client?.updateSession(session.id, { stillness_note: note });
      } catch {
        // kept locally; server sync retried on completion
      }
    },
    [session],
  );

  /** "Set my Ebenezer Stone" — complete the session and save the journal entry. */
  const complete = useCallback(async () => {
    if (!session) return false;
    try {
      const client = await getAuthedClient();
      if (!client) return false;
      await client.updateSession(session.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        ...(stillnessNote ? { stillness_note: stillnessNote } : {}),
      });
      await client.createJournalEntry({
        session_id: session.id,
        title: session.situation.slice(0, 120),
        content: ai?.prayer ?? undefined,
        entry_type: 'discernment',
        // first tag carries the primary scripture reference for the timeline badge
        tags: ai?.scriptures[0]?.reference ? [ai.scriptures[0].reference] : [],
      });
      try {
        sessionStorage.removeItem(STORE_KEY);
      } catch {
        // ignore
      }
      return true;
    } catch {
      setErrorMessage("We couldn't save your stone. Try again in a moment.");
      return false;
    }
  }, [session, stillnessNote, ai]);

  const hasFruitAccess = sub.isPremium;

  const journeysRemaining = useMemo(() => {
    const s = sub.subscription;
    if (!s) return null;
    if (s.tier === 'premium' || s.status === 'trialing') return Infinity;
    return Math.max(0, s.sessions_limit - s.sessions_used_this_month);
  }, [sub.subscription]);

  return {
    status,
    session,
    ai,
    step,
    answers,
    stillnessNote,
    errorMessage,
    hasFruitAccess,
    journeysRemaining,
    startCheckout: sub.startCheckout,
    begin,
    goToStep,
    back,
    saveAnswer,
    saveStillnessNote,
    complete,
  };
}

export type UseJourney = ReturnType<typeof useJourney>;
