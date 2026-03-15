'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface MoodEntry {
  id: string;
  date: string; // ISO string
  value: number; // 1–5
  note?: string;
}

export const MOOD_META: Record<number, { emoji: string; label: string; adultLabel: string; color: string; bar: string }> = {
  1: { emoji: '😢', label: 'Really sad',  adultLabel: 'Very low', color: 'text-blue-500',   bar: 'bg-blue-300' },
  2: { emoji: '😕', label: 'A bit sad',   adultLabel: 'Low',      color: 'text-indigo-400', bar: 'bg-indigo-300' },
  3: { emoji: '😐', label: 'Okay',        adultLabel: 'Neutral',  color: 'text-text-muted', bar: 'bg-beige' },
  4: { emoji: '🙂', label: 'Good',        adultLabel: 'Good',     color: 'text-sage',       bar: 'bg-sage-300' },
  5: { emoji: '😄', label: 'Amazing!',    adultLabel: 'Very good', color: 'text-gold-dark', bar: 'bg-gold' },
};

// Realistic 14-day mood pattern
const PATTERN = [3, 4, 3, 2, 3, 4, 5, 4, 3, 4, 4, 3, 5, 4];
const SKIP_DAYS = new Set([2, 9]); // simulate ~85% logging rate

function buildDemoEntries(): MoodEntry[] {
  const entries: MoodEntry[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    if (SKIP_DAYS.has(i)) continue;
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(9, 0, 0, 0);
    entries.push({
      id: `mood-demo-${i}`,
      date: d.toISOString(),
      value: PATTERN[13 - i] ?? 3,
      note: i === 0 ? 'Feeling okay today, had a good chat with a friend.' : undefined,
    });
  }
  return entries;
}

export function useMoodHistory() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<MoodEntry[]>(() =>
    isEffectiveDemo(user?.id) ? buildDemoEntries() : []
  );
  const [isLoading, setIsLoading] = useState(!isEffectiveDemo(user?.id));

  const fetchEntries = useCallback(async () => {
    if (isEffectiveDemo(user?.id)) {
      setEntries(buildDemoEntries());
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
        .from('mood_entries')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      setEntries(
        (data || []).map((row: any) => ({
          id: row.id,
          date: row.created_at,
          value: row.rating,
          note: row.notes ?? undefined,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch mood entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (value: number, note?: string) => {
    const entry: MoodEntry = {
      id: `mood-${Date.now()}`,
      date: new Date().toISOString(),
      value,
      note,
    };

    setEntries((prev) => [entry, ...prev]);

    if (isEffectiveDemo(user?.id) || !user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          client_id: user.id,
          rating: value,
          notes: note ?? null,
          shared_with_clinician: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace the optimistic entry with the persisted one
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? { id: data.id, date: data.created_at, value: data.rating, note: data.notes ?? undefined }
            : e
        )
      );
    } catch (err) {
      console.error('Failed to save mood entry:', err);
    }
  };

  // Consecutive-day streak (today or yesterday counts as start)
  const streak = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const check = new Date(today);
      check.setDate(check.getDate() - i);
      const str = check.toISOString().split('T')[0];
      if (entries.some((e) => e.date.startsWith(str))) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  })();

  // Last 7 days for chart
  const last7Days = (() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const str = d.toISOString().split('T')[0];
      return {
        date: d,
        dateStr: str,
        dayLabel: d.toLocaleDateString('en-AU', { weekday: 'short' }),
        entry: entries.find((e) => e.date.startsWith(str)) ?? null,
      };
    });
  })();

  const avgThisWeek = (() => {
    const logged = last7Days.filter((d) => d.entry);
    if (logged.length === 0) return null;
    return logged.reduce((s, d) => s + (d.entry!.value), 0) / logged.length;
  })();

  const totalEntries = entries.length;

  return { entries, addEntry, streak, last7Days, avgThisWeek, totalEntries, isLoading };
}
