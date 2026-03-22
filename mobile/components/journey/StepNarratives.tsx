import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import type { DiscernmentResponse } from '@librato/shared';
import { Card } from '@/components/ui/Card';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

interface StepNarrativesProps {
  response: DiscernmentResponse;
}

export function StepNarratives({ response }: StepNarrativesProps) {
  const anims = useRef(
    response.biblicalNarratives.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    })),
  ).current;

  useEffect(() => {
    const animations = anims.map(({ opacity, translateY }, i) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          delay: i * 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          delay: i * 150,
          useNativeDriver: true,
        }),
      ]),
    );
    Animated.stagger(150, animations).start();
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Intro */}
      <Text style={styles.intro}>
        You're not the first to stand at this crossroads. Here are those who walked a similar path.
      </Text>

      {/* Narrative cards */}
      {response.biblicalNarratives.map((narrative, i) => {
        const anim = anims[Math.min(i, anims.length - 1)];
        const initial = narrative.character?.charAt(0)?.toUpperCase() ?? '?';

        return (
          <Animated.View
            key={`${narrative.character}-${i}`}
            style={{
              opacity: anim?.opacity ?? 1,
              transform: [{ translateY: anim?.translateY ?? 0 }],
            }}
          >
            <Card style={styles.narrativeCard}>
              {/* Header: avatar + name + reference */}
              <View style={styles.header}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetter}>{initial}</Text>
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.characterName}>{narrative.character}</Text>
                  <Text style={styles.reference}>{narrative.reference}</Text>
                </View>
              </View>

              {/* Connection paragraph */}
              <Text style={styles.connection}>{narrative.connection}</Text>

              {/* Lesson box */}
              <View style={styles.lessonBox}>
                <Text style={styles.lessonText}>{narrative.lesson}</Text>
              </View>
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

  intro: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textMedium,
    lineHeight: 26,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },

  narrativeCard: { gap: SPACING.lg },

  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarLetter: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.gold,
  },
  headerText: { flex: 1 },
  characterName: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.navy,
  },
  reference: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  connection: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 24,
  },

  lessonBox: {
    backgroundColor: `${COLORS.gold}18`,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    borderRadius: 4,
    padding: SPACING.md,
  },
  lessonText: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.navy,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
