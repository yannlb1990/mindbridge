'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface HomeworkAssignment {
  id: string;
  clinician_id: string;
  client_id: string;
  client_name?: string;
  title: string;
  description?: string;
  category: 'worksheet' | 'exercise' | 'reading' | 'practice' | 'journal' | 'other';
  due_date?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  client_response?: string;
  clinician_feedback?: string;
  created_at: string;
  updated_at: string;
}

interface CreateHomeworkData {
  clientId: string;
  title: string;
  description?: string;
  category: HomeworkAssignment['category'];
  dueDate?: string;
}

// Demo homework
const DEMO_HOMEWORK: HomeworkAssignment[] = [
  {
    id: 'hw-1',
    clinician_id: 'demo-user',
    client_id: 'client-1',
    client_name: 'Emma Thompson',
    title: 'Complete Thought Record',
    description: 'Fill out the thought record worksheet for any eating-related anxiety this week',
    category: 'worksheet',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'assigned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hw-2',
    clinician_id: 'demo-user',
    client_id: 'client-2',
    client_name: 'Liam Nguyen',
    title: 'Practice 5-4-3-2-1 Grounding',
    description: 'Use the grounding exercise at least once daily when feeling anxious',
    category: 'exercise',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    client_response: 'I tried it twice this week, it helped a bit with school stress',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hw-3',
    clinician_id: 'demo-user',
    client_id: 'client-3',
    client_name: 'Sophie Williams',
    title: 'Daily Mood and Urge Tracking',
    description: 'Record mood and urge levels 3 times daily using the app',
    category: 'journal',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    client_response: 'Completed all entries. Noticed urges strongest after dinner.',
    clinician_feedback: 'Great observation! We will work on post-meal coping strategies.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useHomework() {
  const { user } = useAuthStore();
  const [homework, setHomework] = useState<HomeworkAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomework = useCallback(async () => {
    if (!user) return;

    if (isEffectiveDemo(user?.id)) {
      setHomework(DEMO_HOMEWORK);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('homework_assignments')
        .select(`
          *,
          client:users!homework_assignments_client_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('clinician_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHomework: HomeworkAssignment[] = (data || []).map((hw: any) => ({
        ...hw,
        client_name: hw.client ? `${hw.client.first_name} ${hw.client.last_name}` : 'Unknown',
      }));

      setHomework(formattedHomework);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createHomework = async (data: CreateHomeworkData): Promise<{ success: boolean; error?: string; homeworkId?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    if (isEffectiveDemo(user?.id)) {
      const newHomework: HomeworkAssignment = {
        id: `hw-${Date.now()}`,
        clinician_id: user.id,
        client_id: data.clientId,
        title: data.title,
        description: data.description,
        category: data.category,
        due_date: data.dueDate,
        status: 'assigned',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setHomework((prev) => [newHomework, ...prev]);
      return { success: true, homeworkId: newHomework.id };
    }

    try {
      const { data: hwData, error } = await supabase
        .from('homework_assignments')
        .insert({
          clinician_id: user.id,
          client_id: data.clientId,
          title: data.title,
          description: data.description,
          category: data.category,
          due_date: data.dueDate,
          status: 'assigned',
        })
        .select()
        .single();

      if (error) throw error;

      await fetchHomework();
      return { success: true, homeworkId: hwData.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateHomeworkStatus = async (
    homeworkId: string,
    status: HomeworkAssignment['status'],
    feedback?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isEffectiveDemo(user?.id)) {
      setHomework((prev) =>
        prev.map((hw) =>
          hw.id === homeworkId
            ? { ...hw, status, clinician_feedback: feedback, updated_at: new Date().toISOString() }
            : hw
        )
      );
      return { success: true };
    }

    try {
      const updates: any = { status };
      if (feedback) updates.clinician_feedback = feedback;

      const { error } = await supabase
        .from('homework_assignments')
        .update(updates)
        .eq('id', homeworkId);

      if (error) throw error;

      await fetchHomework();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addFeedback = async (
    homeworkId: string,
    feedback: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isEffectiveDemo(user?.id)) {
      setHomework((prev) =>
        prev.map((hw) =>
          hw.id === homeworkId
            ? { ...hw, clinician_feedback: feedback, updated_at: new Date().toISOString() }
            : hw
        )
      );
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('homework_assignments')
        .update({ clinician_feedback: feedback })
        .eq('id', homeworkId);

      if (error) throw error;

      await fetchHomework();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  return {
    homework,
    isLoading,
    error,
    fetchHomework,
    createHomework,
    updateHomeworkStatus,
    addFeedback,
  };
}
