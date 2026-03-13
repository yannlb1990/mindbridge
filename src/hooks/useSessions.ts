'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface Session {
  id: string;
  clinician_id: string;
  client_id: string;
  client_name?: string;
  session_type: 'individual' | 'family' | 'group' | 'telehealth' | 'phone';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  scheduled_start: string;
  scheduled_end: string;
  duration_minutes: number;
  fee?: number;
  telehealth_link?: string;
  location?: string;
  notes_id?: string;
  created_at: string;
}

interface CreateSessionData {
  clientId: string;
  sessionType: Session['session_type'];
  scheduledStart: string;
  durationMinutes?: number;
  fee?: number;
  telehealthLink?: string;
  location?: string;
}

// Module-level store so all useSessions instances share the same demo sessions
let demoSessionsStore: Session[] = [];
let demoSessionsListeners: Array<(sessions: Session[]) => void> = [];
const notifyDemoListeners = (sessions: Session[]) => {
  demoSessionsStore = sessions;
  demoSessionsListeners.forEach((fn) => fn(sessions));
};

export function useSessions() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!user) return;

    if (isEffectiveDemo(user?.id)) {
      // Use shared module-level store if already populated
      if (demoSessionsStore.length > 0) {
        setSessions(demoSessionsStore);
        setIsLoading(false);
        return;
      }
      // Generate demo sessions
      const today = new Date();
      const demoSessions: Session[] = [
        {
          id: 'session-1',
          clinician_id: user.id,
          client_id: 'client-1',
          client_name: 'Emma Thompson',
          session_type: 'individual',
          status: 'scheduled',
          scheduled_start: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
          scheduled_end: new Date(today.setHours(9, 50, 0, 0)).toISOString(),
          duration_minutes: 50,
          fee: 220,
          location: '123 Collins St, Melbourne',
          created_at: new Date().toISOString(),
        },
        {
          id: 'session-2',
          clinician_id: user.id,
          client_id: 'client-2',
          client_name: 'Liam Nguyen',
          session_type: 'telehealth',
          status: 'scheduled',
          scheduled_start: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
          scheduled_end: new Date(today.setHours(10, 50, 0, 0)).toISOString(),
          duration_minutes: 50,
          fee: 220,
          telehealth_link: 'https://meet.mindbridge.com.au/session-123',
          created_at: new Date().toISOString(),
        },
        {
          id: 'session-3',
          clinician_id: user.id,
          client_id: 'client-3',
          client_name: 'Sophie Williams',
          session_type: 'individual',
          status: 'scheduled',
          scheduled_start: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
          scheduled_end: new Date(today.setHours(14, 50, 0, 0)).toISOString(),
          duration_minutes: 50,
          fee: 220,
          location: '123 Collins St, Melbourne',
          created_at: new Date().toISOString(),
        },
      ];
      notifyDemoListeners(demoSessions);
      setSessions(demoSessions);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          client:users!sessions_client_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('clinician_id', user.id)
        .order('scheduled_start', { ascending: true });

      if (error) throw error;

      const formattedSessions: Session[] = (data || []).map((s: any) => ({
        ...s,
        client_name: s.client ? `${s.client.first_name} ${s.client.last_name}` : 'Unknown',
      }));

      setSessions(formattedSessions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createSession = async (data: CreateSessionData): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const scheduledEnd = new Date(data.scheduledStart);
    scheduledEnd.setMinutes(scheduledEnd.getMinutes() + (data.durationMinutes || 50));

    if (isEffectiveDemo(user?.id)) {
      const newSession: Session = {
        id: `session-${Date.now()}`,
        clinician_id: user.id,
        client_id: data.clientId,
        session_type: data.sessionType,
        status: 'scheduled',
        scheduled_start: data.scheduledStart,
        scheduled_end: scheduledEnd.toISOString(),
        duration_minutes: data.durationMinutes || 50,
        fee: data.fee,
        telehealth_link: data.telehealthLink,
        location: data.location,
        created_at: new Date().toISOString(),
      };
      const updated = [...demoSessionsStore, newSession].sort((a, b) =>
        new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
      );
      notifyDemoListeners(updated);
      return { success: true };
    }

    try {
      const { error } = await supabase.from('sessions').insert({
        clinician_id: user.id,
        client_id: data.clientId,
        session_type: data.sessionType,
        scheduled_start: data.scheduledStart,
        scheduled_end: scheduledEnd.toISOString(),
        duration_minutes: data.durationMinutes || 50,
        fee: data.fee,
        telehealth_link: data.telehealthLink,
        location: data.location,
      });

      if (error) throw error;

      await fetchSessions();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateSessionStatus = async (sessionId: string, status: Session['status']): Promise<{ success: boolean; error?: string }> => {
    if (isEffectiveDemo(user?.id)) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status } : s))
      );
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const cancelSession = async (sessionId: string): Promise<{ success: boolean; error?: string }> => {
    return updateSessionStatus(sessionId, 'cancelled');
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Subscribe to demo session changes from other hook instances
  useEffect(() => {
    const listener = (updated: Session[]) => setSessions(updated);
    demoSessionsListeners.push(listener);
    return () => {
      demoSessionsListeners = demoSessionsListeners.filter((fn) => fn !== listener);
    };
  }, []);

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    createSession,
    updateSessionStatus,
    cancelSession,
  };
}
