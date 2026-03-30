import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { SessionSentiment } from '@/lib/ai/types';

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  const supabase = getClient();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 503 });

  // Fetch session + note
  const [sessionRes, noteRes] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, scheduled_start, duration_minutes, client_id')
      .eq('id', sessionId)
      .single(),
    supabase
      .from('clinical_notes')
      .select('content, note_format, transcript')
      .eq('session_id', sessionId)
      .single(),
  ]);

  const session = sessionRes.data;
  const note = noteRes.data;

  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  if (!note) return NextResponse.json({ error: 'No note found for this session. Generate a note first.' }, { status: 404 });

  const contentText = note.transcript
    ? `TRANSCRIPT:\n${note.transcript}`
    : `SESSION NOTE (${note.note_format}):\n${JSON.stringify(note.content)}`;

  const duration = session.duration_minutes || 50;

  const prompt = `You are analyzing a therapy session note for clinical sentiment analysis.

Based on the session content, generate a structured sentiment analysis as JSON matching this exact TypeScript interface:

interface SessionSentiment {
  sessionId: string;
  clientId: string;
  sessionDate: string; // ISO string
  duration: number; // minutes
  timeline: Array<{
    timestamp: number; // seconds into session
    sentiment: 'positive' | 'neutral' | 'negative';
    intensity: number; // 0-100
    topic?: string;
    speaker: 'client' | 'clinician';
  }>;
  summary: {
    overallTone: string; // 1 sentence description
    averageSentiment: number; // -100 to 100
    peakPositive: { time: number; context: string; intensity: number } | null;
    peakNegative: { time: number; context: string; intensity: number } | null;
    turningPoints: Array<{ time: number; from: string; to: string; trigger?: string }>;
    dominantEmotions: string[]; // 3-5 emotion words
  };
  insights: string[]; // 3-4 clinical insights
}

SESSION DURATION: ${duration} minutes
${contentText.slice(0, 2500)}

Generate 8-12 timeline entries spread across the session duration.
Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const claude = new Anthropic({ apiKey });

    const msg = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (msg.content[0] as { text: string }).text.trim();
    const json = raw.startsWith('{') ? raw : raw.slice(raw.indexOf('{'));
    const sentiment: SessionSentiment = JSON.parse(json);

    // Patch real IDs
    sentiment.sessionId = sessionId;
    sentiment.clientId = session.client_id;
    sentiment.sessionDate = session.scheduled_start;
    sentiment.duration = duration;

    return NextResponse.json(sentiment);
  } catch (err: any) {
    console.error('Sentiment AI error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
