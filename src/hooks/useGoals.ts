'use client';

import { useState, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface TreatmentGoal {
  id: string;
  client_id: string;
  clinician_id: string;
  title: string;
  description: string;
  category: 'symptom_reduction' | 'behavioral' | 'cognitive' | 'interpersonal' | 'functional' | 'other';
  status: 'active' | 'achieved' | 'paused' | 'discontinued';
  priority: 'high' | 'medium' | 'low';
  target_date?: string;
  progress: number;
  milestones: GoalMilestone[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalData {
  clientId: string;
  title: string;
  description: string;
  category: TreatmentGoal['category'];
  priority: TreatmentGoal['priority'];
  targetDate?: string;
  milestones?: string[];
}

export function useGoals(clientId: string) {
  const { user } = useAuthStore();
  const [goals, setGoals] = useState<TreatmentGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user || !clientId) return;
    setIsLoading(true);
    setError(null);

    if (isEffectiveDemo(user.id)) {
      setIsLoading(false);
      return; // demo goals managed by client detail page local state
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('treatment_goals')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setGoals(
        (data || []).map((g: any) => ({
          ...g,
          milestones: Array.isArray(g.milestones) ? g.milestones : [],
        }))
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, clientId]);

  const createGoal = useCallback(async (data: CreateGoalData): Promise<boolean> => {
    if (!user) return false;
    if (isEffectiveDemo(user.id)) return true; // handled locally

    const milestones: GoalMilestone[] = (data.milestones || []).map((title, idx) => ({
      id: `ms-${Date.now()}-${idx}`,
      title,
      completed: false,
    }));

    const { error } = await supabase.from('treatment_goals').insert({
      client_id: data.clientId,
      clinician_id: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      target_date: data.targetDate || null,
      progress: 0,
      milestones,
      status: 'active',
    });

    if (error) { console.error('createGoal error:', error.message); return false; }
    await fetchGoals();
    return true;
  }, [user, fetchGoals]);

  const updateGoalProgress = useCallback(async (goalId: string, progress: number): Promise<boolean> => {
    if (!user) return false;
    if (isEffectiveDemo(user.id)) return true;

    const newStatus: TreatmentGoal['status'] = progress >= 100 ? 'achieved' : 'active';
    const { error } = await supabase
      .from('treatment_goals')
      .update({ progress, status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', goalId);

    if (error) return false;
    setGoals((prev) =>
      prev.map((g) => g.id === goalId ? { ...g, progress, status: newStatus } : g)
    );
    return true;
  }, [user]);

  const toggleMilestone = useCallback(async (goalId: string, milestoneId: string): Promise<boolean> => {
    if (!user) return false;
    if (isEffectiveDemo(user.id)) return true;

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return false;

    const milestones = goal.milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
        : m
    );

    const completed = milestones.filter((m) => m.completed).length;
    const progress = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;

    const { error } = await supabase
      .from('treatment_goals')
      .update({ milestones, progress, updated_at: new Date().toISOString() })
      .eq('id', goalId);

    if (error) return false;
    setGoals((prev) =>
      prev.map((g) => g.id === goalId ? { ...g, milestones, progress } : g)
    );
    return true;
  }, [user, goals]);

  const deleteGoal = useCallback(async (goalId: string): Promise<boolean> => {
    if (!user) return false;
    if (isEffectiveDemo(user.id)) return true;

    const { error } = await supabase.from('treatment_goals').delete().eq('id', goalId);
    if (error) return false;
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    return true;
  }, [user]);

  return { goals, setGoals, isLoading, error, fetchGoals, createGoal, updateGoalProgress, toggleMilestone, deleteGoal };
}
