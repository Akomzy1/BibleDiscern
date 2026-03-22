import { useCallback } from 'react';
import { router } from 'expo-router';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { TIER_CONFIG } from '@librato/shared';

type FeatureName =
  | 'fruit_diagnostic'
  | 'full_journal'
  | 'follow_ups'
  | 'scripture_sharing'
  | 'unlimited_sessions';

export function useFeatureGate() {
  const { isPremium, sessionsRemaining, isTrial } = useSubscriptionStore();

  const canUseFeature = useCallback(
    (feature: FeatureName): boolean => {
      if (isPremium || isTrial) return true;

      const free = TIER_CONFIG['free'];
      switch (feature) {
        case 'fruit_diagnostic':
          return free.has_fruit_diagnostic;
        case 'full_journal':
          return free.has_full_journal;
        case 'follow_ups':
          return free.has_follow_ups;
        case 'scripture_sharing':
          return free.has_scripture_sharing;
        case 'unlimited_sessions':
          return false;
        default:
          return false;
      }
    },
    [isPremium, isTrial],
  );

  const showUpgradePrompt = useCallback(() => {
    router.push('/upgrade');
  }, []);

  const journalVisibleCount = isPremium
    ? TIER_CONFIG['premium'].journal_visible_count
    : TIER_CONFIG['free'].journal_visible_count;

  return {
    isPremium,
    isTrial,
    canUseFeature,
    sessionsRemaining,
    journalVisibleCount,
    showUpgradePrompt,
  };
}
