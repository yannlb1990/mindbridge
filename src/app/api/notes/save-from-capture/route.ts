import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin credentials not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  const { clientId, noteFormat, content, transcript, isSigned, clinicianId } = await req.json();

  if (!clientId || !content) {
    return NextResponse.json({ error: 'clientId and content required' }, { status: 400 });
  }

  const admin = getAdminClient();

  // Build a content structure compatible with the NoteEditor format
  const noteContent: Record<string, string> = {};
  const lines = content.split('\n');

  // Parse sections from the generated note (bold headers like **SUBJECTIVE:**)
  let currentSection = 'content';
  for (const line of lines) {
    const sectionMatch = line.match(/^\*\*([A-Z]+)(?:\s+[A-Z]+)*:\*\*/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].toLowerCase();
      noteContent[currentSection] = '';
    } else if (currentSection) {
      noteContent[currentSection] = ((noteContent[currentSection] || '') + line + '\n').trimStart();
    }
  }

  // If no sections found (e.g. narrative), store as single 'content' field
  if (Object.keys(noteContent).length === 0) {
    noteContent.content = content;
  }

  // Add transcript if available
  if (transcript) {
    noteContent.transcript = transcript;
  }

  const { data: note, error } = await admin
    .from('clinical_notes')
    .insert({
      client_id: clientId,
      clinician_id: clinicianId || null,
      note_format: noteFormat || 'SOAP',
      content: noteContent,
      is_signed: isSigned || false,
      signed_at: isSigned ? new Date().toISOString() : null,
      risk_level: 'low',
      source: 'session_capture',
    })
    .select('id')
    .single();

  if (error) {
    console.error('save-from-capture error:', error.message);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, noteId: note?.id });
}
