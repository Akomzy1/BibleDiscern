import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSessionStore } from '@/stores/useSessionStore';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import type { Session } from '@librato/shared';

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function situationPreview(text: string): string {
  return text.length > 120 ? text.slice(0, 120) + '…' : text;
}

export default function JournalScreen() {
  const { sessions, isLoading, fetchSessions } = useSessionStore();
  const { isPremium, journalVisibleCount } = useFeatureGate();
  const [refreshing, setRefreshing] = useState(false);

  const stones = sessions
    .filter((s: Session) => s.status === 'completed')
    .sort((a: Session, b: Session) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  }, []);

  if (isLoading && stones.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.gold} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper onRefresh={handleRefresh} isRefreshing={refreshing}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Spiritual Journal</Text>
        <Text style={styles.subtitle}>Your Ebenezer stones — where God has met you</Text>
      </View>

      {stones.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={stones}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }: { item: Session; index: number }) => {
            const isLocked = !isPremium && index >= journalVisibleCount;
            if (isLocked) {
              return <LockedEntryCard />;
            }
            return (
              <EntryCard
                session={item}
                onPress={() => router.push(`/journal/${item.id}`)}
              />
            );
          }}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </ScreenWrapper>
  );
}

function EntryCard({ session, onPress }: { session: Session; onPress: () => void }) {
  const firstRef = session.ai_response?.scriptures?.[0]?.reference;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [styles.entryCard, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Journal entry: ${situationPreview(session.situation)}`}
    >
      <View style={styles.entryTop}>
        <Text style={styles.entryDate}>{formatLongDate(session.created_at)}</Text>
        <Text style={styles.entryArrow}>›</Text>
      </View>
      <Text style={styles.entryPreview}>{situationPreview(session.situation)}</Text>
      {firstRef && (
        <View style={styles.entryBadgeRow}>
          <Badge label={firstRef} variant="gold" />
        </View>
      )}
    </Pressable>
  );
}

function LockedEntryCard() {
  return (
    <Pressable
      onPress={() => router.push('/upgrade')}
      style={styles.lockedCard}
      accessibilityRole="button"
      accessibilityLabel="Upgrade to unlock your full spiritual history"
    >
      <View style={styles.lockedBlur}>
        <View style={styles.lockedContent}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={styles.lockedText}>Upgrade to unlock your full spiritual history</Text>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📖</Text>
      <Text style={styles.emptyTitle}>Your journal is empty</Text>
      <Text style={styles.emptySubtitle}>
        Begin your first discernment journey to set your first Ebenezer stone.
      </Text>
      <Button
        title="Begin Discernment"
        onPress={() => router.push('/(tabs)/discern')}
        style={styles.emptyBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: SPACING['3xl'], marginBottom: SPACING['2xl'], gap: SPACING.sm },
  title: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.navy },
  subtitle: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.textMedium,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  list: { paddingBottom: SPACING['5xl'] },
  separator: { height: SPACING.md },

  entryCard: {
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryDate: { fontFamily: FONTS.bodyBold, fontSize: 12, color: COLORS.gold, letterSpacing: 0.5 },
  entryArrow: { fontFamily: FONTS.body, fontSize: 22, color: COLORS.textLight, lineHeight: 26 },
  entryPreview: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  entryBadgeRow: { flexDirection: 'row' },

  lockedCard: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    height: 88,
  },
  lockedBlur: {
    flex: 1,
    backgroundColor: `${COLORS.parchment}CC`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.xl },
  lockedIcon: { fontSize: 18 },
  lockedText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.textMedium,
    flex: 1,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING['5xl'],
    paddingHorizontal: SPACING['3xl'],
    gap: SPACING.xl,
  },
  emptyIcon: { fontSize: 52, opacity: 0.35 },
  emptyTitle: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.navy },
  emptySubtitle: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyBtn: {},
});
