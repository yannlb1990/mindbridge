'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { useDemoData } from '@/hooks/useDemoData';
import {
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Plus,
  Video,
  MapPin,
} from 'lucide-react';
import { formatDate, formatRelativeTime, getRiskLevelColor, calculateAge } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, clinicianProfile } = useAuthStore();
  const { clients, sessions, alerts } = useDemoData();

  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.scheduled_start).toDateString();
    return sessionDate === new Date().toDateString() && s.status === 'scheduled';
  });

  const activeClients = clients.filter((c) => c.status === 'active');
  const highRiskClients = clients.filter((c) => c.current_risk_level === 'high' || c.current_risk_level === 'critical');

  // Calculate age distribution
  const ageGroups = {
    'Children (8-12)': 0,
    'Teens (13-17)': 0,
    'Young Adults (18-25)': 0,
    'Adults (26+)': 0,
  };

  clients.forEach((client) => {
    if (client.date_of_birth) {
      const age = calculateAge(client.date_of_birth);
      if (age >= 8 && age <= 12) ageGroups['Children (8-12)']++;
      else if (age >= 13 && age <= 17) ageGroups['Teens (13-17)']++;
      else if (age >= 18 && age <= 25) ageGroups['Young Adults (18-25)']++;
      else if (age > 25) ageGroups['Adults (26+)']++;
    }
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen">
      <Header
        title={`${greeting()}, ${user?.preferred_name || user?.first_name}`}
        subtitle={formatDate(new Date(), 'long')}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Session
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-sage-50 rounded-xl">
                <Users className="w-6 h-6 text-sage" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{activeClients.length}</p>
                <p className="text-sm text-text-secondary">Active Clients</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-calm/20 rounded-xl">
                <Calendar className="w-6 h-6 text-calm-dark" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{todaySessions.length}</p>
                <p className="text-sm text-text-secondary">Sessions Today</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-gold/20 rounded-xl">
                <Clock className="w-6 h-6 text-gold-dark" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">
                  {sessions.filter((s) => s.status === 'scheduled').length}
                </p>
                <p className="text-sm text-text-secondary">This Week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-coral/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-coral-dark" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{highRiskClients.length}</p>
                <p className="text-sm text-text-secondary">High Risk</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <Link href="/schedule" className="text-sm text-calm hover:text-calm-dark flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {todaySessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary">No sessions scheduled for today</p>
                  <Button variant="secondary" size="sm" className="mt-4">
                    Schedule a session
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map((session) => {
                    const client = clients.find((c) => c.id === session.client_id);
                    const clientUser = client ? {
                      first_name: client.first_name || 'Unknown',
                      last_name: client.last_name || 'Client',
                    } : { first_name: 'Unknown', last_name: 'Client' };

                    return (
                      <div
                        key={session.id}
                        className="flex items-center gap-4 p-4 bg-sand rounded-xl hover:bg-beige transition-colors"
                      >
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-semibold text-text-primary">
                            {new Date(session.scheduled_start).toLocaleTimeString('en-AU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-xs text-text-muted">{session.duration_minutes}min</p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Avatar
                              firstName={clientUser.first_name}
                              lastName={clientUser.last_name}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-text-primary">
                                {clientUser.first_name} {clientUser.last_name}
                              </p>
                              <p className="text-sm text-text-muted capitalize">{session.session_type}</p>
                            </div>
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
                          <Button variant="ghost" size="sm">
                            Start
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-coral" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No alerts</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === 'critical'
                          ? 'bg-coral/10 border-coral-dark'
                          : alert.type === 'warning'
                          ? 'bg-gold/10 border-gold'
                          : 'bg-calm/10 border-calm'
                      }`}
                    >
                      <p className="text-sm font-medium text-text-primary">{alert.title}</p>
                      <p className="text-xs text-text-secondary mt-1">{alert.message}</p>
                      <p className="text-xs text-text-muted mt-2">{formatRelativeTime(alert.time)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Clients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Clients</CardTitle>
              <Link href="/clients" className="text-sm text-calm hover:text-calm-dark flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clients.slice(0, 5).map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-sand transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={client.first_name || 'U'}
                        lastName={client.last_name || 'U'}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-text-primary">
                          {client.first_name} {client.last_name}
                        </p>
                        <p className="text-sm text-text-muted">
                          {client.date_of_birth ? `${calculateAge(client.date_of_birth)} years old` : 'Age unknown'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        client.current_risk_level === 'low'
                          ? 'success'
                          : client.current_risk_level === 'moderate'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {client.current_risk_level}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sage" />
                Client Age Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(ageGroups).map(([group, count]) => {
                  const percentage = activeClients.length > 0 ? (count / activeClients.length) * 100 : 0;
                  return (
                    <div key={group}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">{group}</span>
                        <span className="font-medium text-text-primary">{count}</span>
                      </div>
                      <div className="h-2 bg-sand rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sage rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
