import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import type { DiscernmentResponse } from '@librato/shared';
import { Card } from '@/components/ui/Card';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

interface StepExaminationProps {
  response: DiscernmentResponse;
}

export function StepExamination({ response }: StepExaminationProps) {
  const itemAnims = useRef(
    response.examination.map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(-12),
    })),
  ).current;

  useEffect(() => {
    const animations = itemAnims.map(({ opacity, translateX }, i) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay: 100 + i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 400,
          delay: 100 + i * 100,
          useNativeDriver: true,
        }),
      ]),
    );
    Animated.stagger(100, animations).start();
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Intro */}
      <Card highlighted style={styles.introCard}>
        <Text style={styles.introTitle}>Sit with these questions</Text>
        <Text style={styles.introSubtitle}>
          Ignatius taught us to examine our consolations and desolations — where God moves in us and
          where resistance rises.
        </Text>
      </Card>

      {/* Examination questions */}
      {response.examination.map((question, i) => {
        const anim = itemAnims[Math.min(i, itemAnims.length - 1)];
        return (
          <Animated.View
            key={i}
            style={{
              opacity: anim?.opacity ?? 1,
              transform: [{ translateX: anim?.translateX ?? 0 }],
            }}
          >
            <View style={styles.questionRow}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>
              <Card style={styles.questionCard}>
                <Text style={styles.questionText}>{question}</Text>
              </Card>
            </View>
          </Animated.View>
        );
      })}

      {/* Reflective footer */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <Text style={styles.footerText}>
          There are no right answers — only honest ones.
        </Text>
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING['5xl'] },

  introCard: { marginBottom: SPACING.sm },
  introTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.navy,
    marginBottom: SPACING.sm,
  },
  introSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 22,
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    flexShrink: 0,
  },
  numberText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
  },
  questionCard: { flex: 1 },
  questionText: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.navy,
    lineHeight: 28,
    fontStyle: 'italic',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  footerText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    flexShrink: 1,
  },
});
