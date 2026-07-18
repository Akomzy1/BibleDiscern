'use client';

import { createApiClient } from '@librato/shared';
import { getBrowserClient } from '@/lib/supabase/browser';

/**
 * Returns a @librato/shared api client bound to the current Supabase session
 * token, or null when signed out. All app data flows through the frozen API
 * contracts — never through direct table access from the client.
 */
export async function getAuthedClient() {
  const supabase = getBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  return createApiClient('', session.access_token);
}
