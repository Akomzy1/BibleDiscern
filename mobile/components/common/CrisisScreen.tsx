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
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cross Icon */}
        <Text style={styles.cross}>✝</Text>

        <Text style={styles.heading}>We care about you</Text>

        <Text style={styles.body}>
          It sounds like you may be going through something very serious. Before anything else,
          please reach out to someone who can help.
        </Text>

        <Text style={styles.body}>
          God places people in our lives for moments like this. Please don't carry this alone.
        </Text>

        <View style={styles.resources}>
          {CRISIS_RESOURCES.map((resource) => (
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
          ))}
        </View>

        <Text style={styles.verse}>
          "Cast all your anxiety on him because he cares for you." — 1 Peter 5:7
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
  },
  cross: { fontSize: 48, color: COLORS.navy, marginBottom: SPACING['2xl'] },
  heading: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.navy,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textDark,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resources: { width: '100%', gap: SPACING.md, marginVertical: SPACING['3xl'] },
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
  resourceIcon: { fontSize: 24 },
  resourceText: { flex: 1 },
  resourceName: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: COLORS.navy },
  resourceAction: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textLight },
  pressed: { opacity: 0.75 },
  verse: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    marginBottom: SPACING['4xl'],
    lineHeight: 26,
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
