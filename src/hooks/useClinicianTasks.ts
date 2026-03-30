'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface ClinicianTask {
  id: string;
  clinician_id?: string;
  description: string;
  client_name?: string;
  client_id?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  due_label?: string;
  completed: boolean;
  created_at?: string;
}

const DEMO_TASKS: ClinicianTask[] = [
  {
    id: 'ctask-1',
    description: 'Complete referral for dietitian - Emma Thompson',
    client_name: 'Emma Thompson',
    client_id: 'client-1',
    priority: 'high',
    category: 'Referral',
    due_label: 'Today',
    completed: false,
  },
  {
    id: 'ctask-2',
    description: 'Send resources to parents about supporting meal times',
    client_name: 'Emma Thompson',
    client_id: 'client-1',
    priority: 'high',
    category: 'Family Support',
    completed: false,
  },
  {
    id: 'ctask-3',
    description: 'Follow up with school counselor about lunch support program',
    client_name: 'Emma Thompson',
    client_id: 'client-1',
    priority: 'medium',
    category: 'Coordination',
    completed: false,
  },
  {
    id: 'ctask-4',
    description: 'Review PHQ-9 assessment results - Sophie Williams',
    client_name: 'Sophie Williams',
    client_id: 'client-3',
    priority: 'high',
    category: 'Assessment',
    due_label: 'Today',
    completed: false,
  },
  {
    id: 'ctask-5',
    description: 'Prepare coping plan for school trip',
    client_name: 'Emma Thompson',
    client_id: 'client-1',
    priority: 'medium',
    category: 'Treatment Planning',
    due_label: 'This week',
    completed: false,
  },
  {
    id: 'ctask-6',
    description: 'Schedule family session for next week - Liam Nguyen',
    client_name: 'Liam Nguyen',
    client_id: 'client-2',
    priority: 'medium',
    category: 'Scheduling',
    completed: true,
  },
];

export function useClinicianTasks() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<ClinicianTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    if (isEffectiveDemo(user.id)) {
      setTasks(DEMO_TASKS);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clinician_tasks')
        .select('*')
        .eq('clinician_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: ClinicianTask[] = (data || []).map((row: any) => ({
        id: row.id,
        clinician_id: row.clinician_id,
        description: row.description,
        client_name: row.client_name ?? undefined,
        client_id: row.client_id ?? undefined,
        priority: row.priority as 'high' | 'medium' | 'low',
        category: row.category ?? 'General',
        due_label: row.due_label ?? undefined,
        completed: row.completed ?? false,
        created_at: row.created_at,
      }));

      setTasks(mapped);
    } catch (err) {
      console.error('Error fetching clinician tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addTask = async (text: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (!user) return;

    const newTask: ClinicianTask = {
      id: `ctask-${Date.now()}`,
      description: text.trim(),
      priority,
      category: 'General',
      completed: false,
    };

    if (isEffectiveDemo(user.id)) {
      setTasks((prev) => [newTask, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clinician_tasks')
        .insert({
          clinician_id: user.id,
          description: text.trim(),
          priority,
          category: 'General',
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) => [
        {
          id: data.id,
          clinician_id: data.clinician_id,
          description: data.description,
          priority: data.priority,
          category: data.category ?? 'General',
          due_label: data.due_label ?? undefined,
          completed: data.completed,
          created_at: data.created_at,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('Error adding task:', err);
      // Optimistic fallback
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const toggleTask = async (id: string) => {
    if (!user) return;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    if (isEffectiveDemo(user.id)) return;

    try {
      const { error } = await supabase
        .from('clinician_tasks')
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .eq('clinician_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error toggling task:', err);
      // Revert
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t))
      );
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (isEffectiveDemo(user.id)) return;

    try {
      const { error } = await supabase
        .from('clinician_tasks')
        .delete()
        .eq('id', id)
        .eq('clinician_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting task:', err);
      // Refresh to restore
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
  };
}
