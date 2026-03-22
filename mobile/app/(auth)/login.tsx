import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';

export default function LoginScreen() {
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.includes('@') && password.length >= 8;

  const handleSignIn = async () => {
    if (!isValid) return;
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Sign in failed. Please check your credentials.');
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
          {/* Brand header */}
          <View style={styles.header}>
            <Text style={styles.cross}>✝</Text>
            <Text style={styles.brand}>LibratoAi</Text>
            <Text style={styles.tagline}>Weigh it with wisdom</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              placeholder="••••••••"
              accessibilityHint="Enter your password"
              error={error || undefined}
            />

            <Button
              title="Sign In"
              onPress={handleSignIn}
              disabled={!isValid}
              loading={loading}
              fullWidth
              style={styles.cta}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Social auth — shell buttons for Stage 3; wired in Stage 5 */}
          <View style={styles.social}>
            <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="Sign in with Apple">
              <Text style={styles.socialBtnText}>🍎  Sign in with Apple</Text>
            </Pressable>
            <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="Sign in with Google">
              <Text style={styles.socialBtnText}>🔵  Sign in with Google</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <Pressable
            onPress={() => router.push('/(auth)/signup')}
            style={styles.footer}
            accessibilityRole="button"
          >
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.footerLink}>Create one</Text>
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

  header: { alignItems: 'center', paddingVertical: SPACING['4xl'], gap: SPACING.sm },
  cross: { fontSize: 48, color: COLORS.navy },
  brand: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.navy },
  tagline: {
    fontFamily: FONTS.scripture,
    fontSize: 16,
    color: COLORS.gold,
    fontStyle: 'italic',
  },

  form: { gap: SPACING.lg, marginBottom: SPACING['3xl'] },
  cta: { marginTop: SPACING.sm },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textLight },

  social: { gap: SPACING.md, marginBottom: SPACING['3xl'] },
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

  footer: { alignItems: 'center', paddingVertical: SPACING.lg },
  footerText: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMedium },
  footerLink: { color: COLORS.navy, textDecorationLine: 'underline' },
});
