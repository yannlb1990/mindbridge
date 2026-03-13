'use client';

import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { useSessions } from '@/hooks/useSessions';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Calendar, Video, MapPin, Loader2, Clock } from 'lucide-react';

export default function ClientSessionsPage() {
  const { ageGroup, clientProfile } = useAuthStore();
  const theme = useAgeTheme();
  const { sessions, isLoading } = useSessions();
  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';

  const now = new Date();
  const upcoming = sessions
    .filter((s) => s.status === 'scheduled' && new Date(s.scheduled_start) >= now)
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());

  const past = sessions
    .filter((s) => s.status === 'completed' || new Date(s.scheduled_start) < now)
    .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime())
    .slice(0, 5);

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
          {isChild ? 'My Visits' : isTeen ? 'Sessions' : 'Your Sessions'}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          {isChild
            ? `Visits with ${clientProfile?.clinician_name}`
            : `Sessions with ${clientProfile?.clinician_name}`}
        </p>
      </div>

      {/* Next session highlight */}
      {upcoming.length > 0 && (
        <div className={cn('rounded-2xl p-5 border-2', theme.primaryBorder, theme.primaryBg)}>
          <p className={cn('text-xs font-semibold uppercase tracking-wide mb-2', theme.primaryText)}>
            {isChild ? 'Next visit' : 'Next session'}
          </p>
          <div className="flex items-start gap-3">
            <Calendar className={cn(theme.primaryText, isChild ? 'w-8 h-8' : 'w-6 h-6')} />
            <div className="flex-1">
              <p className={cn('font-bold text-text-primary', isChild ? 'text-xl' : 'text-lg')}>
                {formatDate(upcoming[0].scheduled_start, 'long')}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(upcoming[0].scheduled_start).toLocaleTimeString('en-AU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <span className={cn(
                  'flex items-center gap-1 text-sm px-2 py-0.5 rounded-full font-medium',
                  upcoming[0].session_type === 'telehealth'
                    ? 'bg-calm/20 text-calm-dark'
                    : 'bg-sage/20 text-sage-dark'
                )}>
                  {upcoming[0].session_type === 'telehealth' ? (
                    <><Video className="w-3 h-3" /> {isChild ? 'Video call' : 'Telehealth'}</>
                  ) : (
                    <><MapPin className="w-3 h-3" /> {isChild ? 'In person' : 'In-person'}</>
                  )}
                </span>
              </div>

              {upcoming[0].telehealth_link && (
                <a
                  href={upcoming[0].telehealth_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold', theme.primaryButton)}
                >
                  <Video className="w-4 h-4" />
                  {isChild ? 'Join video call' : 'Join session'}
                </a>
              )}

              {upcoming[0].location && (
                <p className="mt-2 text-sm text-text-secondary flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {upcoming[0].location}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All upcoming */}
      {upcoming.length > 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
            {isChild ? 'More visits' : 'Upcoming'}
          </h2>
          {upcoming.slice(1).map((session) => (
            <div key={session.id} className="bg-white rounded-xl shadow-soft p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', theme.primaryBg)}>
                {session.session_type === 'telehealth'
                  ? <Video className={cn('w-5 h-5', theme.primaryText)} />
                  : <MapPin className={cn('w-5 h-5', theme.primaryText)} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{formatDate(session.scheduled_start, 'long')}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {new Date(session.scheduled_start).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  {' · '}
                  {session.session_type === 'telehealth' ? 'Video' : 'In person'}
                </p>
                {session.location && (
                  <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{session.location}
                  </p>
                )}
              </div>
              {session.session_type === 'telehealth' && session.telehealth_link && (
                <a
                  href={session.telehealth_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold', theme.primaryButton)}
                >
                  <Video className="w-3.5 h-3.5" />
                  Join
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {upcoming.length === 0 && (
        <div className={cn('rounded-2xl p-6 text-center', theme.primaryBg)}>
          <Calendar className={cn('mx-auto mb-3', isChild ? 'w-12 h-12' : 'w-8 h-8', theme.primaryText)} />
          <p className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-base')}>
            {isChild ? 'No visits yet!' : 'No upcoming sessions'}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {isChild
              ? 'Ask a grown-up when your next visit is'
              : 'Your clinician will schedule your next appointment.'}
          </p>
        </div>
      )}

      {/* Past sessions */}
      {past.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
            {isChild ? 'Past visits' : 'Past sessions'}
          </h2>
          {past.map((session) => (
            <div key={session.id} className="bg-white/60 rounded-xl p-4 flex items-center gap-3 opacity-70">
              <div className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">{formatDate(session.scheduled_start, 'long')}</p>
                <p className="text-xs text-text-muted">
                  {session.session_type === 'telehealth' ? 'Video' : 'In person'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
