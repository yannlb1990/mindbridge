import { NextRequest, NextResponse } from 'next/server';

export interface EmotionCoachRequest {
  situation: string;
  emotions: string[];
  ageGroup: 'child' | 'teen' | 'adult';
  note?: string;
}

export interface EmotionCoachResponse {
  validation: string;
  normalisation: string;
  strategies: string[];
  encouragement: string;
  severity: 'positive' | 'mixed' | 'negative' | 'concerning';
}

function deriveSeverity(emotions: string[]): 'positive' | 'mixed' | 'negative' | 'concerning' {
  const lower = emotions.map((e) => e.toLowerCase());
  const concerning = ['scared', 'overwhelmed', 'hopeless', 'worthless'];
  const negative = ['sad', 'angry', 'worried', 'lonely', 'nervous', 'frustrated', 'anxious', 'hurt', 'guilty'];
  const positive = ['happy', 'excited', 'calm', 'proud', 'grateful', 'loved', 'hopeful', 'content', 'silly'];

  const hasConcerning = lower.some((e) => concerning.some((c) => e.includes(c)));
  const hasAngryAndSad = lower.some((e) => e.includes('angry') || e.includes('mad')) &&
    lower.some((e) => e.includes('sad') || e.includes('hurt'));
  if (hasConcerning || hasAngryAndSad) return 'concerning';

  const negCount = lower.filter((e) => negative.some((n) => e.includes(n))).length;
  const posCount = lower.filter((e) => positive.some((p) => e.includes(p))).length;

  if (posCount > 0 && negCount === 0) return 'positive';
  if (negCount > 0 && posCount === 0) return 'negative';
  if (negCount > 0 && posCount > 0) return 'mixed';
  return 'mixed';
}

function buildFallback(emotions: string[], ageGroup: 'child' | 'teen' | 'adult'): EmotionCoachResponse {
  const severity = deriveSeverity(emotions);
  const emotionList = emotions.join(', ');

  const validationMap = {
    child: `Feeling ${emotionList} makes a lot of sense — those feelings are real and they matter. It is completely okay to feel this way.`,
    teen: `What you're feeling — ${emotionList} — is completely valid. Your emotions make total sense given what you've been through.`,
    adult: `Experiencing ${emotionList} in this situation is entirely understandable. Your emotional response reflects how deeply you care.`,
  };

  const normalisationMap = {
    child: 'Lots of kids feel this way sometimes, and it shows how much you care.',
    teen: 'Many people your age experience these exact feelings — you are not alone in this.',
    adult: 'These are normal human responses to difficult situations — many people feel this way.',
  };

  const encouragementMap = {
    positive: 'Keep holding onto this wonderful feeling — you deserve every bit of happiness.',
    mixed: 'It takes real strength to sit with complicated feelings, and you are doing great.',
    negative: 'Even hard feelings pass with time, and reaching out shows incredible courage.',
    concerning: 'Please remember you are never alone — talking to someone you trust can make a big difference.',
  };

  const strategiesMap = {
    positive: [] as string[],
    mixed: [
      'Take a few slow, deep breaths to centre yourself',
      'Write down both the good and hard feelings in a journal',
      'Do one small kind thing for yourself today',
    ],
    negative: [
      'Try the 5-4-3-2-1 grounding technique: name 5 things you can see',
      'Move your body — even a short walk can shift your mood',
      'Reach out to someone you trust and share how you are feeling',
    ],
    concerning: [
      'Talk to a trusted adult, friend, or counsellor about what you are experiencing',
      'Use a calm-down strategy: slow breathing or cold water on your wrists',
      'Write your feelings down to help process them safely',
    ],
  };

  return {
    validation: validationMap[ageGroup],
    normalisation: normalisationMap[ageGroup],
    strategies: strategiesMap[severity],
    encouragement: encouragementMap[severity],
    severity,
  };
}

export async function POST(req: NextRequest) {
  let body: EmotionCoachRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { situation, emotions, ageGroup, note } = body;
  if (!situation || !emotions?.length || !ageGroup) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(buildFallback(emotions, ageGroup));
  }

  const systemPrompt = `You are a warm, compassionate therapeutic AI guide in a mental health app.
The user (${ageGroup}) was shown a scenario and chose emotions: ${emotions.join(', ')}.
${note ? `They also shared this note: "${note}"` : ''}

Respond ONLY with valid JSON (no markdown, no commentary):
{
  "validation": "2 sentences acknowledging feelings in ${ageGroup}-appropriate, empathetic language",
  "normalisation": "1 sentence normalising this emotional experience",
  "strategies": ["concrete coping step 1", "concrete coping step 2", "concrete coping step 3"],
  "encouragement": "1 warm, hopeful closing sentence",
  "severity": "positive|mixed|negative|concerning"
}

severity rules:
- "positive" if all emotions are positive (happy, excited, calm, proud, grateful, loved, hopeful)
- "concerning" if emotions include scared/overwhelmed/hopeless/worthless, OR angry+sad together
- "negative" if mostly negative emotions without the above
- "mixed" otherwise

If severity is "positive", return an empty array [] for strategies.
For ${ageGroup === 'child' ? 'children (under 12)' : ageGroup === 'teen' ? 'teenagers (12-17)' : 'adults (18+)'}, use age-appropriate language and coping strategies.`;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `Scenario: "${situation}"\nEmotions chosen: ${emotions.join(', ')}`,
        },
      ],
      system: systemPrompt,
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed: EmotionCoachResponse = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Emotion Coach AI error:', err);
    return NextResponse.json(buildFallback(emotions, ageGroup));
  }
}
