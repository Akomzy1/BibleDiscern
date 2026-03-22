import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client scoped to the user's JWT.
 * RLS policies apply — user can only access their own rows.
 * Use this for reads/writes where you want RLS enforcement.
 */
export function createServerClient(authToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
