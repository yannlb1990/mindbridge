'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertCircle, Eye, EyeOff, Monitor, Heart, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { signIn, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState<'clinician' | 'client' | null>(null);

  const handleClinicianDemo = async () => {
    setDemoLoading('clinician');
    const result = await signIn('demo@mindbridge.com.au', 'demo123');
    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      setDemoLoading(null);
    }
  };

  const handleClientDemo = async () => {
    setDemoLoading('client');
    const result = await signIn('client@mindbridge.com.au', 'client123');
    if (result.success) {
      window.location.href = '/client/dashboard';
    } else {
      setDemoLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.success) {
      window.location.href = result.role === 'client' ? '/client/dashboard' : '/dashboard';
    }
  };

  const busy = demoLoading !== null || submitting;

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-sage rounded-xl mb-3">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-sage-dark">MindBridge</h1>
          <p className="text-text-secondary mt-1">Choose a portal to explore</p>
        </div>

        {/* Portal selector cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Clinician */}
          <button
            onClick={handleClinicianDemo}
            disabled={busy}
            className="group bg-white rounded-2xl p-6 border-2 border-beige hover:border-sage shadow-sm hover:shadow-md transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sage/20 transition-colors">
              <Monitor className="w-6 h-6 text-sage-dark" />
            </div>
            <h2 className="text-base font-semibold text-text-primary mb-1">Clinician Portal</h2>
            <p className="text-text-muted text-xs mb-4 leading-relaxed">
              Clients, notes, sessions, AI insights
            </p>
            <span className="text-sage-dark text-xs font-medium flex items-center gap-1">
              {demoLoading === 'clinician' ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Signing in…</>
              ) : (
                <>Dr. Sarah Mitchell <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </span>
          </button>

          {/* Client */}
          <button
            onClick={handleClientDemo}
            disabled={busy}
            className="group bg-white rounded-2xl p-6 border-2 border-beige hover:border-calm shadow-sm hover:shadow-md transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-calm/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-calm/20 transition-colors">
              <Heart className="w-6 h-6 text-calm-dark" />
            </div>
            <h2 className="text-base font-semibold text-text-primary mb-1">Client Portal</h2>
            <p className="text-text-muted text-xs mb-4 leading-relaxed">
              Mood, journal, homework, games
            </p>
            <span className="text-calm-dark text-xs font-medium flex items-center gap-1">
              {demoLoading === 'client' ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Signing in…</>
              ) : (
                <>Alex Rivera <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-beige" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-cream text-text-muted">Or sign in with your account</span>
          </div>
        </div>

        {/* Login form */}
        <Card variant="elevated">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-coral/20 border border-coral rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-coral-dark flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-coral-dark">{error}</p>
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => { clearError(); setEmail(e.target.value); }}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button type="submit" className="w-full" isLoading={submitting} disabled={busy}>
                Sign in
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-sage hover:text-sage-dark font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
