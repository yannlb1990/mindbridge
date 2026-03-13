'use client';

export type ResourceType = 'exercise' | 'article' | 'audio' | 'worksheet' | 'video';

export interface Resource {
  id: string;
  title: string;
  childTitle: string;
  description: string;
  childDescription: string;
  type: ResourceType;
  category: string;
  duration: string;
  emoji: string;
  pinned?: boolean; // clinician-pinned (shown first)
}

const RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: '4-7-8 Breathing',
    childTitle: 'Magic Breathing',
    description: 'Inhale 4 counts, hold 7, exhale 8. Calms your nervous system in minutes.',
    childDescription: 'A special way to breathe that helps you feel calm when you\'re worried.',
    type: 'exercise',
    category: 'Breathing',
    duration: '5 min',
    emoji: '💨',
    pinned: true,
  },
  {
    id: 'r2',
    title: '5-4-3-2-1 Grounding',
    childTitle: 'The Counting Game',
    description: 'Use your 5 senses to anchor yourself in the present when feeling overwhelmed.',
    childDescription: 'A fun counting game that helps you feel safe and calm right now.',
    type: 'exercise',
    category: 'Grounding',
    duration: '3 min',
    emoji: '⭐',
    pinned: true,
  },
  {
    id: 'r3',
    title: 'Understanding Anxiety',
    childTitle: 'Why does my tummy feel funny?',
    description: 'Learn why anxiety happens and how your body is trying to protect you.',
    childDescription: 'Find out why sometimes your body feels scared or worried — and that\'s okay!',
    type: 'article',
    category: 'Understanding',
    duration: '4 min read',
    emoji: '🧠',
    pinned: true,
  },
  {
    id: 'r4',
    title: 'Body Scan Meditation',
    childTitle: 'Cosy Body Check',
    description: 'A guided relaxation journey through your body to release tension.',
    childDescription: 'Close your eyes and imagine a warm light relaxing every part of your body.',
    type: 'audio',
    category: 'Mindfulness',
    duration: '10 min',
    emoji: '🧘',
  },
  {
    id: 'r5',
    title: 'Thought Record Worksheet',
    childTitle: 'Worry Buster Sheet',
    description: 'Identify unhelpful thoughts and challenge them with balanced alternatives.',
    childDescription: 'Write down your worries and find kinder ways to think about them.',
    type: 'worksheet',
    category: 'CBT',
    duration: '15 min',
    emoji: '📝',
  },
  {
    id: 'r6',
    title: 'Better Sleep Tips',
    childTitle: 'Sleep Superpower',
    description: 'Evidence-based habits to fall asleep faster and wake up more rested.',
    childDescription: 'Fun tips to help you get a great night\'s sleep and have good dreams.',
    type: 'article',
    category: 'Sleep',
    duration: '5 min read',
    emoji: '🌙',
  },
  {
    id: 'r7',
    title: 'Progressive Muscle Relaxation',
    childTitle: 'Squeeze & Let Go',
    description: 'Systematically tense and release muscle groups to reduce physical tension.',
    childDescription: 'Squeeze your muscles tight then let go — it feels SO good!',
    type: 'audio',
    category: 'Relaxation',
    duration: '12 min',
    emoji: '💪',
  },
  {
    id: 'r8',
    title: 'Mood & Activity Tracker',
    childTitle: 'Feelings Diary',
    description: 'Track how different activities influence your mood throughout the week.',
    childDescription: 'Draw how you feel after different activities to spot what makes you happy!',
    type: 'worksheet',
    category: 'Tracking',
    duration: '10 min',
    emoji: '📊',
  },
  {
    id: 'r9',
    title: 'Self-Compassion Break',
    childTitle: 'Be Your Own Best Friend',
    description: 'A short practice to respond to difficult moments with kindness toward yourself.',
    childDescription: 'Learn to be as nice to yourself as you are to your best friend.',
    type: 'exercise',
    category: 'Self-Compassion',
    duration: '5 min',
    emoji: '💛',
  },
  {
    id: 'r10',
    title: 'Worry Time Technique',
    childTitle: 'Worry Box',
    description: 'Schedule a short daily "worry time" to contain anxiety and protect your day.',
    childDescription: 'Put your worries in a special box and only open it at worry time.',
    type: 'article',
    category: 'Anxiety',
    duration: '3 min read',
    emoji: '📦',
  },
];

export function useResources() {
  const categories = Array.from(new Set(RESOURCES.map((r) => r.category)));
  const pinned = RESOURCES.filter((r) => r.pinned);

  return { resources: RESOURCES, pinned, categories };
}
