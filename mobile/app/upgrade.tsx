import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  PRODUCT_IDS,
} from '@/lib/purchases';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import type { PurchasesPackage } from 'react-native-purchases';

const FEATURES = [
  { icon: '⚖️', label: 'Unlimited discernment sessions' },
  { icon: '🍇', label: 'Fruit of the Spirit diagnostic' },
  { icon: '📖', label: 'Full spiritual journal history' },
  { icon: '✉️', label: 'Decision follow-up reminders' },
  { icon: '🃏', label: 'Scripture Card sharing' },
  { icon: '🪨', label: 'Ebenezer pattern insights' },
] as const;

export default function UpgradeScreen() {
  const { fetchSubscription } = useSubscriptionStore();

  const [offerings, setOfferings] = useState<PurchasesPackage[] | null>(null);
  const [selectedId, setSelectedId] = useState<string>(PRODUCT_IDS.annual);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [loadingOfferings, setLoadingOfferings] = useState(true);

  // "Best value" badge pulse
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getOfferings()
      .then(setOfferings)
      .finally(() => setLoadingOfferings(false));
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(badgeScale, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(badgeScale, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const selectedPackage = offerings?.find(
    (p) => p.product.identifier === selectedId,
  );

  const monthlyPackage = offerings?.find(
    (p) => p.product.identifier === PRODUCT_IDS.monthly,
  );
  const annualPackage = offerings?.find(
    (p) => p.product.identifier === PRODUCT_IDS.annual,
  );

  const handlePurchase = async () => {
    if (!selectedPackage) {
      // Fallback for simulators / dev without StoreKit
      Alert.alert(
        'Not available',
        'In-app purchases are not available in this environment. They will work on a real device with App Store / Play Store access.',
      );
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPurchasing(true);

    try {
      await purchasePackage(selectedPackage);
      await fetchSubscription();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
      // Toast would go here — for now, success is implied by returning to previous screen
    } catch (e: any) {
      if (e?.userCancelled) return; // user cancelled — do nothing
      Alert.alert('Purchase failed', e?.message ?? 'Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restorePurchases();
      await fetchSubscription();
      Alert.alert('Restored', 'Your Premium subscription has been restored.');
      router.back();
    } catch (e: any) {
      Alert.alert('Nothing to restore', 'No prior Premium subscription found for this account.');
    } finally {
      setRestoring(false);
    }
  };

  const annualMonthlyEquiv = annualPackage
    ? `${(annualPackage.product.price / 12).toFixed(2)} ${annualPackage.product.currencyCode}/month`
    : '$7.99/month';

  const annualPrice = annualPackage
    ? `${annualPackage.product.priceString}/year`
    : '$49.99/year';

  const monthlyPrice = monthlyPackage
    ? monthlyPackage.product.priceString + '/month'
    : '$7.99/month';

  return (
    <View style={styles.root}>
      {/* Close */}
      <Pressable
        onPress={() => router.back()}
        style={styles.closeBtn}
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={12}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Text style={styles.heroIcon}>⚖️</Text>
        <Text style={styles.heroTitle}>Go deeper with BibleDiscern Premium</Text>
        <Text style={styles.heroSub}>
          Unlimited wisdom. Every crossroads. Every season.
        </Text>

        {/* Plan cards */}
        <View style={styles.plans}>
          {/* Annual — highlighted */}
          <Pressable
            onPress={() => setSelectedId(PRODUCT_IDS.annual)}
            style={[styles.planCard, styles.planCardAnnual, selectedId === PRODUCT_IDS.annual && styles.planCardSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedId === PRODUCT_IDS.annual }}
          >
            <Animated.View style={[styles.bestValueBadge, { transform: [{ scale: badgeScale }] }]}>
              <Text style={styles.bestValueText}>Best value</Text>
            </Animated.View>
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, selectedId === PRODUCT_IDS.annual && styles.radioOuterSelected]}>
                {selectedId === PRODUCT_IDS.annual && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.planTitle}>Annual</Text>
            <Text style={styles.planPrice}>{annualPrice}</Text>
            <Text style={styles.planEquiv}>{annualMonthlyEquiv} — less than a cup of coffee</Text>
            <Text style={styles.planSaving}>Save 33% vs monthly</Text>
          </Pressable>

          {/* Monthly */}
          <Pressable
            onPress={() => setSelectedId(PRODUCT_IDS.monthly)}
            style={[styles.planCard, selectedId === PRODUCT_IDS.monthly && styles.planCardSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedId === PRODUCT_IDS.monthly }}
          >
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, selectedId === PRODUCT_IDS.monthly && styles.radioOuterSelected]}>
                {selectedId === PRODUCT_IDS.monthly && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.planTitle}>Monthly</Text>
            <Text style={styles.planPrice}>{monthlyPrice}</Text>
            <Text style={styles.planCancel}>Cancel anytime</Text>
          </Pressable>
        </View>

        {/* Features */}
        <Card style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={f.label}>
              {i > 0 && <View style={styles.featureDivider} />}
              <View style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* CTA */}
        <Button
          title={purchasing ? 'Processing…' : 'Start 7-Day Free Trial'}
          onPress={handlePurchase}
          disabled={purchasing || loadingOfferings}
          fullWidth
          style={styles.cta}
        />

        {/* Restore */}
        <Pressable
          onPress={handleRestore}
          disabled={restoring}
          accessibilityRole="button"
          style={styles.restoreRow}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={COLORS.textLight} />
          ) : (
            <Text style={styles.restoreText}>Restore Purchases</Text>
          )}
        </Pressable>

        {/* Footer legal */}
        <Text style={styles.footerLegal}>
          Cancel anytime. No commitment. Your trial is free for 7 days.
        </Text>
        <Text style={styles.footerLegal}>
          {Platform.OS === 'ios'
            ? 'Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Manage subscriptions in your App Store settings.'
            : 'Payment will be charged to your Google Play account. Manage subscriptions in Google Play settings.'}
        </Text>

        {/* Scripture */}
        <Text style={styles.verse}>
          "If any of you lacks wisdom, let him ask God, who gives generously to all without
          reproach." — James 1:5
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },

  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 24,
    right: SPACING.lg,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMedium },

  content: {
    paddingTop: Platform.OS === 'ios' ? 100 : 72,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['5xl'],
    alignItems: 'center',
    gap: SPACING.xl,
  },

  heroIcon: { fontSize: 52 },
  heroTitle: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 34,
  },
  heroSub: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  plans: { flexDirection: 'row', gap: SPACING.md, width: '100%' },

  planCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.xs,
    position: 'relative',
  },
  planCardAnnual: {
    borderColor: COLORS.gold,
    backgroundColor: `${COLORS.gold}0D`,
  },
  planCardSelected: {
    ...SHADOWS.elevated,
  },

  bestValueBadge: {
    position: 'absolute',
    top: -11,
    alignSelf: 'center',
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  bestValueText: { fontFamily: FONTS.bodyBold, fontSize: 10, color: COLORS.navy },

  planRadio: { flexDirection: 'row', marginBottom: SPACING.xs },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: COLORS.gold },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.gold,
  },

  planTitle: { fontFamily: FONTS.bodySemiBold, fontSize: 14, color: COLORS.navy },
  planPrice: { fontFamily: FONTS.display, fontSize: 18, color: COLORS.navy },
  planEquiv: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.textMedium, lineHeight: 16 },
  planSaving: { fontFamily: FONTS.bodyBold, fontSize: 11, color: COLORS.gold },
  planCancel: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.textLight },

  featuresCard: { width: '100%', padding: 0, gap: 0, overflow: 'hidden' },
  featureDivider: { height: 1, backgroundColor: COLORS.border },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  featureCheck: { fontFamily: FONTS.bodyBold, fontSize: 14, color: COLORS.gold, width: 16 },
  featureIcon: { fontSize: 16, width: 22 },
  featureLabel: { flex: 1, fontFamily: FONTS.body, fontSize: 14, color: COLORS.textDark },

  cta: { width: '100%' },

  restoreRow: { padding: SPACING.sm },
  restoreText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },

  footerLegal: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: SPACING.md,
  },
  verse: {
    fontFamily: FONTS.scripture,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingHorizontal: SPACING.xl,
  },
});
