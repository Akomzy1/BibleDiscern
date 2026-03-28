import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import { getCached, setCached } from '@/lib/cache';
import type { DailyScale, DailyScalePhase, DailyScaleResults } from '@librato/shared';

// ─── Cache helpers ───────────────────────────────────────────────────────────

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function todayKey(): string {
  return `daily_scale_${new Date().toISOString().split('T')[0]}`;
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface ScaleStore {
  scale: DailyScale | null;
  hasVoted: boolean;
  userVote: 'a' | 'b' | null;
  results: DailyScaleResults | null;
  phase: DailyScalePhase;
  isLoading: boolean;

  fetchTodayScale: () => Promise<void>;
  castVote: (scaleId: string, vote: 'a' | 'b') => Promise<void>;
  setPhase: (phase: DailyScalePhase) => void;
}

interface CachedScaleState {
  scale: DailyScale | null;
  hasVoted: boolean;
  userVote: 'a' | 'b' | null;
  results: DailyScaleResults | null;
  phase: DailyScalePhase;
}

export const useScaleStore = create<ScaleStore>()((set, get) => ({
  scale: null,
  hasVoted: false,
  userVote: null,
  results: null,
  phase: 'weigh',
  isLoading: false,

  fetchTodayScale: async () => {
    // Show cached data instantly while fetching
    const cached = await getCached<CachedScaleState>(todayKey());
    if (cached) {
      set({
        scale: cached.scale,
        hasVoted: cached.hasVoted,
        userVote: cached.userVote ?? null,
        results: cached.results ?? null,
        phase: cached.phase,
      });
    }

    set({ isLoading: true });
    try {
      const resp = await apiClient.getDailyScale();
      const phase: DailyScalePhase = resp.hasVoted ? 'learn' : 'weigh';

      set({
        scale: resp.scale,
        hasVoted: resp.hasVoted,
        userVote: resp.userVote ?? null,
        results: resp.results ?? null,
        phase,
      });

      await setCached<CachedScaleState>(
        todayKey(),
        {
          scale: resp.scale,
          hasVoted: resp.hasVoted,
          userVote: resp.userVote ?? null,
          results: resp.results ?? null,
          phase,
        },
        msUntilMidnight(),
      );
    } catch {
      // Non-fatal — cached state shown if available
    } finally {
      set({ isLoading: false });
    }
  },

  castVote: async (scaleId, vote) => {
    set({ isLoading: true });
    try {
      const resp = await apiClient.castScaleVote(scaleId, vote);
      const state: CachedScaleState = {
        scale: resp.scale,
        hasVoted: true,
        userVote: vote,
        results: resp.results ?? null,
        phase: 'see', // land on SEE phase after voting (user goes see → learn)
      };
      set({ ...state, isLoading: false });
      await setCached<CachedScaleState>(todayKey(), state, msUntilMidnight());
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  setPhase: (phase) => {
    set({ phase });
    // Persist phase change so returning to home shows correct state
    const { scale, hasVoted, userVote, results } = get();
    setCached<CachedScaleState>(
      todayKey(),
      { scale, hasVoted, userVote, results, phase },
      msUntilMidnight(),
    ).catch(() => {});
  },
}));
