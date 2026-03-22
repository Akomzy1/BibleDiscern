import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Gold left border + slightly elevated shadow */
  highlighted?: boolean;
  /** Top border accent color — pass COLORS.gold for prayer cards */
  topBorderColor?: string;
  elevated?: boolean;
}

export function Card({ children, style, highlighted, topBorderColor, elevated }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        highlighted && styles.highlighted,
        topBorderColor && { borderTopWidth: 3, borderTopColor: topBorderColor },
        elevated && SHADOWS.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  highlighted: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
});
