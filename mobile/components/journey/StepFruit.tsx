import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText, G } from 'react-native-svg';
import type { DiscernmentResponse } from '@librato/shared';
import { Card } from '@/components/ui/Card';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface StepFruitProps {
  response: DiscernmentResponse;
  isPremium: boolean;
}

const FRUIT_KEYS = [
  'love',
  'joy',
  'peace',
  'patience',
  'kindness',
  'goodness',
  'faithfulness',
  'gentleness',
  'selfControl',
] as const;

const FRUIT_LABELS: Record<(typeof FRUIT_KEYS)[number], string> = {
  love: 'Love',
  joy: 'Joy',
  peace: 'Peace',
  patience: 'Patience',
  kindness: 'Kindness',
  goodness: 'Goodness',
  faithfulness: 'Faith',
  gentleness: 'Gentle',
  selfControl: 'Self-Ctrl',
};

const CHART_SIZE = 240;
const CENTER = CHART_SIZE / 2;
const RADIUS = 90;
const LABEL_RADIUS = RADIUS + 18;
const NUM_AXES = FRUIT_KEYS.length;

function polarToCartesian(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function buildPolygonPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const angle = (i * 360) / NUM_AXES - 90;
      const r = (v / 10) * RADIUS;
      const pt = polarToCartesian(angle, r);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

interface RadarChartProps {
  data: Record<string, number>;
}

function RadarChart({ data }: RadarChartProps) {
  const values = FRUIT_KEYS.map((k) => data[k] ?? 5);
  const polygonPoints = buildPolygonPoints(values);

  // Grid rings
  const rings = [2, 4, 6, 8, 10];

  return (
    <Svg width={CHART_SIZE} height={CHART_SIZE}>
      {/* Grid rings */}
      {rings.map((ring) => {
        const ringPoints = Array.from({ length: NUM_AXES }, (_, i) => {
          const angle = (i * 360) / NUM_AXES - 90;
          const r = (ring / 10) * RADIUS;
          const pt = polarToCartesian(angle, r);
          return `${pt.x},${pt.y}`;
        }).join(' ');
        return (
          <Polygon
            key={ring}
            points={ringPoints}
            fill="none"
            stroke={`${COLORS.navy}22`}
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {FRUIT_KEYS.map((_, i) => {
        const angle = (i * 360) / NUM_AXES - 90;
        const end = polarToCartesian(angle, RADIUS);
        return (
          <Line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={end.x}
            y2={end.y}
            stroke={`${COLORS.navy}33`}
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <Polygon
        points={polygonPoints}
        fill={`${COLORS.gold}44`}
        stroke={COLORS.gold}
        strokeWidth={1.5}
      />

      {/* Data dots */}
      {values.map((v, i) => {
        const angle = (i * 360) / NUM_AXES - 90;
        const r = (v / 10) * RADIUS;
        const pt = polarToCartesian(angle, r);
        return <Circle key={i} cx={pt.x} cy={pt.y} r={3.5} fill={COLORS.gold} />;
      })}

      {/* Labels */}
      {FRUIT_KEYS.map((key, i) => {
        const angle = (i * 360) / NUM_AXES - 90;
        const pt = polarToCartesian(angle, LABEL_RADIUS);
        const textAnchor =
          Math.abs(pt.x - CENTER) < 5 ? 'middle' : pt.x < CENTER ? 'end' : 'start';
        return (
          <SvgText
            key={key}
            x={pt.x}
            y={pt.y + 4}
            fontSize={9}
            fontFamily={FONTS.bodyBold}
            fill={COLORS.navy}
            textAnchor={textAnchor}
          >
            {FRUIT_LABELS[key]}
          </SvgText>
        );
      })}
    </Svg>
  );
}

export function StepFruit({ response, isPremium }: StepFruitProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!isPremium) {
    return (
      <View style={styles.lockedContainer}>
        <Text style={styles.lockedIcon}>🍇</Text>
        <Text style={styles.lockedTitle}>Fruit of the Spirit Diagnostic</Text>
        <Text style={styles.lockedSubtitle}>
          See which fruits are ripening in you and which need tending — a personalised map of your
          spiritual growth.
        </Text>
        <Card highlighted style={styles.lockedCard}>
          <Text style={styles.lockedVerse}>
            "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness,
            faithfulness, gentleness, self-control." — Galatians 5:22-23
          </Text>
        </Card>
        <Text style={styles.lockedCta}>Upgrade to Premium to unlock this step.</Text>
      </View>
    );
  }

  const diagnostic = response.fruitDiagnostic;

  // Build score rows sorted descending
  const scored = FRUIT_KEYS.map((k) => ({
    key: k,
    label: FRUIT_LABELS[k],
    score: diagnostic[k] ?? 5,
  })).sort((a, b) => b.score - a.score);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.intro}>A map of the Spirit's movement in you right now.</Text>

      {/* Radar chart */}
      <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
        <RadarChart data={diagnostic} />
      </Animated.View>

      {/* Score bars */}
      <Card style={styles.barsCard}>
        {scored.map(({ key, label, score }, i) => (
          <View key={key}>
            {i > 0 && <View style={styles.barSeparator} />}
            <View style={styles.barRow}>
              <Text style={styles.barLabel}>{label}</Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[
                    styles.barFill,
                    {
                      width: `${score * 10}%`,
                      backgroundColor: score >= 7 ? COLORS.gold : score >= 4 ? COLORS.navy : COLORS.error,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barScore}>{score}</Text>
            </View>
          </View>
        ))}
      </Card>

      {/* Ripening / Tending */}
      <View style={styles.insightRow}>
        <Card style={[styles.insightCard, styles.ripeningCard]}>
          <Text style={styles.insightTitle}>Ripening</Text>
          {scored.slice(0, 3).map(({ label }) => (
            <Text key={label} style={styles.insightItem}>
              • {label}
            </Text>
          ))}
        </Card>
        <Card style={[styles.insightCard, styles.tendingCard]}>
          <Text style={styles.insightTitle}>Needs tending</Text>
          {scored.slice(-3).map(({ label }) => (
            <Text key={label} style={styles.insightItem}>
              • {label}
            </Text>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING['5xl'], alignItems: 'center' },

  intro: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  barsCard: { width: '100%', gap: 0, padding: 0, overflow: 'hidden' },
  barSeparator: { height: 1, backgroundColor: COLORS.border },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  barLabel: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textDark, width: 72 },
  barTrack: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barScore: { fontFamily: FONTS.bodyBold, fontSize: 12, color: COLORS.textMedium, width: 18, textAlign: 'right' },

  insightRow: { flexDirection: 'row', gap: SPACING.md, width: '100%' },
  insightCard: { flex: 1, gap: SPACING.xs },
  ripeningCard: { borderTopWidth: 2, borderTopColor: COLORS.gold },
  tendingCard: { borderTopWidth: 2, borderTopColor: COLORS.error },
  insightTitle: { fontFamily: FONTS.bodyBold, fontSize: 12, color: COLORS.textLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: SPACING.xs },
  insightItem: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textDark },

  // Locked state
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['2xl'],
    gap: SPACING.xl,
  },
  lockedIcon: { fontSize: 48 },
  lockedTitle: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.navy, textAlign: 'center' },
  lockedSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },
  lockedCard: { width: '100%' },
  lockedVerse: {
    fontFamily: FONTS.scripture,
    fontSize: 15,
    color: COLORS.navy,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  lockedCta: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    color: COLORS.gold,
    textAlign: 'center',
  },
});
