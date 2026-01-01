import { useMemo } from 'react';
import type { Session, ClientProfile } from '@/types/database';

interface DemoClient extends Partial<ClientProfile> {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  current_risk_level: 'low' | 'moderate' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'discharged';
  primary_diagnosis: string;
  session_count: number;
  treatment_approach: string;
}

interface DemoSession {
  id: string;
  client_id: string;
  clinician_id: string;
  session_type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  scheduled_start: string;
  scheduled_end: string;
  duration_minutes: number;
  telehealth_link: string | null;
  location: string | null;
}

interface DemoAlert {
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
}

// Generate demo clients
const generateDemoClients = (): DemoClient[] => {
  const clients: DemoClient[] = [
    {
      id: 'client-1',
      first_name: 'Emma',
      last_name: 'Thompson',
      date_of_birth: '2010-05-15', // 15 years old (teen)
      current_risk_level: 'moderate',
      status: 'active',
      primary_diagnosis: 'Anorexia Nervosa',
      session_count: 12,
      treatment_approach: 'FBT + CBT-E',
      user_id: 'user-client-1',
      clinician_id: 'demo-clinician-1',
    },
    {
      id: 'client-2',
      first_name: 'Liam',
      last_name: 'Nguyen',
      date_of_birth: '2015-08-22', // 10 years old (child)
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'Generalized Anxiety Disorder',
      session_count: 8,
      treatment_approach: 'CBT',
      user_id: 'user-client-2',
      clinician_id: 'demo-clinician-1',
    },
    {
      id: 'client-3',
      first_name: 'Sophie',
      last_name: 'Williams',
      date_of_birth: '2006-02-10', // 19 years old (young adult)
      current_risk_level: 'high',
      status: 'active',
      primary_diagnosis: 'Bulimia Nervosa',
      session_count: 24,
      treatment_approach: 'CBT-E + DBT Skills',
      user_id: 'user-client-3',
      clinician_id: 'demo-clinician-1',
    },
    {
      id: 'client-4',
      first_name: 'Oliver',
      last_name: 'Chen',
      date_of_birth: '2012-11-30', // 13 years old (teen)
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'Social Anxiety',
      session_count: 6,
      treatment_approach: 'CBT',
      user_id: 'user-client-4',
      clinician_id: 'demo-clinician-1',
    },
    {
      id: 'client-5',
      first_name: 'Mia',
      last_name: 'Patel',
      date_of_birth: '1998-07-18', // 27 years old (adult)
      current_risk_level: 'moderate',
      status: 'active',
      primary_diagnosis: 'Major Depressive Disorder',
      session_count: 15,
      treatment_approach: 'CBT + ACT',
      user_id: 'user-client-5',
      clinician_id: 'demo-clinician-1',
    },
    {
      id: 'client-6',
      first_name: 'Jack',
      last_name: 'Morrison',
      date_of_birth: '2008-04-05', // 17 years old (teen)
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'ADHD',
      session_count: 10,
      treatment_approach: 'CBT + Skills Training',
      user_id: 'user-client-6',
      clinician_id: 'demo-clinician-1',
    },
    {
      id: 'client-7',
      first_name: 'Ava',
      last_name: 'Garcia',
      date_of_birth: '2016-09-12', // 9 years old (child)
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'Selective Mutism',
      session_count: 4,
      treatment_approach: 'Behavioral Therapy',
      user_id: 'user-client-7',
      clinician_id: 'demo-clinician-1',
    },
    {
      id: 'client-8',
      first_name: 'Noah',
      last_name: 'Kim',
      date_of_birth: '2003-01-25', // 22 years old (young adult)
      current_risk_level: 'moderate',
      status: 'active',
      primary_diagnosis: 'ARFID',
      session_count: 18,
      treatment_approach: 'CBT-AR',
      user_id: 'user-client-8',
      clinician_id: 'demo-clinician-1',
    },
  ];

  return clients;
};

// Generate demo sessions for today and this week
const generateDemoSessions = (clients: DemoClient[]): DemoSession[] => {
  const today = new Date();
  const sessions: DemoSession[] = [];

  // Today's sessions
  const todayTimes = ['09:00', '10:00', '11:30', '14:00', '15:30'];
  todayTimes.forEach((time, index) => {
    if (index < clients.length) {
      const [hours, minutes] = time.split(':').map(Number);
      const start = new Date(today);
      start.setHours(hours, minutes, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 50);

      sessions.push({
        id: `session-today-${index}`,
        client_id: clients[index].id,
        clinician_id: 'demo-clinician-1',
        session_type: index % 2 === 0 ? 'individual' : 'telehealth',
        status: 'scheduled',
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
        duration_minutes: 50,
        telehealth_link: index % 2 === 1 ? 'https://meet.mindbridge.com.au/session-123' : null,
        location: index % 2 === 0 ? '123 Collins St, Melbourne' : null,
      });
    }
  });

  // Tomorrow's sessions
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = ['09:30', '11:00', '14:30', '16:00'];
  tomorrowTimes.forEach((time, index) => {
    if (index < clients.length) {
      const [hours, minutes] = time.split(':').map(Number);
      const start = new Date(tomorrow);
      start.setHours(hours, minutes, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 50);

      sessions.push({
        id: `session-tomorrow-${index}`,
        client_id: clients[index + 2 < clients.length ? index + 2 : index].id,
        clinician_id: 'demo-clinician-1',
        session_type: 'individual',
        status: 'scheduled',
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
        duration_minutes: 50,
        telehealth_link: null,
        location: '123 Collins St, Melbourne',
      });
    }
  });

  return sessions;
};

// Generate demo alerts
const generateDemoAlerts = (clients: DemoClient[]): DemoAlert[] => {
  const now = new Date();
  const alerts: DemoAlert[] = [];

  // Find high-risk clients
  const highRiskClients = clients.filter(
    (c) => c.current_risk_level === 'high' || c.current_risk_level === 'critical'
  );

  highRiskClients.forEach((client) => {
    alerts.push({
      type: 'critical',
      title: `High Risk: ${client.first_name} ${client.last_name}`,
      message: 'Safety plan review recommended before next session.',
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    });
  });

  // Add some general alerts
  alerts.push({
    type: 'warning',
    title: 'PHQ-9 Due',
    message: 'Emma Thompson is due for a PHQ-9 assessment.',
    time: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
  });

  alerts.push({
    type: 'info',
    title: 'New Mood Entry',
    message: 'Liam Nguyen logged a mood entry with notes.',
    time: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
  });

  alerts.push({
    type: 'info',
    title: 'Homework Completed',
    message: 'Sophie Williams completed thought record homework.',
    time: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
  });

  return alerts;
};

export function useDemoData() {
  const clients = useMemo(() => generateDemoClients(), []);
  const sessions = useMemo(() => generateDemoSessions(clients), [clients]);
  const alerts = useMemo(() => generateDemoAlerts(clients), [clients]);

  return {
    clients,
    sessions,
    alerts,
  };
}
