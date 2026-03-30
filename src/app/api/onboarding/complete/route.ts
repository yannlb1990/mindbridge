import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin credentials not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    token,
    // Personal
    phone, dateOfBirth, address,
    // Emergency contact
    emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
    // Medicare
    medicareNumber, gpName, gpPractice, gpPhone,
    // Consent
    consentToTelehealth, consentToRecording, consentToResearch,
    // Password for client portal login
    password,
  } = body;

  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

  const admin = getAdminClient();

  // Verify token
  const { data: invite, error: inviteError } = await admin
    .from('onboarding_invites')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .single();

  if (inviteError || !invite) {
    return NextResponse.json({ error: 'Invalid or expired invitation link' }, { status: 400 });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This invitation link has expired. Please contact your clinician for a new one.' }, { status: 400 });
  }

  // If password provided, set it on the auth user
  if (password) {
    const { data: clientUser } = await admin
      .from('client_profiles')
      .select('user_id')
      .eq('id', invite.client_id)
      .single();

    if (clientUser?.user_id) {
      await admin.auth.admin.updateUserById(clientUser.user_id, { password });
    }
  }

  // Update client_profiles with onboarding data
  const profileUpdates: Record<string, unknown> = {
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  };
  if (phone) profileUpdates.phone = phone;
  if (dateOfBirth) profileUpdates.date_of_birth = dateOfBirth;
  if (address) profileUpdates.address = address;
  if (emergencyContactName) profileUpdates.emergency_contact_name = emergencyContactName;
  if (emergencyContactPhone) profileUpdates.emergency_contact_phone = emergencyContactPhone;
  if (emergencyContactRelationship) profileUpdates.emergency_contact_relationship = emergencyContactRelationship;
  if (medicareNumber) profileUpdates.medicare_number = medicareNumber;
  if (gpName) profileUpdates.gp_name = gpName;
  if (gpPractice) profileUpdates.gp_practice = gpPractice;
  if (gpPhone) profileUpdates.gp_phone = gpPhone;
  if (consentToTelehealth !== undefined) profileUpdates.consent_to_telehealth = consentToTelehealth;
  if (consentToRecording !== undefined) profileUpdates.consent_to_recording = consentToRecording;
  if (consentToResearch !== undefined) profileUpdates.consent_to_research = consentToResearch;

  const { error: profileError } = await admin
    .from('client_profiles')
    .update(profileUpdates)
    .eq('id', invite.client_id);

  if (profileError) {
    console.error('Profile update error:', profileError.message);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }

  // Mark token as used
  await admin
    .from('onboarding_invites')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('token', token);

  return NextResponse.json({ ok: true });
}
