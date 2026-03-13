'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Monitor, Heart, ArrowRight, Loader2 } from 'lucide-react';

export default function DemoPage() {
  const [loading, setLoading] = useState<'clinician' | 'client' | null>(null);
  const [ready, setReady] = useState(false);

  // On mount, check if already logged in — if so, redirect straight to the portal.
  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user) {
      window.location.href = user.role === 'client' ? '/client/dashboard' : '/dashboard';
    } else {
      setReady(true);
    }
  }, []);

  const handleClinicianDemo = async () => {
    setLoading('clinician');
    const { signIn } = useAuthStore.getState();
    const result = await signIn('demo@mindbridge.com.au', 'demo123');
    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      setLoading(null);
    }
  };

  const handleClientDemo = async () => {
    setLoading('client');
    const { signIn } = useAuthStore.getState();
    const result = await signIn('client@mindbridge.com.au', 'client123');
    if (result.success) {
      window.location.href = '/client/dashboard';
    } else {
      setLoading(null);
    }
  };

  // Show spinner while checking auth state
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sage rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-sage-dark">MindBridge</h1>
          <p className="text-text-secondary mt-2 text-lg">Choose a portal to explore</p>
        </div>

        {/* Portal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clinician Portal */}
          <button
            onClick={handleClinicianDemo}
            disabled={loading !== null}
            className="group bg-white rounded-2xl p-8 border-2 border-beige hover:border-sage shadow-sm hover:shadow-md transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-14 h-14 bg-sage/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-sage/20 transition-colors">
              <Monitor className="w-7 h-7 text-sage-dark" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Clinician Portal</h2>
            <p className="text-text-muted text-sm mb-5 leading-relaxed">
              Manage clients, write clinical notes, view AI insights, and track session outcomes.
            </p>
            <span className="text-sage-dark text-sm font-medium flex items-center gap-1.5">
              {loading === 'clinician' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Enter as Dr. Sarah Mitchell
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>

          {/* Client Portal */}
          <button
            onClick={handleClientDemo}
            disabled={loading !== null}
            className="group bg-white rounded-2xl p-8 border-2 border-beige hover:border-calm shadow-sm hover:shadow-md transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-14 h-14 bg-calm/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-calm/20 transition-colors">
              <Heart className="w-7 h-7 text-calm-dark" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Client Portal</h2>
            <p className="text-text-muted text-sm mb-5 leading-relaxed">
              Track mood, journal your thoughts, complete homework, play therapeutic games, and stay connected.
            </p>
            <span className="text-calm-dark text-sm font-medium flex items-center gap-1.5">
              {loading === 'client' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Enter as Alex Rivera
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-text-muted mt-8">
          Demo environment — all data is sample data
        </p>
      </div>
    </div>
  );
}
