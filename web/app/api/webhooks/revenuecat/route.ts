import { NextRequest, NextResponse } from 'next/server';
import { IAP_PRODUCTS } from '@librato/shared';
import { adminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// RevenueCat event types we handle
type RevenueCatEventType =
  | 'INITIAL_PURCHASE'
  | 'RENEWAL'
  | 'CANCELLATION'
  | 'EXPIRATION'
  | 'BILLING_ISSUE';

interface RevenueCatWebhook {
  event: {
    type: RevenueCatEventType;
    app_user_id: string;           // This is the Supabase user UUID
    product_id: string;
    store: 'APP_STORE' | 'PLAY_STORE';
    transaction_id?: string;
    original_transaction_id?: string;
    expiration_at_ms?: number;
    purchased_at_ms?: number;
    period_type: 'NORMAL' | 'TRIAL' | 'INTRO';
  };
}

export async function POST(request: NextRequest) {
  // RevenueCat sends the shared secret in the Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== process.env.REVENUECAT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: RevenueCatWebhook;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { event } = payload;
  const userId = event.app_user_id;

  if (!userId) {
    return NextResponse.json({ error: 'Missing app_user_id' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL': {
        await handlePurchaseOrRenewal(userId, event);
        break;
      }
      case 'CANCELLATION': {
        // Cancellation means the user cancelled but still has access until period end.
        // Keep premium status active but mark as cancelled so we know to downgrade later.
        await adminClient.from('subscriptions').update({
          status: 'cancelled',
          // DO NOT downgrade tier yet — access continues until expiration
        }).eq('user_id', userId);
        break;
      }
      case 'EXPIRATION': {
        await handleExpiration(userId, event);
        break;
      }
      case 'BILLING_ISSUE': {
        await adminClient.from('subscriptions').update({
          status: 'past_due',
        }).eq('user_id', userId);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('[revenuecat webhook] Handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handlePurchaseOrRenewal(
  userId: string,
  event: RevenueCatWebhook['event'],
) {
  const source = event.store === 'APP_STORE' ? 'apple' : 'google';
  const billingInterval =
    event.product_id === IAP_PRODUCTS.annual ? 'year' : 'month';
  const expiresAt = event.expiration_at_ms
    ? new Date(event.expiration_at_ms).toISOString()
    : null;
  const purchasedAt = event.purchased_at_ms
    ? new Date(event.purchased_at_ms).toISOString()
    : null;

  await adminClient.from('subscriptions').update({
    tier: 'premium',
    status: 'active',
    source,
    billing_interval: billingInterval,
    sessions_limit: 9999,
    current_period_start: purchasedAt,
    current_period_end: expiresAt,
    ...(source === 'apple' && event.transaction_id
      ? { apple_transaction_id: event.transaction_id }
      : {}),
    ...(source === 'google' && event.transaction_id
      ? { google_order_id: event.transaction_id }
      : {}),
  }).eq('user_id', userId);

  await adminClient
    .from('profiles')
    .update({ subscription_tier: 'premium', subscription_source: source })
    .eq('id', userId);
}

async function handleExpiration(userId: string, _event: RevenueCatWebhook['event']) {
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
