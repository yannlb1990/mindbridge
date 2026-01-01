'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth().then(() => {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    });
  }, [user, router, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-sage mx-auto mb-4" />
        <p className="text-text-secondary">Loading MindBridge...</p>
      </div>
    </div>
  );
}
