'use client';

// Registers the service worker (production only).

import { useEffect } from 'react';

export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // registration failed — the app still works online
    });
  }, []);
  return null;
}
