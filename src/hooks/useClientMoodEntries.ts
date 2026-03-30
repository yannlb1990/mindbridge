'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface ClientMoodEntry {
  id: string;
  client_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  emotions: string[];
  notes: string | null;
  created_at: string;
}

export function useClientMoodEntries(clientId: string) {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<ClientMoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!clientId || !user || isEffectiveDemo(user.id)) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('id, client_id, rating, emotions, notes, created_at')
        .eq('client_id', clientId)
        .eq('shared_with_clinician', true)
        .order('created_at', { ascending: false })
        .limit(60);

      if (error) throw error;

      setEntries(
        (data || []).map((row: any) => ({
          id: row.id,
          client_id: row.client_id,
          rating: row.rating as 1 | 2 | 3 | 4 | 5,
          emotions: row.emotions ?? [],
          notes: row.notes ?? null,
          created_at: row.created_at,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch client mood entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, isLoading, fetchEntries };
}
