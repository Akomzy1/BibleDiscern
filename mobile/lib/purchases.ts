/**
 * RevenueCat purchases integration.
 *
 * Install: npx expo install react-native-purchases
 * Requires native rebuild after install.
 *
 * RevenueCat product IDs:
 *   biblediscern_premium_monthly   — $7.99/month
 *   biblediscern_premium_annual    — $49.99/year
 *
 * RevenueCat entitlement ID: "premium"
 */
import Purchases, {
  LOG_LEVEL,
  type PurchasesPackage,
  type CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { apiClient } from '@/lib/api';

const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

export const PRODUCT_IDS = {
  monthly: 'librato_premium_monthly',
  annual: 'librato_premium_annual',
} as const;

export const ENTITLEMENT_ID = 'premium';

/** Call once in the root layout after auth is initialized. */
export async function initializePurchases(userId?: string): Promise<void> {
  const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  if (!apiKey) {
    if (__DEV__) console.warn('[Purchases] No RevenueCat API key configured.');
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });

  if (userId) {
    await Purchases.logIn(userId);
  }
}

/** Identify the user after sign-in so purchase history follows them across devices. */
export async function identifyUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch (e) {
    if (__DEV__) console.error('[Purchases] identifyUser failed', e);
  }
}

/** Clear identity on sign-out. */
export async function resetPurchasesUser(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (e) {
    if (__DEV__) console.error('[Purchases] resetPurchasesUser failed', e);
  }
}

/**
 * Fetch available packages (monthly + annual).
 * Returns null if unavailable (e.g. simulator without StoreKit).
 */
export async function getOfferings(): Promise<PurchasesPackage[] | null> {
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return null;
    return current.availablePackages;
  } catch (e) {
    if (__DEV__) console.error('[Purchases] getOfferings failed', e);
    return null;
  }
}

/**
 * Purchase a package. Returns updated CustomerInfo on success.
 * Throws on user cancellation (check error.userCancelled) or billing error.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  await syncWithBackend(customerInfo);
  return customerInfo;
}

/** Restore previous purchases. Returns updated CustomerInfo. */
export async function restorePurchases(): Promise<CustomerInfo> {
  const customerInfo = await Purchases.restorePurchases();
  await syncWithBackend(customerInfo);
  return customerInfo;
}

/** Check current subscription status without a network call. */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

/** Returns true if the user currently has an active premium entitlement. */
export async function hasPremiumEntitlement(): Promise<boolean> {
  try {
    const info = await getCustomerInfo();
    return !!info.entitlements.active[ENTITLEMENT_ID];
  } catch {
    return false;
  }
}

/**
 * After any purchase or restore, validate with the backend to sync the
 * subscription record in Supabase.
 */
async function syncWithBackend(customerInfo: CustomerInfo): Promise<void> {
  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  if (!entitlement) return;

  try {
    const receipt = Platform.OS === 'ios'
      ? customerInfo.originalAppUserId // RC stores the App Store receipt via latestExpirationDate
      : customerInfo.originalPurchaseDate ?? '';

    await apiClient.validateReceipt(
      receipt,
      Platform.OS === 'ios' ? 'apple' : 'google',
      entitlement.productIdentifier,
    );
  } catch (e) {
    if (__DEV__) console.error('[Purchases] syncWithBackend failed', e);
    // Non-fatal — RC entitlement is the source of truth on mobile.
  }
}
