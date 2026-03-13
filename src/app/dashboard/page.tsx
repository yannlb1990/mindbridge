'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { useDemoData } from '@/hooks/useDemoData';
import { NewSessionModal } from '@/components/sessions/NewSessionModal';
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
  FileText,
  Loader2,
  BookOpen,
  CheckCircle,
  Circle,
  AlertCircle,
  ListTodo,
  Bell,
  User,
} from 'lucide-react';
import { formatDate, calculateAge } from '@/lib/utils';
import Link from 'next/link';

interface ClinicianTask {
  id: string;
  description: string;
  client_name?: string;
  client_id?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  due?: string;
  completed: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { clients, sessions, notes, homework, alerts } = useDemoData();
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  // Demo clinician tasks
  const [clinicianTasks, setClinicianTasks] = useState<ClinicianTask[]>([
    {
      id: 'ctask-1',
      description: 'Complete referral for dietitian - Emma Thompson',
      client_name: 'Emma Thompson',
      client_id: 'client-1',
      priority: 'high',
      category: 'Referral',
      due: 'Today',
      completed: false,
    },
    {
      id: 'ctask-2',
      description: 'Send resources to parents about supporting meal times',
      client_name: 'Emma Thompson',
      client_id: 'client-1',
      priority: 'high',
      category: 'Family Support',
      completed: false,
    },
    {
      id: 'ctask-3',
      description: 'Follow up with school counselor about lunch support program',
      client_name: 'Emma Thompson',
      client_id: 'client-1',
      priority: 'medium',
      category: 'Coordination',
      completed: false,
    },
    {
      id: 'ctask-4',
      description: 'Review PHQ-9 assessment results - Sophie Williams',
      client_name: 'Sophie Williams',
      client_id: 'client-3',
      priority: 'high',
      category: 'Assessment',
      due: 'Today',
      completed: false,
    },
    {
      id: 'ctask-5',
      description: 'Prepare coping plan for school trip',
      client_name: 'Emma Thompson',
      client_id: 'client-1',
      priority: 'medium',
      category: 'Treatment Planning',
      due: 'This week',
      completed: false,
    },
    {
      id: 'ctask-6',
      description: 'Schedule family session for next week - Liam Nguyen',
      client_name: 'Liam Nguyen',
      client_id: 'client-2',
      priority: 'medium',
      category: 'Scheduling',
      completed: true,
    },
  ]);

  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.scheduled_start).toDateString();
    return sessionDate === new Date().toDateString() && s.status === 'scheduled';
  });

  const highRiskClients = clients.filter(
    (c) => c.current_risk_level === 'high' || c.current_risk_level === 'critical'
  );

  const unsignedNotes = notes.filter((n) => !n.is_signed);

  // Get overdue homework
  const overdueHomework = homework.filter(h => h.status === 'overdue');
  const pendingHomework = homework.filter(h => h.status === 'assigned' || h.status === 'in_progress');

  // Get incomplete clinician tasks
  const pendingClinicianTasks = clinicianTasks.filter(t => !t.completed);
  const highPriorityTasks = pendingClinicianTasks.filter(t => t.priority === 'high');

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

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const toggleTaskComplete = (taskId: string) => {
    setClinicianTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setClinicianTasks(tasks => [
      {
        id: `ctask-${Date.now()}`,
        description: newTaskText.trim(),
        priority: 'medium',
        category: 'General',
        completed: false,
      },
      ...tasks,
    ]);
    setNewTaskText('');
    setIsAddingTask(false);
  };

  return (
    <div className="min-h-screen">
      <Header
        title={`${greeting()}, ${user?.preferred_name || user?.first_name || 'there'}`}
        subtitle={formatDate(new Date(), 'long')}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsNewSessionOpen(true)}>
            New Session
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="p-2 bg-sage/10 rounded-lg">
                <Users className="w-5 h-5 text-sage" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{clients.length}</p>
                <p className="text-xs text-text-secondary">Active Clients</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="p-2 bg-calm/20 rounded-lg">
                <Calendar className="w-5 h-5 text-calm-dark" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{todaySessions.length}</p>
                <p className="text-xs text-text-secondary">Sessions Today</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="p-2 bg-gold/20 rounded-lg">
                <FileText className="w-5 h-5 text-gold-dark" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{unsignedNotes.length}</p>
                <p className="text-xs text-text-secondary">Unsigned Notes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="p-2 bg-coral/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-coral-dark" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{highRiskClients.length}</p>
                <p className="text-xs text-text-secondary">High Risk</p>
              </div>
            </CardContent>
          </Card>

          <Card className={overdueHomework.length > 0 ? 'border-error/50 bg-error/5' : ''}>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className={`p-2 rounded-lg ${overdueHomework.length > 0 ? 'bg-error/20' : 'bg-warning/20'}`}>
                <BookOpen className={`w-5 h-5 ${overdueHomework.length > 0 ? 'text-error' : 'text-warning'}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{overdueHomework.length}</p>
                <p className="text-xs text-text-secondary">Overdue HW</p>
              </div>
            </CardContent>
          </Card>

          <Card className={highPriorityTasks.length > 0 ? 'border-sage/50 bg-sage/5' : ''}>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="p-2 bg-sage/20 rounded-lg">
                <ListTodo className="w-5 h-5 text-sage" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{pendingClinicianTasks.length}</p>
                <p className="text-xs text-text-secondary">My Tasks</p>
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
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={() => setIsNewSessionOpen(true)}
                  >
                    Schedule a session
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map((session) => {
                    const client = getClient(session.client_id);
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
                              firstName={client?.first_name || 'U'}
                              lastName={client?.last_name || 'U'}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-text-primary">
                                {client ? `${client.first_name} ${client.last_name}` : 'Unknown Client'}
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
                          <Button variant="ghost" size="sm" onClick={() => router.push('/session-capture')}>
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
                <Bell className="w-5 h-5 text-coral" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No alerts</p>
              ) : (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert, index) => (
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tasks and Homework Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-sage" />
                My Tasks
                {highPriorityTasks.length > 0 && (
                  <Badge variant="error" size="sm">{highPriorityTasks.length} high priority</Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddingTask(true)}>
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingTask && (
                <div className="flex gap-2 mb-3">
                  <input
                    autoFocus
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') { setIsAddingTask(false); setNewTaskText(''); } }}
                    placeholder="Task description..."
                    className="flex-1 px-3 py-2 border border-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                  <Button size="sm" onClick={handleAddTask}>Add</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setIsAddingTask(false); setNewTaskText(''); }}>Cancel</Button>
                </div>
              )}
              {pendingClinicianTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-text-secondary">All tasks completed!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingClinicianTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        task.completed ? 'bg-success/10' : 'bg-sand hover:bg-beige'
                      }`}
                      onClick={() => toggleTaskComplete(task.id)}
                    >
                      <div className="mt-0.5">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-text-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              task.priority === 'high' ? 'error' :
                              task.priority === 'medium' ? 'warning' : 'default'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-text-muted">{task.category}</span>
                          {task.due && (
                            <span className="text-xs text-calm">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {task.due}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingClinicianTasks.length > 5 && (
                    <p className="text-sm text-text-muted text-center pt-2">
                      +{pendingClinicianTasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overdue & Pending Homework */}
          <Card className={overdueHomework.length > 0 ? 'border-error/30' : ''}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-warning" />
                Client Homework
                {overdueHomework.length > 0 && (
                  <Badge variant="error" size="sm">{overdueHomework.length} overdue</Badge>
                )}
              </CardTitle>
              <Link href="/clients" className="text-sm text-calm hover:text-calm-dark flex items-center gap-1">
                Manage <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {overdueHomework.length === 0 && pendingHomework.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-text-secondary">All homework up to date!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Overdue items first */}
                  {overdueHomework.slice(0, 3).map((hw) => {
                    const client = clients.find(c => c.id === hw.client_id);
                    return (
                      <Link
                        key={hw.id}
                        href={`/clients/${hw.client_id}`}
                        className="flex items-start gap-3 p-3 rounded-lg bg-error/10 border border-error/30 hover:bg-error/20 transition-colors"
                      >
                        <AlertCircle className="w-5 h-5 text-error mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">
                            {hw.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-text-muted flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {client?.first_name} {client?.last_name}
                            </span>
                            <Badge variant="error" size="sm">Overdue</Badge>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {/* Pending items */}
                  {pendingHomework.slice(0, overdueHomework.length > 0 ? 2 : 4).map((hw) => {
                    const client = clients.find(c => c.id === hw.client_id);
                    return (
                      <Link
                        key={hw.id}
                        href={`/clients/${hw.client_id}`}
                        className="flex items-start gap-3 p-3 rounded-lg bg-sand hover:bg-beige transition-colors"
                      >
                        <Circle className="w-5 h-5 text-text-muted mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">
                            {hw.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-text-muted flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {client?.first_name} {client?.last_name}
                            </span>
                            <Badge variant={hw.status === 'in_progress' ? 'info' : 'default'} size="sm">
                              {hw.status === 'in_progress' ? 'In Progress' : 'Assigned'}
                            </Badge>
                            {hw.due_date && (
                              <span className="text-xs text-text-muted">
                                Due {formatDate(hw.due_date)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {(overdueHomework.length + pendingHomework.length) > 5 && (
                    <p className="text-sm text-text-muted text-center pt-2">
                      +{overdueHomework.length + pendingHomework.length - 5} more items
                    </p>
                  )}
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
              {clients.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-text-muted">No clients yet</p>
                  <Link href="/clients">
                    <Button variant="secondary" size="sm" className="mt-2">
                      Add Client
                    </Button>
                  </Link>
                </div>
              ) : (
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
              )}
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
                  const percentage = clients.length > 0 ? (count / clients.length) * 100 : 0;
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

      {/* New Session Modal */}
      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => setIsNewSessionOpen(false)}
        onSuccess={() => {
          // Sessions will auto-refresh via the hook
        }}
      />
    </div>
  );
}
