'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useSessions } from '@/hooks/useSessions';
import { useDemoData } from '@/hooks/useDemoData';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedClientId?: string;
  preselectedDate?: string;
}

export function NewSessionModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedClientId,
  preselectedDate
}: NewSessionModalProps) {
  const { createSession } = useSessions();
  const { clients } = useDemoData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    sessionType: 'individual' as 'individual' | 'family' | 'group' | 'telehealth' | 'phone',
    date: preselectedDate || '',
    time: '09:00',
    duration: '50',
    fee: '220',
    location: '',
    telehealthLink: '',
    notes: '',
  });

  useEffect(() => {
    if (preselectedClientId) {
      setFormData(prev => ({ ...prev, clientId: preselectedClientId }));
    }
    if (preselectedDate) {
      setFormData(prev => ({ ...prev, date: preselectedDate }));
    }
  }, [preselectedClientId, preselectedDate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.date || !formData.time) {
      setError('Please select a client and schedule date/time');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Combine date and time into ISO string
    const scheduledStart = new Date(`${formData.date}T${formData.time}`).toISOString();

    const autoLink =
      formData.sessionType === 'telehealth' && !formData.telehealthLink
        ? `https://meet.mindbridge.app/room-${Math.random().toString(36).substring(2, 10)}`
        : formData.telehealthLink || undefined;

    const result = await createSession({
      clientId: formData.clientId,
      sessionType: formData.sessionType,
      scheduledStart,
      durationMinutes: parseInt(formData.duration),
      fee: parseFloat(formData.fee) || undefined,
      location: formData.sessionType === 'telehealth' ? undefined : formData.location || undefined,
      telehealthLink: formData.sessionType === 'telehealth' ? autoLink : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setFormData({
        clientId: '',
        sessionType: 'individual',
        date: '',
        time: '09:00',
        duration: '50',
        fee: '220',
        location: '',
        telehealthLink: '',
        notes: '',
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError(result.error || 'Failed to create session');
    }
  };

  const clientOptions = [
    { value: '', label: 'Select a client' },
    ...clients.map((c) => ({
      value: c.id,
      label: `${c.first_name} ${c.last_name}`,
    })),
  ];

  const sessionTypeOptions = [
    { value: 'individual', label: 'Individual Session' },
    { value: 'family', label: 'Family Session' },
    { value: 'group', label: 'Group Session' },
    { value: 'telehealth', label: 'Telehealth' },
    { value: 'phone', label: 'Phone Consultation' },
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '50', label: '50 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
    { value: '120', label: '120 minutes' },
  ];

  const timeSlots = [];
  for (let hour = 7; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = min.toString().padStart(2, '0');
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      timeSlots.push({
        value: `${h}:${m}`,
        label: `${displayHour}:${m} ${period}`,
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book New Session" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-coral-light/20 border border-coral rounded-lg text-coral-dark text-sm">
            {error}
          </div>
        )}

        {/* Client Selection */}
        <Select
          label="Client *"
          value={formData.clientId}
          onChange={(e) => handleChange('clientId', e.target.value)}
          options={clientOptions}
        />

        {/* Session Type */}
        <Select
          label="Session Type"
          value={formData.sessionType}
          onChange={(e) => handleChange('sessionType', e.target.value)}
          options={sessionTypeOptions}
        />

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date *"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <Select
            label="Time *"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            options={timeSlots}
          />
        </div>

        {/* Duration and Fee */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Duration"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            options={durationOptions}
          />
          <Input
            label="Fee (AUD)"
            type="number"
            value={formData.fee}
            onChange={(e) => handleChange('fee', e.target.value)}
            placeholder="220"
          />
        </div>

        {/* Location or Telehealth Link */}
        {formData.sessionType === 'telehealth' ? (
          <Input
            label="Telehealth Link"
            value={formData.telehealthLink}
            onChange={(e) => handleChange('telehealthLink', e.target.value)}
            placeholder="https://meet.mindbridge.com.au/..."
            hint="Leave blank to auto-generate"
          />
        ) : formData.sessionType !== 'phone' ? (
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="123 Collins St, Melbourne VIC"
          />
        ) : null}

        {/* Notes */}
        <Textarea
          label="Session Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any pre-session notes or preparation..."
          rows={2}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-beige">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Book Session
          </Button>
        </div>
      </form>
    </Modal>
  );
}
