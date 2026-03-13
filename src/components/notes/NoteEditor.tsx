'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useNotes, ClinicalNote, NOTE_TEMPLATES } from '@/hooks/useNotes';
import { useClients, Client } from '@/hooks/useClients';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (noteId: string) => void;
  existingNote?: ClinicalNote;
  preselectedClientId?: string;
  preselectedSessionId?: string;
  preselectedTranscript?: string;
}

type NoteFormat = 'soap' | 'dap' | 'birp' | 'narrative' | 'brief' | 'structured';

const FORMAT_LABELS: Record<NoteFormat, string> = {
  soap: 'SOAP Note',
  dap: 'DAP Note',
  birp: 'BIRP Note',
  narrative: 'Narrative Note',
  brief: 'Brief Note',
  structured: 'Structured Note',
};

const FORMAT_DESCRIPTIONS: Record<NoteFormat, string> = {
  soap: 'Subjective, Objective, Assessment, Plan - Standard medical format',
  dap: 'Data, Assessment, Plan - Streamlined clinical format',
  birp: 'Behavior, Intervention, Response, Plan - Behavioral focus',
  narrative: 'Free-form detailed session narrative',
  brief: 'Quick summary with next steps',
  structured: 'Template-defined section format',
};

const FIELD_LABELS: Record<string, string> = {
  subjective: 'Subjective',
  objective: 'Objective',
  assessment: 'Assessment',
  plan: 'Plan',
  data: 'Data',
  behavior: 'Behavior',
  intervention: 'Intervention',
  response: 'Response',
  content: 'Session Content',
  summary: 'Summary',
  nextSteps: 'Next Steps',
};

const FIELD_HINTS: Record<string, string> = {
  subjective: "Client's reported symptoms, concerns, and experiences",
  objective: 'Observable behaviors, affect, and clinical observations',
  assessment: 'Clinical interpretation, progress, and diagnostic impressions',
  plan: 'Treatment recommendations, homework, and next session goals',
  data: 'Session content, client statements, and observations',
  behavior: 'Specific behaviors observed or reported',
  intervention: 'Therapeutic interventions used during session',
  response: "Client's response to interventions",
  content: 'Detailed narrative of the session',
  summary: 'Brief overview of the session',
  nextSteps: 'Actions for client and clinician before next session',
};

export function NoteEditor({
  isOpen,
  onClose,
  onSuccess,
  existingNote,
  preselectedClientId,
  preselectedSessionId,
  preselectedTranscript,
}: NoteEditorProps) {
  const { createNote, updateNote, signNote } = useNotes();
  const { clients } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState(preselectedClientId || existingNote?.client_id || '');
  const [noteFormat, setNoteFormat] = useState<NoteFormat>(existingNote?.note_format || 'soap');
  const [content, setContent] = useState<Record<string, string>>(
    existingNote?.content || NOTE_TEMPLATES.soap
  );
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>(
    existingNote?.risk_level || 'low'
  );

  useEffect(() => {
    if (existingNote) {
      setClientId(existingNote.client_id);
      setNoteFormat(existingNote.note_format);
      setContent(existingNote.content);
      setRiskLevel(existingNote.risk_level || 'low');
    } else {
      setContent(NOTE_TEMPLATES[noteFormat]);
    }
  }, [existingNote, noteFormat]);

  const handleFormatChange = (format: NoteFormat) => {
    setNoteFormat(format);
    if (!existingNote) {
      setContent(NOTE_TEMPLATES[format]);
    }
  };

  const handleContentChange = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = async (andSign: boolean = false) => {
    if (!clientId) {
      setError('Please select a client');
      return;
    }

    const hasContent = Object.values(content).some((v) => v.trim().length > 0);
    if (!hasContent) {
      setError('Please add some content to the note');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (existingNote) {
        const result = await updateNote(existingNote.id, content);
        if (!result.success) throw new Error(result.error);

        if (andSign) {
          const signResult = await signNote(existingNote.id);
          if (!signResult.success) throw new Error(signResult.error);
        }

        onClose();
        if (onSuccess) onSuccess(existingNote.id);
      } else {
        const result = await createNote({
          clientId,
          sessionId: preselectedSessionId,
          noteFormat,
          content,
          transcript: preselectedTranscript,
          aiGenerated: !!preselectedTranscript,
          riskLevel,
        });

        if (!result.success) throw new Error(result.error);

        if (andSign && result.noteId) {
          const signResult = await signNote(result.noteId);
          if (!signResult.success) throw new Error(signResult.error);
        }

        onClose();
        if (onSuccess && result.noteId) onSuccess(result.noteId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSign = async () => {
    if (!existingNote) return;

    setIsSigning(true);
    try {
      const result = await signNote(existingNote.id);
      if (!result.success) throw new Error(result.error);
      onClose();
      if (onSuccess) onSuccess(existingNote.id);
    } catch (err: any) {
      setError(err.message || 'Failed to sign note');
    } finally {
      setIsSigning(false);
    }
  };

  const clientOptions = [
    { value: '', label: 'Select a client' },
    ...clients.map((c: Client) => ({
      value: c.id,
      label: `${c.first_name} ${c.last_name}`,
    })),
  ];

  const formatOptions = Object.entries(FORMAT_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const riskOptions = [
    { value: 'low', label: 'Low Risk' },
    { value: 'moderate', label: 'Moderate Risk' },
    { value: 'high', label: 'High Risk' },
    { value: 'critical', label: 'Critical Risk' },
  ];

  const contentFields = Object.keys(content);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingNote ? 'Edit Clinical Note' : 'New Clinical Note'}
      size="xl"
    >
      <div className="space-y-5">
        {error && (
          <div className="p-3 bg-coral-light/20 border border-coral rounded-lg text-coral-dark text-sm">
            {error}
          </div>
        )}

        {/* Existing note status */}
        {existingNote && (
          <div className="flex items-center gap-3">
            <Badge variant={existingNote.is_signed ? 'success' : 'warning'}>
              {existingNote.is_signed ? 'Signed' : 'Draft'}
            </Badge>
            {existingNote.ai_generated && (
              <Badge variant="info">AI Generated</Badge>
            )}
            {existingNote.is_signed && (
              <span className="text-sm text-text-muted">
                Signed: {new Date(existingNote.signed_at!).toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Header selections */}
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Client *"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            options={clientOptions}
            disabled={!!existingNote}
          />
          <Select
            label="Note Format"
            value={noteFormat}
            onChange={(e) => handleFormatChange(e.target.value as NoteFormat)}
            options={formatOptions}
            disabled={!!existingNote}
          />
          <Select
            label="Risk Level"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value as any)}
            options={riskOptions}
          />
        </div>

        {/* Format description */}
        <p className="text-sm text-text-muted">{FORMAT_DESCRIPTIONS[noteFormat]}</p>

        {/* Transcript preview if available */}
        {preselectedTranscript && (
          <Card className="bg-calm-light/30">
            <div className="p-3">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Session Transcript</h4>
              <p className="text-sm text-text-muted max-h-24 overflow-y-auto">
                {preselectedTranscript.substring(0, 500)}
                {preselectedTranscript.length > 500 && '...'}
              </p>
            </div>
          </Card>
        )}

        {/* Note content fields */}
        <div className="space-y-4">
          {contentFields.map((field) => (
            <Textarea
              key={field}
              label={FIELD_LABELS[field] || field}
              value={content[field] || ''}
              onChange={(e) => handleContentChange(field, e.target.value)}
              placeholder={FIELD_HINTS[field] || `Enter ${field}...`}
              rows={field === 'content' ? 8 : 4}
              disabled={existingNote?.is_signed}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-beige">
          <div className="text-sm text-text-muted">
            {existingNote?.is_signed
              ? 'This note is signed and locked'
              : 'Save as draft or sign to finalize'}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {!existingNote?.is_signed && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSave(false)}
                  isLoading={isSubmitting}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSave(true)}
                  isLoading={isSubmitting || isSigning}
                >
                  Save & Sign
                </Button>
              </>
            )}
            {existingNote && !existingNote.is_signed && (
              <Button
                type="button"
                onClick={handleSign}
                isLoading={isSigning}
              >
                Sign Note
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
