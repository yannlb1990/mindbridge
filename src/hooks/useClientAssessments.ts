'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface ClientAssessment {
  id: string;
  client_id: string;
  assessment_type: 'PHQ-9' | 'GAD-7' | 'EDE-Q' | 'DASS-21' | 'K10' | 'CORE-10';
  score: number;
  severity: string;
  notes: string | null;
  created_at: string;
}

export function useClientAssessments(clientId: string) {
  const { user } = useAuthStore();
  const [assessments, setAssessments] = useState<ClientAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssessments = useCallback(async () => {
    if (!clientId || !user || isEffectiveDemo(user.id)) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('id, client_id, assessment_type, score, severity, notes, created_at')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssessments(
        (data || []).map((row: any) => ({
          id: row.id,
          client_id: row.client_id,
          assessment_type: row.assessment_type,
          score: row.score,
          severity: row.severity,
          notes: row.notes ?? null,
          created_at: row.created_at,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch client assessments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, user]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  return { assessments, isLoading, fetchAssessments };
}
