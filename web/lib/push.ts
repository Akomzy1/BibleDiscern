/**
 * Server-side push notification sender via Expo Push API.
 *
 * Usage:
 *   await sendPushNotification(user.expo_push_token, 'Title', 'Body', { type: 'follow_up', entryId })
 *
 * Expo Push API docs: https://docs.expo.dev/push-notifications/sending-notifications/
 */

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default' | null;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
}

interface ExpoPushReceipt {
  status: 'ok' | 'error';
  message?: string;
  details?: { error?: string };
}

interface ExpoPushResponse {
  data: ExpoPushReceipt[];
}

/**
 * Send a push notification via the Expo Push API.
 * Non-throwing — logs errors but does not propagate them (push is best-effort).
 */
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  if (!expoPushToken || !expoPushToken.startsWith('ExponentPushToken')) {
    console.warn('[push] Invalid or missing Expo push token:', expoPushToken);
    return;
  }

  const message: ExpoPushMessage = {
    to: expoPushToken,
    title,
    body,
    data,
    sound: 'default',
    priority: 'high',
  };

  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(message),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[push] Expo Push API HTTP error:', res.status, text);
      return;
    }

    const result = (await res.json()) as ExpoPushResponse;
    const receipt = result.data?.[0];

    if (receipt?.status === 'error') {
      console.error('[push] Expo Push API delivery error:', receipt.message, receipt.details);
    }
  } catch (e) {
    console.error('[push] sendPushNotification threw:', e);
  }
}

/**
 * Send push notifications to multiple tokens in a single batch request.
 */
export async function sendPushNotificationBatch(
  messages: { token: string; title: string; body: string; data?: Record<string, unknown> }[],
): Promise<void> {
  const valid = messages.filter((m) => m.token?.startsWith('ExponentPushToken'));
  if (valid.length === 0) return;

  const payload: ExpoPushMessage[] = valid.map((m) => ({
    to: m.token,
    title: m.title,
    body: m.body,
    data: m.data,
    sound: 'default',
    priority: 'high',
  }));

  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('[push] Batch push HTTP error:', res.status);
    }
  } catch (e) {
    console.error('[push] sendPushNotificationBatch threw:', e);
  }
}
