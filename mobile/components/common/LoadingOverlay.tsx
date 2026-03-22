import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LOADING_MESSAGES } from '@librato/shared';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.cross}>✝</Text>
          <LoadingSpinner size={40} style={styles.spinner} />
          <Text style={styles.message}>{LOADING_MESSAGES[messageIndex]}</Text>
          <Text style={styles.sub}>This may take a moment.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 42, 74, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['3xl'],
  },
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    padding: SPACING['4xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    gap: SPACING.xl,
  },
  cross: { fontSize: 32, color: COLORS.gold },
  spinner: { marginVertical: SPACING.sm },
  message: {
    fontFamily: FONTS.scripture,
    fontSize: 20,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 30,
  },
  sub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
