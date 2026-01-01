'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useDemoData } from '@/hooks/useDemoData';
import { formatDate } from '@/lib/utils';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  User,
} from 'lucide-react';

type ViewMode = 'day' | 'week' | 'month';

export default function SchedulePage() {
  const { clients, sessions } = useDemoData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

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

  const weekDates = getWeekDates(currentDate);
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getSessionsForSlot = (date: Date, hour: number) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.scheduled_start);
      return (
        sessionDate.toDateString() === date.toDateString() &&
        sessionDate.getHours() === hour
      );
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Schedule"
        subtitle="Manage your appointments"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Appointment
          </Button>
        }
      />

      <div className="p-6">
        {/* Calendar Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold text-text-primary">
                  {weekDates[0].toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-2">
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

        {/* Week View Calendar */}
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row - Days */}
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
                    <p
                      className={`text-lg font-semibold ${
                        isToday(date) ? 'text-sage' : 'text-text-primary'
                      }`}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
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
                      >
                        {slotSessions.map((session) => {
                          const client = clients.find((c) => c.id === session.client_id);
                          return (
                            <div
                              key={session.id}
                              className={`p-2 rounded-lg text-xs mb-1 ${
                                session.telehealth_link
                                  ? 'bg-calm/20 border border-calm'
                                  : 'bg-sage-100 border border-sage-200'
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {session.telehealth_link ? (
                                  <Video className="w-3 h-3 text-calm-dark" />
                                ) : (
                                  <MapPin className="w-3 h-3 text-sage" />
                                )}
                                <span className="font-medium text-text-primary truncate">
                                  {client?.first_name} {client?.last_name?.charAt(0)}.
                                </span>
                              </div>
                              <p className="text-text-muted">
                                {session.duration_minutes}min
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Today&apos;s Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions
                .filter((s) => {
                  const sessionDate = new Date(s.scheduled_start);
                  return sessionDate.toDateString() === new Date().toDateString();
                })
                .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime())
                .map((session) => {
                  const client = clients.find((c) => c.id === session.client_id);
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-4 bg-sand rounded-xl"
                    >
                      <div className="text-center min-w-[70px]">
                        <p className="text-lg font-semibold text-text-primary">
                          {new Date(session.scheduled_start).toLocaleTimeString('en-AU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-text-muted">{session.duration_minutes}min</p>
                      </div>
                      <Avatar
                        firstName={client?.first_name || 'U'}
                        lastName={client?.last_name || 'U'}
                        size="md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">
                          {client?.first_name} {client?.last_name}
                        </p>
                        <p className="text-sm text-text-muted capitalize">
                          {session.session_type} session
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.telehealth_link ? (
                          <Badge variant="info">
                            <Video className="w-3 h-3 mr-1" /> Telehealth
                          </Badge>
                        ) : (
                          <Badge variant="default">
                            <MapPin className="w-3 h-3 mr-1" /> In-person
                          </Badge>
                        )}
                        <Button size="sm">Start Session</Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
