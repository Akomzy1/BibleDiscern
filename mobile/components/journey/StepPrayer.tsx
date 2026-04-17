import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import type { DiscernmentResponse } from '@librato/shared';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface StepPrayerProps {
  response: DiscernmentResponse;
  sessionId: string;
  stillnessNote?: string;
}

export function StepPrayer({ response, sessionId, stillnessNote }: StepPrayerProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stoneScale = useRef(new Animated.Value(1)).current;
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEbenezerStone = async () => {
    if (saved) return;

    // Tactile press animation
    Animated.sequence([
      Animated.timing(stoneScale, { toValue: 0.94, duration: 100, useNativeDriver: true }),
      Animated.timing(stoneScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setSaving(true);
    try {
      // Create journal entry and mark session complete
      await apiClient.updateSession(sessionId, { status: 'completed' });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSaved(true);
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity: fadeAnim, gap: SPACING.lg }}>
        {/* Closing word */}
        {response.closingWord && (
          <Card highlighted style={styles.closingCard}>
            <Text style={styles.closingText}>{response.closingWord}</Text>
          </Card>
        )}

        {/* Prayer */}
        <Card style={styles.prayerCard}>
          <Text style={styles.prayerLabel}>A Prayer for Your Journey</Text>
          <View style={styles.prayerDivider} />
          <Text style={styles.prayerText}>{response.prayer}</Text>
        </Card>

        {/* Stillness note if present */}
        {stillnessNote ? (
          <Card style={styles.noteCard}>
            <Text style={styles.noteLabel}>During stillness, you wrote:</Text>
            <Text style={styles.noteText}>"{stillnessNote}"</Text>
          </Card>
        ) : null}

        {/* Ebenezer Stone */}
        <View style={styles.stoneSection}>
          <Text style={styles.stoneVerse}>
            "Then Samuel took a stone and set it up... He named it Ebenezer, saying, 'Thus far the
            Lord has helped us.'" — 1 Samuel 7:12
          </Text>

          <Pressable
            onPress={handleEbenezerStone}
            disabled={saved || saving}
            accessibilityRole="button"
            accessibilityLabel="Place your Ebenezer stone"
            accessibilityState={{ disabled: saved || saving }}
          >
            <Animated.View
              style={[
                styles.stoneButton,
                saved && styles.stoneButtonSaved,
                { transform: [{ scale: stoneScale }] },
              ]}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.goldLight ?? COLORS.cream} />
              ) : saved ? (
                <>
                  <Text style={styles.stoneIcon}>🪨</Text>
                  <Text style={styles.stoneSavedText}>Stone placed</Text>
                  <Text style={styles.stoneSavedSub}>Added to your journal</Text>
                </>
              ) : (
                <>
                  <Text style={styles.stoneIcon}>🪨</Text>
                  <Text style={styles.stoneTitle}>Place Your Ebenezer Stone</Text>
                  <Text style={styles.stoneSub}>
                    Mark this moment in your journal — thus far the Lord has helped you.
                  </Text>
                </>
              )}
            </Animated.View>
          </Pressable>

          {saved && (
            <Button
              title="Return Home"
              onPress={async () => {
                await Haptics.selectionAsync();
                router.replace('/(tabs)');
              }}
              fullWidth
              variant="secondary"
            />
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING['5xl'] },

  closingCard: {},
  closingText: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.navy,
    lineHeight: 28,
    fontStyle: 'italic',
  },

  prayerCard: { gap: SPACING.md },
  prayerLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  prayerDivider: { height: 1, width: 32, backgroundColor: COLORS.gold },
  prayerText: {
    fontFamily: FONTS.scripture,
    fontSize: 18,
    color: COLORS.navy,
    lineHeight: 32,
    fontStyle: 'italic',
  },

  noteCard: { backgroundColor: `${COLORS.gold}11`, gap: SPACING.sm },
  noteLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noteText: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.textMedium,
    lineHeight: 24,
    fontStyle: 'italic',
  },

  stoneSection: { gap: SPACING.lg, marginTop: SPACING.xl },
  stoneVerse: {
    fontFamily: FONTS.scripture,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.md,
  },

  stoneButton: {
    backgroundColor: COLORS.navy,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING['2xl'],
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  stoneButtonSaved: {
    backgroundColor: `${COLORS.navy}99`,
  },
  stoneIcon: { fontSize: 40 },
  stoneTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.goldLight ?? COLORS.cream,
    textAlign: 'center',
  },
  stoneSub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: `${COLORS.cream}BB`,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },
  stoneSavedText: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.gold,
    textAlign: 'center',
  },
  stoneSavedSub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: `${COLORS.cream}BB`,
    textAlign: 'center',
  },
});
