/**
 * Push notification registration and local scheduling.
 *
 * Install: npx expo install expo-notifications expo-device
 *
 * Notification data shapes:
 *   { type: 'daily_moment' }            → navigate to /(tabs) (home)
 *   { type: 'follow_up', entryId }      → navigate to /journal/[entryId]
 *   { type: 'trial_expiry' }            → navigate to /upgrade
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiClient } from '@/lib/api';

// Default behavior: show alert, no sound, no badge
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Request push permission, obtain an ExponentPushToken, and save it to the
 * user profile so the server can send push notifications.
 *
 * Safe to call multiple times — a no-op if permission already granted.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  // Physical device required for push tokens (simulator returns null)
  if (!Device.isDevice) {
    if (__DEV__) console.info('[Notifications] Skipping push registration on simulator.');
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    if (__DEV__) console.warn('[Notifications] Push permission denied.');
    return null;
  }

  try {
    const projectId =
      process.env.EXPO_PUBLIC_PROJECT_ID ?? 'your-project-id-here';

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

    // Persist token on the server
    await apiClient.updateProfile({ expo_push_token: token });
    if (__DEV__) console.info('[Notifications] Token registered:', token);
    return token;
  } catch (e) {
    if (__DEV__) console.error('[Notifications] registerForPushNotifications failed', e);
    return null;
  }
}

/**
 * Schedule (or reschedule) a recurring daily notification at the given 24-hour time.
 * Cancels any previously scheduled daily_moment notifications first.
 */
export async function scheduleDailyMomentNotification(time24: string): Promise<void> {
  // Cancel existing daily_moment notifications
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if ((n.content.data as any)?.type === 'daily_moment') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }

  const [hourStr = '8', minuteStr = '0'] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚖️ Your Daily Scale is ready',
      body: 'A new spiritual tension awaits your discernment today.',
      data: { type: 'daily_moment', screen: '/(tabs)' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Schedule a one-off local notification.
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  trigger: Notifications.SchedulableNotificationTriggerInput,
  data?: Record<string, unknown>,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data: data ?? {} },
    trigger,
  });
}

/**
 * Cancel all scheduled notifications (e.g. on sign-out).
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
