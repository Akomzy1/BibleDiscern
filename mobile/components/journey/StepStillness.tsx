import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { STILLNESS } from '@librato/shared';

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface StepStillnessProps {
  onComplete?: () => void;
}

const PHASE_LABELS: Record<Phase, string> = {
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out',
  pause: 'Rest',
};

const PHASE_VERSE = 'Be still and know that I am God. — Psalm 46:10';

export function StepStillness({ onComplete }: StepStillnessProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);
  const phaseIndex = useSharedValue(0); // 0=inhale,1=hold,2=exhale,3=pause

  const phaseLabel = useSharedValue('Breathe in');

  const setPhaseLabel = useCallback((label: string) => {
    // This runs on JS thread via runOnJS
    phaseLabel.value = label;
  }, []);

  useEffect(() => {
    // One breathing cycle: inhale → hold → exhale → pause
    const cycleDuration =
      STILLNESS.inhaleMs + STILLNESS.holdMs + STILLNESS.exhaleMs + STILLNESS.pauseMs;

    // Animate the orb scale through a full breathing cycle
    scale.value = withRepeat(
      withSequence(
        // Inhale: grow
        withTiming(1.35, {
          duration: STILLNESS.inhaleMs,
          easing: Easing.inOut(Easing.ease),
        }),
        // Hold: stay
        withTiming(1.35, {
          duration: STILLNESS.holdMs,
          easing: Easing.linear,
        }),
        // Exhale: shrink
        withTiming(1, {
          duration: STILLNESS.exhaleMs,
          easing: Easing.inOut(Easing.ease),
        }),
        // Pause: stay small
        withTiming(1, {
          duration: STILLNESS.pauseMs,
          easing: Easing.linear,
        }),
      ),
      -1, // repeat indefinitely
      false,
    );

    // Opacity pulses with scale
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: STILLNESS.inhaleMs, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: STILLNESS.holdMs }),
        withTiming(0.5, { duration: STILLNESS.exhaleMs, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: STILLNESS.pauseMs }),
      ),
      -1,
      false,
    );

    // Ripple ring — expands outward on inhale
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.8, {
          duration: STILLNESS.inhaleMs + STILLNESS.holdMs,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, { duration: STILLNESS.exhaleMs + STILLNESS.pauseMs }),
      ),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: STILLNESS.inhaleMs }),
        withTiming(0, {
          duration: STILLNESS.holdMs + STILLNESS.exhaleMs + STILLNESS.pauseMs,
          easing: Easing.out(Easing.ease),
        }),
      ),
      -1,
      false,
    );

    // Auto-complete after totalDurationMs
    const timer = setTimeout(() => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(ringScale);
      cancelAnimation(ringOpacity);
      onComplete?.();
    }, STILLNESS.totalDurationMs);

    return () => {
      clearTimeout(timer);
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(ringScale);
      cancelAnimation(ringOpacity);
    };
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Verse */}
      <Text style={styles.verse}>{PHASE_VERSE}</Text>

      {/* Breathing orb */}
      <View style={styles.orbContainer}>
        {/* Ripple ring */}
        <Animated.View style={[styles.ring, ringStyle]} />

        {/* Main orb */}
        <Animated.View style={[styles.orb, orbStyle]}>
          <View style={styles.orbInner} />
        </Animated.View>
      </View>

      {/* Instruction */}
      <View style={styles.instructions}>
        <Text style={styles.instructionLabel}>Follow the breath</Text>
        <View style={styles.phaseRow}>
          <PhaseStep label="Breathe in" duration="4s" />
          <View style={styles.phaseDot} />
          <PhaseStep label="Hold" duration="2s" />
          <View style={styles.phaseDot} />
          <PhaseStep label="Breathe out" duration="4s" />
        </View>
      </View>

      {/* Bottom note */}
      <Text style={styles.note}>
        Continue breathing with the orb. This screen will advance when the time is complete.
      </Text>
    </View>
  );
}

function PhaseStep({ label, duration }: { label: string; duration: string }) {
  return (
    <View style={styles.phaseStep}>
      <Text style={styles.phaseLabel}>{label}</Text>
      <Text style={styles.phaseDuration}>{duration}</Text>
    </View>
  );
}

const ORB_SIZE = 160;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING['3xl'],
  },

  verse: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.xl,
  },

  orbContainer: {
    width: ORB_SIZE * 2,
    height: ORB_SIZE * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: `${COLORS.navy}CC`,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  orbInner: {
    width: ORB_SIZE * 0.5,
    height: ORB_SIZE * 0.5,
    borderRadius: ORB_SIZE * 0.25,
    backgroundColor: `${COLORS.gold}33`,
  },

  instructions: { alignItems: 'center', gap: SPACING.md },
  instructionLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  phaseStep: { alignItems: 'center', gap: 2 },
  phaseLabel: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textDark },
  phaseDuration: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.textLight },
  phaseDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.gold },

  note: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.xl,
  },
});
