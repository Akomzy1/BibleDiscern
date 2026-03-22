import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminClient } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

// Stripe requires the raw body bytes for signature verification —
// do NOT parse this route with JSON middleware.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('[stripe webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'invoice.paid': {
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      }
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      }
      case 'customer.subscription.trial_will_end': {
        // Informational — log for now, could trigger an email in Stage 6
        console.info('[stripe] Trial ending soon for subscription:', (event.data.object as Stripe.Subscription).id);
        break;
      }
      default:
        // Unhandled event type — acknowledge receipt to avoid Stripe retries
        break;
    }
  } catch (err) {
    console.error('[stripe webhook] Handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Handlers ────────────────────────────────────────────────────────────────

async function getUserIdFromStripeCustomer(customerId: string): Promise<string | null> {
  const { data } = await adminClient
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
  return data?.id ?? null;
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.customer || typeof invoice.customer !== 'string') return;

  const userId = await getUserIdFromStripeCustomer(invoice.customer);
  if (!userId) {
    console.warn('[stripe] No user found for customer:', invoice.customer);
    return;
  }

  const subscription = invoice.subscription
    ? await stripe.subscriptions.retrieve(invoice.subscription as string)
    : null;

  if (!subscription) return;

  const priceId = subscription.items.data[0]?.price?.id;
  const billingInterval =
    priceId === process.env.STRIPE_PRICE_ID_PREMIUM_ANNUAL ? 'year' : 'month';

  await adminClient.from('subscriptions').update({
    tier: 'premium',
    status: 'active',
    source: 'stripe',
    billing_interval: billingInterval,
    stripe_subscription_id: subscription.id,
    sessions_limit: 9999,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  }).eq('user_id', userId);

  await adminClient
    .from('profiles')
    .update({ subscription_tier: 'premium', stripe_customer_id: invoice.customer })
    .eq('id', userId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  if (!subscription.customer || typeof subscription.customer !== 'string') return;

  const userId = await getUserIdFromStripeCustomer(subscription.customer);
  if (!userId) return;

  const status = subscription.status;
  const tier =
    status === 'active' || status === 'trialing' ? 'premium' : 'free';

  await adminClient.from('subscriptions').update({
    tier,
    status: mapStripeStatus(status),
    stripe_subscription_id: subscription.id,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    sessions_limit: tier === 'premium' ? 9999 : 1,
  }).eq('user_id', userId);

  await adminClient
    .from('profiles')
    .update({ subscription_tier: tier })
    .eq('id', userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  if (!subscription.customer || typeof subscription.customer !== 'string') return;

  const userId = await getUserIdFromStripeCustomer(subscription.customer);
  if (!userId) return;

  await adminClient.from('subscriptions').update({
    tier: 'free',
    status: 'cancelled',
    sessions_limit: 1,
  }).eq('user_id', userId);

  await adminClient
    .from('profiles')
    .update({ subscription_tier: 'free' })
    .eq('id', userId);
}

function mapStripeStatus(
  status: Stripe.Subscription.Status,
): 'active' | 'cancelled' | 'past_due' | 'trialing' {
  switch (status) {
    case 'active': return 'active';
    case 'trialing': return 'trialing';
    case 'past_due':
    case 'unpaid': return 'past_due';
    case 'canceled':
    case 'incomplete_expired': return 'cancelled';
    default: return 'active';
  }
}
