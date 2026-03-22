import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSessionStore } from '@/stores/useSessionStore';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import type { Session } from '@librato/shared';

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function JournalEntryScreen() {
  // entryId is actually the session ID — completed sessions are Ebenezer stones
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const { sessions, fetchSession, updateSession } = useSessionStore();
  const { canUseFeature } = useFeatureGate();

  const [session, setSession] = useState<Session | null>(
    sessions.find((s) => s.id === entryId) ?? null,
  );
  const [loading, setLoading] = useState(!session);
  const [followUpText, setFollowUpText] = useState('');
  const [saving, setSaving] = useState(false);

  const hasFollowUps = canUseFeature('follow_ups');

  useEffect(() => {
    if (!session && entryId) {
      setLoading(true);
      fetchSession(entryId)
        .then((s) => {
          setSession(s);
          setFollowUpText(s.follow_up_1w_response ?? '');
        })
        .catch(() => {
          Alert.alert('Error', 'Could not load this journal entry.');
          router.back();
        })
        .finally(() => setLoading(false));
    } else if (session) {
      setFollowUpText(session.follow_up_1w_response ?? '');
    }
  }, [entryId]);

  const handleSaveFollowUp = async () => {
    if (!session || !followUpText.trim()) return;
    setSaving(true);
    try {
      await updateSession(session.id, { follow_up_1w_response: followUpText.trim() });
      setSession((prev) => prev ? { ...prev, follow_up_1w_response: followUpText.trim() } : prev);
      Alert.alert('Saved', 'Your update has been added to your Ebenezer stone.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  if (!session?.ai_response) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Entry not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backFallback}>
          <Text style={styles.backFallbackText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const { ai_response: response } = session;
  const existingFollowUp = session.follow_up_1w_response;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.headerBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to journal"
          hitSlop={12}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Journal</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Ebenezer Stone</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {/* Date */}
        <Text style={styles.date}>{formatLongDate(session.created_at)}</Text>

        {/* Situation card — gold left border */}
        <View style={styles.situationCard}>
          <Text style={styles.situationLabel}>The situation you brought before God</Text>
          <Text style={styles.situationText}>{session.situation}</Text>
        </View>

        {/* Scripture cards */}
        {response.scriptures.map((scripture) => (
          <Card key={scripture.reference} style={styles.scriptureCard}>
            <Badge label={scripture.reference} variant="gold" />
            <View style={styles.scriptureDivider} />
            <Text style={styles.scriptureVerse}>{scripture.text}</Text>
            <Text style={styles.scriptureContext}>{scripture.context}</Text>
          </Card>
        ))}

        {/* Prayer card */}
        <Card style={styles.prayerCard}>
          <Text style={styles.prayerLabel}>Prayer</Text>
          <View style={styles.prayerTopBorder} />
          <Text style={styles.prayerText}>{response.prayer}</Text>
        </Card>

        {/* Stillness note */}
        {session.stillness_note ? (
          <View style={styles.stillnessCard}>
            <Text style={styles.stillnessLabel}>From your stillness</Text>
            <Text style={styles.stillnessText}>"{session.stillness_note}"</Text>
          </View>
        ) : null}

        {/* Follow-up section */}
        <View style={styles.followUpSection}>
          <Text style={styles.followUpTitle}>How did it turn out?</Text>
          <Text style={styles.followUpSubtitle}>
            Look back at this crossroads — how did God move?
          </Text>

          {!hasFollowUps ? (
            <Card style={styles.followUpLocked}>
              <Text style={styles.lockedIcon}>🔒</Text>
              <Text style={styles.lockedText}>
                Upgrade to Premium to record how God answered this prayer and track His
                faithfulness over time.
              </Text>
              <Button
                title="Unlock Premium"
                onPress={() => router.push('/upgrade')}
                style={styles.lockedBtn}
              />
            </Card>
          ) : existingFollowUp ? (
            <Card style={styles.followUpCard}>
              <Text style={styles.followUpExisting}>{existingFollowUp}</Text>
              <Pressable
                onPress={() => setFollowUpText(existingFollowUp)}
                accessibilityRole="button"
              >
                <Text style={styles.editLink}>Edit this update</Text>
              </Pressable>
            </Card>
          ) : (
            <View style={styles.followUpInput}>
              <TextInput
                value={followUpText}
                onChangeText={setFollowUpText}
                placeholder="Update your Ebenezer stone… how did God move?"
                placeholderTextColor={COLORS.textLight}
                multiline
                style={styles.textInput}
                accessibilityLabel="Follow-up response"
              />
              <Button
                title={saving ? 'Saving…' : 'Save Update'}
                onPress={handleSaveFollowUp}
                disabled={saving || !followUpText.trim()}
                fullWidth
                style={styles.saveBtn}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  errorText: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.textMedium },
  backFallback: { padding: SPACING.md },
  backFallbackText: { fontFamily: FONTS.bodySemiBold, fontSize: 14, color: COLORS.gold },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.cream,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 70 },
  backIcon: { fontFamily: FONTS.body, fontSize: 26, color: COLORS.navy, lineHeight: 30 },
  backLabel: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.navy },
  headerTitle: {
    flex: 1,
    fontFamily: FONTS.display,
    fontSize: 17,
    color: COLORS.navy,
    textAlign: 'center',
  },
  headerRight: { minWidth: 70 },

  content: { padding: SPACING.lg, gap: SPACING.xl, paddingBottom: SPACING['5xl'] },

  date: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  situationCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  situationLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  situationText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 24,
  },

  scriptureCard: { gap: SPACING.sm },
  scriptureDivider: { height: 1, width: 32, backgroundColor: COLORS.gold },
  scriptureVerse: {
    fontFamily: FONTS.scripture,
    fontSize: 18,
    color: COLORS.navy,
    lineHeight: 30,
    fontStyle: 'italic',
  },
  scriptureContext: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
  },

  prayerCard: { gap: SPACING.md, paddingTop: SPACING.xl, overflow: 'visible' },
  prayerLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  prayerTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.gold,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
  prayerText: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.navy,
    lineHeight: 30,
    fontStyle: 'italic',
  },

  stillnessCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.sage,
    backgroundColor: `${COLORS.sage}11`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  stillnessLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.sage,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stillnessText: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.textMedium,
    lineHeight: 24,
    fontStyle: 'italic',
  },

  followUpSection: { gap: SPACING.md },
  followUpTitle: { fontFamily: FONTS.display, fontSize: 20, color: COLORS.navy },
  followUpSubtitle: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMedium },

  followUpLocked: { alignItems: 'center', gap: SPACING.md },
  lockedIcon: { fontSize: 28 },
  lockedText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  lockedBtn: {},

  followUpCard: { gap: SPACING.sm },
  followUpExisting: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textDark,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  editLink: { fontFamily: FONTS.bodySemiBold, fontSize: 13, color: COLORS.gold },

  followUpInput: { gap: SPACING.md },
  textInput: {
    backgroundColor: COLORS.parchment,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textDark,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  saveBtn: {},
});
