'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { useSessions } from '@/hooks/useSessions';
import { useHomework } from '@/hooks/useHomework';
import { formatDate } from '@/lib/utils';
import { Calendar, BookOpen, Shield, Smile, ChevronRight, Star, TrendingUp, PenLine, Flame, Gamepad2 } from 'lucide-react';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { cn } from '@/lib/utils';

// Mood emojis for quick check-in on dashboard
const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄'];

export default function ClientDashboardPage() {
  const { clientProfile, ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const { sessions } = useSessions();
  const { homework } = useHomework();
  const { streak } = useMoodHistory();
  const [quickMood, setQuickMood] = useState<number | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);

  const name = clientProfile?.preferred_name || clientProfile?.first_name || 'there';
  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';

  const upcomingSessions = sessions
    .filter((s) => s.status === 'scheduled' && new Date(s.scheduled_start) >= new Date())
    .slice(0, 1);

  const pendingHomework = homework.filter((hw) => hw.status !== 'completed').slice(0, isChild ? 2 : 3);
  const completedCount = homework.filter((hw) => hw.status === 'completed').length;

  const handleQuickMood = (index: number) => {
    setQuickMood(index);
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Greeting header */}
      <div className={cn('rounded-2xl p-6', theme.primaryBg)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            {isChild ? (
              <>
                <h1 className="text-2xl font-display font-bold text-text-primary">{theme.greeting(name)}</h1>
                <p className="text-text-secondary mt-1 text-lg">How are you feeling today?</p>
              </>
            ) : isTeen ? (
              <>
                <h1 className="text-xl font-display font-bold text-text-primary">{theme.greeting(name)}</h1>
                <p className="text-text-secondary mt-1">Check in and see what&apos;s coming up.</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-display font-bold text-text-primary">{theme.greeting(name)}</h1>
                <p className="text-text-secondary mt-1">Here&apos;s your wellbeing overview.</p>
              </>
            )}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full flex-shrink-0">
              <Flame className={cn('w-4 h-4', theme.primaryText)} />
              <span className={cn('text-sm font-bold', theme.primaryText)}>{streak}</span>
              <span className="text-xs text-text-muted">day streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick mood check-in */}
      <div className="bg-white rounded-2xl shadow-soft p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
            {isChild ? 'How do you feel right now?' : isTeen ? "Today's vibe?" : "Today's mood"}
          </h2>
          <Link href="/client/mood" className={cn('text-sm flex items-center gap-1', theme.primaryText)}>
            {isChild ? 'More →' : 'Full check-in'} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex justify-between items-center">
          {MOOD_EMOJIS.map((emoji, i) => (
            <button
              key={i}
              onClick={() => handleQuickMood(i)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
                isChild ? 'text-4xl' : 'text-2xl',
                quickMood === i
                  ? cn(theme.primaryBg, 'scale-110 shadow-sm')
                  : 'hover:bg-sand'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>

        {moodSaved && (
          <p className={cn('text-sm mt-3 text-center font-medium', theme.primaryText)}>
            {isChild ? 'Saved! Good job!' : 'Mood logged'}
          </p>
        )}
      </div>

      {/* Games card — child/teen highlight */}
      {(isChild || isTeen) && (
        <Link
          href="/client/games"
          className={cn(
            'rounded-2xl p-5 flex items-center gap-4 border-2 transition-all hover:shadow-medium',
            isChild ? 'bg-gradient-to-r from-coral/20 via-gold/20 to-calm/20 border-coral/30' : 'bg-calm/10 border-calm/30'
          )}
        >
          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0', isChild ? 'bg-coral/30' : 'bg-calm/20')}>
            <Gamepad2 className={cn('w-7 h-7', isChild ? 'text-coral-dark' : 'text-calm-dark')} />
          </div>
          <div className="flex-1">
            <p className={cn('font-bold text-text-primary', isChild ? 'text-xl' : 'text-base')}>
              {isChild ? 'Games & Tools!' : 'Coping tools'}
            </p>
            <p className="text-sm text-text-secondary mt-0.5">
              {isChild
                ? 'Breathing, feelings, worry jar and more'
                : 'Breathing exercises, grounding tools and more'}
            </p>
          </div>
          <ChevronRight className={cn('flex-shrink-0', isChild ? 'w-6 h-6' : 'w-5 h-5', 'text-text-muted')} />
        </Link>
      )}

      {/* Quick-access row: Journal + Progress */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/client/journal"
          className={cn('rounded-2xl p-4 flex flex-col gap-2 transition-all hover:shadow-medium', theme.accentBg)}
        >
          <PenLine className={cn(theme.primaryText, isChild ? 'w-7 h-7' : 'w-5 h-5')} />
          <p className={cn('font-semibold text-text-primary', isChild ? 'text-base' : 'text-sm')}>
            {isChild ? 'My Diary' : isTeen ? 'Journal' : 'Reflections'}
          </p>
          <p className="text-xs text-text-secondary">
            {isChild ? 'Write how you feel' : 'Write a new entry'}
          </p>
        </Link>
        <Link
          href="/client/progress"
          className={cn('rounded-2xl p-4 flex flex-col gap-2 transition-all hover:shadow-medium', theme.accentBg)}
        >
          <TrendingUp className={cn(theme.primaryText, isChild ? 'w-7 h-7' : 'w-5 h-5')} />
          <p className={cn('font-semibold text-text-primary', isChild ? 'text-base' : 'text-sm')}>
            {isChild ? 'My Progress' : isTeen ? 'Progress' : 'Mood trends'}
          </p>
          <p className="text-xs text-text-secondary">
            {isChild ? 'See your stars!' : 'View your history'}
          </p>
        </Link>
      </div>

      {/* Next session */}
      <div className="bg-white rounded-2xl shadow-soft p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className={cn(theme.primaryText, isChild ? 'w-6 h-6' : 'w-5 h-5')} />
          <h2 className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
            {isChild ? 'Your next visit' : isTeen ? 'Next session' : 'Upcoming session'}
          </h2>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className={cn('rounded-xl p-4', theme.accentBg)}>
            <p className="font-medium text-text-primary">
              {isChild
                ? `You're seeing ${clientProfile?.clinician_name} on:`
                : clientProfile?.clinician_name}
            </p>
            <p className={cn('mt-1', isChild ? 'text-xl font-bold' : 'text-lg font-semibold', theme.primaryText)}>
              {formatDate(upcomingSessions[0].scheduled_start, 'long')}
            </p>
            <p className="text-sm text-text-secondary mt-0.5">
              {upcomingSessions[0].session_type === 'telehealth' ? 'Video call' : 'In person'}
            </p>
          </div>
        ) : (
          <p className="text-text-muted text-sm">
            {isChild ? 'No visit scheduled yet. Ask a grown-up!' : 'No upcoming sessions scheduled.'}
          </p>
        )}

        <Link
          href="/client/sessions"
          className={cn('mt-3 text-sm flex items-center gap-1', theme.primaryText)}
        >
          {isChild ? 'See all visits →' : 'View all sessions'} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Homework */}
      <div className="bg-white rounded-2xl shadow-soft p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className={cn(theme.primaryText, isChild ? 'w-6 h-6' : 'w-5 h-5')} />
            <h2 className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
              {isChild ? 'Your tasks' : isTeen ? 'Homework' : 'Assignments'}
            </h2>
          </div>
          {completedCount > 0 && (
            <span className={cn('text-xs px-2 py-1 rounded-full font-medium', theme.primaryBg, theme.primaryText)}>
              {isChild ? `${completedCount} done!` : `${completedCount} completed`}
            </span>
          )}
        </div>

        {pendingHomework.length > 0 ? (
          <div className="space-y-2">
            {pendingHomework.map((hw) => (
              <div
                key={hw.id}
                className={cn('flex items-center gap-3 p-3 rounded-xl', theme.accentBg)}
              >
                {isChild ? (
                  <Star className="w-5 h-5 text-gold flex-shrink-0" />
                ) : (
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0',
                    hw.status === 'in_progress' ? 'bg-calm' : 'bg-text-muted'
                  )} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium text-text-primary truncate', isChild ? 'text-base' : 'text-sm')}>
                    {hw.title}
                  </p>
                  {hw.due_date && (
                    <p className="text-xs text-text-muted">Due {formatDate(hw.due_date)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">
            {isChild ? 'All done! Great job!' : 'No pending assignments.'}
          </p>
        )}

        <Link
          href="/client/homework"
          className={cn('mt-3 text-sm flex items-center gap-1', theme.primaryText)}
        >
          {isChild ? 'See all tasks →' : 'View all homework'} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Safety plan quick access */}
      <div className={cn('rounded-2xl p-5 border-2', theme.primaryBorder, theme.primaryBg)}>
        <div className="flex items-center gap-3">
          <Shield className={cn(theme.primaryText, isChild ? 'w-8 h-8' : 'w-6 h-6')} />
          <div className="flex-1">
            <p className={cn('font-semibold', isChild ? 'text-lg' : 'text-base', 'text-text-primary')}>
              {isChild ? 'Feeling really sad or scared?' : isTeen ? 'Need support?' : 'Safety resources'}
            </p>
            <p className="text-sm text-text-secondary mt-0.5">
              {isChild ? 'Your helpers are here for you' : 'Your safety plan and crisis contacts'}
            </p>
          </div>
          <Link
            href="/client/safety"
            className={cn(
              'px-4 py-2 rounded-xl font-medium text-sm transition-all',
              theme.primaryButton
            )}
          >
            {isChild ? 'Get help →' : 'View'}
          </Link>
        </div>
      </div>

    </div>
  );
}
