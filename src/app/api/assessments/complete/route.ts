import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase admin credentials not configured');
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Scoring algorithms for each assessment type
function scoreAssessment(
  type: string,
  responses: Record<string, number>
): { score: number; severity: string } {
  const values = Object.values(responses);
  const total = values.reduce((sum, v) => sum + v, 0);

  switch (type) {
    case 'PHQ-9': {
      const severity =
        total <= 4 ? 'Minimal' :
        total <= 9 ? 'Mild' :
        total <= 14 ? 'Moderate' :
        total <= 19 ? 'Moderately Severe' : 'Severe';
      return { score: total, severity };
    }
    case 'GAD-7': {
      const severity =
        total <= 4 ? 'Minimal' :
        total <= 9 ? 'Mild' :
        total <= 14 ? 'Moderate' : 'Severe';
      return { score: total, severity };
    }
    case 'K10': {
      const severity =
        total <= 19 ? 'Low' :
        total <= 24 ? 'Moderate' :
        total <= 29 ? 'High' : 'Very High';
      return { score: total, severity };
    }
    case 'CORE-10': {
      const avg = total / Math.max(values.length, 1);
      const severity =
        avg < 1 ? 'Healthy' :
        avg < 2 ? 'Low' :
        avg < 3 ? 'Moderate' : 'High';
      return { score: Math.round(avg * 10) / 10, severity };
    }
    case 'DASS-21': {
      const severity =
        total <= 9 ? 'Normal Range' :
        total <= 12 ? 'Mild' :
        total <= 20 ? 'Moderate' :
        total <= 27 ? 'Severe' : 'Extremely Severe';
      return { score: total * 2, severity }; // DASS-21 scores are doubled
    }
    case 'EDE-Q': {
      const avg = total / Math.max(values.length, 1);
      const severity = avg < 2.8 ? 'Below Clinical Threshold' : 'Above Clinical Threshold';
      return { score: Math.round(avg * 10) / 10, severity };
    }
    default:
      return { score: total, severity: 'N/A' };
  }
}

// PATCH /api/assessments/complete — client submits completed assessment
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { assessmentId, clientId, responses } = body;

    if (!assessmentId || !clientId || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = getAdminClient();

    // Fetch the assessment to get its type
    const { data: existing, error: fetchError } = await admin
      .from('assessments')
      .select('assessment_type, status, client_id')
      .eq('id', assessmentId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    if (existing.client_id !== clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (existing.status === 'completed') {
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 409 });
    }

    const { score, severity } = scoreAssessment(existing.assessment_type, responses);

    const { error: updateError } = await admin
      .from('assessments')
      .update({
        status: 'completed',
        score,
        severity,
        responses,
        completed_at: new Date().toISOString(),
      })
      .eq('id', assessmentId);

    if (updateError) throw updateError;

    return NextResponse.json({ score, severity });
  } catch (err: any) {
    console.error('Assessment complete error:', err.message);
    return NextResponse.json({ error: 'Failed to complete assessment' }, { status: 500 });
  }
}
