'use client';

// Install affordance behavior: captures beforeinstallprompt (Android/desktop),
// detects installed/standalone, and detects the iOS-Safari instruction case.
// Surfaced ONLY at high-intent moments (after first scale, after first
// journey, Settings) — never on first paint. (SKILL.md §10)

import { useCallback, useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIos() {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function useInstallPrompt() {
  const [installed, setInstalled] = useState(true); // assume installed until known
  const [canPrompt, setCanPrompt] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setCanPrompt(!!deferredPrompt);
    const onPrompt = () => setCanPrompt(true);
    const onInstalled = () => {
      setInstalled(true);
      deferredPrompt = null;
      setCanPrompt(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
      setCanPrompt(false);
    }
    return outcome === 'accepted';
  }, []);

  // What the affordance should do on this device:
  // 'prompt' — native install prompt available; 'ios-sheet' — show the
  // Add-to-Home-Screen instructions; 'hidden' — installed or unsupported.
  const mode = installed ? 'hidden' : canPrompt ? 'prompt' : isIos() ? 'ios-sheet' : 'hidden';

  return { mode, installed, promptInstall } as const;
}
