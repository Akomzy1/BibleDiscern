import { NextRequest } from 'next/server';
import { CheckoutRequestSchema } from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';
import { stripe, priceIdForPlan, APP_URL } from '@/lib/stripe';

// Sacred Seven Trial: 7-day free trial via Stripe Checkout.
// Copy everywhere reads "Free for 7 days. Cancel anytime." — a card IS required.
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();
    const { plan } = CheckoutRequestSchema.parse(body);

    // Find or create the Stripe customer for this user
    const { data: profile } = await adminClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id as string | null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await adminClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { supabase_user_id: user.id },
      },
      success_url: `${APP_URL}/today?checkout=success`,
      cancel_url: `${APP_URL}/upgrade?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return err('server_error', 'Could not start checkout. Please try again.', 500);
    }
    return ok({ url: session.url });
  } catch (e) {
    return handleError(e);
  }
}
