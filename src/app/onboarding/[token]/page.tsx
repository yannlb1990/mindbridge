'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

type Step = 'personal' | 'emergency' | 'gp' | 'consent' | 'password' | 'done';

const STEPS: Step[] = ['personal', 'emergency', 'gp', 'consent', 'password', 'done'];
const STEP_LABELS: Record<Step, string> = {
  personal: 'Your details',
  emergency: 'Emergency contact',
  gp: 'GP & Medicare',
  consent: 'Consent',
  password: 'Set password',
  done: 'All done',
};

export default function OnboardingPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [step, setStep] = useState<Step>('personal');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const [form, setForm] = useState({
    // Personal
    phone: '', dateOfBirth: '', address: '',
    // Emergency
    emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '',
    // GP
    medicareNumber: '', gpName: '', gpPractice: '', gpPhone: '',
    // Consent
    consentToTelehealth: false, consentToRecording: false, consentToResearch: false,
    // Password
    password: '', passwordConfirm: '',
  });

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const currentIndex = STEPS.indexOf(step);

  const next = () => {
    if (step === 'password') { handleSubmit(); return; }
    const nextStep = STEPS[currentIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const back = () => {
    const prevStep = STEPS[currentIndex - 1];
    if (prevStep && prevStep !== 'done') setStep(prevStep);
  };

  const handleSubmit = async () => {
    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400) { setTokenInvalid(true); return; }
        throw new Error(data.error || 'Failed to complete onboarding');
      }
      setStep('done');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (tokenInvalid) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-soft p-10 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-coral mx-auto mb-4" />
          <h1 className="text-xl font-display font-bold text-text-primary mb-2">Link expired or invalid</h1>
          <p className="text-text-secondary text-sm">
            This onboarding link has expired or has already been used. Please contact your clinician to send a new invitation.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-soft p-10 max-w-md w-full text-center">
          <CheckCircle className="w-14 h-14 text-sage mx-auto mb-5" />
          <h1 className="text-2xl font-display font-bold text-text-primary mb-3">You&apos;re all set!</h1>
          <p className="text-text-secondary mb-6">
            Your profile is complete. You can now log in to MindBridge to access your portal, track your mood, and stay connected with your clinician.
          </p>
          <button
            onClick={() => router.push('/client/login')}
            className="btn-primary w-full py-3 rounded-xl font-semibold"
          >
            Go to client portal
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.round((currentIndex / (STEPS.length - 2)) * 100);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-2xl font-display font-bold text-text-primary">
            Mind<span className="text-sage">Bridge</span>
          </p>
          <p className="text-text-muted text-sm mt-1">Complete your profile setup</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-text-muted mb-1.5">
            <span>{STEP_LABELS[step]}</span>
            <span>{currentIndex} of {STEPS.length - 2} steps</span>
          </div>
          <div className="h-1.5 bg-beige rounded-full overflow-hidden">
            <div className="h-full bg-sage rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {error && (
            <div className="bg-error/10 border border-error/30 text-error text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          {step === 'personal' && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-text-primary mb-4">Your details</h2>
              <div>
                <label className="label">Phone number</label>
                <input className="input" type="tel" placeholder="04xx xxx xxx" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className="label">Date of birth</label>
                <input className="input" type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
              </div>
              <div>
                <label className="label">Address <span className="text-text-muted font-normal">(optional)</span></label>
                <input className="input" type="text" placeholder="123 Street, Suburb VIC 3000" value={form.address} onChange={e => set('address', e.target.value)} />
              </div>
            </div>
          )}

          {step === 'emergency' && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-text-primary mb-1">Emergency contact</h2>
              <p className="text-sm text-text-muted mb-4">Someone your clinician can contact in an emergency.</p>
              <div>
                <label className="label">Full name</label>
                <input className="input" type="text" placeholder="Jane Smith" value={form.emergencyContactName} onChange={e => set('emergencyContactName', e.target.value)} />
              </div>
              <div>
                <label className="label">Phone number</label>
                <input className="input" type="tel" placeholder="04xx xxx xxx" value={form.emergencyContactPhone} onChange={e => set('emergencyContactPhone', e.target.value)} />
              </div>
              <div>
                <label className="label">Relationship</label>
                <input className="input" type="text" placeholder="e.g. Partner, Parent, Friend" value={form.emergencyContactRelationship} onChange={e => set('emergencyContactRelationship', e.target.value)} />
              </div>
            </div>
          )}

          {step === 'gp' && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-text-primary mb-1">GP & Medicare</h2>
              <p className="text-sm text-text-muted mb-4">This helps your clinician coordinate care and process Medicare claims.</p>
              <div>
                <label className="label">Medicare number <span className="text-text-muted font-normal">(optional)</span></label>
                <input className="input" type="text" placeholder="xxxx xxxxx x" value={form.medicareNumber} onChange={e => set('medicareNumber', e.target.value)} />
              </div>
              <div>
                <label className="label">GP name <span className="text-text-muted font-normal">(optional)</span></label>
                <input className="input" type="text" placeholder="Dr Jane Brown" value={form.gpName} onChange={e => set('gpName', e.target.value)} />
              </div>
              <div>
                <label className="label">GP practice <span className="text-text-muted font-normal">(optional)</span></label>
                <input className="input" type="text" placeholder="Northside Medical" value={form.gpPractice} onChange={e => set('gpPractice', e.target.value)} />
              </div>
              <div>
                <label className="label">GP phone <span className="text-text-muted font-normal">(optional)</span></label>
                <input className="input" type="tel" placeholder="(03) xxxx xxxx" value={form.gpPhone} onChange={e => set('gpPhone', e.target.value)} />
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-text-primary mb-1">Consent</h2>
              <p className="text-sm text-text-muted mb-4">Please review and indicate your consent to the following.</p>
              {[
                { key: 'consentToTelehealth', label: 'Telehealth sessions', desc: 'I consent to receiving therapy via video or phone call when clinically appropriate.' },
                { key: 'consentToRecording', label: 'Session recording for AI notes', desc: 'I consent to my sessions being recorded for the purpose of generating clinical notes. Recordings are not stored after the note is created.' },
                { key: 'consentToResearch', label: 'De-identified research', desc: 'I consent to my de-identified, anonymised data being used to improve mental health services. (Optional)' },
              ].map((c) => (
                <label key={c.key} className="flex gap-3 p-4 border border-beige rounded-xl cursor-pointer hover:bg-sand transition-colors">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-sage"
                    checked={form[c.key as keyof typeof form] as boolean}
                    onChange={e => set(c.key, e.target.checked)}
                  />
                  <div>
                    <p className="font-medium text-text-primary text-sm">{c.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{c.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-text-primary mb-1">Set your password</h2>
              <p className="text-sm text-text-muted mb-4">You&apos;ll use this to log in to your MindBridge client portal.</p>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="At least 8 characters" value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <div>
                <label className="label">Confirm password</label>
                <input className="input" type="password" placeholder="Repeat password" value={form.passwordConfirm} onChange={e => set('passwordConfirm', e.target.value)} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentIndex > 0 ? (
              <button onClick={back} className="btn-ghost flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            <button
              onClick={next}
              disabled={submitting}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : step === 'password' ? (
                <>Complete setup <CheckCircle className="w-4 h-4" /></>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          All information is encrypted and stored securely in Australian data centres.
        </p>
      </div>
    </div>
  );
}
