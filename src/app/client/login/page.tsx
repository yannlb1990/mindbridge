'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { AlertCircle, Eye, EyeOff, Heart } from 'lucide-react';

export default function ClientLoginPage() {
  const { signIn, error, clearError, isDemoMode } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.success) {
      window.location.href = '/client/dashboard';
    }
  };

  const handleDemoLogin = async () => {
    setSubmitting(true);
    const result = await signIn('client@mindbridge.com.au', 'client123');
    setSubmitting(false);
    if (result.success) {
      window.location.href = '/client/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm/20 via-cream to-sage-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sage mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-sage-dark">MindBridge</h1>
          <p className="text-text-secondary mt-2">Your personal wellbeing space</p>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="mb-4 p-3 bg-calm/20 border border-calm rounded-lg text-calm-dark text-sm">
            <strong>Demo Mode:</strong> Use <code>client@mindbridge.com.au</code> / <code>client123</code>
          </div>
        )}

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your client account</CardDescription>
          </CardHeader>

          <CardContent>
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
                onChange={(e) => setEmail(e.target.value)}
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

              <Button type="submit" className="w-full" isLoading={submitting}>
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-beige" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-muted">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                className="w-full mt-4"
                onClick={handleDemoLogin}
                isLoading={submitting}
              >
                Try Demo Account
              </Button>

              <p className="text-xs text-text-muted text-center mt-2">
                Explore the client experience with sample data
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Are you a clinician?{' '}
              <Link href="/auth/login" className="text-sage hover:text-sage-dark font-medium">
                Clinician login →
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-text-muted">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-calm hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-calm hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
