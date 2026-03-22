import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import type { DiscernmentResponse } from '@librato/shared';
import { Card } from '@/components/ui/Card';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

interface StepWordProps {
  response: DiscernmentResponse;
}

export function StepWord({ response }: StepWordProps) {
  const anims = useRef(
    response.scriptures.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(16),
    })),
  ).current;

  useEffect(() => {
    const animations = anims.map(({ opacity, translateY }, i) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          delay: i * 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          delay: i * 80,
          useNativeDriver: true,
        }),
      ]),
    );
    Animated.stagger(80, animations).start();
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary card */}
      <Card highlighted style={styles.summaryCard}>
        <Text style={styles.summaryText}>{response.summary}</Text>
      </Card>

      {/* Scripture cards */}
      {response.scriptures.map((scripture, i) => {
        const anim = anims[Math.min(i, anims.length - 1)];
        return (
          <Animated.View
            key={scripture.reference}
            style={{
              opacity: anim?.opacity ?? 1,
              transform: [{ translateY: anim?.translateY ?? 0 }],
            }}
          >
            <Card style={styles.scriptureCard}>
              <Text style={styles.reference}>{scripture.reference}</Text>
              <View style={styles.divider} />
              <Text style={styles.verse}>{scripture.text}</Text>
              <Text style={styles.context}>{scripture.context}</Text>
            </Card>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING['5xl'] },

  summaryCard: { marginBottom: SPACING.sm },
  summaryText: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.navy,
    lineHeight: 28,
    fontStyle: 'italic',
  },

  scriptureCard: { gap: SPACING.md },
  reference: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  divider: { height: 1, width: 32, backgroundColor: COLORS.gold },
  verse: {
    fontFamily: FONTS.scripture,
    fontSize: 20,
    color: COLORS.navy,
    lineHeight: 34,
    fontStyle: 'italic',
  },
  context: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 22,
  },
});
