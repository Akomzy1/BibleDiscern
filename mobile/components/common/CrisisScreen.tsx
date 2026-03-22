import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CRISIS_RESOURCES } from '@librato/shared';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface CrisisScreenProps {
  onContinue: () => void;
}

export function CrisisScreen({ onContinue }: CrisisScreenProps) {
  const call988 = () => Linking.openURL('tel:988');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cross Icon */}
        <Text style={styles.cross}>✝</Text>

        <Text style={styles.heading}>You are not alone</Text>

        <Text style={styles.body}>
          Whatever you're carrying right now — God sees you, and so do we. Before
          anything else, please reach out to someone who can sit with you in this moment.
        </Text>

        <Text style={styles.body}>
          You don't have to carry this alone. There are people ready to listen, right now.
        </Text>

        {/* Prominent 988 call button */}
        <Pressable
          style={({ pressed }) => [styles.callButton, pressed && styles.callButtonPressed]}
          onPress={call988}
          accessibilityRole="button"
          accessibilityLabel="Call or text 988 Suicide and Crisis Lifeline"
        >
          <Text style={styles.callButtonIcon}>📞</Text>
          <View style={styles.callButtonText}>
            <Text style={styles.callButtonTitle}>Talk to Someone Now</Text>
            <Text style={styles.callButtonSub}>Call or text 988 — free, 24/7</Text>
          </View>
          <Text style={styles.callButtonArrow}>›</Text>
        </Pressable>

        {/* Other resources */}
        <View style={styles.resources}>
          {CRISIS_RESOURCES.filter((r) => r.name !== '988 Suicide & Crisis Lifeline').map(
            (resource) => (
              <Pressable
                key={resource.name}
                style={({ pressed }) => [styles.resourceCard, pressed && styles.pressed]}
                onPress={() => Linking.openURL(resource.action)}
                accessibilityRole="button"
                accessibilityLabel={`Contact ${resource.name}`}
              >
                <View style={styles.resourceInner}>
                  <Text style={styles.resourceIcon}>
                    {resource.type === 'call' ? '📞' : '💬'}
                  </Text>
                  <View style={styles.resourceText}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <Text style={styles.resourceAction}>
                      {resource.type === 'call' ? 'Tap to call' : 'Tap to text'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ),
          )}
        </View>

        <Text style={styles.verse}>
          "Cast all your anxiety on him because he cares for you." — 1 Peter 5:7
        </Text>

        <Text style={styles.grace}>
          When you're ready, discernment is still here for you. Take all the time you need.
        </Text>

        <Pressable
          onPress={onContinue}
          style={styles.continueLink}
          accessibilityRole="button"
          accessibilityLabel="Continue to discernment"
        >
          <Text style={styles.continueLinkText}>
            I've seen the resources — continue to discernment
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  content: {
    padding: SPACING['2xl'],
    paddingTop: SPACING['4xl'],
    alignItems: 'center',
    gap: SPACING.xl,
    paddingBottom: SPACING['5xl'],
  },

  cross: { fontSize: 48, color: COLORS.navy },
  heading: {
    fontFamily: FONTS.display,
    fontSize: 30,
    color: COLORS.navy,
    textAlign: 'center',
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textDark,
    lineHeight: 26,
    textAlign: 'center',
  },

  // Prominent 988 button
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.navy,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  callButtonPressed: { opacity: 0.85 },
  callButtonIcon: { fontSize: 28 },
  callButtonText: { flex: 1 },
  callButtonTitle: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.cream,
  },
  callButtonSub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.gold,
    marginTop: 2,
  },
  callButtonArrow: {
    fontFamily: FONTS.body,
    fontSize: 26,
    color: COLORS.cream,
    lineHeight: 28,
    opacity: 0.7,
  },

  resources: { width: '100%', gap: SPACING.md },
  resourceCard: {
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    padding: SPACING.lg,
  },
  resourceInner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  resourceIcon: { fontSize: 22 },
  resourceText: { flex: 1 },
  resourceName: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: COLORS.navy },
  resourceAction: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  pressed: { opacity: 0.75 },

  verse: {
    fontFamily: FONTS.scripture,
    fontSize: 17,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  grace: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  continueLink: { paddingVertical: SPACING.lg },
  continueLinkText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
