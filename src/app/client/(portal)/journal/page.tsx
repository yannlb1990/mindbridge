'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { useJournal } from '@/hooks/useJournal';
import { MOOD_META } from '@/hooks/useMoodHistory';
import { cn } from '@/lib/utils';
import { PenLine, ChevronDown, ChevronUp, Trash2, Sparkles } from 'lucide-react';

const CHILD_PROMPTS = [
  'What happened today?',
  'What made you happy?',
  'Was there anything hard today?',
  'What are you looking forward to?',
];

const TEEN_PROMPTS = [
  "What's on your mind?",
  'Something that happened today...',
  'How are you really feeling?',
  'One thing you\'re grateful for...',
];

const ADULT_PROMPTS = [
  "What challenged you today?",
  "What went well today?",
  "How did you cope with difficult moments?",
  "Something you noticed about yourself...",
];

const MOODS = [1, 2, 3, 4, 5];

function RelativeDate({ iso }: { iso: string }) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return <span>Today</span>;
  if (diffDays === 1) return <span>Yesterday</span>;
  if (diffDays < 7) return <span>{diffDays} days ago</span>;
  return <span>{d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>;
}

export default function ClientJournalPage() {
  const { ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const { entries, addEntry, deleteEntry } = useJournal();

  const [writing, setWriting] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [promptIndex] = useState(() => Math.floor(Math.random() * 4));

  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';

  const prompts = isChild ? CHILD_PROMPTS : isTeen ? TEEN_PROMPTS : ADULT_PROMPTS;
  const placeholder = prompts[promptIndex];

  const handleSave = () => {
    if (!content.trim()) return;
    addEntry(content, title || undefined, selectedMood ?? undefined);
    setContent('');
    setTitle('');
    setSelectedMood(null);
    setWriting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('font-display font-bold text-text-primary', isChild ? 'text-2xl' : 'text-xl')}>
            {isChild ? 'My Diary' : isTeen ? 'Journal' : 'Reflections'}
          </h1>
          <p className="text-text-secondary mt-0.5 text-sm">
            {isChild
              ? 'Your private space to share your thoughts'
              : isTeen
              ? 'Your private space — only you (and your therapist with permission) can see this.'
              : 'A private space for your thoughts and reflections.'}
          </p>
        </div>
        {!writing && (
          <button
            onClick={() => setWriting(true)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all',
              isChild ? 'text-base py-3' : '',
              theme.primaryButton
            )}
          >
            <PenLine className="w-4 h-4" />
            {isChild ? 'Write!' : 'New entry'}
          </button>
        )}
      </div>

      {/* Writing form */}
      {writing && (
        <div className={cn('rounded-2xl p-5 border-2', theme.primaryBorder, 'bg-white shadow-medium')}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className={cn('w-5 h-5', theme.primaryText)} />
            <p className={cn('font-medium', isChild ? 'text-base' : 'text-sm', theme.primaryText)}>
              {isChild ? 'Write in your diary' : "Today's entry"}
            </p>
          </div>

          {/* Title — teen/adult only */}
          {!isChild && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full border border-beige rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none mb-3"
            />
          )}

          {/* Prompt suggestion */}
          <p className={cn('text-text-muted mb-2', isChild ? 'text-base' : 'text-sm')}>
            {placeholder}
          </p>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={isChild ? 4 : 5}
            placeholder={isChild ? 'Write anything here...' : 'Write your thoughts...'}
            autoFocus
            className={cn(
              'w-full border border-beige rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none resize-none',
              isChild ? 'text-base' : 'text-sm'
            )}
          />

          {/* Mood tag */}
          <div className="mt-3">
            <p className={cn('text-text-muted mb-2', isChild ? 'text-base' : 'text-xs')}>
              {isChild ? 'How are you feeling? (optional)' : 'How were you feeling? (optional)'}
            </p>
            <div className="flex gap-2">
              {MOODS.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedMood(selectedMood === v ? null : v)}
                  className={cn(
                    'flex-1 py-1.5 rounded-xl transition-all',
                    isChild ? 'text-2xl' : 'text-xl',
                    selectedMood === v
                      ? cn(theme.primaryBg, 'scale-110 shadow-sm')
                      : 'hover:bg-sand'
                  )}
                >
                  {MOOD_META[v].emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={!content.trim()}
              className={cn(
                'flex-1 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-40',
                isChild ? 'text-base py-3' : 'text-sm',
                theme.primaryButton
              )}
            >
              {isChild ? 'Save my diary!' : 'Save entry'}
            </button>
            <button
              onClick={() => { setWriting(false); setContent(''); setTitle(''); setSelectedMood(null); }}
              className="px-4 py-2.5 rounded-xl text-sm text-text-muted hover:bg-sand transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Entry list */}
      {entries.length === 0 ? (
        <div className={cn('rounded-2xl p-8 text-center', theme.primaryBg)}>
          <PenLine className={cn('mx-auto mb-3 text-text-muted', isChild ? 'w-10 h-10' : 'w-8 h-8')} />
          <p className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
            {isChild ? 'Your diary is empty!' : 'No entries yet'}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {isChild ? 'Write your first entry above!' : 'Start writing to track your thoughts over time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-text-muted uppercase tracking-wide font-semibold">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="w-full flex items-start gap-3 p-4 text-left"
                >
                  {entry.mood && (
                    <span className={isChild ? 'text-2xl flex-shrink-0' : 'text-xl flex-shrink-0'}>
                      {MOOD_META[entry.mood].emoji}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    {entry.title && (
                      <p className={cn('font-semibold text-text-primary', isChild ? 'text-base' : 'text-sm')}>
                        {entry.title}
                      </p>
                    )}
                    <p className={cn('text-text-secondary truncate', isChild ? 'text-sm' : 'text-xs', entry.title && 'mt-0.5')}>
                      {entry.content}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      <RelativeDate iso={entry.created_at} />
                    </p>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" />
                    : <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" />
                  }
                </button>

                {isExpanded && (
                  <div className={cn('px-4 pb-4 border-t border-beige pt-3', theme.accentBg)}>
                    <p className={cn('text-text-primary whitespace-pre-wrap', isChild ? 'text-base' : 'text-sm')}>
                      {entry.content}
                    </p>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="flex items-center gap-1 text-xs text-text-muted hover:text-error transition-colors px-2 py-1 rounded-lg hover:bg-sand"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
