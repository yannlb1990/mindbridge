'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { useResources, type ResourceType, type Resource } from '@/hooks/useResources';
import { cn } from '@/lib/utils';
import { BookMarked, Clock, X, CheckCircle } from 'lucide-react';

const TYPE_LABELS: Record<ResourceType, { label: string; color: string }> = {
  exercise:  { label: 'Exercise',  color: 'bg-sage/20 text-sage-dark' },
  article:   { label: 'Article',   color: 'bg-calm/20 text-calm-dark' },
  audio:     { label: 'Audio',     color: 'bg-coral/20 text-coral-dark' },
  worksheet: { label: 'Worksheet', color: 'bg-gold/20 text-gold-dark' },
  video:     { label: 'Video',     color: 'bg-indigo-100 text-indigo-700' },
};

export default function ClientResourcesPage() {
  const { ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const { resources, pinned, categories } = useResources();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openResource, setOpenResource] = useState<Resource | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';

  const handleComplete = (id: string) => {
    setCompleted(prev => new Set(prev).add(id));
    setTimeout(() => setOpenResource(null), 1200);
  };

  const filtered = activeCategory
    ? resources.filter((r) => r.category === activeCategory)
    : resources;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className={cn('font-display font-bold text-text-primary', isChild ? 'text-2xl' : 'text-xl')}>
          {isChild ? 'Fun Activities' : isTeen ? 'Your toolkit' : 'Resources'}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          {isChild
            ? 'Cool activities and ideas to help you feel better!'
            : isTeen
            ? 'Exercises, articles and tools to support your wellbeing.'
            : 'Evidence-based tools and exercises shared by your clinician.'}
        </p>
      </div>

      {/* Pinned / recommended */}
      {!activeCategory && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookMarked className={cn('w-4 h-4', theme.primaryText)} />
            <h2 className={cn('font-semibold text-text-primary', isChild ? 'text-base' : 'text-sm')}>
              {isChild ? 'Start here' : 'Recommended by your clinician'}
            </h2>
          </div>
          <div className="space-y-2">
            {pinned.map((r) => (
              <div
                key={r.id}
                className={cn(
                  'rounded-2xl p-4 border-2 flex items-start gap-4',
                  theme.primaryBorder,
                  theme.primaryBg
                )}
              >
                <span className={isChild ? 'text-4xl flex-shrink-0' : 'text-3xl flex-shrink-0'}>{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-sm')}>
                      {isChild ? r.childTitle : r.title}
                    </p>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0', TYPE_LABELS[r.type].color)}>
                      {TYPE_LABELS[r.type].label}
                    </span>
                  </div>
                  <p className={cn('text-text-secondary mt-1', isChild ? 'text-base' : 'text-xs')}>
                    {isChild ? r.childDescription : r.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-text-muted" />
                      <span className="text-xs text-text-muted">{r.duration}</span>
                    </div>
                    <button
                      onClick={() => setOpenResource(r)}
                      className={cn(
                        'text-xs px-3 py-1 rounded-lg font-semibold transition-all',
                        theme.primaryButton
                      )}
                    >
                      {isChild ? "Let's go!" : 'Open'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category filter chips */}
      <div>
        <h2 className={cn('font-semibold text-text-primary mb-3', isChild ? 'text-base' : 'text-sm')}>
          {isChild ? 'All activities' : 'All resources'}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
              !activeCategory ? cn(theme.primaryButton) : 'bg-sand text-text-secondary hover:bg-beige'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                activeCategory === cat
                  ? cn(theme.primaryButton)
                  : 'bg-sand text-text-secondary hover:bg-beige'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow-soft p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={isChild ? 'text-3xl' : 'text-2xl'}>{r.emoji}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', TYPE_LABELS[r.type].color)}>
                  {TYPE_LABELS[r.type].label}
                </span>
              </div>
              <p className={cn('font-semibold text-text-primary', isChild ? 'text-base' : 'text-sm')}>
                {isChild ? r.childTitle : r.title}
              </p>
              <p className={cn('text-text-secondary flex-1', isChild ? 'text-sm' : 'text-xs')}>
                {isChild ? r.childDescription : r.description}
              </p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-text-muted" />
                  <span className="text-xs text-text-muted">{r.duration}</span>
                </div>
                <button
                  onClick={() => setOpenResource(r)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1',
                    completed.has(r.id) ? 'bg-sage/20 text-sage-dark' : theme.primaryButton
                  )}
                >
                  {completed.has(r.id) ? (
                    <><CheckCircle className="w-3 h-3" /> Done</>
                  ) : (
                    isChild ? "Let's go!" : r.type === 'exercise' || r.type === 'audio' ? 'Start' : 'Read'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Resource modal */}
      {openResource && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-large w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{openResource.emoji}</span>
                <div>
                  <h3 className="font-bold text-text-primary">
                    {isChild ? openResource.childTitle : openResource.title}
                  </h3>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', TYPE_LABELS[openResource.type].color)}>
                    {TYPE_LABELS[openResource.type].label}
                  </span>
                </div>
              </div>
              <button onClick={() => setOpenResource(null)} className="p-1.5 hover:bg-sand rounded-lg">
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            <p className="text-text-secondary text-sm">
              {isChild ? openResource.childDescription : openResource.description}
            </p>

            <div className="bg-sand rounded-xl p-4 text-sm text-text-secondary">
              <p className="font-medium text-text-primary mb-2">How to use this resource</p>
              <p>Take your time with this {openResource.type}. Find a comfortable space, and follow along at your own pace. You can always come back to it later.</p>
            </div>

            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Clock className="w-3 h-3" />
              {openResource.duration}
            </div>

            {completed.has(openResource.id) ? (
              <div className="flex items-center justify-center gap-2 py-3 bg-sage/10 rounded-xl text-sage font-semibold">
                <CheckCircle className="w-5 h-5" /> Completed!
              </div>
            ) : (
              <button
                onClick={() => handleComplete(openResource.id)}
                className={cn('w-full py-3 rounded-xl font-semibold text-sm transition-all', theme.primaryButton)}
              >
                {isChild ? '✅ I did it!' : 'Mark as complete'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
