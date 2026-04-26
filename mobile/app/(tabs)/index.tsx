import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useScaleStore } from '@/stores/useScaleStore';
import { DailyScale } from '@/components/scale/DailyScale';
import type { Session } from '@librato/shared';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { Disclaimer } from '@/components/common/Disclaimer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HomeScreen() {
  return (
    <ErrorBoundary>
      <HomeScreenContent />
    </ErrorBoundary>
  );
}

function HomeScreenContent() {
  const { user } = useAuthStore();
  const { sessions, fetchSessions } = useSessionStore();
  const { fetchSubscription, sessionsUsed, sessionsLimit, isAtLimit, isTrial, isPremium } =
    useSubscriptionStore();
  const { fetchTodayScale } = useScaleStore();

  const [refreshing, setRefreshing] = useState(false);

  const fullName = user?.user_metadata?.full_name;
  const firstName = typeof fullName === 'string' ? fullName.split(' ')[0] : undefined;
  const displayName = user?.user_metadata?.display_name ?? firstName ?? 'Friend';

  useEffect(() => {
    fetchTodayScale();
    fetchSessions();
    fetchSubscription();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTodayScale(), fetchSessions(), fetchSubscription()]);
    setRefreshing(false);
  };

  const recentSessions = Array.isArray(sessions) ? sessions.slice(0, 3) : [];

  return (
    <ScreenWrapper onRefresh={handleRefresh} isRefreshing={refreshing}>
      <OfflineBanner />

      {/* Greeting + badge */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{displayName}</Text>
        </View>
        {!isPremium && !isTrial && (
          <Badge
            label={isAtLimit ? '0 remaining' : `${sessionsUsed} of ${sessionsLimit} used`}
            variant={isAtLimit ? 'error' : 'neutral'}
          />
        )}
        {isTrial && <Badge label="Free trial" variant="gold" />}
      </View>

      {/* Daily Scale — always inline, phases handled internally */}
      <View style={styles.scaleSection}>
        <DailyScale />
      </View>

      {/* Primary CTA */}
      <Button
        title="Begin Discernment"
        onPress={() => router.push('/(tabs)/discern')}
        fullWidth
        style={styles.cta}
        accessibilityLabel="Begin a new discernment journey"
      />

      {/* Recent journeys */}
      {recentSessions.length > 0 && (
        <View style={styles.section}>
          <SectionLabel label="Recent journeys" icon="🪶" />
          {recentSessions.map((session) => (
            <SessionPreviewCard
              key={session.id}
              session={session}
              onPress={() => router.push(`/discern/${session.id}`)}
            />
          ))}
        </View>
      )}

      {recentSessions.length === 0 && !refreshing && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🕊️</Text>
          <Text style={styles.emptyText}>
            Your discernment journey begins with a single question.
          </Text>
        </View>
      )}

      <Disclaimer style={styles.disclaimer} />
    </ScreenWrapper>
  );
}

function SessionPreviewCard({
  session,
  onPress,
}: {
  session: Session;
  onPress: () => void;
}) {
  const firstScripture = session.ai_response?.scriptures?.[0]?.reference;
  const preview =
    session.situation.length > 120
      ? session.situation.slice(0, 120) + '...'
      : session.situation;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.sessionCard, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`View session: ${preview}`}
    >
      <Text style={styles.sessionPreview}>{preview}</Text>
      <View style={styles.sessionMeta}>
        <Text style={styles.sessionDate}>{formatDate(session.created_at)}</Text>
        {firstScripture && (
          <Badge label={firstScripture} variant="gold" style={styles.sessionBadge} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING['2xl'],
    paddingTop: SPACING.xl,
  },
  greeting: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.textMedium },
  name: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.navy },

  scaleSection: { marginBottom: SPACING['2xl'] },

  cta: { marginBottom: SPACING['3xl'] },

  section: { gap: SPACING.lg },

  sessionCard: {
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  sessionPreview: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sessionDate: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.textLight },
  sessionBadge: {},
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },

  emptyState: { alignItems: 'center', paddingTop: SPACING['5xl'], gap: SPACING.lg },
  disclaimer: { marginTop: SPACING['3xl'] },

  emptyIcon: { fontSize: 36 },
  emptyText: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
    paddingHorizontal: SPACING['2xl'],
  },
});
