// Demo data for AI features
import { SessionSentiment, SessionPrep, OutcomeDashboard, SentimentTimelineEntry } from './types';

// Generate sentiment timeline for demo
function generateSentimentTimeline(duration: number): SentimentTimelineEntry[] {
  const entries: SentimentTimelineEntry[] = [];
  const topics = [
    'Greeting/check-in',
    'Work stress discussion',
    'Family relationships',
    'Coping strategies review',
    'Upcoming challenges',
    'Homework review',
    'Treatment progress',
    'Session wrap-up',
  ];

  // Simulate a typical session flow
  const patterns = [
    { start: 0, end: 5, sentiment: 'neutral' as const, intensityBase: 50 },
    { start: 5, end: 15, sentiment: 'negative' as const, intensityBase: 65 },
    { start: 15, end: 25, sentiment: 'negative' as const, intensityBase: 75 },
    { start: 25, end: 35, sentiment: 'neutral' as const, intensityBase: 55 },
    { start: 35, end: 45, sentiment: 'positive' as const, intensityBase: 60 },
    { start: 45, end: 50, sentiment: 'positive' as const, intensityBase: 70 },
  ];

  for (let minute = 0; minute < Math.min(duration, 50); minute += 2) {
    const pattern = patterns.find(p => minute >= p.start && minute < p.end);
    if (pattern) {
      entries.push({
        timestamp: minute * 60,
        sentiment: pattern.sentiment,
        intensity: pattern.intensityBase + Math.floor(Math.random() * 20 - 10),
        topic: topics[Math.floor(minute / 7)] || 'Discussion',
        speaker: Math.random() > 0.4 ? 'client' : 'clinician',
      });
    }
  }

  return entries;
}

export const demoSessionSentiments: SessionSentiment[] = [
  {
    sessionId: 'session-001',
    clientId: 'client-001',
    sessionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 50,
    timeline: generateSentimentTimeline(50),
    summary: {
      overallTone: 'Cautiously optimistic with moments of vulnerability',
      averageSentiment: 15,
      peakPositive: { time: 45 * 60, context: 'Client expressed hope about new coping strategies', intensity: 78 },
      peakNegative: { time: 18 * 60, context: 'Discussion of workplace conflict with supervisor', intensity: 82 },
      turningPoints: [
        { time: 25 * 60, from: 'negative', to: 'neutral', trigger: 'Reframing of situation' },
        { time: 38 * 60, from: 'neutral', to: 'positive', trigger: 'Recognition of progress made' },
      ],
      dominantEmotions: ['anxiety', 'frustration', 'hope', 'relief'],
    },
    insights: [
      'Client showed increased emotional regulation compared to last session',
      'Work-related topics consistently trigger negative sentiment',
      'Positive shift occurred after discussing concrete coping strategies',
      'Client demonstrates self-awareness when discussing emotional patterns',
    ],
  },
  {
    sessionId: 'session-002',
    clientId: 'client-002',
    sessionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 50,
    timeline: generateSentimentTimeline(50),
    summary: {
      overallTone: 'Reflective with underlying sadness',
      averageSentiment: -10,
      peakPositive: { time: 42 * 60, context: 'Discussed supportive relationship with sister', intensity: 65 },
      peakNegative: { time: 12 * 60, context: 'Grief processing - anniversary of loss', intensity: 88 },
      turningPoints: [
        { time: 30 * 60, from: 'negative', to: 'neutral', trigger: 'Validation of grief experience' },
      ],
      dominantEmotions: ['sadness', 'grief', 'love', 'acceptance'],
    },
    insights: [
      'Grief work is progressing appropriately',
      'Client is beginning to integrate positive memories',
      'Family support remains a protective factor',
      'May benefit from additional grief-focused interventions',
    ],
  },
  {
    sessionId: 'session-003',
    clientId: 'client-003',
    sessionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 50,
    timeline: generateSentimentTimeline(50),
    summary: {
      overallTone: 'Engaged and motivated',
      averageSentiment: 35,
      peakPositive: { time: 40 * 60, context: 'Celebrated completing exposure hierarchy step', intensity: 85 },
      peakNegative: { time: 8 * 60, context: 'Anticipatory anxiety about upcoming exposure', intensity: 70 },
      turningPoints: [
        { time: 15 * 60, from: 'negative', to: 'neutral', trigger: 'Psychoeducation on anxiety curve' },
        { time: 35 * 60, from: 'neutral', to: 'positive', trigger: 'Successful in-session exposure' },
      ],
      dominantEmotions: ['anxiety', 'determination', 'pride', 'relief'],
    },
    insights: [
      'Exposure therapy is showing clear positive effects',
      'Client demonstrates strong commitment to treatment',
      'In-session exposures correlate with positive sentiment shifts',
      'Consider increasing exposure difficulty next session',
    ],
  },
];

export const demoSessionPreps: SessionPrep[] = [
  {
    clientId: 'client-001',
    clientName: 'Sarah Mitchell',
    sessionDate: new Date(),
    summary: {
      lastSessionHighlights: [
        'Discussed workplace anxiety and conflict with supervisor',
        'Introduced cognitive restructuring techniques',
        'Assigned thought record homework',
        'Client expressed motivation for change',
      ],
      lastSessionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      homeworkStatus: { completed: 2, assigned: 3, overdue: 1 },
      moodTrend: 'improving',
      averageMoodScore: 3.2,
      recentConcerns: [
        'Sleep difficulties (3 mentions this week)',
        'Work deadline stress',
        'Relationship with mother',
      ],
      riskLevel: 'low',
      riskChange: 'stable',
    },
    suggestedAgenda: [
      {
        priority: 1,
        topic: 'Review thought record homework',
        rationale: 'Client completed 2/3 assigned exercises - discuss patterns identified',
        timeEstimate: 10,
        type: 'homework-review',
      },
      {
        priority: 2,
        topic: 'Address sleep difficulties',
        rationale: 'Mentioned in mood journal 3 times this week - may be impacting anxiety',
        timeEstimate: 15,
        type: 'new-topic',
      },
      {
        priority: 3,
        topic: 'Follow up on workplace situation',
        rationale: 'Primary stressor from last session - check on progress',
        timeEstimate: 15,
        type: 'follow-up',
      },
      {
        priority: 4,
        topic: 'Introduce sleep hygiene strategies',
        rationale: 'Complements anxiety work and addresses emerging concern',
        timeEstimate: 10,
        type: 'new-topic',
      },
    ],
    preparedResources: [
      { type: 'worksheet', name: 'Sleep Hygiene Checklist', description: 'Evidence-based sleep improvement strategies' },
      { type: 'psychoeducation', name: 'Anxiety-Sleep Connection', description: 'Handout on bidirectional relationship' },
      { type: 'exercise', name: 'Progressive Muscle Relaxation', description: 'Guided relaxation for bedtime routine' },
    ],
    alerts: [
      { type: 'info', message: '1 homework assignment overdue - thought record #3' },
      { type: 'info', message: 'PHQ-9 due for reassessment (last completed 4 weeks ago)' },
    ],
    treatmentProgress: {
      goals: [
        { goal: 'Reduce workplace anxiety', progress: 35, status: 'on-track' },
        { goal: 'Improve sleep quality', progress: 15, status: 'behind' },
        { goal: 'Develop assertiveness skills', progress: 25, status: 'on-track' },
      ],
      sessionsCompleted: 6,
      estimatedRemaining: 10,
    },
  },
  {
    clientId: 'client-002',
    clientName: 'James Chen',
    sessionDate: new Date(),
    summary: {
      lastSessionHighlights: [
        'Processed grief related to father\'s passing',
        'Explored meaning-making and legacy',
        'Discussed return to work plans',
      ],
      lastSessionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      homeworkStatus: { completed: 1, assigned: 2, overdue: 0 },
      moodTrend: 'stable',
      averageMoodScore: 2.8,
      recentConcerns: [
        'Anniversary of father\'s death approaching',
        'Pressure from work to return full-time',
        'Difficulty concentrating',
      ],
      riskLevel: 'moderate',
      riskChange: 'stable',
    },
    suggestedAgenda: [
      {
        priority: 1,
        topic: 'Anniversary preparation',
        rationale: 'Father\'s death anniversary in 2 weeks - proactive planning',
        timeEstimate: 15,
        type: 'crisis',
      },
      {
        priority: 2,
        topic: 'Return to work planning',
        rationale: 'Ongoing stressor - work with client on gradual return plan',
        timeEstimate: 15,
        type: 'follow-up',
      },
      {
        priority: 3,
        topic: 'Review grief journaling',
        rationale: 'Check on homework completion and themes emerging',
        timeEstimate: 10,
        type: 'homework-review',
      },
      {
        priority: 4,
        topic: 'Concentration difficulties',
        rationale: 'May need assessment - common in grief but worth monitoring',
        timeEstimate: 10,
        type: 'assessment',
      },
    ],
    preparedResources: [
      { type: 'worksheet', name: 'Anniversary Planning Guide', description: 'Strategies for navigating difficult dates' },
      { type: 'exercise', name: 'Letter to Loved One', description: 'Continuing bonds exercise' },
      { type: 'assessment', name: 'PCL-5', description: 'Screen for trauma symptoms if indicated' },
    ],
    alerts: [
      { type: 'warning', message: 'Anniversary of loss approaching (Feb 25) - ensure safety plan is current' },
      { type: 'info', message: 'Moderate risk level - continue monitoring' },
    ],
    treatmentProgress: {
      goals: [
        { goal: 'Process grief adaptively', progress: 45, status: 'on-track' },
        { goal: 'Return to work', progress: 30, status: 'on-track' },
        { goal: 'Rebuild social connections', progress: 20, status: 'behind' },
      ],
      sessionsCompleted: 8,
      estimatedRemaining: 8,
    },
  },
];

export const demoOutcomeDashboards: OutcomeDashboard[] = [
  {
    clientId: 'client-001',
    clientName: 'Sarah Mitchell',
    treatmentStartDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    currentPhase: 'Active Treatment - Skill Building',
    assessments: [
      {
        type: 'PHQ-9',
        fullName: 'Patient Health Questionnaire-9',
        scores: [
          { date: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000), score: 18, severity: 'Moderately Severe' },
          { date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), score: 15, severity: 'Moderate' },
          { date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), score: 12, severity: 'Moderate' },
          { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), score: 9, severity: 'Mild' },
        ],
        trend: 'improving',
        clinicallySignificantChange: true,
        reliableChangeIndex: 2.1,
      },
      {
        type: 'GAD-7',
        fullName: 'Generalized Anxiety Disorder-7',
        scores: [
          { date: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000), score: 16, severity: 'Severe' },
          { date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), score: 14, severity: 'Moderate' },
          { date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), score: 11, severity: 'Moderate' },
          { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), score: 8, severity: 'Mild' },
        ],
        trend: 'improving',
        clinicallySignificantChange: true,
        reliableChangeIndex: 1.9,
      },
    ],
    goals: [
      {
        id: 'goal-1',
        goal: 'Reduce workplace anxiety to manageable levels',
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: 45,
        status: 'on-track',
        milestones: [
          { description: 'Identify anxiety triggers', completed: true, date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000) },
          { description: 'Learn 3 coping strategies', completed: true, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
          { description: 'Apply strategies in workplace', completed: false },
          { description: 'Maintain GAD-7 < 10', completed: false },
        ],
      },
      {
        id: 'goal-2',
        goal: 'Improve sleep quality to 7+ hours/night',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: 25,
        status: 'behind',
        milestones: [
          { description: 'Establish consistent sleep schedule', completed: true, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
          { description: 'Implement sleep hygiene routine', completed: false },
          { description: 'Reduce screen time before bed', completed: false },
          { description: 'Achieve 7+ hours for 1 week', completed: false },
        ],
      },
      {
        id: 'goal-3',
        goal: 'Develop assertiveness in professional settings',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progress: 30,
        status: 'on-track',
        milestones: [
          { description: 'Understand assertiveness vs aggression', completed: true, date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) },
          { description: 'Practice assertive statements in session', completed: true, date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
          { description: 'Use assertive communication at work', completed: false },
          { description: 'Handle conflict assertively', completed: false },
        ],
      },
    ],
    overallProgress: {
      startScore: 17, // Average of initial PHQ-9 and GAD-7
      currentScore: 8.5,
      percentImprovement: 50,
      sessionsCompleted: 8,
      estimatedSessionsRemaining: 8,
      projectedEndDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000),
    },
    moodTrend: {
      data: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        rating: 2.5 + Math.random() * 1.5 + (i * 0.05),
      })),
      average: 3.2,
      trend: 'improving',
    },
    engagementMetrics: {
      attendanceRate: 100,
      homeworkCompletionRate: 75,
      appUsageFrequency: 4.2,
    },
  },
];

export function getSessionSentiment(sessionId: string): SessionSentiment | undefined {
  return demoSessionSentiments.find(s => s.sessionId === sessionId);
}

export function getSessionPrep(clientId: string): SessionPrep | undefined {
  return demoSessionPreps.find(p => p.clientId === clientId);
}

export function getOutcomeDashboard(clientId: string): OutcomeDashboard | undefined {
  return demoOutcomeDashboards.find(d => d.clientId === clientId);
}
