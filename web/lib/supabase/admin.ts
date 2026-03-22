import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — bypasses RLS.
 * Use ONLY in server-side code for:
 *   - Webhook handlers (Stripe, RevenueCat)
 *   - Writing subscription rows on behalf of users
 *   - Cron jobs (follow-up emails)
 *   - Receipt validation
 *
 * NEVER expose this client to the browser or return it in responses.
 */
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
