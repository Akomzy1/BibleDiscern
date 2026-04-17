import React, { useEffect, useRef } from 'react';
import { Stack, SplashScreen, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_600SemiBold_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  SourceSans3_400Regular,
  SourceSans3_600SemiBold,
  SourceSans3_700Bold,
} from '@expo-google-fonts/source-sans-3';
import { useAuthStore } from '@/stores/useAuthStore';
import { initializePurchases, identifyUser } from '@/lib/purchases';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

function useNotificationDeepLink() {
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, string>;
        const type = data?.type;

        if (type === 'daily_moment') {
          router.push('/(tabs)');
        } else if (type === 'follow_up' && data?.entryId) {
          router.push(`/journal/${data.entryId}` as any);
        } else if (type === 'trial_expiry') {
          router.push('/upgrade');
        }
      },
    );

    return () => {
      responseListener.current?.remove();
    };
  }, []);
}

export default function RootLayout() {
  const { initialize, isLoading, user } = useAuthStore();
  useNotificationDeepLink();

  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
  });

  useEffect(() => {
    initialize();
    // Initialize RevenueCat without a user ID first; we'll identify once auth resolves
    initializePurchases();
  }, []);

  // Once auth resolves and we have a user, identify them in RevenueCat
  useEffect(() => {
    if (user?.id) {
      identifyUser(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  if ((!fontsLoaded && !fontError) || isLoading) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="discern/[sessionId]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="journal/[entryId]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="upgrade"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
