'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { useHomework } from '@/hooks/useHomework';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Star, CheckCircle2, Clock, BookOpen, Loader2 } from 'lucide-react';

const CATEGORY_COLOR: Record<string, string> = {
  worksheet: 'bg-calm/20 text-calm-dark',
  exercise: 'bg-coral/20 text-coral-dark',
  reading: 'bg-sage/20 text-sage-dark',
  practice: 'bg-gold/20 text-gold-dark',
  journal: 'bg-violet-100 text-violet-700',
  other: 'bg-sand text-text-secondary',
};

const CATEGORY_CHILD_LABEL: Record<string, string> = {
  worksheet: 'Fill in',
  exercise: 'Move!',
  reading: 'Read',
  practice: 'Practice',
  journal: 'Write',
  other: 'Task',
};

export default function ClientHomeworkPage() {
  const { ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const { homework, isLoading, updateHomeworkStatus } = useHomework();
  const [completing, setCompleting] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [responseFor, setResponseFor] = useState<string | null>(null);

  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';

  const pending = homework.filter((hw) => hw.status !== 'completed');
  const completed = homework.filter((hw) => hw.status === 'completed');

  const handleComplete = async (id: string) => {
    setCompleting(id);
    await updateHomeworkStatus(id, 'completed');
    setCompleting(null);
    setResponseFor(null);
    setResponse('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('font-display font-bold text-text-primary', isChild ? 'text-2xl' : 'text-xl')}>
          {isChild ? 'My Tasks' : isTeen ? 'Homework' : 'Assignments'}
        </h1>
        {isChild ? (
          <p className="text-text-secondary mt-1">
            Complete your tasks to earn stars!
          </p>
        ) : (
          <p className="text-text-secondary mt-1 text-sm">
            {pending.length} pending · {completed.length} completed
          </p>
        )}
      </div>

      {/* Progress bar for child */}
      {isChild && homework.length > 0 && (
        <div className={cn('rounded-2xl p-4', theme.primaryBg)}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Your progress</span>
            <span className={cn('font-bold', theme.primaryText)}>
              {completed.length}/{homework.length}
            </span>
          </div>
          <div className="h-4 bg-white/60 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', theme.primaryButton.split(' ')[0])}
              style={{ width: `${(completed.length / homework.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div className="space-y-3">
          {!isChild && (
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">To do</h2>
          )}
          {pending.map((hw) => (
            <div
              key={hw.id}
              className={cn('bg-white rounded-2xl shadow-soft overflow-hidden', isChild ? 'p-5' : 'p-4')}
            >
              <div className="flex items-start gap-3">
                {isChild ? (
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-xs', CATEGORY_COLOR[hw.category] || CATEGORY_COLOR.other)}>
                    {CATEGORY_CHILD_LABEL[hw.category]?.slice(0, 2) || 'Do'}
                  </div>
                ) : (
                  <BookOpen className="w-5 h-5 text-text-muted flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
                    {hw.title}
                  </p>
                  {isChild && (
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block', theme.primaryBg, theme.primaryText)}>
                      {CATEGORY_CHILD_LABEL[hw.category] || 'Task'}
                    </span>
                  )}
                  {hw.description && (
                    <p className={cn('text-text-secondary mt-1', isChild ? 'text-base' : 'text-sm')}>
                      {hw.description}
                    </p>
                  )}
                  {hw.due_date && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
                      <Clock className="w-3 h-3" />
                      <span>Due {formatDate(hw.due_date)}</span>
                    </div>
                  )}
                  {hw.clinician_feedback && (
                    <div className={cn('mt-2 text-sm p-2 rounded-lg', theme.accentBg)}>
                      <span className="font-medium">Feedback: </span>{hw.clinician_feedback}
                    </div>
                  )}
                </div>
              </div>

              {/* Response + complete section */}
              {responseFor === hw.id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={isChild ? 2 : 3}
                    placeholder={isChild ? 'Tell us what you did...' : 'How did this go? (optional)'}
                    className="w-full border border-beige rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleComplete(hw.id)}
                      disabled={completing === hw.id}
                      className={cn('flex-1 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50', theme.primaryButton)}
                    >
                      {completing === hw.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : isChild ? 'Done!' : 'Mark complete'}
                    </button>
                    <button
                      onClick={() => setResponseFor(null)}
                      className="px-4 py-2 rounded-xl text-sm text-text-muted hover:bg-sand"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setResponseFor(hw.id)}
                  className={cn(
                    'mt-3 w-full py-2.5 rounded-xl font-semibold text-sm transition-all',
                    isChild ? 'text-base py-3' : '',
                    theme.primaryButton
                  )}
                >
                  {isChild ? 'I did this!' : isTeen ? 'Mark as done' : 'Complete'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className={cn('rounded-2xl p-6 text-center', theme.primaryBg)}>
          <CheckCircle2 className={cn('mx-auto mb-2 text-sage', isChild ? 'w-12 h-12' : 'w-8 h-8')} />
          <p className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
            {isChild ? 'All done! You are amazing!' : 'All caught up!'}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {isChild ? 'Your therapist will give you new tasks soon.' : 'No pending assignments right now.'}
          </p>
        </div>
      )}

      {/* Completed tasks */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
            Completed
          </h2>
          {completed.map((hw) => (
            <div key={hw.id} className="bg-white/60 rounded-xl p-4 flex items-center gap-3 opacity-75">
              <CheckCircle2 className={cn('w-5 h-5 flex-shrink-0', theme.primaryText)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-secondary line-through truncate">{hw.title}</p>
              </div>
              {isChild && <Star className="w-5 h-5 text-gold flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
