import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useScaleStore } from '@/stores/useScaleStore';
import { apiClient } from '@/lib/api';
import { registerForPushNotifications, scheduleDailyMomentNotification } from '@/lib/notifications';
import { Button } from '@/components/ui/Button';
import { DailyScale } from '@/components/scale/DailyScale';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const SEASONS = [
  { id: 'crossroads', icon: '⚖️', label: 'A Crossroads', subtitle: 'Facing a significant decision' },
  { id: 'new_beginning', icon: '🌱', label: 'A New Beginning', subtitle: 'Starting something new' },
  { id: 'waiting', icon: '⏳', label: 'A Season of Waiting', subtitle: 'In between chapters' },
  { id: 'struggle', icon: '🌊', label: 'A Season of Struggle', subtitle: 'Going through difficulty' },
  { id: 'growth', icon: '✝', label: 'A Season of Growth', subtitle: 'Deepening my faith' },
] as const;

const TIME_PRESETS = [
  { label: '6 AM', value: '06:00' },
  { label: '7 AM', value: '07:00' },
  { label: '8 AM', value: '08:00' },
  { label: '9 AM', value: '09:00' },
] as const;

// ─────────────────────────────────────────────
// Circular countdown ring
// ─────────────────────────────────────────────

const RING_SIZE = 96;
const RING_STROKE = 5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function CountdownRing({ secondsLeft, total }: { secondsLeft: number; total: number }) {
  const progress = secondsLeft / total;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.ringWrap}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ringSvg}>
        {/* Track */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={COLORS.border}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        {/* Progress arc — rotated so it starts at top */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={COLORS.gold}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeDasharray={`${RING_CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>
      <Text style={styles.ringNumber}>{secondsLeft}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Screen 1 — The Hook
// ─────────────────────────────────────────────

function Screen1({ onNext }: { onNext: () => void }) {
  const crossOpacity = useRef(new Animated.Value(0)).current;
  const headOpacity = useRef(new Animated.Value(0)).current;
  const quoteOpacity = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const make = (v: Animated.Value, delay: number) =>
      Animated.timing(v, { toValue: 1, duration: 700, delay, useNativeDriver: true });

    Animated.parallel([
      make(crossOpacity, 100),
      make(headOpacity, 400),
      make(quoteOpacity, 700),
      make(subOpacity, 1000),
      make(btnOpacity, 1300),
    ]).start();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.Text style={[styles.crossIcon, { opacity: crossOpacity }]}>✝</Animated.Text>

      <Animated.Text style={[styles.hookHeading, { opacity: headOpacity }]}>
        What decision is weighing on your heart?
      </Animated.Text>

      <View style={styles.goldDivider} />

      <Animated.Text style={[styles.hookQuote, { opacity: quoteOpacity }]}>
        "This is not a place for quick answers. It's a space where you bring your real
        questions before God, guided by His Word and the wisdom of His people across centuries."
      </Animated.Text>

      <Animated.Text style={[styles.hookSub, { opacity: subOpacity }]}>
        We don't replace the Holy Spirit, your pastor, or your community.{'\n'}
        We help you listen more carefully.
      </Animated.Text>

      <Animated.View style={[styles.btnWrap, { opacity: btnOpacity }]}>
        <Button
          title="Begin"
          onPress={onNext}
          fullWidth
        />
      </Animated.View>

      <Text style={styles.verse}>
        "Trust in the Lord with all your heart, and do not lean on your own understanding." — Prov. 3:5
      </Text>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// Screen 2 — Season Selection
// ─────────────────────────────────────────────

function Screen2({ onNext }: { onNext: () => void }) {
  const { selectedSeason, setSeason } = useOnboardingStore();

  const handleSelect = async (id: string) => {
    await Haptics.selectionAsync();
    setSeason(id);
  };

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNext();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepLabel}>Your Season</Text>
      <Text style={styles.screen2Heading}>What season are you in right now?</Text>
      <Text style={styles.screen2Sub}>
        Be honest. God meets you exactly where you are.
      </Text>

      <View style={styles.seasonList}>
        {SEASONS.map((s) => {
          const selected = selectedSeason === s.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => handleSelect(s.id)}
              style={[styles.seasonCard, selected && styles.seasonCardSelected]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <Text style={styles.seasonIcon}>{s.icon}</Text>
              <View style={styles.seasonText}>
                <Text style={[styles.seasonLabel, selected && styles.seasonLabelSelected]}>
                  {s.label}
                </Text>
                <Text style={styles.seasonSub}>{s.subtitle}</Text>
              </View>
              {selected && <Text style={styles.seasonCheck}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedSeason}
        fullWidth
        style={styles.btnWrap}
      />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// Screen 3 — Micro-discernment
// ─────────────────────────────────────────────

const MICRO_TOTAL = 5;

function Screen3({ onNext }: { onNext: () => void }) {
  const { selectedSeason, setMicroDiscernmentResponse } = useOnboardingStore();
  const [secondsLeft, setSecondsLeft] = useState(MICRO_TOTAL);
  const [showButtons, setShowButtons] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const season = SEASONS.find((s) => s.id === selectedSeason);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        // Haptic pulse each second
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          setShowButtons(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, []);

  const handleResponse = async (response: 'peace' | 'tension') => {
    await Haptics.selectionAsync();
    setMicroDiscernmentResponse(response);
    onNext();
  };

  return (
    <View style={styles.screenContent}>
      <Text style={styles.stepLabel}>A Moment With God</Text>
      <Text style={styles.microHeading}>
        Bring {season ? `"${season.label}"` : 'your situation'} before God.
      </Text>
      <Text style={styles.microPrompt}>
        Close your eyes. Take a slow breath. Hold this decision gently in your heart.
      </Text>

      <View style={styles.microCenter}>
        <CountdownRing secondsLeft={secondsLeft} total={MICRO_TOTAL} />
      </View>

      {!showButtons ? (
        <Text style={styles.microWaiting}>Sit in stillness...</Text>
      ) : (
        <View style={styles.responseWrap}>
          <Text style={styles.responsePrompt}>
            As you held this before God, what did you feel?
          </Text>
          <View style={styles.responseRow}>
            <Pressable
              style={[styles.responseBtn, styles.responsePeace]}
              onPress={() => handleResponse('peace')}
              accessibilityRole="button"
            >
              <Text style={styles.responseBtnIcon}>🕊️</Text>
              <Text style={styles.responseBtnLabel}>Peace</Text>
            </Pressable>
            <Pressable
              style={[styles.responseBtn, styles.responseTension]}
              onPress={() => handleResponse('tension')}
              accessibilityRole="button"
            >
              <Text style={styles.responseBtnIcon}>🌊</Text>
              <Text style={styles.responseBtnLabel}>Tension</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Screen 4 — Notification Time Picker
// ─────────────────────────────────────────────

function Screen4({ onNext }: { onNext: () => void }) {
  const { selectedNotificationTime, setNotificationTime } = useOnboardingStore();
  const [saving, setSaving] = useState(false);

  const handleBegin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);

    try {
      // Request push permissions
      await registerForPushNotifications();
      // Schedule local daily notification
      await scheduleDailyMomentNotification(selectedNotificationTime).catch(() => {});
    } catch {
      // Non-fatal
    } finally {
      setSaving(false);
      onNext();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepLabel}>Daily Moment</Text>
      <Text style={styles.notifHeading}>
        When would you like your Daily Moment?
      </Text>
      <Text style={styles.notifSub}>
        Each morning, a scripture and reflection waits for you.
      </Text>

      <View style={styles.timePills}>
        {TIME_PRESETS.map((t) => {
          const selected = selectedNotificationTime === t.value;
          return (
            <Pressable
              key={t.value}
              onPress={async () => {
                await Haptics.selectionAsync();
                setNotificationTime(t.value);
              }}
              style={[styles.timePill, selected && styles.timePillSelected]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.timePillLabel, selected && styles.timePillLabelSelected]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.notifNote}>
        You can change this anytime in Settings.
      </Text>

      <Button
        title={saving ? 'Setting up…' : 'Begin My Journey'}
        onPress={handleBegin}
        disabled={saving}
        fullWidth
        style={styles.btnWrap}
      />

      <Pressable
        onPress={onNext}
        style={styles.skipRow}
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// Screen 5 — First Daily Scale
// ─────────────────────────────────────────────

function Screen5() {
  const { selectedSeason, selectedNotificationTime } = useOnboardingStore();
  const { user } = useAuthStore();
  const { fetchTodayScale, phase } = useScaleStore();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Friend';
  const [finishing, setFinishing] = useState(false);

  const headOpacity = useRef(new Animated.Value(0)).current;
  const scaleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTodayScale();
    Animated.stagger(300, [
      Animated.timing(headOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(scaleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleFinish = async () => {
    if (finishing) return;
    setFinishing(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await apiClient.updateProfile({
        onboarding_completed: true,
        onboarding_season: selectedSeason ?? undefined,
        daily_scale_time: selectedNotificationTime,
      });
    } catch {
      // Non-fatal
    }
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.Text style={[styles.stepLabel, { opacity: headOpacity }]}>
        Your First Daily Scale
      </Animated.Text>
      <Animated.Text style={[styles.screen2Heading, { opacity: headOpacity }]}>
        Welcome, {firstName}.{'\n'}Here's today's question.
      </Animated.Text>
      <Animated.Text style={[styles.screen2Sub, { opacity: headOpacity }]}>
        BibleDiscern trains discernment daily — one honest question at a time.
      </Animated.Text>

      <Animated.View style={[{ opacity: scaleOpacity, width: '100%' }]}>
        <DailyScale />
      </Animated.View>

      {/* Always-visible escape hatch — fades in after scale loads */}
      <Animated.View style={[styles.btnWrap, { opacity: scaleOpacity }]}>
        <Pressable
          onPress={handleFinish}
          style={styles.skipRow}
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>
            {phase === 'learn' ? 'Enter BibleDiscern →' : 'Skip for now'}
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// Root — State machine + crossfade
// ─────────────────────────────────────────────

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const opacity = useSharedValue(1);

  const goToStep = useCallback(
    (newStep: number) => {
      opacity.value = withTiming(0, { duration: 150 }, (finished) => {
        'worklet';
        if (finished) {
          runOnJS(setStep)(newStep);
          opacity.value = withTiming(1, { duration: 400 });
        }
      });
    },
    [opacity],
  );

  const next = useCallback(() => goToStep(step + 1), [goToStep, step]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Progress dots */}
      <View style={styles.progressRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
          />
        ))}
      </View>

      <Reanimated.View style={[styles.flex, animStyle]}>
        {step === 1 && <Screen1 onNext={next} />}
        {step === 2 && <Screen2 onNext={next} />}
        {step === 3 && <Screen3 onNext={next} />}
        {step === 4 && <Screen4 onNext={next} />}
        {step === 5 && <Screen5 />}
      </Reanimated.View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  flex: { flex: 1 },

  // Progress dots
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.gold,
  },
  dotDone: {
    backgroundColor: COLORS.goldMuted,
  },

  // Common screen layout
  screenContent: {
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING['5xl'],
    alignItems: 'center',
    gap: SPACING['2xl'],
  },

  // ── Screen 1
  crossIcon: { fontSize: 56, color: COLORS.navy },
  hookHeading: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 36,
  },
  goldDivider: { width: 40, height: 1, backgroundColor: COLORS.gold },
  hookQuote: {
    fontFamily: FONTS.scripture,
    fontSize: 18,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 30,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.sm,
  },
  hookSub: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.sm,
  },
  verse: {
    fontFamily: FONTS.scripture,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  btnWrap: { width: '100%' },

  // ── Screen 2
  stepLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  screen2Heading: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 34,
  },
  screen2Sub: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  seasonList: { width: '100%', gap: SPACING.sm },
  seasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.warmWhite,
  },
  seasonCardSelected: {
    borderColor: COLORS.gold,
    backgroundColor: `${COLORS.gold}12`,
    ...SHADOWS.card,
  },
  seasonIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  seasonText: { flex: 1 },
  seasonLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.navy,
    lineHeight: 22,
  },
  seasonLabelSelected: { color: COLORS.navy },
  seasonSub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  seasonCheck: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    color: COLORS.gold,
  },

  // ── Screen 3
  microHeading: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 32,
  },
  microPrompt: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.md,
  },
  microCenter: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.lg },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSvg: { position: 'absolute' },
  ringNumber: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.navy,
    lineHeight: 40,
  },
  microWaiting: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  responseWrap: { width: '100%', gap: SPACING.lg, alignItems: 'center' },
  responsePrompt: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 24,
  },
  responseRow: { flexDirection: 'row', gap: SPACING.md, width: '100%' },
  responseBtn: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1.5,
  },
  responsePeace: {
    borderColor: COLORS.sage,
    backgroundColor: `${COLORS.sage}14`,
  },
  responseTension: {
    borderColor: COLORS.navy,
    backgroundColor: `${COLORS.navy}0A`,
  },
  responseBtnIcon: { fontSize: 28 },
  responseBtnLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.navy,
  },

  // ── Screen 4
  notifHeading: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 34,
  },
  notifSub: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
  },
  timePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
    width: '100%',
  },
  timePill: {
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.warmWhite,
  },
  timePillSelected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold,
  },
  timePillLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.navy,
  },
  timePillLabelSelected: {
    color: COLORS.navy,
  },
  notifNote: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  skipRow: { paddingVertical: SPACING.sm },
  skipText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },

});
