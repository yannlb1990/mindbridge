'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useDemoData } from '@/hooks/useDemoData';
import { calculateAge, formatDate, getMoodEmoji, getMoodLabel } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  AlertTriangle,
  Shield,
  ClipboardList,
  TrendingUp,
  Edit,
  Plus,
  Clock,
  Video,
  MapPin,
} from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const { clients, sessions } = useDemoData();

  const client = clients.find((c) => c.id === params.id);
  const clientSessions = sessions.filter((s) => s.client_id === params.id);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">Client not found</p>
            <Link href="/clients">
              <Button variant="secondary" className="mt-4">
                Back to Clients
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock mood entries for demo
  const moodEntries = [
    { rating: 4, date: new Date().toISOString(), notes: 'Feeling better today' },
    { rating: 3, date: new Date(Date.now() - 86400000).toISOString(), notes: 'Okay day' },
    { rating: 2, date: new Date(Date.now() - 172800000).toISOString(), notes: 'Struggled with meals' },
    { rating: 3, date: new Date(Date.now() - 259200000).toISOString(), notes: '' },
    { rating: 4, date: new Date(Date.now() - 345600000).toISOString(), notes: 'Good session yesterday' },
  ];

  // Mock assessments
  const assessments = [
    { type: 'PHQ-9', score: 12, severity: 'Moderate', date: new Date(Date.now() - 604800000).toISOString() },
    { type: 'GAD-7', score: 8, severity: 'Mild', date: new Date(Date.now() - 604800000).toISOString() },
    { type: 'EDE-Q', score: 3.2, severity: 'Clinical', date: new Date(Date.now() - 1209600000).toISOString() },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title=""
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>
              Schedule Session
            </Button>
            <Button leftIcon={<FileText className="w-4 h-4" />}>
              New Note
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Back Button */}
        <Link href="/clients" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar
                    firstName={client.first_name}
                    lastName={client.last_name}
                    size="xl"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-display font-semibold text-text-primary">
                        {client.first_name} {client.last_name}
                      </h1>
                      <Badge
                        variant={
                          client.current_risk_level === 'low'
                            ? 'success'
                            : client.current_risk_level === 'moderate'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {client.current_risk_level === 'high' || client.current_risk_level === 'critical' ? (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        ) : null}
                        {client.current_risk_level} risk
                      </Badge>
                    </div>

                    <p className="text-text-secondary mb-4">
                      {client.date_of_birth ? `${calculateAge(client.date_of_birth)} years old` : ''}
                      {client.primary_diagnosis && ` • ${client.primary_diagnosis}`}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-muted">Treatment Approach</p>
                        <p className="text-text-primary font-medium">{client.treatment_approach}</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Sessions Completed</p>
                        <p className="text-text-primary font-medium">{client.session_count}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Sessions</CardTitle>
                <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Schedule
                </Button>
              </CardHeader>
              <CardContent>
                {clientSessions.filter((s) => s.status === 'scheduled').length === 0 ? (
                  <p className="text-text-muted text-center py-4">No upcoming sessions</p>
                ) : (
                  <div className="space-y-3">
                    {clientSessions
                      .filter((s) => s.status === 'scheduled')
                      .slice(0, 3)
                      .map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center gap-4 p-3 bg-sand rounded-lg"
                        >
                          <div className="text-center min-w-[70px]">
                            <p className="text-xs text-text-muted">
                              {formatDate(session.scheduled_start)}
                            </p>
                            <p className="text-lg font-semibold text-text-primary">
                              {new Date(session.scheduled_start).toLocaleTimeString('en-AU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-text-primary capitalize">
                              {session.session_type} Session
                            </p>
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                              <Clock className="w-3 h-3" />
                              {session.duration_minutes} minutes
                              {session.telehealth_link ? (
                                <span className="flex items-center gap-1 text-calm">
                                  <Video className="w-3 h-3" /> Telehealth
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> In-person
                                </span>
                              )}
                            </div>
                          </div>
                          <Button size="sm">Start</Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Clinical Notes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Clinical Notes</CardTitle>
                <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  New Note
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 border border-beige rounded-lg hover:bg-sand transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-text-primary">Session Note - SOAP</p>
                          <p className="text-sm text-text-muted">
                            {formatDate(new Date(Date.now() - i * 604800000))}
                          </p>
                        </div>
                        <Badge variant="success" size="sm">Signed</Badge>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        Client presented with improved mood compared to last session.
                        Discussed progress with meal planning and coping strategies...
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Shield className="w-4 h-4" />}>
                  View Safety Plan
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<ClipboardList className="w-4 h-4" />}>
                  New Assessment
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  Send Message
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<FileText className="w-4 h-4" />}>
                  Assign Homework
                </Button>
              </CardContent>
            </Card>

            {/* Mood Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sage" />
                  Recent Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodEntries.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-2xl">{getMoodEmoji(entry.rating)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {getMoodLabel(entry.rating)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assessments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessments.map((assessment, i) => (
                    <div key={i} className="p-3 bg-sand rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-text-primary">{assessment.type}</p>
                        <Badge
                          variant={
                            assessment.severity === 'Mild' ? 'success' :
                            assessment.severity === 'Moderate' ? 'warning' : 'error'
                          }
                          size="sm"
                        >
                          {assessment.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">{formatDate(assessment.date)}</span>
                        <span className="font-semibold text-text-primary">Score: {assessment.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
