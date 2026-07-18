'use client';

// Settings behavior: profile + preferences. Sound cues live in localStorage
// (off by default); notifications toggle drives the Web Push subscription.

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile } from '@librato/shared';
import { getAuthedClient } from '@/lib/api';
import { getBrowserClient } from '@/lib/supabase/browser';
import { usePush } from './usePush';

const SOUND_KEY = 'bd-sound-cues';

export function useSettings() {
  const router = useRouter();
  const push = usePush();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unauthenticated'>(
    'loading',
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(false);
  const [soundCues, setSoundCues] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const supabase = getBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setStatus('unauthenticated');
          router.replace('/login');
          return;
        }
        setEmail(session.user.email ?? null);
        const client = await getAuthedClient();
        if (client) setProfile(await client.getProfile());
        setNotifications(
          typeof Notification !== 'undefined' && Notification.permission === 'granted',
        );
        try {
          setSoundCues(localStorage.getItem(SOUND_KEY) === 'on');
        } catch {
          // storage unavailable
        }
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    })();
  }, [router]);

  const setScaleTime = useCallback(async (time: string) => {
    setProfile((p) => (p ? { ...p, daily_scale_time: time } : p));
    try {
      const client = await getAuthedClient();
      await client?.updateProfile({ daily_scale_time: time });
    } catch {
      // keep optimistic value; next save retries
    }
  }, []);

  const toggleNotifications = useCallback(
    async (on: boolean) => {
      setBusy(true);
      if (on) {
        const ok = await push.subscribe();
        setNotifications(ok);
      } else {
        await push.unsubscribe();
        setNotifications(false);
      }
      setBusy(false);
    },
    [push],
  );

  const toggleSoundCues = useCallback((on: boolean) => {
    setSoundCues(on);
    try {
      localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
    } catch {
      // storage unavailable
    }
  }, []);

  const signOut = useCallback(async () => {
    await getBrowserClient().auth.signOut();
    router.push('/login');
  }, [router]);

  return {
    status,
    profile,
    email,
    notifications,
    soundCues,
    busy,
    setScaleTime,
    toggleNotifications,
    toggleSoundCues,
    signOut,
  };
}
