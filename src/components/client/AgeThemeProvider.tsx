'use client';

import { createContext, useContext } from 'react';
import type { AgeGroup } from '@/lib/utils';

export interface AgeTheme {
  ageGroup: AgeGroup;
  // Colors (Tailwind class fragments)
  primaryBg: string;
  primaryText: string;
  primaryBorder: string;
  primaryButton: string;
  accentBg: string;
  pageBg: string;
  cardBg: string;
  // Copy
  greeting: (name: string) => string;
  // Sizing
  cardPadding: string;
  fontSize: string;
  iconSize: string;
}

const themes: Record<AgeGroup, AgeTheme> = {
  child: {
    ageGroup: 'child',
    primaryBg: 'bg-coral-light',
    primaryText: 'text-coral-dark',
    primaryBorder: 'border-coral',
    primaryButton: 'bg-coral hover:bg-coral-dark text-white',
    accentBg: 'bg-gold-light',
    pageBg: 'bg-gradient-to-br from-coral/10 via-cream to-gold/10',
    cardBg: 'bg-white',
    greeting: (name: string) => `Hi ${name}!`,
    cardPadding: 'p-6',
    fontSize: 'text-lg',
    iconSize: 'w-8 h-8',
  },
  teen: {
    ageGroup: 'teen',
    primaryBg: 'bg-calm/20',
    primaryText: 'text-calm-dark',
    primaryBorder: 'border-calm',
    primaryButton: 'bg-calm hover:bg-calm-dark text-white',
    accentBg: 'bg-sage-50',
    pageBg: 'bg-gradient-to-br from-calm/10 via-cream to-sage-50',
    cardBg: 'bg-white',
    greeting: (name: string) => `Hey ${name}`,
    cardPadding: 'p-5',
    fontSize: 'text-base',
    iconSize: 'w-6 h-6',
  },
  adult: {
    ageGroup: 'adult',
    primaryBg: 'bg-sage-50',
    primaryText: 'text-sage-dark',
    primaryBorder: 'border-sage',
    primaryButton: 'bg-sage hover:bg-sage-dark text-white',
    accentBg: 'bg-sand',
    pageBg: 'bg-cream',
    cardBg: 'bg-white',
    greeting: (name: string) => `Good to see you, ${name}`,
    cardPadding: 'p-5',
    fontSize: 'text-base',
    iconSize: 'w-5 h-5',
  },
};

const AgeThemeContext = createContext<AgeTheme>(themes.adult);

export function AgeThemeProvider({
  children,
  ageGroup,
}: {
  children: React.ReactNode;
  ageGroup: AgeGroup;
}) {
  return (
    <AgeThemeContext.Provider value={themes[ageGroup]}>
      {children}
    </AgeThemeContext.Provider>
  );
}

export function useAgeTheme(): AgeTheme {
  return useContext(AgeThemeContext);
}
