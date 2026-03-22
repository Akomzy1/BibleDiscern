import React from 'react';
import { Text, StyleSheet, ViewStyle, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

interface DisclaimerProps {
  style?: ViewStyle;
}

export function Disclaimer({ style }: DisclaimerProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>
        Consider sharing this journey with a trusted mentor or pastor. LibratoAi supports
        reflection — it does not replace God, Scripture, the Holy Spirit, or wise counsel.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  text: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 17,
  },
});
