import React from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  onRefresh?: () => void | Promise<void>;
  isRefreshing?: boolean;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  /** For full-bleed screens that handle their own padding */
  noPadding?: boolean;
}

export function ScreenWrapper({
  children,
  onRefresh,
  isRefreshing = false,
  scrollable = true,
  style,
  contentStyle,
  noPadding = false,
}: ScreenWrapperProps) {
  const paddingStyle = noPadding ? {} : styles.padding;

  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[paddingStyle, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.gold}
                colors={[COLORS.gold]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fixed, paddingStyle, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: { flex: 1 },
  fixed: { flex: 1 },
  padding: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
});
