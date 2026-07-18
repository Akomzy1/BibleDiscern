'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LibratoApiError } from '@librato/shared';
import type { DailyScaleResponse } from '@librato/shared';
import { getAuthedClient } from '@/lib/api';

export type ScalePhase = 'weigh' | 'see' | 'learn' | 'completed';
export type ScaleStatus = 'loading' | 'ready' | 'error' | 'offline' | 'unauthenticated';

export type UseDailyScale = ReturnType<typeof useDailyScale>;

/**
 * Owns the Daily Scale behavior: fetching today's scale, vote selection,
 * phase (weigh → see → learn / completed-collapsed), and the optimistic vote
 * via /api/daily-scale/vote. Pure logic — no rendering, no DOM.
 */
export function useDailyScale() {
  const [status, setStatus] = useState<ScaleStatus>('loading');
  const [data, setData] = useState<DailyScaleResponse | null>(null);
  const [phase, setPhase] = useState<ScalePhase>('weigh');
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getClient = getAuthedClient;

  const load = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const client = await getClient();
      if (!client) {
        setStatus('unauthenticated');
        return;
      }
      const res = await client.getDailyScale();
      setData(res);
      setPhase(res.hasVoted ? 'completed' : 'weigh');
      setStatus('ready');
    } catch (e) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setStatus('offline');
        return;
      }
      if (e instanceof LibratoApiError && e.isAuthError) {
        setStatus('unauthenticated');
        return;
      }
      setErrorMessage(
        "We couldn't reach the server. Your words are saved — try again in a moment.",
      );
      setStatus('error');
    }
  }, [getClient]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectSide = useCallback(
    (side: 'a' | 'b') => {
      if (phase !== 'weigh' || submitting) return;
      setSelected((prev) => (prev === side ? null : side));
    },
    [phase, submitting],
  );

  const confirmVote = useCallback(async () => {
    if (!data || !selected || submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const client = await getClient();
      if (!client) {
        setStatus('unauthenticated');
        return;
      }
      const res = await client.castScaleVote(data.scale.id, selected);
      setData(res);
      setPhase('see');
    } catch (e) {
      if (e instanceof LibratoApiError && e.code === 'already_voted') {
        // Someone voted from another tab/device — reload the truth
        await load();
        return;
      }
      setErrorMessage(
        "We couldn't record your choice. Your selection is kept — try again in a moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [data, selected, submitting, getClient, load]);

  const goToLearn = useCallback(() => setPhase('learn'), []);
  const collapse = useCallback(() => setPhase('completed'), []);

  const isMajority = useMemo(() => {
    if (!data?.results || !data.userVote) return null;
    const mine = data.userVote === 'a' ? data.results.percent_a : data.results.percent_b;
    return mine >= 50;
  }, [data]);

  return {
    status,
    data,
    phase,
    selected,
    submitting,
    errorMessage,
    isMajority,
    selectSide,
    confirmVote,
    goToLearn,
    collapse,
    reload: load,
  };
}
