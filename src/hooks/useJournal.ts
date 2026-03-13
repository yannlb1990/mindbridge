'use client';

import { useState } from 'react';

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
      'Didn\'t sleep well last night. Kept overthinking things. Made a list of worries like Dr. Mitchell suggested — helped a bit to get them out of my head.',
    mood: 3,
  },
];

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(DEMO_ENTRIES);

  const addEntry = (content: string, title?: string, mood?: number): JournalEntry => {
    const entry: JournalEntry = {
      id: `j-${Date.now()}`,
      created_at: new Date().toISOString(),
      title: title?.trim() || undefined,
      content,
      mood,
    };
    setEntries((prev) => [entry, ...prev]);
    return entry;
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return { entries, addEntry, deleteEntry };
}
