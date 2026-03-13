import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type AccentColor = 'sage' | 'calm' | 'coral' | 'gold' | 'purple' | 'blue';
export type FontSize = 'small' | 'medium' | 'large';

interface AppearanceState {
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSize) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      theme: 'light',
      accentColor: 'sage',
      fontSize: 'medium',
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'mindbridge-appearance',
    }
  )
);
