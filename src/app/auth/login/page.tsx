'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading, error, clearError, isDemoMode, enterDemoMode } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await signIn(email, password);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  const handleDemoLogin = async () => {
    if (isDemoMode) {
      enterDemoMode();
      router.push('/dashboard');
    } else {
      const result = await signIn('demo@mindbridge.com.au', 'demo123');
      if (result.success) {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-sage-dark">MindBridge</h1>
          <p className="text-text-secondary mt-2">Clinician Platform</p>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="mb-4 p-3 bg-calm/20 border border-calm rounded-lg text-calm-dark text-sm">
            <strong>Demo Mode:</strong> Supabase not configured. Use demo credentials to explore.
          </div>
        )}

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your clinician account</CardDescription>
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-beige text-sage focus:ring-sage" />
                  <span className="text-text-secondary">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-calm hover:text-calm-dark">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
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
              >
                Try Demo Account
              </Button>

              {isDemoMode && (
                <p className="text-xs text-text-muted text-center mt-2">
                  demo@mindbridge.com.au / demo123
                </p>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-sage hover:text-sage-dark font-medium">
                Sign up
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
