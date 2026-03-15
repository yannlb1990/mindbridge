'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface EmotionSession {
  id: string;
  scenario: string;
  emotions: string[];
  clientNote?: string;
  aiValidation: string;
  aiNormalisation: string;
  aiStrategies: string[];
  aiEncouragement: string;
  severity: 'positive' | 'mixed' | 'negative' | 'concerning';
  created_at: string;
}

// 3 pre-seeded demo sessions
const DEMO_SESSIONS: EmotionSession[] = [
  {
    id: 'ec-demo-1',
    scenario: 'A friend didn\'t include you in their plans',
    emotions: ['Sad', 'Lonely'],
    aiValidation: 'Feeling sad and lonely when you\'re left out makes complete sense — those feelings show how much you value your friendships. It\'s okay to feel hurt by this.',
    aiNormalisation: 'Many teens go through moments like this, and it doesn\'t mean anything is wrong with you.',
    aiStrategies: [
      'Reach out to another friend or trusted adult to talk about how you feel',
      'Write in a journal to express your feelings safely',
      'Do something kind for yourself — watch your favourite show or go for a walk',
    ],
    aiEncouragement: 'Your feelings are valid, and this difficult moment will pass.',
    severity: 'negative',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ec-demo-2',
    scenario: 'You got great feedback on something you worked really hard on',
    emotions: ['Happy', 'Proud', 'Excited'],
    clientNote: 'This made my whole week!',
    aiValidation: 'Feeling happy, proud, and excited about this wonderful recognition is absolutely deserved — you worked hard and it paid off! Enjoy every bit of this moment.',
    aiNormalisation: 'Feeling great when your efforts are noticed is a natural and healthy response.',
    aiStrategies: [],
    aiEncouragement: 'Hold onto this feeling — it\'s a reminder of what you\'re capable of!',
    severity: 'positive',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ec-demo-3',
    scenario: 'You felt overwhelmed by all your responsibilities',
    emotions: ['Overwhelmed', 'Anxious'],
    aiValidation: 'Feeling overwhelmed and anxious when life piles up is completely understandable — your feelings are telling you that you\'ve been carrying a lot. It\'s okay to need support.',
    aiNormalisation: 'Almost everyone experiences overwhelm at some point; it doesn\'t mean you can\'t cope.',
    aiStrategies: [
      'Break one task into tiny steps and focus only on the very first one',
      'Take 5 slow, deep breaths to calm your nervous system',
      'Talk to someone you trust about what\'s on your plate',
    ],
    aiEncouragement: 'You\'ve handled hard things before, and you have the strength to get through this too.',
    severity: 'concerning',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const SEVERITY_TO_RATING: Record<EmotionSession['severity'], number> = {
  positive: 5,
  mixed: 3,
  negative: 2,
  concerning: 1,
};

export function useEmotionSessions() {
  const { clientProfile } = useAuthStore();
  const [sessions, setSessions] = useState<EmotionSession[]>(DEMO_SESSIONS);
  const [saving, setSaving] = useState(false);

  const saveSession = useCallback(async (session: Omit<EmotionSession, 'id' | 'created_at'>): Promise<EmotionSession> => {
    const newSession: EmotionSession = {
      ...session,
      id: `ec-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);

    if (clientProfile?.id && !clientProfile.id.startsWith('demo-')) {
      setSaving(true);
      try {
        const notesPayload = JSON.stringify({
          type: 'emotion_coach',
          scenario: session.scenario,
          aiValidation: session.aiValidation,
          aiNormalisation: session.aiNormalisation,
          aiStrategies: session.aiStrategies,
          aiEncouragement: session.aiEncouragement,
          severity: session.severity,
          clientNote: session.clientNote,
        });

        await supabase.from('mood_entries').insert({
          client_id: clientProfile.id,
          rating: SEVERITY_TO_RATING[session.severity],
          emotions: session.emotions,
          notes: notesPayload,
          shared_with_clinician: true,
        });
      } catch (err) {
        console.error('Failed to save emotion coach session:', err);
      } finally {
        setSaving(false);
      }
    }

    return newSession;
  }, [clientProfile]);

  return { sessions, saveSession, saving };
}
