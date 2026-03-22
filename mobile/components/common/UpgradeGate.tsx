import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface UpgradeGateProps {
  feature?: string;
  style?: ViewStyle;
  onSkip?: () => void;
}

export function UpgradeGate({
  feature = 'this feature',
  style,
  onSkip,
}: UpgradeGateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.heading}>Premium Feature</Text>
        <Text style={styles.body}>
          Upgrade to see how your decision aligns with the Fruit of the Spirit and unlock{' '}
          {feature}.
        </Text>
        <Button
          title="Unlock Premium — $3.33/month"
          onPress={() => router.push('/upgrade')}
          variant="primary"
          fullWidth
          style={styles.button}
        />
        {onSkip && (
          <Button
            title="Skip for now"
            onPress={onSkip}
            variant="ghost"
            style={styles.skipButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(253, 246, 236, 0.9)',
    borderRadius: BORDER_RADIUS.lg,
  },
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['3xl'],
    margin: SPACING['3xl'],
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.elevated,
  },
  lock: { fontSize: 36, marginBottom: SPACING.sm },
  heading: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.navy,
    textAlign: 'center',
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  button: { marginTop: SPACING.sm },
  skipButton: { marginTop: -SPACING.sm },
});
