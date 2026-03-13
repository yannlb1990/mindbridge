'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { AgeThemeProvider, useAgeTheme } from '@/components/client/AgeThemeProvider';
import { ClientNav } from '@/components/client/ClientNav';
import { Loader2 } from 'lucide-react';
import type { AgeGroup } from '@/lib/utils';

function ClientPortalInner({ children }: { children: React.ReactNode }) {
  const theme = useAgeTheme();
  return (
    <div className={`flex min-h-screen ${theme.pageBg}`}>
      <ClientNav />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const ageGroup = useAuthStore((state) => state.ageGroup);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated && (!user || user.role !== 'client')) {
      window.location.href = '/auth/login';
    }
  }, [mounted, hasHydrated, user]);

  if (!mounted || !hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  if (!user || user.role !== 'client') return null;

  const resolvedAgeGroup: AgeGroup = ageGroup ?? 'adult';

  return (
    <AgeThemeProvider ageGroup={resolvedAgeGroup}>
      <ClientPortalInner>{children}</ClientPortalInner>
    </AgeThemeProvider>
  );
}
