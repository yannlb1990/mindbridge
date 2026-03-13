'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { useMoodHistory, MOOD_META } from '@/hooks/useMoodHistory';
import { cn } from '@/lib/utils';
import { TrendingUp, Flame, BarChart2, CalendarDays } from 'lucide-react';

function MoodBar({ value, dayLabel, isToday }: { value: number | null; dayLabel: string; isToday: boolean }) {
  const heightPct = value ? (value / 5) * 100 : 0;
  const barClass = value ? MOOD_META[value].bar : 'bg-beige';
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      <div className="w-full h-28 flex items-end">
        <div
          className={cn('w-full rounded-t-lg transition-all duration-500', barClass, !value && 'opacity-40')}
          style={{ height: value ? `${heightPct}%` : '6px' }}
        />
      </div>
      <span className={cn('text-xs font-medium', isToday ? 'text-text-primary font-bold' : 'text-text-muted')}>
        {isToday ? 'Today' : dayLabel}
      </span>
    </div>
  );
}

export default function ClientProgressPage() {
  const { ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const { entries, streak, last7Days, avgThisWeek, totalEntries } = useMoodHistory();
  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';

  const avgLabel = avgThisWeek
    ? MOOD_META[Math.round(avgThisWeek)]
    : null;

  const loggedDaysThisWeek = last7Days.filter((d) => d.entry).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className={cn('font-display font-bold text-text-primary', isChild ? 'text-2xl' : 'text-xl')}>
          {isChild ? 'My Progress' : isTeen ? 'Your progress' : 'Wellbeing overview'}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          {isChild
            ? 'Look how much you\'ve been tracking! Keep it up!'
            : 'Your mood trends and check-in history.'}
        </p>
      </div>

      {/* Streak + stats row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Streak */}
        <div className={cn('rounded-2xl p-4 flex flex-col items-center gap-1', theme.primaryBg)}>
          <Flame className={cn('w-5 h-5', theme.primaryText)} />
          <p className={cn('font-bold text-text-primary', isChild ? 'text-3xl' : 'text-2xl')}>{streak}</p>
          <p className="text-xs text-text-muted text-center">day streak</p>
        </div>

        {/* This week */}
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-1 shadow-soft">
          <CalendarDays className="w-5 h-5 text-text-muted" />
          <p className={cn('font-bold text-text-primary', isChild ? 'text-3xl' : 'text-2xl')}>{loggedDaysThisWeek}/7</p>
          <p className="text-xs text-text-muted text-center">{isChild ? 'this week' : 'days logged'}</p>
        </div>

        {/* Avg mood */}
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-1 shadow-soft">
          <BarChart2 className="w-5 h-5 text-text-muted" />
          {avgLabel ? (
            <>
              <span className={isChild ? 'text-2xl' : 'text-xl'}>{avgLabel.emoji}</span>
              <p className="text-xs text-text-muted text-center">{isChild ? 'avg feeling' : 'avg this week'}</p>
            </>
          ) : (
            <p className="text-xs text-text-muted text-center mt-2">No data yet</p>
          )}
        </div>
      </div>

      {/* 7-day mood chart */}
      <div className="bg-white rounded-2xl shadow-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
            This week
          </h2>
          <TrendingUp className="w-4 h-4 text-text-muted" />
        </div>

        {/* Bars */}
        <div className="flex items-end gap-1.5">
          {last7Days.map((day, i) => (
            <MoodBar
              key={day.dateStr}
              value={day.entry?.value ?? null}
              dayLabel={day.dayLabel}
              isToday={i === 6}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4">
          {[1, 2, 3, 4, 5].map((v) => (
            <div key={v} className="flex items-center gap-1">
              <div className={cn('w-3 h-3 rounded-sm', MOOD_META[v].bar)} />
              <span className="text-xs text-text-muted">
                {isChild ? MOOD_META[v].label : MOOD_META[v].adultLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to log today */}
      {!last7Days[6].entry && (
        <Link
          href="/client/mood"
          className={cn(
            'block text-center py-3 rounded-2xl font-semibold transition-all',
            isChild ? 'text-lg py-4' : 'text-base',
            theme.primaryButton
          )}
        >
          {isChild ? 'Log how you feel today!' : 'Log today\'s mood'}
        </Link>
      )}

      {/* Recent history */}
      {entries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
            {isChild ? 'My check-ins' : 'Recent entries'}
          </h2>
          <div className="space-y-2">
            {entries.slice(0, 7).map((entry) => {
              const meta = MOOD_META[entry.value];
              const d = new Date(entry.date);
              return (
                <div key={entry.id} className="bg-white rounded-xl shadow-soft p-4 flex items-start gap-3">
                  <span className={isChild ? 'text-3xl' : 'text-2xl'}>{meta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={cn('font-medium text-text-primary', isChild ? 'text-base' : 'text-sm')}>
                        {isChild ? meta.label : meta.adultLabel}
                      </p>
                      <p className="text-xs text-text-muted">
                        {d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{entry.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
