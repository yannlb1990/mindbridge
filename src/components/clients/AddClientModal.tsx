'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useClients } from '@/hooks/useClients';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (clientId: string) => void;
}

export function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const { createClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    pronouns: '',
    primaryDiagnosis: '',
    treatmentApproach: '',
    riskLevel: 'low' as 'low' | 'moderate' | 'high' | 'critical',
    emergencyContactName: '',
    emergencyContactPhone: '',
    referrerName: '',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    const result = await createClient({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      pronouns: formData.pronouns || undefined,
      primaryDiagnosis: formData.primaryDiagnosis || undefined,
      treatmentApproach: formData.treatmentApproach || undefined,
      riskLevel: formData.riskLevel,
      emergencyContactName: formData.emergencyContactName || undefined,
      emergencyContactPhone: formData.emergencyContactPhone || undefined,
      referrerName: formData.referrerName || undefined,
      notes: formData.notes || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        pronouns: '',
        primaryDiagnosis: '',
        treatmentApproach: '',
        riskLevel: 'low',
        emergencyContactName: '',
        emergencyContactPhone: '',
        referrerName: '',
        notes: '',
      });
      onClose();
      if (onSuccess && result.clientId) {
        onSuccess(result.clientId);
      }
    } else {
      setError(result.error || 'Failed to create client');
    }
  };

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-coral-light/20 border border-coral rounded-lg text-coral-dark text-sm">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">Basic Information</h3>
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
          </div>
        </div>

        {/* Clinical Information */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">Clinical Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primary Diagnosis"
              value={formData.primaryDiagnosis}
              onChange={(e) => handleChange('primaryDiagnosis', e.target.value)}
              placeholder="e.g., Anorexia Nervosa"
            />
            <Input
              label="Treatment Approach"
              value={formData.treatmentApproach}
              onChange={(e) => handleChange('treatmentApproach', e.target.value)}
              placeholder="e.g., FBT, CBT-E"
            />
            <Select
              label="Current Risk Level"
              value={formData.riskLevel}
              onChange={(e) => handleChange('riskLevel', e.target.value)}
              options={riskLevelOptions}
            />
            <Input
              label="Referrer"
              value={formData.referrerName}
              onChange={(e) => handleChange('referrerName', e.target.value)}
              placeholder="GP or referrer name"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label="Additional Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional information about this client..."
          rows={3}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-beige">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add Client
          </Button>
        </div>
      </form>
    </Modal>
  );
}
