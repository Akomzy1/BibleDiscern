import { create } from 'zustand';

interface OnboardingState {
  selectedSeason: string | null;
  microDiscernmentResponse: 'peace' | 'tension' | null;
  selectedNotificationTime: string;

  setSeason: (season: string) => void;
  setMicroDiscernmentResponse: (response: 'peace' | 'tension') => void;
  setNotificationTime: (time: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  selectedSeason: null,
  microDiscernmentResponse: null,
  selectedNotificationTime: '08:00',

  setSeason: (season) => set({ selectedSeason: season }),
  setMicroDiscernmentResponse: (response) => set({ microDiscernmentResponse: response }),
  setNotificationTime: (time) => set({ selectedNotificationTime: time }),
  reset: () =>
    set({ selectedSeason: null, microDiscernmentResponse: null, selectedNotificationTime: '08:00' }),
}));
