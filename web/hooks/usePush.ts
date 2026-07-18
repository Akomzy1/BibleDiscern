'use client';

// Web Push (VAPID) subscription behavior. iOS requires the installed PWA
// (16.4+); elsewhere it works in the browser. Degrades silently.

import { useCallback } from 'react';
import { getAuthedClient } from '@/lib/api';
import { getBrowserClient } from '@/lib/supabase/browser';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function usePush() {
  /** Request permission and store the subscription. Returns true on success. */
  const subscribe = useCallback(async (): Promise<boolean> => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) return false;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return false;

      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapid),
        }));

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false;

      const client = await getAuthedClient();
      if (!client) return false;
      await client.subscribePush({
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<void> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        const {
          data: { session },
        } = await getBrowserClient().auth.getSession();
        if (session) {
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ endpoint }),
          }).catch(() => undefined);
        }
      }
    } catch {
      // nothing to clean up
    }
  }, []);

  return { subscribe, unsubscribe };
}
