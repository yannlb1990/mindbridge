import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { SessionPrep } from '@/lib/ai/types';

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('clientId');
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 });

  const supabase = getClient();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 503 });

  // Fetch all data in parallel
  const [clientRes, sessionsRes, notesRes, homeworkRes, moodRes] = await Promise.all([
    supabase
      .from('client_profiles')
      .select('*, user:users!client_profiles_user_id_fkey(first_name, last_name, email)')
      .eq('user_id', clientId)
      .single(),
    supabase
      .from('sessions')
      .select('id, scheduled_start, session_type, status, duration_minutes')
      .eq('client_id', clientId)
      .order('scheduled_start', { ascending: false })
      .limit(6),
    supabase
      .from('clinical_notes')
      .select('id, note_format, content, created_at, session_id')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('homework_assignments')
      .select('id, title, status, due_date')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('mood_entries')
      .select('mood_score, mood_label, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(14),
  ]);

  const client = clientRes.data;
  const sessions = sessionsRes.data || [];
  const notes = notesRes.data || [];
  const homework = homeworkRes.data || [];
  const moodEntries = moodRes.data || [];

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const clientUser = Array.isArray(client.user) ? client.user[0] : (client.user as any);
  const clientName = `${clientUser?.first_name || ''} ${clientUser?.last_name || ''}`.trim();

  const completedHw = homework.filter(h => h.status === 'completed').length;
  const overdueHw = homework.filter(h => h.status === 'overdue').length;
  const lastNote = notes[0];
  const lastSession = sessions.find(s => s.status === 'completed');
  const avgMood = moodEntries.length
    ? Math.round(moodEntries.reduce((s, e) => s + (e.mood_score || 5), 0) / moodEntries.length)
    : null;

  const contextBlock = `
CLIENT: ${clientName}
Diagnosis: ${client.primary_diagnosis || 'Not specified'}
Risk level: ${client.current_risk_level || 'low'}
Sessions completed: ${sessions.filter(s => s.status === 'completed').length}
Last session: ${lastSession ? new Date(lastSession.scheduled_start).toLocaleDateString('en-AU') : 'None recorded'}
Homework: ${completedHw} completed, ${overdueHw} overdue of ${homework.length} assigned
Average mood (last 14 days): ${avgMood !== null ? `${avgMood}/10` : 'No data'}
${lastNote ? `\nMost recent note (${lastNote.note_format}):\n${JSON.stringify(lastNote.content).slice(0, 1200)}` : ''}
`.trim();

  const prompt = `You are a clinical assistant helping a psychologist prepare for an upcoming session.

Based on this client data, generate a structured session preparation brief as JSON matching this exact TypeScript interface:

interface SessionPrep {
  clientId: string;
  clientName: string;
  sessionDate: string; // ISO string
  summary: {
    lastSessionHighlights: string[]; // 2-4 bullet points
    lastSessionDate: string | null; // ISO string or null
    homeworkStatus: { completed: number; assigned: number; overdue: number };
    moodTrend: 'improving' | 'stable' | 'declining';
    averageMoodScore: number; // 1-10
    recentConcerns: string[]; // 2-3 items
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskChange: 'increased' | 'stable' | 'decreased';
  };
  suggestedAgenda: Array<{
    priority: number; // 1-5
    topic: string;
    rationale: string;
    timeEstimate: number; // minutes
    type: 'follow-up' | 'new-topic' | 'assessment' | 'crisis' | 'homework-review';
  }>;
  preparedResources: Array<{
    type: 'worksheet' | 'assessment' | 'psychoeducation' | 'exercise';
    name: string;
    description: string;
  }>;
  alerts: Array<{
    type: 'warning' | 'info' | 'urgent';
    message: string;
  }>;
  treatmentProgress: {
    goals: Array<{ goal: string; progress: number; status: 'on-track' | 'behind' | 'achieved' }>;
    sessionsCompleted: number;
    estimatedRemaining: number;
  };
}

CLIENT DATA:
${contextBlock}

Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const claude = new Anthropic({ apiKey });

    const msg = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (msg.content[0] as { text: string }).text.trim();
    const json = raw.startsWith('{') ? raw : raw.slice(raw.indexOf('{'));
    const prep: SessionPrep = JSON.parse(json);

    // Patch in real values
    prep.clientId = clientId;
    prep.clientName = clientName;
    prep.sessionDate = new Date();
    prep.summary.homeworkStatus = { completed: completedHw, assigned: homework.length, overdue: overdueHw };
    if (avgMood !== null) prep.summary.averageMoodScore = avgMood;

    return NextResponse.json(prep);
  } catch (err: any) {
    console.error('Session prep AI error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
