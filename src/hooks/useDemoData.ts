import { useMemo } from 'react';
import type { ClientProfile, HomeworkStatus, NoteFormat, RiskLevel } from '@/types/database';

interface DemoClient extends Partial<ClientProfile> {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  current_risk_level: RiskLevel;
  status: 'active' | 'inactive' | 'discharged';
  primary_diagnosis: string;
  session_count: number;
  treatment_approach: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  treatment_start_date?: string;
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
  client_id?: string;
}

interface DemoNote {
  id: string;
  client_id: string;
  session_id: string;
  note_format: NoteFormat;
  title: string;
  content: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    data?: string;
    intervention?: string;
    response?: string;
  };
  is_signed: boolean;
  signed_at: string | null;
  risk_level: RiskLevel | null;
  ai_generated: boolean;
  created_at: string;
}

interface DemoHomework {
  id: string;
  client_id: string;
  title: string;
  description: string;
  exercise_type: 'thought_record' | 'behavioral_experiment' | 'exposure_task' | 'journaling' | 'mindfulness' | 'meal_planning' | 'other';
  status: HomeworkStatus;
  due_date: string | null;
  completed_at: string | null;
  response: string | null;
  created_at: string;
}

interface DemoAssessment {
  id: string;
  client_id: string;
  assessment_type: 'PHQ-9' | 'GAD-7' | 'EDE-Q' | 'DASS-21' | 'K10' | 'CORE-10';
  score: number;
  severity: string;
  notes: string | null;
  created_at: string;
}

interface DemoMoodEntry {
  id: string;
  client_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  emotions: string[];
  notes: string | null;
  created_at: string;
}

interface DemoCrisisEvent {
  id: string;
  client_id: string;
  event_type: 'self_harm' | 'suicidal_ideation' | 'hospitalization' | 'crisis_call' | 'safety_plan_activation';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  actions_taken: string[];
  resolved: boolean;
  created_at: string;
}

interface DemoSafetyPlan {
  id: string;
  client_id: string;
  warning_signs: string[];
  coping_strategies: string[];
  support_people: { name: string; phone: string; relationship: string }[];
  professional_contacts: { name: string; phone: string; role: string }[];
  crisis_helplines: { name: string; phone: string }[];
  reasons_to_live: string[];
  safe_environment_steps: string[];
  last_reviewed: string;
  created_at: string;
}

// Generate demo clients
const generateDemoClients = (): DemoClient[] => {
  const clients: DemoClient[] = [
    {
      id: 'client-1',
      first_name: 'Emma',
      last_name: 'Thompson',
      date_of_birth: '2010-05-15',
      current_risk_level: 'moderate',
      status: 'active',
      primary_diagnosis: 'Anorexia Nervosa',
      session_count: 12,
      treatment_approach: 'FBT + CBT-E',
      user_id: 'user-client-1',
      clinician_id: 'demo-clinician-1',
      phone: '+61 412 345 678',
      email: 'emma.t@email.com',
      emergency_contact_name: 'Sarah Thompson',
      emergency_contact_phone: '+61 413 456 789',
      emergency_contact_relationship: 'Mother',
      treatment_start_date: '2025-09-15',
    },
    {
      id: 'client-2',
      first_name: 'Liam',
      last_name: 'Nguyen',
      date_of_birth: '2015-08-22',
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'Generalized Anxiety Disorder',
      session_count: 8,
      treatment_approach: 'CBT',
      user_id: 'user-client-2',
      clinician_id: 'demo-clinician-1',
      phone: '+61 422 345 678',
      email: 'liam.n@email.com',
      emergency_contact_name: 'Mai Nguyen',
      emergency_contact_phone: '+61 423 456 789',
      emergency_contact_relationship: 'Mother',
      treatment_start_date: '2025-10-01',
    },
    {
      id: 'client-3',
      first_name: 'Sophie',
      last_name: 'Williams',
      date_of_birth: '2006-02-10',
      current_risk_level: 'high',
      status: 'active',
      primary_diagnosis: 'Bulimia Nervosa',
      session_count: 24,
      treatment_approach: 'CBT-E + DBT Skills',
      user_id: 'user-client-3',
      clinician_id: 'demo-clinician-1',
      phone: '+61 432 345 678',
      email: 'sophie.w@email.com',
      emergency_contact_name: 'James Williams',
      emergency_contact_phone: '+61 433 456 789',
      emergency_contact_relationship: 'Father',
      treatment_start_date: '2025-06-01',
    },
    {
      id: 'client-4',
      first_name: 'Oliver',
      last_name: 'Chen',
      date_of_birth: '2012-11-30',
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'Social Anxiety',
      session_count: 6,
      treatment_approach: 'CBT',
      user_id: 'user-client-4',
      clinician_id: 'demo-clinician-1',
      phone: '+61 442 345 678',
      email: 'oliver.c@email.com',
      emergency_contact_name: 'Wei Chen',
      emergency_contact_phone: '+61 443 456 789',
      emergency_contact_relationship: 'Father',
      treatment_start_date: '2025-11-01',
    },
    {
      id: 'client-5',
      first_name: 'Mia',
      last_name: 'Patel',
      date_of_birth: '1998-07-18',
      current_risk_level: 'moderate',
      status: 'active',
      primary_diagnosis: 'Major Depressive Disorder',
      session_count: 15,
      treatment_approach: 'CBT + ACT',
      user_id: 'user-client-5',
      clinician_id: 'demo-clinician-1',
      phone: '+61 452 345 678',
      email: 'mia.p@email.com',
      emergency_contact_name: 'Raj Patel',
      emergency_contact_phone: '+61 453 456 789',
      emergency_contact_relationship: 'Brother',
      treatment_start_date: '2025-08-15',
    },
    {
      id: 'client-6',
      first_name: 'Jack',
      last_name: 'Morrison',
      date_of_birth: '2008-04-05',
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'ADHD',
      session_count: 10,
      treatment_approach: 'CBT + Skills Training',
      user_id: 'user-client-6',
      clinician_id: 'demo-clinician-1',
      phone: '+61 462 345 678',
      email: 'jack.m@email.com',
      emergency_contact_name: 'Helen Morrison',
      emergency_contact_phone: '+61 463 456 789',
      emergency_contact_relationship: 'Mother',
      treatment_start_date: '2025-09-01',
    },
    {
      id: 'client-7',
      first_name: 'Ava',
      last_name: 'Garcia',
      date_of_birth: '2016-09-12',
      current_risk_level: 'low',
      status: 'active',
      primary_diagnosis: 'Selective Mutism',
      session_count: 4,
      treatment_approach: 'Behavioral Therapy',
      user_id: 'user-client-7',
      clinician_id: 'demo-clinician-1',
      phone: '+61 472 345 678',
      email: 'ava.g@email.com',
      emergency_contact_name: 'Maria Garcia',
      emergency_contact_phone: '+61 473 456 789',
      emergency_contact_relationship: 'Mother',
      treatment_start_date: '2025-11-15',
    },
    {
      id: 'client-8',
      first_name: 'Noah',
      last_name: 'Kim',
      date_of_birth: '2003-01-25',
      current_risk_level: 'moderate',
      status: 'active',
      primary_diagnosis: 'ARFID',
      session_count: 18,
      treatment_approach: 'CBT-AR',
      user_id: 'user-client-8',
      clinician_id: 'demo-clinician-1',
      phone: '+61 482 345 678',
      email: 'noah.k@email.com',
      emergency_contact_name: 'Jina Kim',
      emergency_contact_phone: '+61 483 456 789',
      emergency_contact_relationship: 'Mother',
      treatment_start_date: '2025-07-01',
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

  // Past completed sessions for history
  for (let i = 1; i <= 4; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - i * 7);
    clients.slice(0, 4).forEach((client, idx) => {
      const start = new Date(pastDate);
      start.setHours(9 + idx * 2, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 50);

      sessions.push({
        id: `session-past-${i}-${idx}`,
        client_id: client.id,
        clinician_id: 'demo-clinician-1',
        session_type: 'individual',
        status: 'completed',
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
        duration_minutes: 50,
        telehealth_link: null,
        location: '123 Collins St, Melbourne',
      });
    });
  }

  return sessions;
};

// Generate demo clinical notes
const generateDemoNotes = (clients: DemoClient[], sessions: DemoSession[]): DemoNote[] => {
  const notes: DemoNote[] = [];
  const completedSessions = sessions.filter(s => s.status === 'completed');

  completedSessions.slice(0, 12).forEach((session, index) => {
    const client = clients.find(c => c.id === session.client_id);
    if (!client) return;

    notes.push({
      id: `note-${index}`,
      client_id: session.client_id,
      session_id: session.id,
      note_format: index % 2 === 0 ? 'soap' : 'dap',
      title: `Session ${Math.floor(index / 2) + 1} - ${client.treatment_approach}`,
      content: index % 2 === 0 ? {
        subjective: `Client reports ${index % 3 === 0 ? 'improved mood and better sleep this week' : index % 3 === 1 ? 'ongoing challenges with anxiety symptoms' : 'some progress with meal planning'}. ${index % 2 === 0 ? 'Feeling more motivated to engage in coping strategies.' : 'Expressed concerns about upcoming school assessments.'}`,
        objective: `Client appeared ${index % 2 === 0 ? 'calm and engaged' : 'somewhat tired but cooperative'} during session. ${index % 3 === 0 ? 'Made good eye contact throughout.' : 'Completed homework assignments as discussed.'} Weight ${index % 2 === 0 ? 'stable' : 'slightly improved'} this week.`,
        assessment: `${client.primary_diagnosis} - ${index % 2 === 0 ? 'showing gradual improvement' : 'stable but ongoing challenges'}. Risk level remains ${client.current_risk_level}. ${index % 3 === 0 ? 'Good engagement with treatment plan.' : 'May benefit from increased family involvement.'}`,
        plan: `Continue ${client.treatment_approach}. ${index % 2 === 0 ? 'Focus on consolidating gains and preventing relapse.' : 'Address remaining barriers to recovery.'} Homework: ${index % 3 === 0 ? 'Complete thought records daily' : index % 3 === 1 ? 'Practice grounding techniques when anxious' : 'Continue meal logging and review with family'}. Next session in one week.`,
      } : {
        data: `Client attended ${index % 2 === 0 ? 'individual' : 'telehealth'} session. ${index % 3 === 0 ? 'Reported improved symptom management since last session.' : 'Discussed challenges with implementing coping strategies.'} ${index % 2 === 0 ? 'Weight monitoring shows stable trajectory.' : 'Homework partially completed.'}`,
        assessment: `${client.primary_diagnosis} treatment progressing ${index % 2 === 0 ? 'well' : 'with some challenges'}. Client ${index % 3 === 0 ? 'demonstrates good insight into triggers' : 'would benefit from additional skill building'}. Risk assessment: ${client.current_risk_level} - ${index % 2 === 0 ? 'no immediate concerns' : 'continue monitoring'}.`,
        plan: `Continue current treatment approach. ${index % 2 === 0 ? 'Begin transitioning to maintenance phase.' : 'Focus on skill generalization.'} Assign ${index % 3 === 0 ? 'behavioral experiment for next week' : 'journaling exercise to track progress'}. Schedule follow-up in one week.`,
      },
      is_signed: index < 10,
      signed_at: index < 10 ? new Date(session.scheduled_start).toISOString() : null,
      risk_level: client.current_risk_level,
      ai_generated: index % 3 === 0,
      created_at: session.scheduled_start,
    });
  });

  return notes;
};

// Generate demo homework assignments
const generateDemoHomework = (clients: DemoClient[]): DemoHomework[] => {
  const homework: DemoHomework[] = [];
  const now = new Date();
  const exerciseTypes: DemoHomework['exercise_type'][] = ['thought_record', 'behavioral_experiment', 'exposure_task', 'journaling', 'mindfulness', 'meal_planning'];

  clients.forEach((client, clientIndex) => {
    // Create 3-5 homework items per client
    const numHomework = 3 + (clientIndex % 3);
    for (let i = 0; i < numHomework; i++) {
      const daysAgo = i * 7;
      const createdDate = new Date(now);
      createdDate.setDate(createdDate.getDate() - daysAgo);

      const dueDate = new Date(createdDate);
      dueDate.setDate(dueDate.getDate() + 7);

      let status: HomeworkStatus = 'assigned';
      let completedAt: string | null = null;
      let response: string | null = null;

      if (i >= 2) {
        status = 'completed';
        completedAt = new Date(dueDate.getTime() - 86400000).toISOString();
        response = 'Completed as assigned. Found the exercise helpful for managing symptoms.';
      } else if (i === 1) {
        status = 'in_progress';
      } else if (dueDate < now) {
        status = 'overdue';
      }

      const exerciseType = exerciseTypes[(clientIndex + i) % exerciseTypes.length];

      homework.push({
        id: `homework-${client.id}-${i}`,
        client_id: client.id,
        title: getHomeworkTitle(exerciseType, i),
        description: getHomeworkDescription(exerciseType, client.primary_diagnosis),
        exercise_type: exerciseType,
        status,
        due_date: dueDate.toISOString(),
        completed_at: completedAt,
        response,
        created_at: createdDate.toISOString(),
      });
    }
  });

  return homework;
};

function getHomeworkTitle(type: DemoHomework['exercise_type'], index: number): string {
  const titles: Record<DemoHomework['exercise_type'], string[]> = {
    thought_record: ['Daily Thought Record', 'Challenging Negative Thoughts', 'Cognitive Restructuring Exercise'],
    behavioral_experiment: ['Testing Your Predictions', 'Behavioral Experiment: Social Situation', 'Reality Testing Exercise'],
    exposure_task: ['Gradual Exposure Practice', 'Fear Hierarchy Step', 'Facing Your Fears'],
    journaling: ['Weekly Reflection Journal', 'Gratitude Journal', 'Progress Journal Entry'],
    mindfulness: ['Mindfulness Practice', 'Body Scan Exercise', 'Mindful Eating Exercise'],
    meal_planning: ['Weekly Meal Plan', 'Meal Logging', 'Food Diary'],
    other: ['Custom Exercise', 'Assigned Task', 'Practice Exercise'],
  };
  return titles[type][index % titles[type].length];
}

function getHomeworkDescription(type: DemoHomework['exercise_type'], diagnosis: string): string {
  const descriptions: Record<DemoHomework['exercise_type'], string> = {
    thought_record: 'Complete the thought record when you notice strong emotions. Identify the situation, automatic thoughts, emotions, and alternative perspectives.',
    behavioral_experiment: 'Design and carry out a behavioral experiment to test your prediction. Record what you expected vs what actually happened.',
    exposure_task: 'Practice the next step on your exposure hierarchy. Rate your anxiety before, during, and after. Remember to stay in the situation until anxiety decreases.',
    journaling: 'Write in your journal about your experiences this week. Focus on what went well, challenges faced, and insights gained.',
    mindfulness: 'Practice the guided mindfulness exercise for 10-15 minutes daily. Notice any thoughts or feelings that arise without judgment.',
    meal_planning: diagnosis.includes('Anorexia') || diagnosis.includes('Bulimia') || diagnosis.includes('ARFID')
      ? 'Complete your meal plan as discussed. Log all meals and snacks, noting any challenges or urges. Review with support person daily.'
      : 'Plan balanced meals for the week ahead. Include a variety of foods and regular eating times.',
    other: 'Complete the assigned exercise and bring your reflections to our next session.',
  };
  return descriptions[type];
}

// Generate demo assessments
const generateDemoAssessments = (clients: DemoClient[]): DemoAssessment[] => {
  const assessments: DemoAssessment[] = [];
  const now = new Date();

  clients.forEach((client) => {
    // PHQ-9 assessments over time
    for (let i = 0; i < 4; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);

      // Simulate improvement over time
      const baseScore = client.current_risk_level === 'high' ? 18 : client.current_risk_level === 'moderate' ? 12 : 6;
      const score = Math.max(0, baseScore - i * 2 + (Math.random() * 4 - 2));

      assessments.push({
        id: `assessment-phq9-${client.id}-${i}`,
        client_id: client.id,
        assessment_type: 'PHQ-9',
        score: Math.round(score),
        severity: score > 19 ? 'Severe' : score > 14 ? 'Moderately Severe' : score > 9 ? 'Moderate' : score > 4 ? 'Mild' : 'Minimal',
        notes: i === 0 ? 'Most recent assessment' : null,
        created_at: date.toISOString(),
      });
    }

    // GAD-7 assessments
    for (let i = 0; i < 3; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);

      const baseScore = client.primary_diagnosis.includes('Anxiety') ? 14 : 8;
      const score = Math.max(0, baseScore - i * 2 + (Math.random() * 3 - 1.5));

      assessments.push({
        id: `assessment-gad7-${client.id}-${i}`,
        client_id: client.id,
        assessment_type: 'GAD-7',
        score: Math.round(score),
        severity: score > 14 ? 'Severe' : score > 9 ? 'Moderate' : score > 4 ? 'Mild' : 'Minimal',
        notes: null,
        created_at: date.toISOString(),
      });
    }

    // EDE-Q for eating disorder clients
    if (client.primary_diagnosis.includes('Anorexia') || client.primary_diagnosis.includes('Bulimia') || client.primary_diagnosis.includes('ARFID')) {
      for (let i = 0; i < 3; i++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i * 2);

        const baseScore = client.current_risk_level === 'high' ? 4.5 : 3.2;
        const score = Math.max(0, baseScore - i * 0.4 + (Math.random() * 0.6 - 0.3));

        assessments.push({
          id: `assessment-edeq-${client.id}-${i}`,
          client_id: client.id,
          assessment_type: 'EDE-Q',
          score: Math.round(score * 10) / 10,
          severity: score > 4 ? 'Clinical' : score > 2.8 ? 'Subclinical' : 'Normal Range',
          notes: i === 0 ? 'Global score' : null,
          created_at: date.toISOString(),
        });
      }
    }
  });

  return assessments;
};

// Generate demo mood entries
const generateDemoMoodEntries = (clients: DemoClient[]): DemoMoodEntry[] => {
  const entries: DemoMoodEntry[] = [];
  const now = new Date();
  const emotions = ['happy', 'sad', 'anxious', 'calm', 'frustrated', 'hopeful', 'tired', 'motivated', 'overwhelmed', 'content'];

  clients.forEach((client) => {
    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Create 1-2 entries per day
      const numEntries = i % 3 === 0 ? 2 : 1;
      for (let j = 0; j < numEntries; j++) {
        const entryDate = new Date(date);
        entryDate.setHours(j === 0 ? 9 : 20, Math.floor(Math.random() * 60), 0, 0);

        // Slight trend towards improvement
        const baseRating = client.current_risk_level === 'high' ? 2 : client.current_risk_level === 'moderate' ? 3 : 4;
        const rating = Math.min(5, Math.max(1, Math.round(baseRating + (i / 14) - Math.random()))) as 1 | 2 | 3 | 4 | 5;

        const numEmotions = 1 + Math.floor(Math.random() * 3);
        const selectedEmotions = emotions.sort(() => Math.random() - 0.5).slice(0, numEmotions);

        entries.push({
          id: `mood-${client.id}-${i}-${j}`,
          client_id: client.id,
          rating,
          emotions: selectedEmotions,
          notes: i % 4 === 0 ? getMoodNote(rating) : null,
          created_at: entryDate.toISOString(),
        });
      }
    }
  });

  return entries;
};

function getMoodNote(rating: number): string {
  const notes: Record<number, string[]> = {
    1: ['Really struggling today', 'Hard day', 'Feeling overwhelmed'],
    2: ['Difficult but managing', 'Some challenges', 'Trying to use coping strategies'],
    3: ['Okay day overall', 'Mixed feelings', 'Getting through'],
    4: ['Good day', 'Feeling more positive', 'Made progress today'],
    5: ['Great day!', 'Feeling really good', 'Best day in a while'],
  };
  return notes[rating][Math.floor(Math.random() * notes[rating].length)];
}

// Generate demo crisis events
const generateDemoCrisisEvents = (clients: DemoClient[]): DemoCrisisEvent[] => {
  const events: DemoCrisisEvent[] = [];
  const now = new Date();

  clients.filter(c => c.current_risk_level === 'high' || c.current_risk_level === 'moderate').forEach((client) => {
    const numEvents = client.current_risk_level === 'high' ? 3 : 1;

    for (let i = 0; i < numEvents; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i - 1);

      events.push({
        id: `crisis-${client.id}-${i}`,
        client_id: client.id,
        event_type: i === 0 ? 'suicidal_ideation' : i === 1 ? 'self_harm' : 'crisis_call',
        severity: i === 0 ? 'high' : 'moderate',
        description: getCrisisDescription(i === 0 ? 'suicidal_ideation' : i === 1 ? 'self_harm' : 'crisis_call'),
        actions_taken: [
          'Safety plan reviewed and updated',
          'Increased session frequency',
          'Contacted emergency contact with consent',
          'Coordinated with GP for medication review',
        ].slice(0, 2 + i),
        resolved: true,
        created_at: date.toISOString(),
      });
    }
  });

  return events;
};

function getCrisisDescription(type: DemoCrisisEvent['event_type']): string {
  const descriptions: Record<DemoCrisisEvent['event_type'], string> = {
    suicidal_ideation: 'Client reported passive suicidal ideation during session. No plan or intent identified. Safety plan was reviewed and coping strategies were reinforced.',
    self_harm: 'Client disclosed recent self-harm behaviour. Wounds were superficial and did not require medical attention. Discussed triggers and alternative coping strategies.',
    hospitalization: 'Client was admitted to hospital following acute crisis. Remained for observation and stabilization. Coordinated with treating team for discharge planning.',
    crisis_call: 'Received after-hours call from client experiencing acute distress. Provided phone support and crisis intervention. Follow-up session scheduled for next day.',
    safety_plan_activation: 'Client successfully used safety plan during crisis. Contacted support person and used coping strategies. Crisis was de-escalated without need for emergency services.',
  };
  return descriptions[type];
}

// Generate demo safety plans
const generateDemoSafetyPlans = (clients: DemoClient[]): DemoSafetyPlan[] => {
  const plans: DemoSafetyPlan[] = [];
  const now = new Date();

  clients.filter(c => c.current_risk_level === 'high' || c.current_risk_level === 'moderate').forEach((client) => {
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 30));

    plans.push({
      id: `safety-plan-${client.id}`,
      client_id: client.id,
      warning_signs: [
        'Increased isolation from family and friends',
        'Changes in sleep patterns',
        'Missing meals or restricting food intake',
        'Feeling hopeless about the future',
        'Thinking about self-harm',
      ],
      coping_strategies: [
        'Practice deep breathing exercises',
        'Go for a walk outside',
        'Listen to favourite music',
        'Write in journal about feelings',
        'Use grounding technique (5-4-3-2-1)',
        'Do something creative (art, music)',
      ],
      support_people: [
        { name: client.emergency_contact_name || 'Parent', phone: client.emergency_contact_phone || '', relationship: client.emergency_contact_relationship || 'Family' },
        { name: 'Best Friend', phone: '+61 400 123 456', relationship: 'Friend' },
        { name: 'School Counselor', phone: '+61 3 9000 0001', relationship: 'School Support' },
      ],
      professional_contacts: [
        { name: 'Dr. Sarah Mitchell', phone: '+61 3 9000 0000', role: 'Psychologist' },
        { name: 'Dr. James Chen', phone: '+61 3 9000 0002', role: 'Psychiatrist' },
        { name: 'Clinic Reception', phone: '+61 3 9000 0003', role: 'After-hours support' },
      ],
      crisis_helplines: [
        { name: 'Lifeline', phone: '13 11 14' },
        { name: 'Kids Helpline', phone: '1800 55 1800' },
        { name: 'Butterfly Foundation', phone: '1800 33 4673' },
        { name: 'Beyond Blue', phone: '1300 22 4636' },
      ],
      reasons_to_live: [
        'My family who loves and supports me',
        'My pet dog/cat',
        'Future goals and dreams',
        'Things I want to experience',
        'People who would miss me',
      ],
      safe_environment_steps: [
        'Remove or secure any medications',
        'Keep sharp objects out of easy reach',
        'Stay in common areas when distressed',
        'Give phone to parent during crisis',
      ],
      last_reviewed: reviewDate.toISOString(),
      created_at: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  return plans;
};

// Generate demo alerts
const generateDemoAlerts = (clients: DemoClient[], homework: DemoHomework[]): DemoAlert[] => {
  const now = new Date();
  const alerts: DemoAlert[] = [];

  // High-risk client alerts
  const highRiskClients = clients.filter(
    (c) => c.current_risk_level === 'high' || c.current_risk_level === 'critical'
  );

  highRiskClients.forEach((client) => {
    alerts.push({
      type: 'critical',
      title: `High Risk: ${client.first_name} ${client.last_name}`,
      message: 'Safety plan review recommended before next session.',
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      client_id: client.id,
    });
  });

  // Overdue homework alerts
  const overdueHomework = homework.filter(h => h.status === 'overdue');
  overdueHomework.slice(0, 3).forEach((hw) => {
    const client = clients.find(c => c.id === hw.client_id);
    if (client) {
      alerts.push({
        type: 'warning',
        title: 'Overdue Homework',
        message: `${client.first_name} ${client.last_name}: "${hw.title}" is overdue.`,
        time: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        client_id: client.id,
      });
    }
  });

  // Assessment due alerts
  alerts.push({
    type: 'warning',
    title: 'PHQ-9 Due',
    message: 'Emma Thompson is due for a PHQ-9 assessment.',
    time: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    client_id: 'client-1',
  });

  // Info alerts
  alerts.push({
    type: 'info',
    title: 'New Mood Entry',
    message: 'Liam Nguyen logged a mood entry with notes.',
    time: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    client_id: 'client-2',
  });

  alerts.push({
    type: 'info',
    title: 'Homework Completed',
    message: 'Sophie Williams completed thought record homework.',
    time: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    client_id: 'client-3',
  });

  return alerts;
};

export function useDemoData() {
  const clients = useMemo(() => generateDemoClients(), []);
  const sessions = useMemo(() => generateDemoSessions(clients), [clients]);
  const notes = useMemo(() => generateDemoNotes(clients, sessions), [clients, sessions]);
  const homework = useMemo(() => generateDemoHomework(clients), [clients]);
  const assessments = useMemo(() => generateDemoAssessments(clients), [clients]);
  const moodEntries = useMemo(() => generateDemoMoodEntries(clients), [clients]);
  const crisisEvents = useMemo(() => generateDemoCrisisEvents(clients), [clients]);
  const safetyPlans = useMemo(() => generateDemoSafetyPlans(clients), [clients]);
  const alerts = useMemo(() => generateDemoAlerts(clients, homework), [clients, homework]);

  return {
    clients,
    sessions,
    notes,
    homework,
    assessments,
    moodEntries,
    crisisEvents,
    safetyPlans,
    alerts,
  };
}

export type {
  DemoClient,
  DemoSession,
  DemoNote,
  DemoHomework,
  DemoAssessment,
  DemoMoodEntry,
  DemoCrisisEvent,
  DemoSafetyPlan,
  DemoAlert
};
