'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError, isDemoMode } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    registrationNumber: '',
    registrationBody: 'AHPRA',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!validateForm()) return;

    const result = await signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      title: formData.title,
      registrationNumber: formData.registrationNumber,
      registrationBody: formData.registrationBody,
    });

    if (result.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Account Created</h2>
            <p className="text-text-secondary mb-6">
              Please check your email to verify your account before signing in.
            </p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-sage-dark">MindBridge</h1>
          <p className="text-text-secondary mt-2">Create your clinician account</p>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="mb-4 p-3 bg-gold/20 border border-gold rounded-lg text-gold-dark text-sm">
            <strong>Note:</strong> Sign up is disabled in demo mode. Please configure Supabase to enable account creation.
          </div>
        )}

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Clinician Registration</CardTitle>
            <CardDescription>Enter your professional details to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || validationError) && (
                <div className="p-3 bg-coral/20 border border-coral rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-coral-dark flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-coral-dark">{validationError || error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Sarah"
                  required
                />
                <Input
                  label="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Mitchell"
                  required
                />
              </div>

              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sarah@example.com"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Professional title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Clinical Psychologist"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Registration body
                  </label>
                  <select
                    name="registrationBody"
                    value={formData.registrationBody}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                    required
                  >
                    <option value="AHPRA">AHPRA</option>
                    <option value="APS">APS</option>
                    <option value="AASW">AASW</option>
                    <option value="PACFA">PACFA</option>
                    <option value="ACA">ACA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <Input
                label="Registration number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="PSY0001234"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                  hint="Must be at least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Input
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 rounded border-beige text-sage focus:ring-sage"
                />
                <label htmlFor="terms" className="text-text-secondary">
                  I agree to the{' '}
                  <Link href="/terms" className="text-calm hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-calm hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isDemoMode}>
                Create account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-sage hover:text-sage-dark font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
