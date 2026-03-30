import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase admin credentials not configured');
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

// POST /api/assessments — clinician sends an assessment to a client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, clinicianId, assessmentType } = body;

    if (!clientId || !clinicianId || !assessmentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = getAdminClient();

    const { data, error } = await admin
      .from('assessments')
      .insert({
        client_id: clientId,
        clinician_id: clinicianId,
        assessment_type: assessmentType,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: any) {
    console.error('Assessment send error:', err.message);
    return NextResponse.json({ error: 'Failed to send assessment' }, { status: 500 });
  }
}

// GET /api/assessments?clinicianId=xxx — fetch all completed assessments for a clinician's clients
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicianId = searchParams.get('clinicianId');

    if (!clinicianId) {
      return NextResponse.json({ error: 'Missing clinicianId' }, { status: 400 });
    }

    const admin = getAdminClient();

    // Fetch assessments for all clients of this clinician
    const { data, error } = await admin
      .from('assessments')
      .select(`
        id, assessment_type, status, score, severity, notes, created_at, completed_at,
        client_id,
        users!client_id(id, first_name, last_name)
      `)
      .eq('clinician_id', clinicianId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ assessments: data || [] });
  } catch (err: any) {
    console.error('Assessment fetch error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}
