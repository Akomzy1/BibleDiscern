import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';
import { stripe, APP_URL } from '@/lib/stripe';

// Stripe Customer Portal — subscription management ("Manage billing" in Settings).
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    const { data: profile } = await adminClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    const customerId = profile?.stripe_customer_id as string | null;
    if (!customerId) {
      return err('not_found', 'No billing account found for this user.', 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/settings`,
    });

    return ok({ url: session.url });
  } catch (e) {
    return handleError(e);
  }
}
