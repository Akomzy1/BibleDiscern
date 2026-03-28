import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Rect, Ellipse } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useScaleStore } from '@/stores/useScaleStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

// ─────────────────────────────────────────────
// Balance scale icon
// ─────────────────────────────────────────────

function BalanceScaleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Central post */}
      <Rect x="11.25" y="7" width="1.5" height="13" rx="0.75" fill={COLORS.gold} />
      {/* Base */}
      <Rect x="7" y="19.5" width="10" height="1.5" rx="0.75" fill={COLORS.gold} />
      {/* Horizontal beam */}
      <Rect x="2" y="6.25" width="20" height="1.5" rx="0.75" fill={COLORS.gold} />
      {/* Left chain */}
      <Rect x="3.5" y="7.75" width="1" height="5" rx="0.5" fill={COLORS.gold} />
      {/* Right chain */}
      <Rect x="19.5" y="7.75" width="1" height="5" rx="0.5" fill={COLORS.gold} />
      {/* Left pan */}
      <Ellipse cx="4" cy="13.5" rx="4" ry="1.25" fill={COLORS.gold} />
      {/* Right pan */}
      <Ellipse cx="20" cy="13.5" rx="4" ry="1.25" fill={COLORS.gold} />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// Animated percentage bar
// ─────────────────────────────────────────────

function PercentBar({
  percent,
  color,
  animate,
}: {
  percent: number;
  color: string;
  animate: boolean;
}) {
  const width = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!animate) return;
    // Bar width animation
    width.value = withTiming(percent, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
    // Counter animation
    const steps = 50;
    const interval = 1500 / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setDisplay(Math.min(Math.round((current / steps) * percent), percent));
      if (current >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [animate, percent]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.percentWrap}>
      <View style={styles.percentTrack}>
        <Reanimated.View
          style={[styles.percentFill, { backgroundColor: color }, barStyle]}
        />
      </View>
      <Text style={[styles.percentNum, { color }]}>{display}%</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Phase 1 — WEIGH
// ─────────────────────────────────────────────

function WeighPhase() {
  const { scale, castVote } = useScaleStore();
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [confirming, setConfirming] = useState(false);

  const confirmOpacity = useRef(new Animated.Value(0)).current;
  const cardAScale = useRef(new Animated.Value(1)).current;
  const cardBScale = useRef(new Animated.Value(1)).current;

  const select = useCallback(
    async (side: 'a' | 'b') => {
      await Haptics.selectionAsync();
      setSelected(side);

      // Scale-up selected card, scale neutral the other
      Animated.parallel([
        Animated.spring(side === 'a' ? cardAScale : cardBScale, {
          toValue: 1.02,
          useNativeDriver: true,
          friction: 6,
        }),
        Animated.spring(side === 'a' ? cardBScale : cardAScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
        }),
        Animated.timing(confirmOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [cardAScale, cardBScale, confirmOpacity],
  );

  const handleConfirm = async () => {
    if (!selected || !scale?.id || confirming) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConfirming(true);
    try {
      await castVote(scale.id, selected);
      // castVote sets phase to 'see' in the store — nothing else needed here
    } catch {
      setConfirming(false);
    }
  };

  if (!scale) return null;

  return (
    <View style={styles.phaseWrap}>
      <View style={styles.scaleHeader}>
        <BalanceScaleIcon size={28} />
        <Text style={styles.sectionLabel}>TODAY'S DAILY SCALE</Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{scale.question}</Text>
      </View>

      <View style={styles.sidesRow}>
        {/* Side A */}
        <Pressable
          onPress={() => select('a')}
          style={({ pressed }) => [
            styles.sideCard,
            selected === 'a' && styles.sideCardSelected,
            pressed && styles.pressed,
          ]}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === 'a' }}
        >
          <Animated.View
            style={[styles.sideCardInner, { transform: [{ scale: cardAScale }], opacity: selected === 'b' ? 0.55 : 1 }]}
          >
            <View style={styles.badgeA}>
              <Text style={styles.badgeTextA}>A</Text>
            </View>
            <Text style={styles.sideLabel}>{scale.side_a_label}</Text>
            <Text style={styles.sideArg}>{scale.side_a_argument}</Text>
          </Animated.View>
        </Pressable>

        {/* Side B */}
        <Pressable
          onPress={() => select('b')}
          style={({ pressed }) => [
            styles.sideCard,
            selected === 'b' && styles.sideCardSelected,
            pressed && styles.pressed,
          ]}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === 'b' }}
        >
          <Animated.View
            style={[styles.sideCardInner, { transform: [{ scale: cardBScale }], opacity: selected === 'a' ? 0.55 : 1 }]}
          >
            <View style={styles.badgeB}>
              <Text style={styles.badgeTextB}>B</Text>
            </View>
            <Text style={styles.sideLabel}>{scale.side_b_label}</Text>
            <Text style={styles.sideArg}>{scale.side_b_argument}</Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* Confirm button — fades in after selection */}
      <Animated.View style={[styles.confirmWrap, { opacity: confirmOpacity }]}>
        <Pressable
          onPress={handleConfirm}
          disabled={!selected || confirming}
          style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.confirmBtnText}>
            {confirming ? 'Recording…' : 'Confirm my choice'}
          </Text>
        </Pressable>
      </Animated.View>

      <Text style={styles.weighFooter}>Weigh carefully. You can only choose once.</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Phase 2 — SEE
// ─────────────────────────────────────────────

function SeePhase() {
  const { scale, userVote, results, setPhase } = useScaleStore();
  const [animating, setAnimating] = useState(false);
  const totalVotesStr = results ? results.total.toLocaleString() : '0';

  useEffect(() => {
    // Start animation shortly after mount for drama
    const t = setTimeout(async () => {
      setAnimating(true);
      // Fire success haptic after animation completes
      setTimeout(async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1600);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  if (!scale || !results) return null;

  const isMajority =
    (userVote === 'a' && results.percent_a >= 50) ||
    (userVote === 'b' && results.percent_b >= 50);

  return (
    <View style={styles.phaseWrap}>
      <View style={styles.scaleHeader}>
        <BalanceScaleIcon size={28} />
        <Text style={styles.sectionLabel}>THE COMMUNITY HAS SPOKEN</Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{scale.question}</Text>
      </View>

      {/* Side A result */}
      <View style={[styles.resultCard, userVote === 'a' && styles.resultCardChosen]}>
        <View style={styles.resultCardHeader}>
          <View style={styles.badgeA}>
            <Text style={styles.badgeTextA}>A</Text>
          </View>
          <Text style={styles.sideLabel}>{scale.side_a_label}</Text>
          {userVote === 'a' && <Text style={styles.yourChoiceTag}>Your choice</Text>}
        </View>
        <PercentBar
          percent={results.percent_a}
          color={COLORS.navy}
          animate={animating}
        />
      </View>

      {/* Side B result */}
      <View style={[styles.resultCard, userVote === 'b' && styles.resultCardChosen]}>
        <View style={styles.resultCardHeader}>
          <View style={styles.badgeB}>
            <Text style={styles.badgeTextB}>B</Text>
          </View>
          <Text style={styles.sideLabel}>{scale.side_b_label}</Text>
          {userVote === 'b' && <Text style={styles.yourChoiceTag}>Your choice</Text>}
        </View>
        <PercentBar
          percent={results.percent_b}
          color={COLORS.gold}
          animate={animating}
        />
      </View>

      <Text style={styles.totalVotes}>{totalVotesStr} believers weighed in</Text>

      <Text style={styles.majorityText}>
        {isMajority
          ? 'You\'re with the majority — but the minority has wisdom too.'
          : 'You\'re in the minority — and that\'s okay. Discernment isn\'t a vote.'}
      </Text>

      <Pressable
        onPress={() => setPhase('learn')}
        style={({ pressed }) => [styles.lensBtn, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        <Text style={styles.lensBtnText}>See the Scripture Lens →</Text>
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────
// Phase 3 — LEARN
// ─────────────────────────────────────────────

function LearnPhase() {
  const { scale, userVote, results } = useScaleStore();

  if (!scale) return null;

  return (
    <View style={styles.learnContent}>
      <View style={styles.scaleHeader}>
        <BalanceScaleIcon size={28} />
        <Text style={styles.sectionLabel}>THE SCRIPTURE LENS</Text>
      </View>

      {scale.scripture_reference && (
        <Text style={styles.scriptureRef}>{scale.scripture_reference}</Text>
      )}

      {scale.scripture_text && (
        <View style={styles.scriptureTextCard}>
          <Text style={styles.scriptureText}>{scale.scripture_text}</Text>
        </View>
      )}

      <View style={styles.goldDivider} />

      {scale.scripture_lens && (
        <Text style={styles.lensText}>{scale.scripture_lens}</Text>
      )}

      {scale.prayer && (
        <View style={styles.prayerCard}>
          <Text style={styles.prayerLabel}>A PRAYER FOR THE TENSION</Text>
          <Text style={styles.prayerText}>{scale.prayer}</Text>
        </View>
      )}

      {results && (
        <View style={styles.learnResults}>
          <Text style={styles.learnResultsLabel}>Community: </Text>
          <Text style={styles.learnResultsA}>{results.percent_a}% chose A</Text>
          <Text style={styles.learnResultsDot}> · </Text>
          <Text style={styles.learnResultsB}>{results.percent_b}% chose B</Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Main DailyScale component
// ─────────────────────────────────────────────

export function DailyScale() {
  const { scale, phase, isLoading } = useScaleStore();

  if (isLoading && !scale) {
    return (
      <View style={styles.skeleton}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '75%' }]} />
        <View style={[styles.skeletonLine, { width: '60%' }]} />
      </View>
    );
  }

  if (!scale) return null;

  return (
    <View>
      {phase === 'weigh' && <WeighPhase />}
      {phase === 'see' && <SeePhase />}
      {phase === 'learn' && <LearnPhase />}
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  phaseWrap: { gap: SPACING.lg },

  // Header
  scaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    flex: 1,
  },

  // Question
  questionCard: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  questionText: {
    fontFamily: FONTS.scripture,
    fontSize: 18,
    color: COLORS.navy,
    lineHeight: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Side cards
  sidesRow: { flexDirection: 'row', gap: SPACING.md },
  sideCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.warmWhite,
  },
  sideCardSelected: {
    borderColor: COLORS.gold,
    borderWidth: 2,
    ...SHADOWS.card,
  },
  sideCardInner: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },

  // Badges
  badgeA: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  badgeTextA: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.cream,
  },
  badgeB: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  badgeTextB: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.navy,
  },

  sideLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.navy,
    lineHeight: 18,
  },
  sideArg: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMedium,
    lineHeight: 18,
  },

  // Confirm button
  confirmWrap: { width: '100%' },
  confirmBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    color: COLORS.navy,
  },

  weighFooter: {
    fontFamily: FONTS.scripture,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Result cards
  resultCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.sm,
    backgroundColor: COLORS.warmWhite,
  },
  resultCardChosen: {
    borderColor: COLORS.gold,
    borderWidth: 2,
    borderLeftWidth: 3,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  yourChoiceTag: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: COLORS.gold,
    marginLeft: 'auto',
  },

  // Percent bar
  percentWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  percentTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  percentFill: {
    height: 8,
    borderRadius: 4,
  },
  percentNum: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    width: 36,
    textAlign: 'right',
  },

  totalVotes: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  majorityText: {
    fontFamily: FONTS.scripture,
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },

  lensBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  lensBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    color: COLORS.cream,
  },

  // LEARN phase
  learnContent: {
    gap: SPACING.xl,
    paddingBottom: SPACING['2xl'],
  },
  scriptureRef: {
    fontFamily: FONTS.display,
    fontSize: 16,
    color: COLORS.gold,
    textAlign: 'center',
  },
  scriptureTextCard: {
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
  },
  scriptureText: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.navy,
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  goldDivider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    alignSelf: 'center',
  },
  lensText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 26,
  },
  prayerCard: {
    borderTopWidth: 2,
    borderTopColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.parchment,
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  prayerLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  prayerText: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  learnResults: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  learnResultsLabel: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textLight,
  },
  learnResultsA: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.navy,
  },
  learnResultsDot: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textLight,
  },
  learnResultsB: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.gold,
  },

  // Loading skeleton
  skeleton: {
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.border,
    width: '100%',
  },

  pressed: { opacity: 0.75 },
});
