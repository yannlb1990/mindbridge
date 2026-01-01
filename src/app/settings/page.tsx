'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
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
} from 'lucide-react';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'practice', label: 'Practice', icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function SettingsPage() {
  const { user, clinicianProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen">
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
                        defaultValue={user?.first_name}
                      />
                      <Input
                        label="Last Name"
                        defaultValue={user?.last_name}
                      />
                    </div>

                    <Input
                      label="Preferred Name"
                      defaultValue={user?.preferred_name || ''}
                      hint="How you'd like to be addressed"
                    />

                    <Input
                      label="Email"
                      type="email"
                      defaultValue={user?.email}
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      defaultValue={user?.phone || ''}
                    />

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Pronouns
                      </label>
                      <select
                        defaultValue={user?.pronouns || ''}
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
                      defaultValue={clinicianProfile?.credentials || ''}
                      placeholder="e.g., Clinical Psychologist"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Registration Number"
                        defaultValue={clinicianProfile?.registration_number || ''}
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

            {['security', 'billing', 'appearance', 'privacy', 'help'].includes(activeSection) && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-text-muted">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} settings coming soon
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
