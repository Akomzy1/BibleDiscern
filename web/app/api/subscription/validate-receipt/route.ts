import { NextRequest } from 'next/server';
import { ValidateReceiptRequestSchema, IAP_PRODUCTS } from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';

// ─── Apple Receipt Validation ───────────────────────────────────────────────

async function validateAppleReceipt(
  receipt: string,
): Promise<{ valid: boolean; productId?: string; expiresAt?: string }> {
  // Try production first, fall back to sandbox
  const endpoints = [
    'https://buy.itunes.apple.com/verifyReceipt',
    'https://sandbox.itunes.apple.com/verifyReceipt',
  ];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'receipt-data': receipt,
        password: process.env.APPLE_SHARED_SECRET,
        'exclude-old-transactions': true,
      }),
    });

    const data = await response.json();

    // Status 21007 = sandbox receipt sent to production — retry against sandbox
    if (data.status === 21007) continue;

    if (data.status !== 0) {
      return { valid: false };
    }

    // Get the most recent transaction
    const latestReceipts: any[] =
      data.latest_receipt_info ?? data.receipt?.in_app ?? [];

    if (!latestReceipts.length) return { valid: false };

    const latest = latestReceipts.sort(
      (a: any, b: any) =>
        Number(b.purchase_date_ms) - Number(a.purchase_date_ms),
    )[0];

    const expiresMs = Number(latest.expires_date_ms);
    const isExpired = expiresMs < Date.now();

    return {
      valid: !isExpired,
      productId: latest.product_id,
      expiresAt: latest.expires_date_ms
        ? new Date(expiresMs).toISOString()
        : undefined,
    };
  }

  return { valid: false };
}

// ─── Google Purchase Validation ──────────────────────────────────────────────
// Requires Google Play Developer API with a service account.
// See: https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptions/get

async function validateGooglePurchase(
  purchaseToken: string,
  productId: string,
): Promise<{ valid: boolean; expiresAt?: string }> {
  // TODO: Implement Google Play Developer API verification.
  // This requires a service account JSON key and the google-auth-library package.
  // Pattern:
  //   1. Create a GoogleAuth client with the service account key
  //   2. Call: GET https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{packageName}/purchases/subscriptions/{subscriptionId}/tokens/{token}
  //   3. Check expiryTimeMillis and paymentState
  //
  // For now, log a warning and return invalid to prevent fraudulent upgrades.
  console.warn('[validate-google] Google Play validation not yet implemented. Token:', purchaseToken.slice(0, 20));
  return { valid: false };
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    const body = await request.json();
    const { receipt, platform, product_id } = ValidateReceiptRequestSchema.parse(body);

    // Validate the receipt
    let isValid = false;
    let expiresAt: string | undefined;

    if (platform === 'apple') {
      const result = await validateAppleReceipt(receipt);
      isValid = result.valid;
      expiresAt = result.expiresAt;
    } else {
      const result = await validateGooglePurchase(receipt, product_id);
      isValid = result.valid;
      expiresAt = result.expiresAt;
    }

    // Determine billing interval from product ID
    const billingInterval = product_id === IAP_PRODUCTS.annual ? 'year' : 'month';

    if (!isValid) {
      // Receipt invalid or expired — downgrade to free
      await adminClient
        .from('subscriptions')
        .update({
          tier: 'free',
          status: 'cancelled',
          source: platform,
        })
        .eq('user_id', user.id);

      await adminClient
        .from('profiles')
        .update({ subscription_tier: 'free' })
        .eq('id', user.id);

      return err('invalid_receipt', 'Receipt validation failed or subscription has expired.', 422);
    }

    // Receipt valid — upsert premium subscription
    const { data: subscription, error } = await adminClient
      .from('subscriptions')
      .update({
        tier: 'premium',
        status: 'active',
        source: platform,
        billing_interval: billingInterval,
        sessions_limit: 9999,
        current_period_end: expiresAt ?? null,
        ...(platform === 'apple' ? { apple_transaction_id: receipt.slice(0, 100) } : {}),
        ...(platform === 'google' ? { google_order_id: product_id } : {}),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[validate-receipt]', error);
      return err('server_error', 'Failed to update subscription.', 500);
    }

    // Sync tier to profiles table
    await adminClient
      .from('profiles')
      .update({ subscription_tier: 'premium', subscription_source: platform })
      .eq('id', user.id);

    return ok({ subscription });
  } catch (e) {
    return handleError(e);
  }
}
