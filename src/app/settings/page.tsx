'use client';

import { useState, useEffect } from 'react';
import { useAppearanceStore, type Theme, type AccentColor, type FontSize } from '@/stores/appearanceStore';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import {
  User,
  Building,
  Bell,
  Lock,
  CreditCard,
  Palette,
  Shield,
  HelpCircle,
  Save,
  Camera,
  LayoutDashboard,
  GripVertical,
  Eye,
  EyeOff,
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  BookOpen,
  ListTodo,
  TrendingUp,
  Clock,
  Check,
} from 'lucide-react';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'practice', label: 'Practice', icon: Building },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  order: number;
}

const ACCENT_HEX: Record<AccentColor, { main: string; dark: string; light: string }> = {
  sage:   { main: '#7C9885', dark: '#5A7360', light: '#A8C5B0' },
  calm:   { main: '#8BA4B4', dark: '#6B8899', light: '#B0C5D1' },
  coral:  { main: '#E8A598', dark: '#C97B7B', light: '#F5C4BB' },
  gold:   { main: '#D4B896', dark: '#B89B6A', light: '#E8D4BC' },
  purple: { main: '#9B8EC4', dark: '#7B6EA0', light: '#C3BAE0' },
  blue:   { main: '#5B8FD4', dark: '#3B70B5', light: '#8BB3E8' },
};

export default function SettingsPage() {
  const { user, clinicianProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedHelp, setExpandedHelp] = useState<number | null>(null);
  const [comingSoonToast, setComingSoonToast] = useState('');

  // Controlled profile state
  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [preferredName, setPreferredName] = useState(user?.preferred_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [pronouns, setPronouns] = useState(user?.pronouns ?? '');
  const [credentials, setCredentials] = useState(clinicianProfile?.credentials ?? '');
  const [registrationNumber, setRegistrationNumber] = useState(clinicianProfile?.registration_number ?? '');

  // Sync state when user/clinicianProfile loads from store
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? '');
      setLastName(user.last_name ?? '');
      setPreferredName(user.preferred_name ?? '');
      setPhone(user.phone ?? '');
      setPronouns(user.pronouns ?? '');
    }
  }, [user]);

  useEffect(() => {
    if (clinicianProfile) {
      setCredentials(clinicianProfile.credentials ?? '');
      setRegistrationNumber(clinicianProfile.registration_number ?? '');
    }
  }, [clinicianProfile]);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaEnrolling, setMfaEnrolling] = useState(false);
  const [mfaQrCode, setMfaQrCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [mfaSuccess, setMfaSuccess] = useState('');

  // Check MFA status on mount
  useEffect(() => {
    if (!user || isEffectiveDemo(user.id)) return;
    (async () => {
      try {
        const { data } = await supabase.auth.mfa.listFactors();
        const totpFactors = data?.totp ?? [];
        const verified = totpFactors.find((f: any) => f.status === 'verified');
        if (verified) {
          setMfaEnabled(true);
          setMfaFactorId(verified.id);
        }
      } catch (err) {
        console.error('Failed to check MFA status:', err);
      }
    })();
  }, [user]);

  const handlePasswordChange = async () => {
    setPasswordError('');

    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    if (isEffectiveDemo(user?.id)) {
      setIsChangingPassword(true);
      await new Promise((r) => setTimeout(r, 600));
      setIsChangingPassword(false);
      setSaveSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(false), 2200);
      return;
    }

    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2200);
    } catch (err: any) {
      setPasswordError(err.message ?? 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleMfaEnroll = async () => {
    if (isEffectiveDemo(user?.id)) {
      showComingSoon('Two-factor authentication');
      return;
    }
    setMfaError('');
    setMfaSuccess('');
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (error) throw error;
      setMfaQrCode(data.totp.qr_code);
      setMfaSecret(data.totp.secret);
      setMfaFactorId(data.id);
      setMfaEnrolling(true);
    } catch (err: any) {
      setMfaError(err.message ?? 'Failed to start 2FA setup.');
    }
  };

  const handleMfaVerify = async () => {
    setMfaError('');
    if (!mfaCode || mfaCode.length !== 6) {
      setMfaError('Please enter the 6-digit code from your authenticator app.');
      return;
    }
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code: mfaCode,
      });
      if (error) throw error;
      setMfaEnabled(true);
      setMfaEnrolling(false);
      setMfaCode('');
      setMfaQrCode('');
      setMfaSecret('');
      setMfaSuccess('Two-factor authentication enabled successfully.');
      setTimeout(() => setMfaSuccess(''), 3000);
    } catch (err: any) {
      setMfaError(err.message ?? 'Invalid code. Please try again.');
    }
  };

  const handleMfaDisable = async () => {
    setMfaError('');
    if (!mfaFactorId) return;
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: mfaFactorId });
      if (error) throw error;
      setMfaEnabled(false);
      setMfaFactorId('');
      setMfaSuccess('Two-factor authentication disabled.');
      setTimeout(() => setMfaSuccess(''), 3000);
    } catch (err: any) {
      setMfaError(err.message ?? 'Failed to disable 2FA.');
    }
  };

  const showComingSoon = (label: string) => {
    setComingSoonToast(label);
    setTimeout(() => setComingSoonToast(''), 2200);
  };

  const { theme, accentColor, fontSize, setTheme, setAccentColor, setFontSize } = useAppearanceStore();

  // Apply appearance changes directly to DOM immediately on state change
  useEffect(() => {
    const resolved = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  }, [theme]);

  useEffect(() => {
    const c = ACCENT_HEX[accentColor];
    document.documentElement.style.setProperty('--sage', c.main);
    document.documentElement.style.setProperty('--sage-dark', c.dark);
    document.documentElement.style.setProperty('--sage-light', c.light);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    const sizes: Record<string, string> = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[fontSize] ?? '16px';
  }, [fontSize]);

  // Dashboard widget configuration
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([
    { id: 'stats', name: 'Quick Stats', description: 'Overview cards showing clients, sessions, notes, etc.', icon: TrendingUp, enabled: true, order: 1 },
    { id: 'schedule', name: "Today's Schedule", description: 'Your sessions scheduled for today', icon: Calendar, enabled: true, order: 2 },
    { id: 'alerts', name: 'Alerts & Notifications', description: 'Risk alerts and important notifications', icon: AlertTriangle, enabled: true, order: 3 },
    { id: 'tasks', name: 'My Tasks', description: 'Clinician tasks from session notes', icon: ListTodo, enabled: true, order: 4 },
    { id: 'homework', name: 'Client Homework', description: 'Overdue and pending client homework', icon: BookOpen, enabled: true, order: 5 },
    { id: 'clients', name: 'Recent Clients', description: 'Quick access to recently viewed clients', icon: Users, enabled: true, order: 6 },
    { id: 'age-distribution', name: 'Age Distribution', description: 'Visual breakdown of client ages', icon: TrendingUp, enabled: true, order: 7 },
    { id: 'unsigned-notes', name: 'Unsigned Notes', description: 'Notes awaiting your signature', icon: FileText, enabled: false, order: 8 },
    { id: 'upcoming-assessments', name: 'Upcoming Assessments', description: 'Assessments due this week', icon: Clock, enabled: false, order: 9 },
  ]);

  const toggleWidget = (widgetId: string) => {
    setDashboardWidgets(widgets =>
      widgets.map(w =>
        w.id === widgetId ? { ...w, enabled: !w.enabled } : w
      )
    );
  };

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const index = dashboardWidgets.findIndex(w => w.id === widgetId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= dashboardWidgets.length) return;

    const newWidgets = [...dashboardWidgets];
    [newWidgets[index], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[index]];

    // Update order numbers
    newWidgets.forEach((w, i) => {
      w.order = i + 1;
    });

    setDashboardWidgets(newWidgets);
  };

  const handleSave = async () => {
    setIsSaving(true);

    if (isEffectiveDemo(user?.id)) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2200);
      return;
    }

    if (!user) {
      setIsSaving(false);
      return;
    }

    try {
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          preferred_name: preferredName || null,
          phone: phone || null,
          pronouns: pronouns || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (userError) throw userError;

      if (clinicianProfile) {
        const { error: clinicianError } = await supabase
          .from('clinician_profiles')
          .update({
            credentials: credentials || null,
            registration_number: registrationNumber || null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (clinicianError) throw clinicianError;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2200);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-white px-5 py-3 rounded-xl shadow-large flex items-center gap-2">
          <Check className="w-4 h-4 text-sage" />
          Changes saved
        </div>
      )}
      {comingSoonToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-white px-5 py-3 rounded-xl shadow-large flex items-center gap-2">
          <Check className="w-4 h-4 text-sage" />
          {comingSoonToast} — coming soon
        </div>
      )}
      <Header
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <Card className="w-64 h-fit sticky top-6">
            <CardContent className="pt-6">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-sage-50 text-sage-dark'
                        : 'text-text-secondary hover:bg-sand'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {activeSection === 'profile' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <Avatar
                        firstName={user?.first_name || 'U'}
                        lastName={user?.last_name || 'U'}
                        size="xl"
                      />
                      <div>
                        <Button variant="secondary" size="sm" leftIcon={<Camera className="w-4 h-4" />}>
                          Change Photo
                        </Button>
                        <p className="text-xs text-text-muted mt-1">JPG, PNG. Max 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <Input
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Preferred Name"
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                      hint="How you'd like to be addressed"
                    />

                    <Input
                      label="Email"
                      type="email"
                      defaultValue={user?.email}
                      disabled
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Pronouns
                      </label>
                      <select
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="she/her">She/Her</option>
                        <option value="he/him">He/Him</option>
                        <option value="they/them">They/Them</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                    <CardDescription>Your clinical qualifications and registration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Professional Title"
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                      placeholder="e.g., Clinical Psychologist"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Registration Number"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                      />
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                          Registration Body
                        </label>
                        <select
                          defaultValue="AHPRA"
                          className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                        >
                          <option value="AHPRA">AHPRA</option>
                          <option value="APS">APS</option>
                          <option value="AASW">AASW</option>
                          <option value="PACFA">PACFA</option>
                          <option value="ACA">ACA</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Specializations
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {clinicianProfile?.specializations?.map((spec) => (
                          <span
                            key={spec}
                            className="px-3 py-1 bg-sage-50 text-sage-dark rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                        <button className="px-3 py-1 border border-dashed border-beige text-text-muted rounded-full text-sm hover:border-sage hover:text-sage">
                          + Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        defaultValue={clinicianProfile?.bio || ''}
                        className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sage resize-none"
                        placeholder="Tell clients about your approach and experience..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              </>
            )}

            {activeSection === 'practice' && (
              <Card>
                <CardHeader>
                  <CardTitle>Practice Settings</CardTitle>
                  <CardDescription>Configure your practice details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Practice Name"
                    defaultValue={clinicianProfile?.practice_name || ''}
                  />
                  <Input
                    label="Practice Address"
                    defaultValue={clinicianProfile?.practice_address || ''}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Default Session Duration (minutes)"
                      type="number"
                      defaultValue={clinicianProfile?.default_session_duration || 50}
                    />
                    <Input
                      label="Default Session Fee ($)"
                      type="number"
                      defaultValue={clinicianProfile?.default_session_fee || 220}
                    />
                  </div>
                  <Input
                    label="ABN"
                    defaultValue={clinicianProfile?.abn || ''}
                  />
                  <Input
                    label="Medicare Provider Number"
                    defaultValue={clinicianProfile?.medicare_provider_number || ''}
                  />
                </CardContent>
              </Card>
            )}

            {activeSection === 'dashboard' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Layout</CardTitle>
                    <CardDescription>
                      Customize which widgets appear on your dashboard and their order.
                      Drag to reorder or toggle visibility.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dashboardWidgets.sort((a, b) => a.order - b.order).map((widget, index) => (
                        <div
                          key={widget.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                            widget.enabled
                              ? 'bg-white border-beige'
                              : 'bg-sand/50 border-beige/50'
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveWidget(widget.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => moveWidget(widget.id, 'down')}
                              disabled={index === dashboardWidgets.length - 1}
                              className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>

                          <div className={`p-2 rounded-lg ${widget.enabled ? 'bg-sage/10' : 'bg-beige'}`}>
                            <widget.icon className={`w-5 h-5 ${widget.enabled ? 'text-sage' : 'text-text-muted'}`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${widget.enabled ? 'text-text-primary' : 'text-text-muted'}`}>
                                {widget.name}
                              </p>
                              {widget.enabled && (
                                <Badge variant="success" size="sm">
                                  <Check className="w-3 h-3 mr-1" />
                                  Visible
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-text-muted">{widget.description}</p>
                          </div>

                          <button
                            onClick={() => toggleWidget(widget.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              widget.enabled
                                ? 'bg-sage/10 text-sage hover:bg-sage/20'
                                : 'bg-beige text-text-muted hover:bg-sand'
                            }`}
                          >
                            {widget.enabled ? (
                              <Eye className="w-5 h-5" />
                            ) : (
                              <EyeOff className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Preferences</CardTitle>
                    <CardDescription>Additional display options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Show greeting message', description: 'Display personalized greeting with your name', default: true },
                      { label: 'Compact mode', description: 'Use smaller cards for more information density', default: false },
                      { label: 'Show risk level colors', description: 'Highlight clients by risk level with colors', default: true },
                      { label: 'Auto-refresh data', description: 'Automatically update dashboard every 5 minutes', default: true },
                      { label: 'Show session countdown', description: 'Display time until next session', default: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-beige last:border-0">
                        <div>
                          <p className="font-medium text-text-primary">{item.label}</p>
                          <p className="text-sm text-text-muted">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                          <div className="w-11 h-6 bg-beige peer-focus:ring-2 peer-focus:ring-sage rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Default View</CardTitle>
                    <CardDescription>Choose your preferred starting view when opening MindBridge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview with all widgets' },
                        { id: 'schedule', label: 'Schedule', icon: Calendar, description: 'Jump to today\'s calendar' },
                        { id: 'clients', label: 'Clients', icon: Users, description: 'Client list view' },
                      ].map((view) => (
                        <label
                          key={view.id}
                          className="flex flex-col items-center p-4 border border-beige rounded-lg cursor-pointer hover:border-sage hover:bg-sage/5 transition-colors has-[:checked]:border-sage has-[:checked]:bg-sage/10"
                        >
                          <input type="radio" name="defaultView" defaultChecked={view.id === 'dashboard'} className="sr-only" />
                          <view.icon className="w-8 h-8 text-sage mb-2" />
                          <p className="font-medium text-text-primary">{view.label}</p>
                          <p className="text-xs text-text-muted text-center mt-1">{view.description}</p>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                    Save Dashboard Settings
                  </Button>
                </div>
              </>
            )}

            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'New client messages', description: 'Get notified when clients send messages' },
                    { label: 'Session reminders', description: '15 minutes before scheduled sessions' },
                    { label: 'Risk alerts', description: 'Immediate alerts for high-risk client updates' },
                    { label: 'Assessment due', description: 'When client assessments are scheduled' },
                    { label: 'Homework completed', description: 'When clients complete assigned homework' },
                    { label: 'Overdue homework', description: 'When client homework becomes overdue' },
                    { label: 'Unsigned notes reminder', description: 'Daily reminder for unsigned clinical notes' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-beige last:border-0">
                      <div>
                        <p className="font-medium text-text-primary">{item.label}</p>
                        <p className="text-sm text-text-muted">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-beige peer-focus:ring-2 peer-focus:ring-sage rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how MindBridge looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {([
                        { id: 'light' as Theme, label: 'Light', color: 'bg-white border border-beige' },
                        { id: 'dark' as Theme, label: 'Dark', color: 'bg-gray-900' },
                        { id: 'system' as Theme, label: 'System', color: 'bg-gradient-to-r from-white to-gray-900' },
                      ]).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTheme(t.id)}
                          className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            theme === t.id
                              ? 'border-sage bg-sage/5'
                              : 'border-beige hover:border-sage'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-lg mb-2 ${t.color}`} />
                          <p className="font-medium text-text-primary">{t.label}</p>
                          {theme === t.id && (
                            <span className="mt-1 text-xs text-sage font-medium">Active</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Accent Color
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {([
                        { id: 'sage' as AccentColor, hex: '#7C9885', label: 'Sage' },
                        { id: 'calm' as AccentColor, hex: '#8BA4B4', label: 'Calm' },
                        { id: 'coral' as AccentColor, hex: '#E8A598', label: 'Coral' },
                        { id: 'gold' as AccentColor, hex: '#D4B896', label: 'Gold' },
                        { id: 'purple' as AccentColor, hex: '#9B8EC4', label: 'Purple' },
                        { id: 'blue' as AccentColor, hex: '#5B8FD4', label: 'Blue' },
                      ]).map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          title={a.label}
                          onClick={() => setAccentColor(a.id)}
                          className={`w-10 h-10 rounded-full transition-all ring-offset-2 ${
                            accentColor === a.id ? 'ring-2 ring-text-primary scale-110' : 'ring-0 hover:scale-105'
                          }`}
                          style={{ backgroundColor: a.hex }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      Changes buttons, links, and active states throughout the app.
                    </p>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Font Size
                    </label>
                    <div className="flex gap-4">
                      {([
                        { id: 'small' as FontSize, label: 'Small', preview: 'text-xs' },
                        { id: 'medium' as FontSize, label: 'Medium', preview: 'text-sm' },
                        { id: 'large' as FontSize, label: 'Large', preview: 'text-base' },
                      ]).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFontSize(f.id)}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                            fontSize === f.id
                              ? 'border-sage bg-sage/10 text-sage font-medium'
                              : 'border-beige hover:border-sage text-text-primary'
                          }`}
                        >
                          <span className={f.preview}>Aa</span>
                          <span>{f.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      Adjusts the base text size across the entire app.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'security' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your login password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      hint="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordError && (
                      <p className="text-sm text-error">{passwordError}</p>
                    )}
                    <Button onClick={handlePasswordChange} isLoading={isChangingPassword} leftIcon={<Save className="w-4 h-4" />}>
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-sand rounded-xl">
                      <div>
                        <p className="font-medium text-text-primary">Authenticator App</p>
                        <p className="text-sm text-text-muted">Use an app like Google Authenticator or Authy</p>
                      </div>
                      <Badge variant={mfaEnabled ? 'success' : 'default'}>
                        {mfaEnabled ? 'Enabled' : 'Not enabled'}
                      </Badge>
                    </div>

                    {mfaError && (
                      <p className="text-sm text-error">{mfaError}</p>
                    )}
                    {mfaSuccess && (
                      <p className="text-sm text-success">{mfaSuccess}</p>
                    )}

                    {/* QR code enrollment flow */}
                    {mfaEnrolling && (
                      <div className="space-y-4 p-4 border border-sage/30 rounded-xl bg-sage/5">
                        <p className="text-sm font-medium text-text-primary">
                          Scan this QR code with your authenticator app
                        </p>
                        {mfaQrCode && (
                          <div
                            className="flex justify-center"
                            dangerouslySetInnerHTML={{ __html: mfaQrCode }}
                          />
                        )}
                        {mfaSecret && (
                          <div>
                            <p className="text-xs text-text-muted mb-1">Or enter this key manually:</p>
                            <code className="text-xs bg-sand px-2 py-1 rounded font-mono break-all">
                              {mfaSecret}
                            </code>
                          </div>
                        )}
                        <Input
                          label="Verification Code"
                          type="text"
                          placeholder="000000"
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          hint="Enter the 6-digit code from your authenticator app"
                        />
                        <div className="flex gap-3">
                          <Button onClick={handleMfaVerify} size="sm">Verify & Enable</Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setMfaEnrolling(false);
                              setMfaQrCode('');
                              setMfaSecret('');
                              setMfaCode('');
                              setMfaError('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!mfaEnrolling && !mfaEnabled && (
                      <Button variant="secondary" onClick={handleMfaEnroll}>Enable 2FA</Button>
                    )}
                    {!mfaEnrolling && mfaEnabled && (
                      <Button variant="ghost" className="text-coral hover:text-coral-dark" onClick={handleMfaDisable}>
                        Disable 2FA
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Devices currently logged into your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { device: 'MacBook Pro — Chrome', location: 'Brisbane, QLD', time: 'Active now', current: true },
                      { device: 'iPhone 15 — Safari', location: 'Brisbane, QLD', time: '2 hours ago', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-beige rounded-xl">
                        <div>
                          <p className="font-medium text-text-primary">{session.device}</p>
                          <p className="text-sm text-text-muted">{session.location} · {session.time}</p>
                        </div>
                        {session.current ? (
                          <Badge variant="success">This device</Badge>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-coral hover:text-coral-dark">Sign out</Button>
                        )}
                      </div>
                    ))}
                    <Button variant="secondary" className="w-full">Sign out all other devices</Button>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === 'billing' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your MindBridge subscription</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-sage/10 border border-sage/30 rounded-xl">
                      <div>
                        <p className="font-semibold text-text-primary">Professional Plan</p>
                        <p className="text-sm text-text-muted">Up to 50 active clients · All features included</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-text-primary text-lg">$89<span className="text-sm font-normal text-text-muted">/mo</span></p>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted">Next billing date: <span className="font-medium text-text-primary">1 April 2026</span></p>
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={() => showComingSoon('Plan change')}>Change Plan</Button>
                      <Button variant="ghost" className="text-coral hover:text-coral-dark" onClick={() => showComingSoon('Subscription cancellation')}>Cancel Subscription</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Manage your billing details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-beige rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">Visa ending in 4242</p>
                          <p className="text-sm text-text-muted">Expires 09/27</p>
                        </div>
                      </div>
                      <Badge variant="success">Default</Badge>
                    </div>
                    <Button variant="secondary" onClick={() => showComingSoon('Payment method update')}>Update Payment Method</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Your recent invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { date: '1 Mar 2026', amount: '$89.00', status: 'Paid' },
                        { date: '1 Feb 2026', amount: '$89.00', status: 'Paid' },
                        { date: '1 Jan 2026', amount: '$89.00', status: 'Paid' },
                      ].map((invoice, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-beige last:border-0">
                          <div>
                            <p className="font-medium text-text-primary">{invoice.date}</p>
                            <p className="text-sm text-text-muted">Professional Plan</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-text-primary">{invoice.amount}</span>
                            <Badge variant="success" size="sm">{invoice.status}</Badge>
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === 'privacy' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                    <CardDescription>Manage how your data is used</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Analytics & Usage Data', description: 'Help improve MindBridge by sharing anonymous usage data', default: true },
                      { label: 'Product Updates', description: 'Receive emails about new features and improvements', default: true },
                      { label: 'Training Data Opt-out', description: 'Exclude your data from AI model training', default: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-beige last:border-0">
                        <div>
                          <p className="font-medium text-text-primary">{item.label}</p>
                          <p className="text-sm text-text-muted">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                          <div className="w-11 h-6 bg-beige peer-focus:ring-2 peer-focus:ring-sage rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Your Data</CardTitle>
                    <CardDescription>Download a copy of your account data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-text-secondary">
                      You can request a full export of your account data including clinical notes, client records, and settings. Exports are prepared within 24 hours and sent to your registered email.
                    </p>
                    <Button variant="secondary" onClick={handleSave} isLoading={isSaving}>Request Data Export</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-coral-dark">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-text-secondary">
                      Deleting your account will permanently remove all your data. Clinical records are retained for the legally required period under Australian health legislation before deletion.
                    </p>
                    <Button variant="ghost" className="text-coral hover:text-coral-dark border border-coral/30 hover:border-coral">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === 'help' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>Click an article to read it inline</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        title: 'Getting Started Guide',
                        description: 'Learn the basics of MindBridge',
                        icon: BookOpen,
                        content: `Welcome to MindBridge! Here's how to get started:\n\n**1. Complete your profile** — Go to Settings → Profile and fill in your name, credentials, and AHPRA registration number.\n\n**2. Add your first client** — Navigate to Clients and click "Add Client". Enter their details and set up their portal access.\n\n**3. Write your first note** — Open a client record and click "Add Note". Choose a template (SOAP, DAP, or BIRP) and start documenting.\n\n**4. Set up your dashboard** — Go to Settings → Dashboard to choose which widgets appear on your home screen.\n\n**5. Invite clients to the portal** — Once a client is set up, they'll receive an invitation email to access their client portal.`,
                      },
                      {
                        title: 'Clinical Notes & Templates',
                        description: 'How to use SOAP, DAP, BIRP formats',
                        icon: FileText,
                        content: `MindBridge supports three clinical note formats:\n\n**SOAP Notes**\n- **S**ubjective — what the client reports\n- **O**bjective — your clinical observations\n- **A**ssessment — your clinical analysis\n- **P**lan — treatment plan and follow-up\n\n**DAP Notes**\n- **D**ata — objective and subjective information\n- **A**ssessment — your interpretation and analysis\n- **P**lan — next steps and interventions\n\n**BIRP Notes**\n- **B**ehaviour — observed client behaviour\n- **I**ntervention — what you did in session\n- **R**esponse — how the client responded\n- **P**lan — goals and next session focus\n\nAll notes are auto-saved as drafts. Sign notes when complete to lock them for compliance.`,
                      },
                      {
                        title: 'Client Portal Setup',
                        description: 'Setting up and inviting clients',
                        icon: Users,
                        content: `The MindBridge client portal gives clients secure access to their own information.\n\n**Setting up a client portal:**\n1. Open the client's record\n2. Click "Portal Access" in the client header\n3. Toggle on "Portal Enabled"\n4. The client will receive an invitation email\n\n**What clients can do:**\n- View their upcoming sessions\n- Complete homework and exercises\n- Send secure messages to you\n- View mood tracking and progress\n- Access documents you share\n\n**Privacy note:** Clients under 18 will not receive email notifications for messages. You can set their date of birth in their profile to ensure age-appropriate privacy settings.`,
                      },
                      {
                        title: 'Billing & Subscriptions',
                        description: 'Managing your plan and payments',
                        icon: CreditCard,
                        content: `**Your current plan**\nYou are on the Professional Plan ($89/month) which includes up to 50 active clients and all features.\n\n**Changing your plan:**\nGo to Settings → Billing → Change Plan to upgrade or downgrade.\n\n**Invoices:**\nAll invoices are downloadable from Settings → Billing → Billing History.\n\n**Medicare & Private Health:**\nMindBridge does not process Medicare or private health fund claims directly. Session fees are tracked for your records. Use your practice management software or claim directly through HICAPS.\n\n**Cancellation:**\nYou can cancel anytime. Your data will be retained for the legally required period before deletion under Australian health legislation.`,
                      },
                      {
                        title: 'Privacy & Compliance',
                        description: 'How we protect your client data',
                        icon: Shield,
                        content: `MindBridge is built to comply with Australian privacy and health legislation.\n\n**Data storage:**\nAll data is stored in Australian data centres. We do not transfer data overseas.\n\n**Encryption:**\nAll data is encrypted at rest and in transit using AES-256 and TLS 1.3.\n\n**Australian Privacy Principles (APPs):**\nWe comply with all 13 Australian Privacy Principles under the Privacy Act 1988.\n\n**Health Records Act:**\nClinical notes are retained in accordance with state and territory health records legislation (minimum 7 years for adults, until age 25 for minors).\n\n**Access to your data:**\nYou can request a data export at any time from Settings → Privacy → Export Your Data.\n\n**Questions?** Contact our privacy officer at privacy@mindbridge.com.au`,
                      },
                    ].map((item, i) => (
                      <div key={i} className="border border-beige rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedHelp(expandedHelp === i ? null : i)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-sage/5 transition-colors text-left"
                        >
                          <div className="p-2 bg-sage/10 rounded-lg flex-shrink-0">
                            <item.icon className="w-5 h-5 text-sage" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-text-primary">{item.title}</p>
                            <p className="text-sm text-text-muted">{item.description}</p>
                          </div>
                          <svg
                            className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${expandedHelp === i ? 'rotate-90' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        {expandedHelp === i && (
                          <div className="px-4 pb-4 border-t border-beige bg-sand/30">
                            <div className="pt-4 space-y-2">
                              {item.content.split('\n\n').map((paragraph, pi) => {
                                if (paragraph.startsWith('**') && paragraph.endsWith('**') && !paragraph.slice(2, -2).includes('**')) {
                                  return (
                                    <p key={pi} className="font-semibold text-text-primary mt-3">
                                      {paragraph.slice(2, -2)}
                                    </p>
                                  );
                                }
                                return (
                                  <p key={pi} className="text-sm text-text-secondary leading-relaxed">
                                    {paragraph.split('**').map((part, idx) =>
                                      idx % 2 === 1 ? <strong key={idx} className="text-text-primary font-semibold">{part}</strong> : part
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>Get in touch with the MindBridge team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <a
                        href="mailto:support@mindbridge.com.au?subject=MindBridge Support Request"
                        className="p-4 border border-beige rounded-xl text-center hover:border-sage hover:bg-sage/5 cursor-pointer transition-colors block"
                      >
                        <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="font-medium text-text-primary">Email Support</p>
                        <p className="text-xs text-text-muted mt-1">support@mindbridge.com.au</p>
                        <p className="text-xs text-text-muted">Response within 24h</p>
                      </a>
                      <a
                        href="mailto:support@mindbridge.com.au?subject=Live Chat Request&body=Please contact me via email as live chat is unavailable."
                        className="p-4 border border-beige rounded-xl text-center hover:border-sage hover:bg-sage/5 cursor-pointer transition-colors block"
                      >
                        <div className="w-10 h-10 bg-calm/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-calm-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="font-medium text-text-primary">Live Chat</p>
                        <p className="text-xs text-text-muted mt-1">Mon–Fri, 9am–5pm AEST</p>
                        <p className="text-xs text-sage font-medium">Available now</p>
                      </a>
                    </div>
                    <div className="p-4 bg-sand rounded-xl">
                      <p className="text-sm font-medium text-text-primary mb-1">App Version</p>
                      <p className="text-sm text-text-muted">MindBridge v1.0.0 · Next.js 14</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
