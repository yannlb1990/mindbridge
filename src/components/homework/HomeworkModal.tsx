'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useHomework } from '@/hooks/useHomework';
import { useClients, Client } from '@/hooks/useClients';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (homeworkId: string) => void;
  preselectedClientId?: string;
}

export function HomeworkModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedClientId,
}: HomeworkModalProps) {
  const { createHomework } = useHomework();
  const { clients } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    title: '',
    description: '',
    category: 'worksheet' as 'worksheet' | 'exercise' | 'reading' | 'practice' | 'journal' | 'other',
    dueDate: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.title) {
      setError('Please select a client and enter a title');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createHomework({
      clientId: formData.clientId,
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      dueDate: formData.dueDate || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setFormData({
        clientId: '',
        title: '',
        description: '',
        category: 'worksheet',
        dueDate: '',
      });
      onClose();
      if (onSuccess && result.homeworkId) {
        onSuccess(result.homeworkId);
      }
    } else {
      setError(result.error || 'Failed to create homework');
    }
  };

  const clientOptions = [
    { value: '', label: 'Select a client' },
    ...clients.map((c: Client) => ({
      value: c.id,
      label: `${c.first_name} ${c.last_name}`,
    })),
  ];

  const categoryOptions = [
    { value: 'worksheet', label: 'Worksheet' },
    { value: 'exercise', label: 'Exercise / Activity' },
    { value: 'reading', label: 'Reading Material' },
    { value: 'practice', label: 'Skill Practice' },
    { value: 'journal', label: 'Journaling / Tracking' },
    { value: 'other', label: 'Other' },
  ];

  // Pre-made homework templates
  const templates = [
    { title: 'Complete Thought Record', category: 'worksheet', description: 'Fill out the thought record worksheet for challenging situations this week' },
    { title: 'Practice Deep Breathing', category: 'exercise', description: 'Practice diaphragmatic breathing for 5 minutes, twice daily' },
    { title: '5-4-3-2-1 Grounding Exercise', category: 'exercise', description: 'Use the grounding technique when feeling anxious or overwhelmed' },
    { title: 'Daily Mood Tracking', category: 'journal', description: 'Record your mood 3 times daily using the scale we discussed' },
    { title: 'Meal Log Completion', category: 'journal', description: 'Log all meals and snacks with hunger/fullness ratings' },
    { title: 'Behavioral Experiment', category: 'practice', description: 'Test the belief we identified by [specific experiment]' },
    { title: 'Self-Compassion Practice', category: 'practice', description: 'Write a self-compassionate letter about a recent difficult situation' },
    { title: 'Progressive Muscle Relaxation', category: 'exercise', description: 'Practice PMR using the audio recording, once daily before bed' },
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      category: template.category as any,
      description: template.description,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Homework" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-coral-light/20 border border-coral rounded-lg text-coral-dark text-sm">
            {error}
          </div>
        )}

        {/* Quick Templates */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.slice(0, 4).map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(template)}
                className="px-3 py-1.5 text-xs bg-sage-light/20 text-sage-dark rounded-full hover:bg-sage-light/40 transition-colors"
              >
                {template.title}
              </button>
            ))}
          </div>
        </div>

        {/* Client Selection */}
        <Select
          label="Client *"
          value={formData.clientId}
          onChange={(e) => handleChange('clientId', e.target.value)}
          options={clientOptions}
        />

        {/* Title */}
        <Input
          label="Assignment Title *"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Complete thought record worksheet"
        />

        {/* Category */}
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={categoryOptions}
        />

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />

        {/* Description */}
        <Textarea
          label="Instructions"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Detailed instructions for the client..."
          rows={4}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-beige">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Assign Homework
          </Button>
        </div>
      </form>
    </Modal>
  );
}
