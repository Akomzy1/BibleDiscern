import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { isAdminEmail } from '@/lib/admin';

/**
 * Cookie-backed Supabase client for React Server Components.
 * The PWA signs in with @supabase/ssr's browser client (cookie session), so a
 * server component can read that same session to gate a route.
 *
 * NOTE: @supabase/ssr@0.3.x uses the singular get/set/remove cookie API — NOT
 * getAll/setAll (that's ≥0.5). Providing the wrong shape makes the client read
 * no cookies at all ("Auth session missing!"). set/remove are no-ops because a
 * server component cannot mutate cookies; reads are all the guard needs.
 */
export async function createRscClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          /* no-op — a server component cannot mutate cookies */
        },
        remove() {
          /* no-op — a server component cannot mutate cookies */
        },
      },
    },
  );
}

/**
 * Server-component guard for /admin routes: read the cookie session, check it
 * against ADMIN_EMAILS, and 404 for anyone else. Called by the admin layout AND
 * by each admin page before it queries — so service-role reads only ever run
 * after the allowlist check has passed.
 */
export async function requireAdminRSC() {
  const supabase = await createRscClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) notFound();
  return user;
}
