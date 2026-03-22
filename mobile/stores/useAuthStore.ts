import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { setApiAuthToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  isLoading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, isLoading: false });

    if (session?.access_token) {
      setApiAuthToken(session.access_token);
    }

    // Listen for auth state changes (token refresh, sign out, etc.)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
      setApiAuthToken(session?.access_token ?? null);
    });
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setApiAuthToken(data.session?.access_token ?? null);
    set({ session: data.session, user: data.user });
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    setApiAuthToken(data.session?.access_token ?? null);
    set({ session: data.session, user: data.user ?? null });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    setApiAuthToken(null);
    set({ session: null, user: null });
  },
}));
