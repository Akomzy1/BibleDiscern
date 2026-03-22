import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { apiClient } from '@/lib/api';
import { getCached, setCached } from '@/lib/cache';
import { CACHE_TTL } from '@librato/shared';
import type { DailyMoment, Session } from '@librato/shared';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
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
  const { user } = useAuthStore();
  const { sessions, fetchSessions } = useSessionStore();
  const { fetchSubscription, sessionsUsed, sessionsLimit, isAtLimit, isTrial, isPremium } =
    useSubscriptionStore();

  const [dailyMoment, setDailyMoment] = useState<DailyMoment | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const cardOpacity = useState(new Animated.Value(0))[0];

  const displayName =
    user?.user_metadata?.display_name ??
    user?.user_metadata?.full_name?.split(' ')[0] ??
    'Friend';

  const loadDailyMoment = useCallback(async () => {
    const cached = await getCached<DailyMoment>('daily-moment');
    if (cached) {
      setDailyMoment(cached);
      fadein();
      return;
    }
    try {
      const moment = await apiClient.getDailyMoment();
      setDailyMoment(moment);
      await setCached('daily-moment', moment, CACHE_TTL.dailyMoment);
      fadein();
    } catch {
      // Fallback handled by API
    }
  }, []);

  const fadein = () => {
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    loadDailyMoment();
    fetchSessions();
    fetchSubscription();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadDailyMoment(), fetchSessions(), fetchSubscription()]);
    setRefreshing(false);
  };

  const recentSessions = sessions.slice(0, 3);

  return (
    <ScreenWrapper onRefresh={handleRefresh} isRefreshing={refreshing}>
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

      {/* Daily Moment card */}
      {dailyMoment && (
        <Animated.View style={{ opacity: cardOpacity }}>
          <Card style={styles.momentCard}>
            <Text style={styles.momentRef}>{dailyMoment.scripture_reference}</Text>
            <View style={styles.momentDivider} />
            <Text style={styles.momentVerse}>{dailyMoment.scripture_text}</Text>
            <View style={styles.momentDivider} />
            <Text style={styles.momentPrompt}>{dailyMoment.reflection_prompt}</Text>
            <Text style={styles.momentPrayer}>{dailyMoment.prayer}</Text>
          </Card>
        </Animated.View>
      )}

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
    marginBottom: SPACING['3xl'],
    paddingTop: SPACING.xl,
  },
  greeting: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.textMedium },
  name: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.navy },

  momentCard: { marginBottom: SPACING.xl, gap: SPACING.lg },
  momentRef: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  momentDivider: { height: 1, width: 40, backgroundColor: COLORS.gold, alignSelf: 'center' },
  momentVerse: {
    fontFamily: FONTS.scripture,
    fontSize: 20,
    color: COLORS.navy,
    lineHeight: 32,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  momentPrompt: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 24,
  },
  momentPrayer: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.textMedium,
    lineHeight: 24,
    fontStyle: 'italic',
  },

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
