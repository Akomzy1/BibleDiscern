import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TONES, containsCrisisKeywords } from '@librato/shared';
import type { Session } from '@librato/shared';
import { useSessionStore } from '@/stores/useSessionStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { CrisisScreen } from '@/components/common/CrisisScreen';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

export default function DiscernScreen() {
  const { createSession, isCreating } = useSessionStore();
  const { isAtLimit, isTrial } = useSubscriptionStore();

  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState<Session['tone']>('reflective');
  const [error, setError] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const canSubmit = situation.trim().length >= 10;

  const handleBegin = async () => {
    if (!canSubmit) return;
    setError('');

    // Check for crisis keywords before calling API
    if (containsCrisisKeywords(situation)) {
      setShowCrisis(true);
      return;
    }

    // Check session limit
    if (isAtLimit) {
      setShowLimitModal(true);
      return;
    }

    try {
      const session = await createSession(situation.trim(), tone);
      setSituation('');
      router.push(`/discern/${session.id}`);
    } catch (e: any) {
      if (e?.status === 403 || e?.code === 'limit_reached') {
        setShowLimitModal(true);
      } else {
        setError(e?.message ?? 'Something went wrong. Please try again.');
      }
    }
  };

  if (showCrisis) {
    return <CrisisScreen onContinue={() => setShowCrisis(false)} />;
  }

  return (
    <>
      <LoadingOverlay visible={isCreating} />

      <ScreenWrapper>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>The Crossroads</Text>
          <View style={styles.goldLine} />
          <Text style={styles.subtitle}>
            What decision or situation are you bringing before God today?
          </Text>
        </View>

        {/* Situation input */}
        <Input
          value={situation}
          onChangeText={setSituation}
          multiline
          placeholder={
            'Share what\'s on your heart... a decision you\'re facing, a struggle you\'re navigating, a question you can\'t resolve on your own...'
          }
          containerStyle={styles.inputContainer}
          error={error || undefined}
          accessibilityLabel="Your situation"
          accessibilityHint="Describe what you'd like to bring to God in discernment"
        />
        {situation.length > 10 && (
          <Text style={styles.charCount}>{situation.length} / 2000</Text>
        )}

        {/* Tone selector */}
        <View style={styles.toneSection}>
          <Text style={styles.toneLabel}>TONE</Text>
          <View style={styles.toneRow}>
            {TONES.map((t) => (
              <TonePill
                key={t.id}
                tone={t}
                selected={tone === t.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setTone(t.id as Session['tone']);
                }}
              />
            ))}
          </View>
        </View>

        {/* CTA */}
        <Button
          title="Begin My Discernment Journey"
          onPress={handleBegin}
          disabled={!canSubmit}
          fullWidth
          style={styles.cta}
        />

        {/* Limit upgrade modal */}
        <LimitModal
          visible={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          onUpgrade={() => {
            setShowLimitModal(false);
            router.push('/upgrade');
          }}
        />
      </ScreenWrapper>
    </>
  );
}

function TonePill({
  tone,
  selected,
  onPress,
}: {
  tone: (typeof TONES)[number];
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tonePill, selected && styles.tonePillSelected]}
      accessibilityRole="button"
      accessibilityLabel={`Select ${tone.label} tone`}
      accessibilityState={{ selected }}
    >
      <Text style={styles.toneIcon}>{tone.icon}</Text>
      <Text style={[styles.toneText, selected && styles.toneTextSelected]}>
        {tone.label}
      </Text>
    </Pressable>
  );
}

function LimitModal({
  visible,
  onClose,
  onUpgrade,
}: {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Card style={styles.modalCard} elevated>
          <Text style={styles.modalIcon}>🔒</Text>
          <Text style={styles.modalTitle}>Monthly limit reached</Text>
          <Text style={styles.modalBody}>
            You've used your free session this month. Upgrade to Premium for unlimited
            discernment, the Fruit of the Spirit diagnostic, and follow-up check-ins.
          </Text>
          <Button title="Unlock Premium" onPress={onUpgrade} fullWidth style={{ marginTop: SPACING.md }} />
          <Button title="Not now" onPress={onClose} variant="ghost" fullWidth />
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: SPACING['3xl'], marginBottom: SPACING['3xl'], gap: SPACING.md },
  title: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.navy },
  goldLine: { width: 40, height: 2, backgroundColor: COLORS.gold },
  subtitle: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.textMedium,
    lineHeight: 26,
    fontStyle: 'italic',
  },

  inputContainer: { marginBottom: SPACING.xs },
  charCount: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'right',
    marginBottom: SPACING.xl,
  },

  toneSection: { marginBottom: SPACING['3xl'], gap: SPACING.md },
  toneLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  toneRow: { flexDirection: 'row', gap: SPACING.sm },
  tonePill: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 4,
  },
  tonePillSelected: {
    backgroundColor: `${COLORS.gold}22`,
    borderColor: COLORS.gold,
    borderWidth: 1.5,
  },
  toneIcon: { fontSize: 18 },
  toneText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMedium,
    textAlign: 'center',
  },
  toneTextSelected: { fontFamily: FONTS.bodyBold, color: COLORS.navy },

  cta: {},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 42, 74, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  modalCard: { width: '100%', alignItems: 'center', gap: SPACING.md },
  modalIcon: { fontSize: 36 },
  modalTitle: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.navy, textAlign: 'center' },
  modalBody: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
});
