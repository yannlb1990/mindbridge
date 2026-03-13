'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useSessions, Session } from '@/hooks/useSessions';
import { useClients } from '@/hooks/useClients';
import { NewSessionModal } from '@/components/sessions/NewSessionModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Loader2,
  Clock,
  Copy,
  Check,
} from 'lucide-react';

type ViewMode = 'day' | 'week' | 'month';

export default function SchedulePage() {
  const router = useRouter();
  const { sessions, isLoading, fetchSessions } = useSessions();
  const { clients } = useClients();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = (sessionId: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Navigation helpers
  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1));

    const days = [];
    const current = new Date(startDate);
    while (current <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const weekDates = getWeekDates(currentDate);
  const monthDates = getMonthDates(currentDate);
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8);

  const getSessionsForSlot = (date: Date, hour: number) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.scheduled_start);
      return (
        sessionDate.toDateString() === date.toDateString() &&
        sessionDate.getHours() === hour
      );
    });
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.scheduled_start);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleSlotClick = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setIsNewSessionOpen(true);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name?.charAt(0) || ''}.` : 'Unknown';
  };

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const getHeaderTitle = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      return `${weekDates[0].toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} - ${weekDates[6].toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
    }
  };

  const renderSessionCard = (session: Session, compact = false) => {
    const client = getClient(session.client_id);
    if (compact) {
      return (
        <div
          key={session.id}
          className={`p-1.5 rounded text-xs mb-1 truncate ${
            session.telehealth_link
              ? 'bg-calm/20 border border-calm'
              : 'bg-sage-100 border border-sage-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-medium">
            {new Date(session.scheduled_start).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {' '}{session.client_name || getClientName(session.client_id)}
        </div>
      );
    }
    return (
      <div
        key={session.id}
        className={`p-2 rounded-lg text-xs mb-1 ${
          session.telehealth_link
            ? 'bg-calm/20 border border-calm'
            : 'bg-sage-100 border border-sage-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 mb-1">
          {session.telehealth_link ? (
            <Video className="w-3 h-3 text-calm-dark" />
          ) : (
            <MapPin className="w-3 h-3 text-sage" />
          )}
          <span className="font-medium text-text-primary truncate">
            {session.client_name || getClientName(session.client_id)}
          </span>
        </div>
        <p className="text-text-muted">{session.duration_minutes}min</p>
      </div>
    );
  };

  // Day View Component
  const DayView = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="min-w-[400px]">
          {timeSlots.map((hour) => {
            const slotSessions = getSessionsForSlot(currentDate, hour);
            return (
              <div key={hour} className="flex border-b border-beige min-h-[80px]">
                <div className="w-20 p-2 text-sm text-text-muted text-right pr-4 border-r border-beige flex-shrink-0">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div
                  className="flex-1 p-2 hover:bg-sand/50 cursor-pointer"
                  onClick={() => handleSlotClick(currentDate)}
                >
                  {slotSessions.map((session) => {
                    const client = getClient(session.client_id);
                    return (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg mb-2 ${
                          session.telehealth_link
                            ? 'bg-calm/20 border border-calm'
                            : 'bg-sage-100 border border-sage-200'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar
                              firstName={client?.first_name || 'U'}
                              lastName={client?.last_name || 'U'}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-text-primary">
                                {session.client_name || (client ? `${client.first_name} ${client.last_name}` : 'Unknown')}
                              </p>
                              <p className="text-sm text-text-muted capitalize">
                                {session.session_type} • {session.duration_minutes}min
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.telehealth_link ? (
                              <Badge variant="info" size="sm">
                                <Video className="w-3 h-3 mr-1" /> Telehealth
                              </Badge>
                            ) : (
                              <Badge variant="default" size="sm">
                                <MapPin className="w-3 h-3 mr-1" /> In-person
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  // Week View Component
  const WeekView = () => (
    <Card>
      <CardContent className="pt-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-beige">
            <div className="p-3"></div>
            {weekDates.map((date, i) => (
              <div
                key={i}
                className={`p-3 text-center border-l border-beige ${
                  isToday(date) ? 'bg-sage-50' : ''
                }`}
              >
                <p className="text-sm text-text-muted">
                  {date.toLocaleDateString('en-AU', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-semibold ${isToday(date) ? 'text-sage' : 'text-text-primary'}`}>
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>

          {timeSlots.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-beige min-h-[80px]">
              <div className="p-2 text-sm text-text-muted text-right pr-4 border-r border-beige">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDates.map((date, dayIndex) => {
                const slotSessions = getSessionsForSlot(date, hour);
                return (
                  <div
                    key={dayIndex}
                    className={`p-1 border-l border-beige relative ${
                      isToday(date) ? 'bg-sage-50/30' : ''
                    } hover:bg-sand/50 cursor-pointer`}
                    onClick={() => handleSlotClick(date)}
                  >
                    {slotSessions.map((session) => renderSessionCard(session))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Month View Component
  const MonthView = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-px bg-beige">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="bg-cream p-2 text-center text-sm font-medium text-text-secondary">
              {day}
            </div>
          ))}
          {monthDates.map((date, i) => {
            const daySessions = getSessionsForDate(date);
            return (
              <div
                key={i}
                className={`bg-white min-h-[100px] p-2 cursor-pointer hover:bg-sand/30 transition-colors ${
                  !isCurrentMonth(date) ? 'opacity-40' : ''
                } ${isToday(date) ? 'ring-2 ring-sage ring-inset' : ''}`}
                onClick={() => handleSlotClick(date)}
              >
                <p className={`text-sm font-medium mb-1 ${
                  isToday(date) ? 'text-sage' : 'text-text-primary'
                }`}>
                  {date.getDate()}
                </p>
                <div className="space-y-1">
                  {daySessions.slice(0, 3).map((session) => renderSessionCard(session, true))}
                  {daySessions.length > 3 && (
                    <p className="text-xs text-text-muted">+{daySessions.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Header
        title="Schedule"
        subtitle="Manage your appointments"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsNewSessionOpen(true)}>
            New Appointment
          </Button>
        }
      />

      <div className="p-6">
        {/* Calendar Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold text-text-primary min-w-[200px] text-center">
                  {getHeaderTitle()}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-1 bg-sand rounded-lg p-1">
                {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className="capitalize"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        )}

        {/* Calendar Views */}
        {!isLoading && viewMode === 'day' && <DayView />}
        {!isLoading && viewMode === 'week' && <WeekView />}
        {!isLoading && viewMode === 'month' && <MonthView />}

        {/* Today's Sessions List (only show in week/month view) */}
        {!isLoading && viewMode !== 'day' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sage" />
                Today&apos;s Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions
                  .filter((s) => new Date(s.scheduled_start).toDateString() === new Date().toDateString())
                  .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime())
                  .map((session) => {
                    const client = getClient(session.client_id);
                    return (
                      <div key={session.id} className="flex items-center gap-4 p-4 bg-sand rounded-xl">
                        <div className="text-center min-w-[70px]">
                          <p className="text-lg font-semibold text-text-primary">
                            {new Date(session.scheduled_start).toLocaleTimeString('en-AU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-xs text-text-muted">{session.duration_minutes}min</p>
                        </div>
                        <Avatar firstName={client?.first_name || 'U'} lastName={client?.last_name || 'U'} size="md" />
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">
                            {session.client_name || (client ? `${client.first_name} ${client.last_name}` : 'Unknown')}
                          </p>
                          <p className="text-sm text-text-muted capitalize">{session.session_type} session</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.session_type === 'telehealth' ? (
                            <>
                              {session.telehealth_link && (
                                <button
                                  onClick={() => copyLink(session.id, session.telehealth_link!)}
                                  title="Copy link"
                                  className="p-1.5 rounded-lg hover:bg-beige transition-colors text-text-muted hover:text-text-primary"
                                >
                                  {copiedId === session.id
                                    ? <Check className="w-4 h-4 text-sage" />
                                    : <Copy className="w-4 h-4" />
                                  }
                                </button>
                              )}
                              <Button
                                size="sm"
                                leftIcon={<Video className="w-3.5 h-3.5" />}
                                onClick={() => window.open(session.telehealth_link || '#', '_blank')}
                                disabled={!session.telehealth_link}
                              >
                                Join Call
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => router.push('/session-capture')}>
                                Notes
                              </Button>
                            </>
                          ) : (
                            <>
                              {session.location && (
                                <span className="hidden sm:flex items-center gap-1 text-xs text-text-muted">
                                  <MapPin className="w-3 h-3" />{session.location}
                                </span>
                              )}
                              <Button size="sm" onClick={() => router.push('/session-capture')}>
                                Start
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {sessions.filter((s) => new Date(s.scheduled_start).toDateString() === new Date().toDateString()).length === 0 && (
                  <p className="text-center text-text-muted py-4">No sessions scheduled for today</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => {
          setIsNewSessionOpen(false);
          setSelectedDate('');
        }}
        preselectedDate={selectedDate}
        onSuccess={() => fetchSessions()}
      />
    </div>
  );
}
