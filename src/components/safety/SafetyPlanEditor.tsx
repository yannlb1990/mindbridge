'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSafetyPlans, SafetyPlan, AUSTRALIAN_CRISIS_RESOURCES } from '@/hooks/useSafetyPlans';
import { useClients, Client } from '@/hooks/useClients';

interface SafetyPlanEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (planId: string) => void;
  existingPlan?: SafetyPlan;
  preselectedClientId?: string;
}

interface ListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

function ListEditor({ label, items, onChange, placeholder, suggestions }: ListEditorProps) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addSuggestion = (suggestion: string) => {
    if (!items.includes(suggestion)) {
      onChange([...items, suggestion]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">{label}</label>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {suggestions.filter(s => !items.includes(s)).slice(0, 4).map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addSuggestion(suggestion)}
              className="px-2 py-1 text-xs bg-sage-light/20 text-sage-dark rounded-full hover:bg-sage-light/40 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Current items */}
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-cream/50 rounded-lg px-3 py-2">
            <span className="flex-1 text-sm">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-coral-dark hover:text-coral-dark/80 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          className="flex-1"
        />
        <Button type="button" variant="secondary" onClick={addItem} size="sm">
          Add
        </Button>
      </div>
    </div>
  );
}

interface ContactEditorProps {
  label: string;
  contacts: Array<{ name: string; phone: string; relationship?: string; role?: string }>;
  onChange: (contacts: any[]) => void;
  type: 'social' | 'professional';
}

function ContactEditor({ label, contacts, onChange, type }: ContactEditorProps) {
  const [newContact, setNewContact] = useState({ name: '', phone: '', extra: '' });

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      const contact = type === 'social'
        ? { name: newContact.name.trim(), phone: newContact.phone.trim(), relationship: newContact.extra.trim() || 'Contact' }
        : { name: newContact.name.trim(), phone: newContact.phone.trim(), role: newContact.extra.trim() || 'Professional' };
      onChange([...contacts, contact]);
      setNewContact({ name: '', phone: '', extra: '' });
    }
  };

  const removeContact = (index: number) => {
    onChange(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">{label}</label>

      {/* Current contacts */}
      <div className="space-y-2">
        {contacts.map((contact, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-cream/50 rounded-lg px-3 py-2">
            <div className="flex-1">
              <div className="text-sm font-medium">{contact.name}</div>
              <div className="text-xs text-text-muted">
                {contact.phone} • {type === 'social' ? contact.relationship : contact.role}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeContact(idx)}
              className="text-coral-dark hover:text-coral-dark/80 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="grid grid-cols-3 gap-2">
        <Input
          value={newContact.name}
          onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Name"
        />
        <Input
          value={newContact.phone}
          onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Phone"
        />
        <div className="flex gap-2">
          <Input
            value={newContact.extra}
            onChange={(e) => setNewContact(prev => ({ ...prev, extra: e.target.value }))}
            placeholder={type === 'social' ? 'Relationship' : 'Role'}
            className="flex-1"
          />
          <Button type="button" variant="secondary" onClick={addContact} size="sm">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

// Suggestion lists
const WARNING_SIGN_SUGGESTIONS = [
  'Isolating from others',
  'Changes in sleep patterns',
  'Skipping meals',
  'Increased negative self-talk',
  'Feeling hopeless',
  'Difficulty concentrating',
  'Physical tension or restlessness',
  'Avoiding activities previously enjoyed',
];

const COPING_SUGGESTIONS = [
  'Deep breathing exercises',
  '5-4-3-2-1 grounding technique',
  'Going for a walk',
  'Calling a friend',
  'Listening to music',
  'Writing in a journal',
  'Taking a shower',
  'Watching a favourite show',
];

const SAFE_ENVIRONMENT_SUGGESTIONS = [
  'Keep medications locked',
  'Remove sharps from easy access',
  'Stay in common areas when struggling',
  'Keep phone charged',
  'Have crisis numbers visible',
];

const REASONS_SUGGESTIONS = [
  'Family and friends who care',
  'Future goals and dreams',
  'Pets who depend on me',
  'Things can get better',
  'People I want to help',
];

export function SafetyPlanEditor({
  isOpen,
  onClose,
  onSuccess,
  existingPlan,
  preselectedClientId,
}: SafetyPlanEditorProps) {
  const { createSafetyPlan, updateSafetyPlan, markReviewed } = useSafetyPlans();
  const { clients } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const [clientId, setClientId] = useState(preselectedClientId || existingPlan?.client_id || '');
  const [warningSigns, setWarningSigns] = useState<string[]>(existingPlan?.warning_signs || []);
  const [copingStrategies, setCopingStrategies] = useState<string[]>(existingPlan?.coping_strategies || []);
  const [socialContacts, setSocialContacts] = useState<SafetyPlan['social_contacts']>(existingPlan?.social_contacts || []);
  const [professionalContacts, setProfessionalContacts] = useState<SafetyPlan['professional_contacts']>(existingPlan?.professional_contacts || []);
  const [safeEnvironment, setSafeEnvironment] = useState<string[]>(existingPlan?.safe_environment || []);
  const [reasonsForLiving, setReasonsForLiving] = useState<string[]>(existingPlan?.reasons_for_living || []);
  const [crisisResources, setCrisisResources] = useState<SafetyPlan['crisis_resources']>(
    existingPlan?.crisis_resources || AUSTRALIAN_CRISIS_RESOURCES.slice(0, 5)
  );
  const [nextReviewDate, setNextReviewDate] = useState(existingPlan?.next_review_date?.split('T')[0] || '');

  useEffect(() => {
    if (existingPlan) {
      setClientId(existingPlan.client_id);
      setWarningSigns(existingPlan.warning_signs);
      setCopingStrategies(existingPlan.coping_strategies);
      setSocialContacts(existingPlan.social_contacts);
      setProfessionalContacts(existingPlan.professional_contacts);
      setSafeEnvironment(existingPlan.safe_environment);
      setReasonsForLiving(existingPlan.reasons_for_living);
      setCrisisResources(existingPlan.crisis_resources);
      setNextReviewDate(existingPlan.next_review_date?.split('T')[0] || '');
    }
  }, [existingPlan]);

  const handleSave = async () => {
    if (!clientId) {
      setError('Please select a client');
      return;
    }

    if (warningSigns.length === 0 || copingStrategies.length === 0) {
      setError('Please add at least one warning sign and coping strategy');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (existingPlan) {
        const result = await updateSafetyPlan(existingPlan.id, {
          warningSigns,
          copingStrategies,
          socialContacts,
          professionalContacts,
          safeEnvironment,
          reasonsForLiving,
          nextReviewDate: nextReviewDate || undefined,
        });
        if (!result.success) throw new Error(result.error);
        onClose();
        if (onSuccess) onSuccess(existingPlan.id);
      } else {
        const result = await createSafetyPlan({
          clientId,
          warningSigns,
          copingStrategies,
          socialContacts,
          professionalContacts,
          safeEnvironment,
          reasonsForLiving,
          crisisResources,
          nextReviewDate: nextReviewDate || undefined,
        });
        if (!result.success) throw new Error(result.error);
        onClose();
        if (onSuccess && result.planId) onSuccess(result.planId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save safety plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkReviewed = async () => {
    if (!existingPlan) return;
    setIsSubmitting(true);
    try {
      const result = await markReviewed(existingPlan.id, nextReviewDate || undefined);
      if (!result.success) throw new Error(result.error);
      onClose();
      if (onSuccess) onSuccess(existingPlan.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clientOptions = [
    { value: '', label: 'Select a client' },
    ...clients.map((c: Client) => ({
      value: c.id,
      label: `${c.first_name} ${c.last_name}`,
    })),
  ];

  const sections = [
    { title: 'Warning Signs' },
    { title: 'Coping Strategies' },
    { title: 'Support Network' },
    { title: 'Safety & Reasons' },
    { title: 'Crisis Resources' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingPlan ? 'Edit Safety Plan' : 'Create Safety Plan'}
      size="xl"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-coral-light/20 border border-coral rounded-lg text-coral-dark text-sm">
            {error}
          </div>
        )}

        {/* Client selection */}
        <Select
          label="Client *"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          options={clientOptions}
          disabled={!!existingPlan}
        />

        {/* Section tabs */}
        <div className="flex gap-2 border-b border-beige pb-2 overflow-x-auto">
          {sections.map((section, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSection(idx)}
              className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                activeSection === idx
                  ? 'bg-sage text-white'
                  : 'bg-cream text-text-secondary hover:bg-beige'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="min-h-[300px]">
          {activeSection === 0 && (
            <ListEditor
              label="What are the warning signs that a crisis may be developing?"
              items={warningSigns}
              onChange={setWarningSigns}
              placeholder="Add a warning sign..."
              suggestions={WARNING_SIGN_SUGGESTIONS}
            />
          )}

          {activeSection === 1 && (
            <ListEditor
              label="What coping strategies help when you notice warning signs?"
              items={copingStrategies}
              onChange={setCopingStrategies}
              placeholder="Add a coping strategy..."
              suggestions={COPING_SUGGESTIONS}
            />
          )}

          {activeSection === 2 && (
            <div className="space-y-6">
              <ContactEditor
                label="People I can contact for distraction or support"
                contacts={socialContacts}
                onChange={setSocialContacts}
                type="social"
              />
              <ContactEditor
                label="Professional contacts I can reach out to"
                contacts={professionalContacts}
                onChange={setProfessionalContacts}
                type="professional"
              />
            </div>
          )}

          {activeSection === 3 && (
            <div className="space-y-6">
              <ListEditor
                label="How can I make my environment safer?"
                items={safeEnvironment}
                onChange={setSafeEnvironment}
                placeholder="Add a safety measure..."
                suggestions={SAFE_ENVIRONMENT_SUGGESTIONS}
              />
              <ListEditor
                label="What are my reasons for living?"
                items={reasonsForLiving}
                onChange={setReasonsForLiving}
                placeholder="Add a reason..."
                suggestions={REASONS_SUGGESTIONS}
              />
            </div>
          )}

          {activeSection === 4 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-secondary">
                Crisis Resources (Australian)
              </label>
              <div className="space-y-2">
                {crisisResources.map((resource, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sage-dark">{resource.name}</div>
                        <div className="text-lg font-bold">{resource.phone}</div>
                        <div className="text-xs text-text-muted">{resource.available}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-text-muted">
                These are pre-configured Australian crisis resources. In an emergency, always call 000.
              </p>
            </div>
          )}
        </div>

        {/* Review date */}
        <Input
          label="Next Review Date"
          type="date"
          value={nextReviewDate}
          onChange={(e) => setNextReviewDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />

        {/* Last reviewed info */}
        {existingPlan && (
          <p className="text-sm text-text-muted">
            Last reviewed: {new Date(existingPlan.last_reviewed).toLocaleDateString()}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-beige">
          <div className="text-sm text-text-muted">
            Safety plans should be reviewed regularly with the client
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {existingPlan && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleMarkReviewed}
                isLoading={isSubmitting}
              >
                Mark Reviewed
              </Button>
            )}
            <Button type="button" onClick={handleSave} isLoading={isSubmitting}>
              {existingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
