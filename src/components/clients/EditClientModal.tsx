'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useClients, Client } from '@/hooks/useClients';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Heart,
  AlertTriangle,
  FileText,
  Users,
  Stethoscope,
  MapPin,
  CreditCard,
  Shield,
} from 'lucide-react';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onSuccess?: () => void;
}

type TabType = 'personal' | 'clinical' | 'contacts' | 'billing' | 'preferences';

export function EditClientModal({ isOpen, onClose, client, onSuccess }: EditClientModalProps) {
  const { updateClient } = useClients();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    preferredName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    pronouns: '',
    gender: '',
    address: '',
    suburb: '',
    state: '',
    postcode: '',

    // Clinical Information
    primaryDiagnosis: '',
    secondaryDiagnoses: '',
    treatmentApproach: '',
    treatmentStartDate: '',
    riskLevel: 'low' as 'low' | 'moderate' | 'high' | 'critical',
    medicareNumber: '',
    referralSource: '',
    referrerName: '',
    referralDate: '',
    gpName: '',
    gpPhone: '',
    gpAddress: '',
    psychiatristName: '',
    psychiatristPhone: '',

    // Emergency Contacts
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    secondaryContactName: '',
    secondaryContactPhone: '',
    secondaryContactRelationship: '',

    // Billing
    billingType: 'private' as 'private' | 'medicare' | 'dva' | 'insurance' | 'ndis',
    healthFund: '',
    healthFundNumber: '',
    ndisNumber: '',
    ndisManager: '',
    invoiceEmail: '',

    // Preferences
    preferredSessionTime: '',
    preferredSessionDay: '',
    sessionReminders: true,
    reminderMethod: 'sms' as 'sms' | 'email' | 'both',
    consentToTelehealth: false,
    consentToRecording: false,
    notes: '',
  });

  // Initialize form with client data
  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.first_name || '',
        lastName: client.last_name || '',
        preferredName: client.preferred_name || '',
        email: client.email || '',
        phone: client.phone || '',
        dateOfBirth: client.date_of_birth || '',
        pronouns: client.pronouns || '',
        gender: client.gender || '',
        address: client.address || '',
        suburb: client.suburb || '',
        state: client.state || '',
        postcode: client.postcode || '',
        primaryDiagnosis: client.primary_diagnosis || '',
        secondaryDiagnoses: client.secondary_diagnoses?.join(', ') || '',
        treatmentApproach: client.treatment_approach || '',
        treatmentStartDate: client.treatment_start_date || '',
        riskLevel: client.current_risk_level || 'low',
        medicareNumber: client.medicare_number || '',
        referralSource: client.referral_source || '',
        referrerName: client.referrer_name || '',
        referralDate: client.referral_date || '',
        gpName: client.gp_name || '',
        gpPhone: client.gp_phone || '',
        gpAddress: client.gp_address || '',
        psychiatristName: client.psychiatrist_name || '',
        psychiatristPhone: client.psychiatrist_phone || '',
        emergencyContactName: client.emergency_contact_name || '',
        emergencyContactPhone: client.emergency_contact_phone || '',
        emergencyContactRelationship: client.emergency_contact_relationship || '',
        secondaryContactName: client.secondary_contact_name || '',
        secondaryContactPhone: client.secondary_contact_phone || '',
        secondaryContactRelationship: client.secondary_contact_relationship || '',
        billingType: client.billing_type || 'private',
        healthFund: client.health_fund || '',
        healthFundNumber: client.health_fund_number || '',
        ndisNumber: client.ndis_number || '',
        ndisManager: client.ndis_manager || '',
        invoiceEmail: client.invoice_email || client.email || '',
        preferredSessionTime: client.preferred_session_time || '',
        preferredSessionDay: client.preferred_session_day || '',
        sessionReminders: client.session_reminders !== false,
        reminderMethod: client.reminder_method || 'sms',
        consentToTelehealth: client.consent_to_telehealth || false,
        consentToRecording: client.consent_to_recording || false,
        notes: client.notes || '',
      });
      setHasChanges(false);
    }
  }, [client]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await updateClient(client.id, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      preferred_name: formData.preferredName || undefined,
      email: formData.email,
      phone: formData.phone || undefined,
      date_of_birth: formData.dateOfBirth || undefined,
      pronouns: formData.pronouns || undefined,
      gender: formData.gender || undefined,
      address: formData.address || undefined,
      suburb: formData.suburb || undefined,
      state: formData.state || undefined,
      postcode: formData.postcode || undefined,
      primary_diagnosis: formData.primaryDiagnosis || undefined,
      secondary_diagnoses: formData.secondaryDiagnoses ? formData.secondaryDiagnoses.split(',').map(d => d.trim()) : undefined,
      treatment_approach: formData.treatmentApproach || undefined,
      treatment_start_date: formData.treatmentStartDate || undefined,
      current_risk_level: formData.riskLevel,
      medicare_number: formData.medicareNumber || undefined,
      referral_source: formData.referralSource || undefined,
      referrer_name: formData.referrerName || undefined,
      referral_date: formData.referralDate || undefined,
      gp_name: formData.gpName || undefined,
      gp_phone: formData.gpPhone || undefined,
      gp_address: formData.gpAddress || undefined,
      psychiatrist_name: formData.psychiatristName || undefined,
      psychiatrist_phone: formData.psychiatristPhone || undefined,
      emergency_contact_name: formData.emergencyContactName || undefined,
      emergency_contact_phone: formData.emergencyContactPhone || undefined,
      emergency_contact_relationship: formData.emergencyContactRelationship || undefined,
      secondary_contact_name: formData.secondaryContactName || undefined,
      secondary_contact_phone: formData.secondaryContactPhone || undefined,
      secondary_contact_relationship: formData.secondaryContactRelationship || undefined,
      billing_type: formData.billingType,
      health_fund: formData.healthFund || undefined,
      health_fund_number: formData.healthFundNumber || undefined,
      ndis_number: formData.ndisNumber || undefined,
      ndis_manager: formData.ndisManager || undefined,
      invoice_email: formData.invoiceEmail || undefined,
      preferred_session_time: formData.preferredSessionTime || undefined,
      preferred_session_day: formData.preferredSessionDay || undefined,
      session_reminders: formData.sessionReminders,
      reminder_method: formData.reminderMethod,
      consent_to_telehealth: formData.consentToTelehealth,
      consent_to_recording: formData.consentToRecording,
      notes: formData.notes || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setHasChanges(false);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError(result.error || 'Failed to update client');
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
    { id: 'clinical', label: 'Clinical', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'contacts', label: 'Contacts', icon: <Users className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Shield className="w-4 h-4" /> },
  ];

  const riskLevelOptions = [
    { value: 'low', label: 'Low Risk' },
    { value: 'moderate', label: 'Moderate Risk' },
    { value: 'high', label: 'High Risk' },
    { value: 'critical', label: 'Critical Risk' },
  ];

  const pronounOptions = [
    { value: '', label: 'Select pronouns' },
    { value: 'she/her', label: 'She/Her' },
    { value: 'he/him', label: 'He/Him' },
    { value: 'they/them', label: 'They/Them' },
    { value: 'other', label: 'Other' },
  ];

  const stateOptions = [
    { value: '', label: 'Select state' },
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' },
  ];

  const billingTypeOptions = [
    { value: 'private', label: 'Private Pay' },
    { value: 'medicare', label: 'Medicare Rebate' },
    { value: 'dva', label: 'DVA' },
    { value: 'insurance', label: 'Private Health Insurance' },
    { value: 'ndis', label: 'NDIS' },
  ];

  const dayOptions = [
    { value: '', label: 'No preference' },
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
  ];

  const timeOptions = [
    { value: '', label: 'No preference' },
    { value: 'morning', label: 'Morning (8am - 12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
    { value: 'evening', label: 'Evening (5pm - 8pm)' },
  ];

  const reminderOptions = [
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' },
    { value: 'both', label: 'Both SMS & Email' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Client" size="xl">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-coral-light/20 border border-coral rounded-lg text-coral-dark text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-sand rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                />
                <Input
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
                <Input
                  label="Preferred Name"
                  value={formData.preferredName}
                  onChange={(e) => handleChange('preferredName', e.target.value)}
                  placeholder="Nickname or preferred name"
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
                <Select
                  label="Pronouns"
                  value={formData.pronouns}
                  onChange={(e) => handleChange('pronouns', e.target.value)}
                  options={pronounOptions}
                />
                <Input
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  placeholder="Enter gender identity"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="client@email.com"
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="0400 000 000"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Street Address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123 Example Street"
                  />
                </div>
                <Input
                  label="Suburb"
                  value={formData.suburb}
                  onChange={(e) => handleChange('suburb', e.target.value)}
                  placeholder="Suburb"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    options={stateOptions}
                  />
                  <Input
                    label="Postcode"
                    value={formData.postcode}
                    onChange={(e) => handleChange('postcode', e.target.value)}
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Information Tab */}
        {activeTab === 'clinical' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Diagnosis & Treatment
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Primary Diagnosis"
                  value={formData.primaryDiagnosis}
                  onChange={(e) => handleChange('primaryDiagnosis', e.target.value)}
                  placeholder="e.g., Anorexia Nervosa"
                />
                <Input
                  label="Secondary Diagnoses"
                  value={formData.secondaryDiagnoses}
                  onChange={(e) => handleChange('secondaryDiagnoses', e.target.value)}
                  placeholder="Comma separated"
                />
                <Input
                  label="Treatment Approach"
                  value={formData.treatmentApproach}
                  onChange={(e) => handleChange('treatmentApproach', e.target.value)}
                  placeholder="e.g., FBT, CBT-E, DBT"
                />
                <Input
                  label="Treatment Start Date"
                  type="date"
                  value={formData.treatmentStartDate}
                  onChange={(e) => handleChange('treatmentStartDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risk Assessment
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Current Risk Level"
                  value={formData.riskLevel}
                  onChange={(e) => handleChange('riskLevel', e.target.value)}
                  options={riskLevelOptions}
                />
                <Input
                  label="Medicare Number"
                  value={formData.medicareNumber}
                  onChange={(e) => handleChange('medicareNumber', e.target.value)}
                  placeholder="1234 56789 1"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Referral Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Referral Source"
                  value={formData.referralSource}
                  onChange={(e) => handleChange('referralSource', e.target.value)}
                  placeholder="e.g., GP, Self, School"
                />
                <Input
                  label="Referrer Name"
                  value={formData.referrerName}
                  onChange={(e) => handleChange('referrerName', e.target.value)}
                  placeholder="Dr. Name"
                />
                <Input
                  label="Referral Date"
                  type="date"
                  value={formData.referralDate}
                  onChange={(e) => handleChange('referralDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Healthcare Team
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="GP Name"
                  value={formData.gpName}
                  onChange={(e) => handleChange('gpName', e.target.value)}
                  placeholder="Dr. General Practitioner"
                />
                <Input
                  label="GP Phone"
                  type="tel"
                  value={formData.gpPhone}
                  onChange={(e) => handleChange('gpPhone', e.target.value)}
                  placeholder="02 0000 0000"
                />
                <Input
                  label="Psychiatrist Name"
                  value={formData.psychiatristName}
                  onChange={(e) => handleChange('psychiatristName', e.target.value)}
                  placeholder="Dr. Psychiatrist"
                />
                <Input
                  label="Psychiatrist Phone"
                  type="tel"
                  value={formData.psychiatristPhone}
                  onChange={(e) => handleChange('psychiatristPhone', e.target.value)}
                  placeholder="02 0000 0000"
                />
                <div className="col-span-2">
                  <Input
                    label="GP Address"
                    value={formData.gpAddress}
                    onChange={(e) => handleChange('gpAddress', e.target.value)}
                    placeholder="GP clinic address"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-coral" />
                Primary Emergency Contact
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Contact Name"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                  placeholder="Parent/Guardian name"
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                  placeholder="0400 000 000"
                />
                <Input
                  label="Relationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => handleChange('emergencyContactRelationship', e.target.value)}
                  placeholder="e.g., Mother, Father, Partner"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Secondary Emergency Contact
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Contact Name"
                  value={formData.secondaryContactName}
                  onChange={(e) => handleChange('secondaryContactName', e.target.value)}
                  placeholder="Secondary contact name"
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  value={formData.secondaryContactPhone}
                  onChange={(e) => handleChange('secondaryContactPhone', e.target.value)}
                  placeholder="0400 000 000"
                />
                <Input
                  label="Relationship"
                  value={formData.secondaryContactRelationship}
                  onChange={(e) => handleChange('secondaryContactRelationship', e.target.value)}
                  placeholder="e.g., Sibling, Friend"
                />
              </div>
            </div>

            <div className="p-4 bg-calm/10 rounded-lg border border-calm/20">
              <p className="text-sm text-calm-dark">
                <strong>Note:</strong> Emergency contacts will be notified in crisis situations as per your practice&apos;s
                policies and the client&apos;s safety plan.
              </p>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Billing Type
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Primary Billing Method"
                  value={formData.billingType}
                  onChange={(e) => handleChange('billingType', e.target.value)}
                  options={billingTypeOptions}
                />
                <Input
                  label="Invoice Email"
                  type="email"
                  value={formData.invoiceEmail}
                  onChange={(e) => handleChange('invoiceEmail', e.target.value)}
                  placeholder="billing@email.com"
                />
              </div>
            </div>

            {formData.billingType === 'medicare' && (
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Medicare Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Medicare Number"
                    value={formData.medicareNumber}
                    onChange={(e) => handleChange('medicareNumber', e.target.value)}
                    placeholder="1234 56789 1"
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Ensure a valid Mental Health Treatment Plan referral is on file for Medicare rebates.
                </p>
              </div>
            )}

            {formData.billingType === 'insurance' && (
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Private Health Insurance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Health Fund"
                    value={formData.healthFund}
                    onChange={(e) => handleChange('healthFund', e.target.value)}
                    placeholder="e.g., Medibank, Bupa"
                  />
                  <Input
                    label="Member Number"
                    value={formData.healthFundNumber}
                    onChange={(e) => handleChange('healthFundNumber', e.target.value)}
                    placeholder="Member ID"
                  />
                </div>
              </div>
            )}

            {formData.billingType === 'ndis' && (
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">NDIS Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="NDIS Number"
                    value={formData.ndisNumber}
                    onChange={(e) => handleChange('ndisNumber', e.target.value)}
                    placeholder="NDIS participant number"
                  />
                  <Input
                    label="Plan Manager / Support Coordinator"
                    value={formData.ndisManager}
                    onChange={(e) => handleChange('ndisManager', e.target.value)}
                    placeholder="Plan manager name/org"
                  />
                </div>
              </div>
            )}

            <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
              <p className="text-sm text-text-primary">
                <strong>Xero Integration:</strong> Billing information will sync with your connected Xero account
                for automated invoicing.
              </p>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Session Preferences
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Preferred Day"
                  value={formData.preferredSessionDay}
                  onChange={(e) => handleChange('preferredSessionDay', e.target.value)}
                  options={dayOptions}
                />
                <Select
                  label="Preferred Time"
                  value={formData.preferredSessionTime}
                  onChange={(e) => handleChange('preferredSessionTime', e.target.value)}
                  options={timeOptions}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Communication Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-sand rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Session Reminders</p>
                    <p className="text-sm text-text-muted">Receive reminders before scheduled sessions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sessionReminders}
                      onChange={(e) => handleChange('sessionReminders', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-beige peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                  </label>
                </div>

                {formData.sessionReminders && (
                  <Select
                    label="Reminder Method"
                    value={formData.reminderMethod}
                    onChange={(e) => handleChange('reminderMethod', e.target.value)}
                    options={reminderOptions}
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Consent
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-sand rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Telehealth Sessions</p>
                    <p className="text-sm text-text-muted">Consent to conduct sessions via video call</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentToTelehealth}
                      onChange={(e) => handleChange('consentToTelehealth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-beige peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-sand rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Session Recording</p>
                    <p className="text-sm text-text-muted">Consent to record sessions for clinical purposes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentToRecording}
                      onChange={(e) => handleChange('consentToRecording', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-beige peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Notes
              </h3>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes about this client's preferences, accommodations, or special considerations..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-beige">
          <div>
            {hasChanges && (
              <Badge variant="warning" size="sm">Unsaved changes</Badge>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={!hasChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
