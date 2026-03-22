import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '@/constants/theme';

type BadgeVariant = 'gold' | 'navy' | 'sage' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'gold', style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  label: { fontFamily: FONTS.bodySemiBold, fontSize: 11, letterSpacing: 0.5 },

  gold: { backgroundColor: COLORS.goldLight },
  goldLabel: { color: COLORS.navy },

  navy: { backgroundColor: COLORS.navy },
  navyLabel: { color: COLORS.goldLight },

  sage: { backgroundColor: '#D6E4D3' },
  sageLabel: { color: COLORS.sage },

  error: { backgroundColor: '#FAE5E3' },
  errorLabel: { color: COLORS.error },

  neutral: { backgroundColor: COLORS.parchment },
  neutralLabel: { color: COLORS.textMedium },
});
