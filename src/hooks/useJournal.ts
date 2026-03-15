'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface JournalEntry {
  id: string;
  created_at: string;
  title?: string;
  content: string;
  mood?: number; // 1–5 optional
}

const ago = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

const DEMO_ENTRIES: JournalEntry[] = [
  {
    id: 'j1',
    created_at: ago(1),
    title: 'Had a good day',
    content:
      'School was okay today. I talked to my friend about how I was feeling and it helped a lot. Tried the breathing exercise before my exam and it actually worked!',
    mood: 4,
  },
  {
    id: 'j2',
    created_at: ago(4),
    title: 'Feeling a bit anxious',
    content:
      'Hard time focusing in class. Tried the 5-4-3-2-1 grounding technique Dr. Mitchell showed me. It helped a little. Going to try again tomorrow.',
    mood: 2,
  },
  {
    id: 'j3',
    created_at: ago(7),
    title: 'Weekend thoughts',
    content:
      'Spent time with my family over the weekend. Felt more relaxed than usual. Cooked dinner with mum which was really nice.',
    mood: 4,
  },
  {
    id: 'j4',
    created_at: ago(11),
    content:
      "Didn't sleep well last night. Kept overthinking things. Made a list of worries like Dr. Mitchell suggested — helped a bit to get them out of my head.",
    mood: 3,
  },
];

export function useJournal() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    if (isEffectiveDemo(user?.id)) {
      setEntries(DEMO_ENTRIES);
      setIsLoading(false);
      return;
    }

    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntries(
        (data || []).map((row: any) => ({
          id: row.id,
          created_at: row.created_at,
          title: row.title ?? undefined,
          content: row.content,
          mood: row.mood ?? undefined,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch journal entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (content: string, title?: string, mood?: number): Promise<JournalEntry> => {
    const entry: JournalEntry = {
      id: `j-${Date.now()}`,
      created_at: new Date().toISOString(),
      title: title?.trim() || undefined,
      content,
      mood,
    };

    if (isEffectiveDemo(user?.id)) {
      setEntries((prev) => [entry, ...prev]);
      return entry;
    }

    if (!user) return entry;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          client_id: user.id,
          title: title?.trim() || null,
          content,
          mood: mood ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      const saved: JournalEntry = {
        id: data.id,
        created_at: data.created_at,
        title: data.title ?? undefined,
        content: data.content,
        mood: data.mood ?? undefined,
      };
      setEntries((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.error('Failed to save journal entry:', err);
      setEntries((prev) => [entry, ...prev]);
      return entry;
    }
  };

  const deleteEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));

    if (isEffectiveDemo(user?.id) || !user) return;

    try {
      await supabase.from('journal_entries').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to delete journal entry:', err);
    }
  };

  return { entries, addEntry, deleteEntry, isLoading };
}
