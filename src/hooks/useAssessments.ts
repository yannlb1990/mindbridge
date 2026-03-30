'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isEffectiveDemo } from '@/lib/supabase';

export interface AssessmentResult {
  id: string;
  client_id: string;
  client_name: string;
  assessment_type: string;
  status: 'pending' | 'completed';
  score: number | null;
  severity: string | null;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

export function useAssessments() {
  const { user } = useAuthStore();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssessments = useCallback(async () => {
    if (!user || isEffectiveDemo(user.id)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/assessments?clinicianId=${user.id}`);
      if (!res.ok) throw new Error(await res.text());
      const { assessments: data } = await res.json();

      setAssessments(
        (data || []).map((row: any) => ({
          id: row.id,
          client_id: row.client_id,
          client_name: row.users
            ? `${row.users.first_name} ${row.users.last_name}`
            : 'Unknown',
          assessment_type: row.assessment_type,
          status: row.status,
          score: row.score ?? null,
          severity: row.severity ?? null,
          notes: row.notes ?? null,
          created_at: row.created_at,
          completed_at: row.completed_at ?? null,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const sendAssessment = useCallback(
    async (clientId: string, assessmentType: string): Promise<boolean> => {
      if (!user || isEffectiveDemo(user.id)) return false;
      try {
        const res = await fetch('/api/assessments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId,
            clinicianId: user.id,
            assessmentType,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        await fetchAssessments();
        return true;
      } catch (err) {
        console.error('Failed to send assessment:', err);
        return false;
      }
    },
    [user, fetchAssessments]
  );

  return { assessments, isLoading, fetchAssessments, sendAssessment };
}
