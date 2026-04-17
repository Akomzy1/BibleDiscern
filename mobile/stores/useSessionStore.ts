import { create } from 'zustand';
import type { Session } from '@librato/shared';
import { apiClient } from '@/lib/api';

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  isCreating: boolean;

  fetchSessions: () => Promise<void>;
  fetchSession: (id: string) => Promise<Session>;
  createSession: (situation: string, tone: Session['tone']) => Promise<Session>;
  updateSession: (id: string, data: Partial<Session>) => Promise<void>;
  setCurrentSession: (session: Session | null) => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  isCreating: false,

  fetchSessions: async () => {
    set({ isLoading: true });
    try {
      const sessions = await apiClient.getSessions();
      set({ sessions });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSession: async (id: string) => {
    const session = await apiClient.getSession(id);
    set({ currentSession: session });
    return session;
  },

  createSession: async (situation, tone) => {
    set({ isCreating: true });
    try {
      const { session } = await apiClient.discern(situation, tone);
      set((state) => ({
        currentSession: session,
        sessions: [session, ...state.sessions],
      }));
      return session;
    } finally {
      set({ isCreating: false });
    }
  },

  updateSession: async (id, data) => {
    const updated = await apiClient.updateSession(id, data);
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? updated : s)),
      currentSession: state.currentSession?.id === id ? updated : state.currentSession,
    }));
  },

  setCurrentSession: (session) => set({ currentSession: session }),
}));
