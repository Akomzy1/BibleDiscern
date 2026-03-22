import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/stores/useSessionStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { StepWord } from '@/components/journey/StepWord';
import { StepNarratives } from '@/components/journey/StepNarratives';
import { StepExamination } from '@/components/journey/StepExamination';
import { StepStillness } from '@/components/journey/StepStillness';
import { StepFruit } from '@/components/journey/StepFruit';
import { StepPrayer } from '@/components/journey/StepPrayer';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

const STEP_TITLES = [
  'The Word',
  'Those Who Walked Before',
  'The Examination',
  'The Stillness',
  'The Fruit',
  'The Prayer',
] as const;

const STEP_SUBTITLES = [
  'What Scripture speaks to your situation',
  'Biblical figures who faced your crossroads',
  'Questions to sit with before God',
  'Be still and know',
  'The Spirit\'s movement in you',
  'Your Ebenezer Stone',
] as const;

const TOTAL_STEPS = 6;

export default function JourneyScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { sessions, fetchSession } = useSessionStore();
  const { isPremium } = useSubscriptionStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [stillnessDone, setStillnessDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const session = sessions.find((s) => s.id === sessionId);
  const response = session?.ai_response;

  useEffect(() => {
    if (!session && sessionId) {
      setLoading(true);
      fetchSession(sessionId).finally(() => setLoading(false));
    }
  }, [sessionId]);

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const animateToStep = (nextStep: number) => {
    const direction = nextStep > currentStep ? 1 : -1;
    headerOpacity.setValue(0);
    slideAnim.setValue(direction * 40);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentStep(nextStep);
  };

  const handleNext = () => {
    Haptics.selectionAsync();
    if (currentStep < TOTAL_STEPS - 1) {
      animateToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    Haptics.selectionAsync();
    if (currentStep > 0) {
      animateToStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  if (loading || !response) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparing your journey...</Text>
      </View>
    );
  }

  const isStillnessStep = currentStep === 3;
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const canAdvanceStillness = stillnessDone;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Animated.View style={[styles.headerCenter, { opacity: headerOpacity }]}>
          <Text style={styles.stepCounter}>
            {currentStep + 1} of {TOTAL_STEPS}
          </Text>
          <Text style={styles.stepTitle}>{STEP_TITLES[currentStep]}</Text>
        </Animated.View>

        {/* Empty right side for balance */}
        <View style={styles.headerRight} />
      </View>

      {/* Step dots */}
      <View style={styles.dots}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentStep && styles.dotActive,
              i < currentStep && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Subtitle */}
      <Animated.Text
        style={[styles.stepSubtitle, { opacity: headerOpacity, transform: [{ translateY: slideAnim }] }]}
      >
        {STEP_SUBTITLES[currentStep]}
      </Animated.Text>

      {/* Step content */}
      <Animated.View
        style={[
          styles.stepContent,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {currentStep === 0 && <StepWord response={response} />}
        {currentStep === 1 && <StepNarratives response={response} />}
        {currentStep === 2 && <StepExamination response={response} />}
        {currentStep === 3 && (
          <StepStillness onComplete={() => setStillnessDone(true)} />
        )}
        {currentStep === 4 && (
          <StepFruit response={response} isPremium={isPremium} />
        )}
        {currentStep === 5 && (
          <StepPrayer
            response={response}
            sessionId={sessionId ?? ''}
            stillnessNote={session?.stillness_note ?? undefined}
          />
        )}
      </Animated.View>

      {/* Navigation footer */}
      {!isLastStep && (
        <View style={styles.footer}>
          {isStillnessStep ? (
            <Button
              title={canAdvanceStillness ? 'Continue' : 'In stillness...'}
              onPress={handleNext}
              disabled={!canAdvanceStillness}
              fullWidth
            />
          ) : (
            <Button title="Continue" onPress={handleNext} fullWidth />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
  },
  loadingText: {
    fontFamily: FONTS.scripture,
    fontSize: 18,
    color: COLORS.textMedium,
    fontStyle: 'italic',
  },

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
  backButton: { width: 40, alignItems: 'flex-start' },
  backIcon: { fontFamily: FONTS.body, fontSize: 28, color: COLORS.navy, lineHeight: 32 },
  headerCenter: { flex: 1, alignItems: 'center' },
  stepCounter: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.navy,
    marginTop: 2,
  },
  headerRight: { width: 40 },

  dots: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: SPACING.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.gold,
    width: 16,
  },
  dotCompleted: {
    backgroundColor: `${COLORS.gold}88`,
  },

  stepSubtitle: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING.sm,
  },

  stepContent: { flex: 1 },

  footer: {
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
    backgroundColor: COLORS.cream,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
