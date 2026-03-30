import { NextRequest, NextResponse } from 'next/server';

interface SessionCaptureResponse {
  transcript: string;
  note: string;
  tasks: Array<{
    description: string;
    type: 'clinician' | 'client';
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
  insights: Array<{
    type: 'progress' | 'concern' | 'recommendation' | 'milestone';
    content: string;
  }>;
}

const NOTE_FORMAT_PROMPTS: Record<string, string> = {
  SOAP: `Generate a SOAP note with these exact sections:
**SUBJECTIVE:** (what the client reported)
**OBJECTIVE:** (clinician observations)
**ASSESSMENT:** (clinical impression and diagnosis update)
**PLAN:** (treatment plan, homework, next steps)`,
  DAP: `Generate a DAP note with these exact sections:
**DATA:** (what was observed and reported)
**ASSESSMENT:** (clinical interpretation)
**PLAN:** (next steps and interventions)`,
  BIRP: `Generate a BIRP note with these exact sections:
**BEHAVIOR:** (client's behavior and reported symptoms)
**INTERVENTION:** (therapeutic interventions used)
**RESPONSE:** (client's response to interventions)
**PLAN:** (follow-up plan)`,
  narrative: `Generate a narrative note in flowing paragraph format covering: presenting issues, interventions used, client response, and treatment plan.`,
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const noteFormat = (formData.get('noteFormat') as string) || 'SOAP';
    const clientName = (formData.get('clientName') as string) || 'the client';
    const manualTranscript = formData.get('transcript') as string | null;

    let transcript = manualTranscript || '';

    // Step 1: Transcribe audio if provided
    if (audioFile && audioFile.size > 0) {
      const openaiKey = process.env.OPENAI_API_KEY;

      if (openaiKey) {
        // Use OpenAI Whisper for transcription
        const whisperForm = new FormData();
        whisperForm.append('file', audioFile, 'session.webm');
        whisperForm.append('model', 'whisper-1');
        whisperForm.append('language', 'en');
        whisperForm.append('prompt', 'This is a psychotherapy session between a clinician and a client. Transcribe accurately including speaker turns.');

        const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${openaiKey}` },
          body: whisperForm,
        });

        if (whisperRes.ok) {
          const whisperData = await whisperRes.json();
          transcript = whisperData.text || '';
        }
      } else {
        // Fallback: use AssemblyAI if configured
        const assemblyKey = process.env.ASSEMBLYAI_API_KEY;
        if (assemblyKey) {
          const audioBuffer = await audioFile.arrayBuffer();
          const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
            method: 'POST',
            headers: { authorization: assemblyKey, 'Content-Type': 'application/octet-stream' },
            body: audioBuffer,
          });
          const { upload_url } = await uploadRes.json();

          const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: { authorization: assemblyKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio_url: upload_url, speaker_labels: true }),
          });
          const { id } = await transcriptRes.json();

          // Poll for completion
          for (let i = 0; i < 30; i++) {
            await new Promise((r) => setTimeout(r, 3000));
            const poll = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
              headers: { authorization: assemblyKey },
            });
            const result = await poll.json();
            if (result.status === 'completed') {
              transcript = result.text || '';
              break;
            }
            if (result.status === 'error') break;
          }
        }
      }
    }

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript available' }, { status: 400 });
    }

    // Step 2: Generate clinical note, tasks, and insights via Claude
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const claude = new Anthropic({ apiKey });

    const systemPrompt = `You are an expert clinical psychologist assistant helping a clinician document a therapy session.
You produce accurate, professional clinical documentation following Australian psychology standards.
Always use person-first language. Maintain clinical objectivity. Never invent information not present in the transcript.
Respond ONLY with valid JSON — no markdown fences, no commentary.`;

    const userPrompt = `Client name: ${clientName}
Note format requested: ${noteFormat}

Session transcript:
${transcript}

${NOTE_FORMAT_PROMPTS[noteFormat] || NOTE_FORMAT_PROMPTS.SOAP}

Also extract:
1. Action items (tasks) — things the clinician needs to do (follow-up, referrals, letters, etc.) and things assigned to the client (homework, exercises, readings)
2. Session insights — progress indicators, concerns, recommendations, or milestones

Respond with this exact JSON structure:
{
  "note": "the formatted clinical note as a single string with markdown formatting",
  "tasks": [
    {
      "description": "task description",
      "type": "clinician or client",
      "priority": "high, medium, or low",
      "category": "e.g. follow-up, homework, referral, documentation, exercise"
    }
  ],
  "insights": [
    {
      "type": "progress, concern, recommendation, or milestone",
      "content": "brief insight description"
    }
  ]
}`;

    const message = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const parsed = JSON.parse(text);

    const response: SessionCaptureResponse = {
      transcript,
      note: parsed.note || '',
      tasks: parsed.tasks || [],
      insights: parsed.insights || [],
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('Session capture error:', err);
    return NextResponse.json({ error: err.message || 'Processing failed' }, { status: 500 });
  }
}
