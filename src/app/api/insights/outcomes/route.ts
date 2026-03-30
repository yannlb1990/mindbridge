import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { OutcomeDashboard } from '@/lib/ai/types';

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const ASSESSMENT_FULL_NAMES: Record<string, string> = {
  PHQ9: 'Patient Health Questionnaire (PHQ-9)',
  'PHQ-9': 'Patient Health Questionnaire (PHQ-9)',
  GAD7: 'Generalised Anxiety Disorder Scale (GAD-7)',
  'GAD-7': 'Generalised Anxiety Disorder Scale (GAD-7)',
  K10: 'Kessler Psychological Distress Scale (K-10)',
  DASS21: 'Depression Anxiety Stress Scales (DASS-21)',
  'DASS-21': 'Depression Anxiety Stress Scales (DASS-21)',
};

const SEVERITY_LABELS: Record<string, (score: number) => string> = {
  PHQ9: (s) => s <= 4 ? 'Minimal' : s <= 9 ? 'Mild' : s <= 14 ? 'Moderate' : s <= 19 ? 'Moderately Severe' : 'Severe',
  'PHQ-9': (s) => s <= 4 ? 'Minimal' : s <= 9 ? 'Mild' : s <= 14 ? 'Moderate' : s <= 19 ? 'Moderately Severe' : 'Severe',
  GAD7: (s) => s <= 4 ? 'Minimal' : s <= 9 ? 'Mild' : s <= 14 ? 'Moderate' : 'Severe',
  'GAD-7': (s) => s <= 4 ? 'Minimal' : s <= 9 ? 'Mild' : s <= 14 ? 'Moderate' : 'Severe',
  K10: (s) => s <= 15 ? 'Likely well' : s <= 21 ? 'Mild distress' : s <= 29 ? 'Moderate distress' : 'Severe distress',
  DASS21: (s) => s <= 9 ? 'Normal' : s <= 13 ? 'Mild' : s <= 20 ? 'Moderate' : s <= 27 ? 'Severe' : 'Extremely Severe',
  'DASS-21': (s) => s <= 9 ? 'Normal' : s <= 13 ? 'Mild' : s <= 20 ? 'Moderate' : s <= 27 ? 'Severe' : 'Extremely Severe',
};

function getSeverity(type: string, score: number): string {
  const fn = SEVERITY_LABELS[type];
  return fn ? fn(score) : 'Unknown';
}

// Reliable Change Index thresholds (standard clinical values)
const RCI_THRESHOLD: Record<string, number> = {
  'PHQ9': 5, 'PHQ-9': 5,
  'GAD7': 4, 'GAD-7': 4,
  'K10': 5,
  'DASS21': 6, 'DASS-21': 6,
};

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('clientId');
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 });

  const supabase = getClient();

  const [clientRes, assessmentsRes, sessionsRes, homeworkRes, moodRes] = await Promise.all([
    supabase
      .from('client_profiles')
      .select('*, user:users!client_profiles_user_id_fkey(first_name, last_name)')
      .eq('user_id', clientId)
      .single(),
    supabase
      .from('assessments')
      .select('assessment_type, score, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true }),
    supabase
      .from('sessions')
      .select('id, scheduled_start, status')
      .eq('client_id', clientId)
      .order('scheduled_start', { ascending: true }),
    supabase
      .from('homework_assignments')
      .select('status')
      .eq('client_id', clientId),
    supabase
      .from('mood_entries')
      .select('mood_score, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true })
      .limit(60),
  ]);

  const client = clientRes.data;
  const assessments = assessmentsRes.data || [];
  const sessions = sessionsRes.data || [];
  const homework = homeworkRes.data || [];
  const moodEntries = moodRes.data || [];

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const clientUser = Array.isArray(client.user) ? client.user[0] : (client.user as any);
  const clientName = `${clientUser?.first_name || ''} ${clientUser?.last_name || ''}`.trim();

  // Build assessment sections grouped by type
  const byType: Record<string, typeof assessments> = {};
  for (const a of assessments) {
    const t = a.assessment_type;
    if (!byType[t]) byType[t] = [];
    byType[t].push(a);
  }

  const assessmentSections = Object.entries(byType).map(([type, entries]) => {
    const scores = entries.map((e: any) => ({
      date: new Date(e.created_at),
      score: e.score,
      severity: getSeverity(type, e.score),
    }));
    const first = scores[0]?.score ?? 0;
    const last = scores[scores.length - 1]?.score ?? 0;
    const diff = last - first;
    const trend = diff < -(RCI_THRESHOLD[type] ?? 5) ? 'improving'
      : diff > (RCI_THRESHOLD[type] ?? 5) ? 'worsening'
      : 'stable';
    return {
      type,
      fullName: ASSESSMENT_FULL_NAMES[type] || type,
      scores,
      trend: trend as 'improving' | 'stable' | 'worsening',
      clinicallySignificantChange: Math.abs(diff) >= (RCI_THRESHOLD[type] ?? 5),
      reliableChangeIndex: Math.round(Math.abs(diff) / (RCI_THRESHOLD[type] ?? 5) * 10) / 10,
    };
  });

  // Overall progress — average across all assessment types
  const allFirst = assessmentSections.map(a => a.scores[0]?.score ?? 0);
  const allLast = assessmentSections.map(a => a.scores[a.scores.length - 1]?.score ?? 0);
  const startScore = allFirst.length ? Math.round(allFirst.reduce((a, b) => a + b, 0) / allFirst.length) : 0;
  const currentScore = allLast.length ? Math.round(allLast.reduce((a, b) => a + b, 0) / allLast.length) : 0;
  const percentImprovement = startScore > 0 ? Math.round(((startScore - currentScore) / startScore) * 100) : 0;

  const completedSessions = sessions.filter((s: any) => s.status === 'completed').length;
  const treatmentStart = sessions[0]
    ? new Date(sessions[0].scheduled_start)
    : new Date(client.created_at || Date.now());

  // Goals from assessments
  const goals = assessmentSections.map(a => ({
    id: a.type,
    goal: `Achieve minimal ${a.type} score`,
    targetDate: undefined,
    progress: Math.max(0, Math.min(100, startScore > 0 ? Math.round(((startScore - (a.scores[a.scores.length - 1]?.score ?? startScore)) / startScore) * 100) : 0)),
    status: (a.trend === 'improving' ? 'on-track'
      : a.trend === 'worsening' ? 'at-risk'
      : 'behind') as 'on-track' | 'behind' | 'achieved' | 'at-risk',
    milestones: [],
  }));

  // Mood trend
  const moodData = moodEntries.map((e: any) => ({ date: new Date(e.created_at), rating: e.mood_score || 5 }));
  const avgMood = moodData.length ? Math.round(moodData.reduce((s: any, e: any) => s + e.rating, 0) / moodData.length * 10) / 10 : 5;
  const firstMoods = moodData.slice(0, 5).map((e: any) => e.rating);
  const lastMoods = moodData.slice(-5).map((e: any) => e.rating);
  const firstAvg = firstMoods.length ? firstMoods.reduce((a: any, b: any) => a + b, 0) / firstMoods.length : avgMood;
  const lastAvg = lastMoods.length ? lastMoods.reduce((a: any, b: any) => a + b, 0) / lastMoods.length : avgMood;
  const moodTrendDir = lastAvg > firstAvg + 0.5 ? 'improving' : lastAvg < firstAvg - 0.5 ? 'declining' : 'stable';

  // Engagement
  const attendanceRate = sessions.length ? Math.round((completedSessions / sessions.length) * 100) : 100;
  const completedHw = homework.filter((h: any) => h.status === 'completed').length;
  const hwRate = homework.length ? Math.round((completedHw / homework.length) * 100) : 0;

  // Phase
  const currentPhase = completedSessions < 3 ? 'Assessment'
    : percentImprovement >= 50 ? 'Maintenance'
    : 'Active Treatment';

  const dashboard: OutcomeDashboard = {
    clientId,
    clientName,
    treatmentStartDate: treatmentStart,
    currentPhase,
    assessments: assessmentSections,
    goals,
    overallProgress: {
      startScore,
      currentScore,
      percentImprovement,
      sessionsCompleted: completedSessions,
      estimatedSessionsRemaining: Math.max(0, 20 - completedSessions),
      projectedEndDate: null,
    },
    moodTrend: {
      data: moodData,
      average: avgMood,
      trend: moodTrendDir,
    },
    engagementMetrics: {
      attendanceRate,
      homeworkCompletionRate: hwRate,
      appUsageFrequency: moodData.length > 0 ? Math.round(moodData.length / Math.max(1, completedSessions)) : 0,
    },
  };

  return NextResponse.json(dashboard);
}
