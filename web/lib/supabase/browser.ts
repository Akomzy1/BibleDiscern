'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client (anon key, cookie-backed session).
 * Used by the PWA for auth + passing the session access token to the
 * frozen API contracts via @librato/shared's api client.
 */
let client: ReturnType<typeof createBrowserClient> | undefined;

export function getBrowserClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
