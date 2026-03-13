'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const MOOD_OPTIONS = [
  { emoji: '😢', label: 'Really sad', adultLabel: 'Very low', value: 1, color: 'bg-blue-100 border-blue-300' },
  { emoji: '😕', label: 'A bit sad', adultLabel: 'Low', value: 2, color: 'bg-indigo-100 border-indigo-300' },
  { emoji: '😐', label: 'Okay', adultLabel: 'Neutral', value: 3, color: 'bg-sand border-beige' },
  { emoji: '🙂', label: 'Good', adultLabel: 'Good', value: 4, color: 'bg-sage-50 border-sage' },
  { emoji: '😄', label: 'Amazing!', adultLabel: 'Very good', value: 5, color: 'bg-gold/20 border-gold' },
];

export default function ClientMoodPage() {
  const { ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';
  const isAdult = ageGroup === 'adult';

  const handleSubmit = () => {
    if (selectedMood === null) return;
    setSubmitted(true);
  };

  if (submitted) {
    const chosen = MOOD_OPTIONS.find((m) => m.value === selectedMood);
    return (
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col items-center text-center gap-6">
        <CheckCircle2 className={cn('w-20 h-20', theme.primaryText)} />
        <div>
          <p className={cn('text-5xl mb-3', isChild && 'text-7xl')}>{chosen?.emoji}</p>
          <h2 className={cn('font-display font-bold text-text-primary', isChild ? 'text-2xl' : 'text-xl')}>
            {isChild ? 'Thanks for sharing!' : 'Mood logged!'}
          </h2>
          <p className="text-text-secondary mt-2">
            {isChild
              ? 'Your therapist will see how you&apos;re feeling.'
              : 'Your clinician will be able to see this during your next session.'}
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setSelectedMood(null); setNote(''); }}
          className={cn('px-6 py-3 rounded-xl font-medium', theme.primaryButton)}
        >
          {isChild ? 'Do it again' : 'Log another'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('font-display font-bold text-text-primary', isChild ? 'text-2xl' : 'text-xl')}>
          {isChild ? 'How are you feeling?' : isTeen ? "What's your vibe today?" : 'Mood Check-in'}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          {isChild
            ? 'Tap on the face that shows how you feel!'
            : isTeen
            ? 'How are you feeling right now? Be honest with yourself.'
            : 'Record how you are feeling today. This helps track your wellbeing over time.'}
        </p>
      </div>

      {/* Mood selector — child: big tap targets */}
      {isChild ? (
        <div className="grid grid-cols-5 gap-3">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all',
                selectedMood === mood.value
                  ? cn(mood.color, 'scale-105 shadow-medium border-2')
                  : 'border-transparent hover:bg-sand'
              )}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-xs font-medium text-text-secondary text-center leading-tight">
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        /* Teen / adult: horizontal scale with labels */
        <div className="space-y-3">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                selectedMood === mood.value
                  ? cn(mood.color, 'shadow-sm')
                  : 'border-beige bg-white hover:bg-sand'
              )}
            >
              <span className={isAdult ? 'text-2xl' : 'text-3xl'}>{mood.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-text-primary">
                  {isAdult ? mood.adultLabel : mood.label}
                </p>
                {isAdult && (
                  <p className="text-xs text-text-muted">Score: {mood.value}/5</p>
                )}
              </div>
              {selectedMood === mood.value && (
                <CheckCircle2 className={cn('w-5 h-5', theme.primaryText)} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Optional note */}
      {selectedMood !== null && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {isChild
              ? 'Want to tell us more? (optional)'
              : isTeen
              ? "Anything on your mind? (optional)"
              : 'Additional notes (optional)'}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={isChild ? 2 : 3}
            placeholder={isChild ? 'Write anything here...' : isTeen ? "What's going on?" : 'Describe how you are feeling...'}
            className={cn(
              'w-full border border-beige rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none resize-none',
              isChild ? 'text-base' : ''
            )}
          />
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={selectedMood === null}
        className={cn(
          'w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed',
          isChild ? 'text-lg py-4' : '',
          theme.primaryButton
        )}
      >
        {isChild ? 'Save my feeling!' : 'Save mood'}
      </button>
    </div>
  );
}
