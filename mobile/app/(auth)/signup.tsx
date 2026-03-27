import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

export default function SignupScreen() {
  const { signUp } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = name.trim().length > 0 && email.includes('@') && password.length >= 8;

  const handleSignUp = async () => {
    if (!isValid) return;
    setError('');
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      // Navigate to onboarding covenant screen
      router.replace('/(auth)/onboarding');
    } catch (e: any) {
      setError(e.message ?? 'Account creation failed. Please try again.');
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.cross}>✝</Text>
            <Text style={styles.brand}>BibleDiscern</Text>
            <Text style={styles.tagline}>Weigh it with wisdom</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              placeholder="How should we call you?"
              accessibilityHint="Enter your full name"
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
              accessibilityHint="Enter your email address"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              secureToggle
              placeholder="Min. 8 characters"
              helper="At least 8 characters"
              accessibilityHint="Choose a password with at least 8 characters"
              error={error || undefined}
            />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              disabled={!isValid}
              loading={loading}
              fullWidth
              style={styles.cta}
            />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.social}>
            <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="Sign up with Apple">
              <Text style={styles.socialBtnText}>🍎  Sign up with Apple</Text>
            </Pressable>
            <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="Sign up with Google">
              <Text style={styles.socialBtnText}>🔵  Sign up with Google</Text>
            </Pressable>
          </View>

          <View style={styles.legal}>
            <Text style={styles.legalText}>
              By creating an account you agree to our{' '}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL('https://librato.ai/terms')}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.legalLink}
                onPress={() => Linking.openURL('https://librato.ai/privacy')}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>

          <Pressable
            onPress={() => router.back()}
            style={styles.footer}
            accessibilityRole="button"
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerLink}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  content: { padding: SPACING['2xl'], paddingBottom: SPACING['4xl'] },
  header: { alignItems: 'center', paddingVertical: SPACING['3xl'], gap: SPACING.sm },
  cross: { fontSize: 48, color: COLORS.navy },
  brand: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.navy },
  tagline: { fontFamily: FONTS.scripture, fontSize: 16, color: COLORS.gold, fontStyle: 'italic' },
  form: { gap: SPACING.lg, marginBottom: SPACING['3xl'] },
  cta: { marginTop: SPACING.sm },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING['2xl'] },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textLight },
  social: { gap: SPACING.md, marginBottom: SPACING['2xl'] },
  socialBtn: {
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.parchment,
  },
  socialBtnText: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: COLORS.navy },
  legal: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  legalText: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.textLight, textAlign: 'center', lineHeight: 18 },
  legalLink: { color: COLORS.textMedium, textDecorationLine: 'underline' },
  footer: { alignItems: 'center', paddingVertical: SPACING.lg },
  footerText: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMedium },
  footerLink: { color: COLORS.navy, textDecorationLine: 'underline' },
});
