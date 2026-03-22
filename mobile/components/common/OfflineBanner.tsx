import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const height = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOffline) {
      Animated.parallel([
        Animated.timing(height, { toValue: 40, duration: 250, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: false }),
        Animated.timing(height, { toValue: 0, duration: 250, useNativeDriver: false }),
      ]).start();
    }
  }, [isOffline]);

  return (
    <Animated.View style={[styles.banner, { height, opacity }]}>
      <Text style={styles.text} numberOfLines={1}>
        📵  You're offline — some features require a connection
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.navy,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  text: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.cream,
    textAlign: 'center',
  },
});
