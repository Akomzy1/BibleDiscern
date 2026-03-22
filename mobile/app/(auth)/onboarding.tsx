import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

export default function OnboardingScreen() {
  const { user } = useAuthStore();
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? '',
  );
  const [loading, setLoading] = useState(false);

  // Staggered entrance animations
  const crossOpacity = useRef(new Animated.Value(0)).current;
  const headingOpacity = useRef(new Animated.Value(0)).current;
  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const stagger = (anim: Animated.Value, delay: number) =>
      Animated.timing(anim, { toValue: 1, duration: 600, delay, useNativeDriver: true });

    Animated.stagger(400, [
      stagger(crossOpacity, 0),
      stagger(headingOpacity, 0),
      stagger(text1Opacity, 0),
      stagger(text2Opacity, 0),
      stagger(inputOpacity, 0),
      stagger(btnOpacity, 0),
    ]).start();
  }, []);

  const handleBegin = async () => {
    setLoading(true);
    try {
      await apiClient.updateProfile({
        display_name: displayName.trim() || undefined,
        onboarding_completed: true,
      });
      router.replace('/(tabs)');
    } catch {
      // Non-fatal — still navigate even if profile update fails
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cross */}
          <Animated.View style={[styles.crossWrap, { opacity: crossOpacity }]}>
            <Text style={styles.cross}>✝</Text>
          </Animated.View>

          {/* Heading */}
          <Animated.Text style={[styles.heading, { opacity: headingOpacity }]}>
            Welcome to LibratoAi
          </Animated.Text>

          {/* Covenant text 1 */}
          <Animated.Text style={[styles.covenant, { opacity: text1Opacity }]}>
            "This is not a place for quick answers. It's a space where you bring your real
            questions before God, guided by His Word and the wisdom of His people across
            centuries."
          </Animated.Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Covenant text 2 */}
          <Animated.Text style={[styles.subtitle, { opacity: text2Opacity }]}>
            We don't replace the Holy Spirit, your pastor, or your community. We simply
            help you listen more carefully.
          </Animated.Text>

          {/* Name input */}
          <Animated.View style={[styles.inputWrap, { opacity: inputOpacity }]}>
            <Input
              label="What should we call you?"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              placeholder="Your name"
              accessibilityHint="Enter the name you'd like LibratoAi to use"
            />
          </Animated.View>

          {/* CTA */}
          <Animated.View style={[{ opacity: btnOpacity }]}>
            <Button
              title="Begin My Journey"
              onPress={handleBegin}
              loading={loading}
              fullWidth
            />
          </Animated.View>

          {/* Scripture footer */}
          <Text style={styles.verse}>
            "If any of you lacks wisdom, let him ask God, who gives generously to all
            without reproach, and it will be given him." — James 1:5
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  content: {
    padding: SPACING['2xl'],
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING['5xl'],
    alignItems: 'center',
    gap: SPACING['2xl'],
  },
  crossWrap: { marginBottom: SPACING.sm },
  cross: { fontSize: 64, color: COLORS.navy },
  heading: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.navy,
    textAlign: 'center',
  },
  covenant: {
    fontFamily: FONTS.scripture,
    fontSize: 18,
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 30,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.sm,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.sm,
  },
  inputWrap: { width: '100%' },
  verse: {
    fontFamily: FONTS.scripture,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SPACING['2xl'],
    fontStyle: 'italic',
    paddingHorizontal: SPACING.md,
  },
});
