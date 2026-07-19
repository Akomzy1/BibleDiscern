'use client';

// Auth behavior — Supabase email/password. Pure logic; pages render.

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase/browser';
import { getAuthedClient } from '@/lib/api';

const GENERIC_ERROR =
  "We couldn't reach the server. Your words are saved — try again in a moment.";

/** After auth, route to onboarding until it's completed, then Today. */
export async function routeAfterAuth(): Promise<string> {
  try {
    const client = await getAuthedClient();
    if (!client) return '/login';
    const profile = await client.getProfile();
    return profile.onboarding_completed ? '/today' : '/onboarding';
  } catch {
    return '/today';
  }
}

export function useAuth() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const signUp = useCallback(
    async (email: string, password: string) => {
      setBusy(true);
      setError(null);
      try {
        const supabase = getBrowserClient();
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) {
          setError(err.message);
          return;
        }
        if (data.session) {
          router.push('/onboarding');
        } else {
          setNotice(`We sent a confirmation link to ${email}. Open it to continue.`);
        }
      } catch {
        setError(GENERIC_ERROR);
      } finally {
        setBusy(false);
      }
    },
    [router],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setBusy(true);
      setError(null);
      try {
        const supabase = getBrowserClient();
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          setError(err.message);
          return;
        }
        router.push(await routeAfterAuth());
      } catch {
        setError(GENERIC_ERROR);
      } finally {
        setBusy(false);
      }
    },
    [router],
  );

  const resetPassword = useCallback(async (email: string) => {
    setBusy(true);
    setError(null);
    try {
      const supabase = getBrowserClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (err) {
        setError(err.message);
        return false;
      }
      return true;
    } catch {
      setError(GENERIC_ERROR);
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  return { busy, error, notice, signUp, signIn, resetPassword };
}
