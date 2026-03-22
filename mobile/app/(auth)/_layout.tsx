import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthLayout() {
  const { user } = useAuthStore();

  // Already signed in — redirect to main app
  if (user) return <Redirect href="/(tabs)" />;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
