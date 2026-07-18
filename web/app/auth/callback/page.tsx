'use client';

// OAuth (PKCE) landing — the browser client exchanges ?code automatically via
// detectSessionInUrl; we wait for the session, then route by onboarding state.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase/browser';
import { routeAfterAuth } from '@/hooks/useAuth';
import { Beam, Eyebrow } from '@/components/selah';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getBrowserClient();
    let done = false;

    const go = async () => {
      if (done) return;
      done = true;
      router.replace(await routeAfterAuth());
    };

    // If the session is already in place, go immediately; else wait for the event
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void go();
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') void go();
    });
    const timeout = setTimeout(() => {
      if (!done) router.replace('/login');
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-nave-800 text-center">
      <Eyebrow>One moment</Eyebrow>
      <Beam sway className="my-4" />
      <p className="font-body text-sm text-vellum-200/70">Preparing your place…</p>
    </main>
  );
}
