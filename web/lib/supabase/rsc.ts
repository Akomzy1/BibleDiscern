import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Cookie-backed Supabase client for React Server Components.
 * The PWA signs in with @supabase/ssr's browser client (cookie session), so a
 * server component can read that same session to gate a route. Read-only: this
 * client never sets cookies (RSCs can't), which is fine for guard checks.
 */
export async function createRscClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          /* no-op — a server component cannot mutate cookies */
        },
      },
    },
  );
}
