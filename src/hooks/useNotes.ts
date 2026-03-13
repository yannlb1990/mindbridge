'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isDemoMode } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface ClinicalNote {
  id: string;
  session_id?: string;
  clinician_id: string;
  client_id: string;
  client_name?: string;
  note_format: 'soap' | 'dap' | 'birp' | 'narrative' | 'brief' | 'structured';
  content: Record<string, any>;
  transcript?: string;
  ai_generated: boolean;
  is_signed: boolean;
  signed_at?: string;
  risk_level?: 'low' | 'moderate' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface CreateNoteData {
  sessionId?: string;
  clientId: string;
  noteFormat: ClinicalNote['note_format'];
  content: Record<string, any>;
  transcript?: string;
  aiGenerated?: boolean;
  riskLevel?: ClinicalNote['risk_level'];
}

// Note templates
export const NOTE_TEMPLATES = {
  soap: {
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  },
  dap: {
    data: '',
    assessment: '',
    plan: '',
  },
  birp: {
    behavior: '',
    intervention: '',
    response: '',
    plan: '',
  },
  narrative: {
    content: '',
  },
  brief: {
    summary: '',
    nextSteps: '',
  },
  structured: {
    content: '',
  },
};

export function useNotes() {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!user) return;

    if (isDemoMode) {
      const demoNotes: ClinicalNote[] = [
        {
          id: 'note-1',
          clinician_id: user.id,
          client_id: 'client-1',
          client_name: 'Emma Thompson',
          note_format: 'soap',
          content: {
            subjective: 'Client reports improved mood. Following meal plan with 80% compliance.',
            objective: 'Affect appropriate. Good engagement. Weight stable.',
            assessment: 'Anorexia Nervosa - showing improvement with FBT approach.',
            plan: 'Continue current meal plan. Review in 1 week. Family session next Thursday.',
          },
          ai_generated: false,
          is_signed: true,
          signed_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'note-2',
          clinician_id: user.id,
          client_id: 'client-2',
          client_name: 'Liam Nguyen',
          note_format: 'dap',
          content: {
            data: 'Client practiced breathing exercises daily. Reports anxiety reduced at school.',
            assessment: 'GAD symptoms improving. Using coping strategies effectively.',
            plan: 'Introduce gradual exposure to social situations. Parent session next week.',
          },
          ai_generated: true,
          is_signed: true,
          signed_at: new Date(Date.now() - 172800000).toISOString(),
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 'note-3',
          clinician_id: user.id,
          client_id: 'client-3',
          client_name: 'Sophie Williams',
          note_format: 'soap',
          content: {
            subjective: 'Client reports increased urges this week. Stress from exams.',
            objective: 'Tearful at start. Engaged in safety planning.',
            assessment: 'Bulimia Nervosa - elevated risk due to exam stress.',
            plan: 'Updated safety plan. Daily check-ins via app. Crisis resources reviewed.',
          },
          ai_generated: true,
          is_signed: false,
          risk_level: 'high',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setNotes(demoNotes);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
          *,
          client:users!clinical_notes_client_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('clinician_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotes: ClinicalNote[] = (data || []).map((n: any) => ({
        ...n,
        client_name: n.client ? `${n.client.first_name} ${n.client.last_name}` : 'Unknown',
      }));

      setNotes(formattedNotes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createNote = async (data: CreateNoteData): Promise<{ success: boolean; error?: string; noteId?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    if (isDemoMode) {
      const newNote: ClinicalNote = {
        id: `note-${Date.now()}`,
        session_id: data.sessionId,
        clinician_id: user.id,
        client_id: data.clientId,
        note_format: data.noteFormat,
        content: data.content,
        transcript: data.transcript,
        ai_generated: data.aiGenerated || false,
        is_signed: false,
        risk_level: data.riskLevel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      return { success: true, noteId: newNote.id };
    }

    try {
      const { data: noteData, error } = await supabase
        .from('clinical_notes')
        .insert({
          session_id: data.sessionId,
          clinician_id: user.id,
          client_id: data.clientId,
          note_format: data.noteFormat,
          content: data.content,
          transcript: data.transcript,
          ai_generated: data.aiGenerated || false,
          risk_level: data.riskLevel,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchNotes();
      return { success: true, noteId: noteData.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateNote = async (noteId: string, content: Record<string, any>): Promise<{ success: boolean; error?: string }> => {
    if (isDemoMode) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? { ...n, content, updated_at: new Date().toISOString() }
            : n
        )
      );
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('clinical_notes')
        .update({ content })
        .eq('id', noteId);

      if (error) throw error;

      await fetchNotes();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const signNote = async (noteId: string): Promise<{ success: boolean; error?: string }> => {
    const signedAt = new Date().toISOString();

    if (isDemoMode) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? { ...n, is_signed: true, signed_at: signedAt }
            : n
        )
      );
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('clinical_notes')
        .update({ is_signed: true, signed_at: signedAt })
        .eq('id', noteId);

      if (error) throw error;

      await fetchNotes();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    signNote,
    NOTE_TEMPLATES,
  };
}
