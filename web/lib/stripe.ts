import Stripe from 'stripe';

// Single server-side Stripe client. Never import from client components.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://biblediscern.app';

export function priceIdForPlan(plan: 'monthly' | 'annual'): string {
  return plan === 'annual'
    ? process.env.STRIPE_PRICE_ID_PREMIUM_ANNUAL!
    : process.env.STRIPE_PRICE_ID_PREMIUM_MONTHLY!;
}
