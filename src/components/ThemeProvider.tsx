'use client';

import { useEffect } from 'react';
import { useAppearanceStore } from '@/stores/appearanceStore';

const ACCENT_COLORS: Record<string, { sage: string; sageDark: string; sageLight: string }> = {
  sage:   { sage: '#7C9885', sageDark: '#5A7360', sageLight: '#A8C5B0' },
  calm:   { sage: '#8BA4B4', sageDark: '#6B8899', sageLight: '#B0C5D1' },
  coral:  { sage: '#E8A598', sageDark: '#C97B7B', sageLight: '#F5C4BB' },
  gold:   { sage: '#D4B896', sageDark: '#B89B6A', sageLight: '#E8D4BC' },
  purple: { sage: '#9B8EC4', sageDark: '#7B6EA0', sageLight: '#C3BAE0' },
  blue:   { sage: '#5B8FD4', sageDark: '#3B70B5', sageLight: '#8BB3E8' },
};

const FONT_SIZES: Record<string, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, accentColor, fontSize } = useAppearanceStore();

  // Apply theme
  useEffect(() => {
    const html = document.documentElement;
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    html.setAttribute('data-theme', resolvedTheme);
  }, [theme]);

  // Apply accent color via CSS custom properties
  useEffect(() => {
    const colors = ACCENT_COLORS[accentColor] ?? ACCENT_COLORS.sage;
    const root = document.documentElement;
    root.style.setProperty('--sage', colors.sage);
    root.style.setProperty('--sage-dark', colors.sageDark);
    root.style.setProperty('--sage-light', colors.sageLight);
    root.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZES[fontSize] ?? '16px';
  }, [fontSize]);

  return <>{children}</>;
}
