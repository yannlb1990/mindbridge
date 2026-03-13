'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

export default function NewNoteLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && hasHydrated && !user) window.location.href = '/auth/login';
  }, [mounted, hasHydrated, user]);

  if (!mounted || !hasHydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  return <>{children}</>;
}
