import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key
// Required because creating a client user involves writing to auth.users
// which can only be done server-side with the service role key
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase admin credentials not configured');
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email, firstName, lastName, dateOfBirth, phone, pronouns,
      primaryDiagnosis, treatmentApproach, riskLevel,
      emergencyContactName, emergencyContactPhone, referrerName,
      notes, clinicianId,
    } = body;

    if (!email || !firstName || !lastName || !clinicianId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = getAdminClient();

    // 1. Create auth user (generates auth.users row so FK constraint is satisfied)
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-10) + 'Aa1!', // temp password
      email_confirm: true, // auto-confirm so client can request password reset
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (authError) {
      // If user already exists, try to find them
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
      }
      throw authError;
    }

    const userId = authData.user.id;

    // 2. Insert into public users table
    const { error: userError } = await admin.from('users').insert({
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth || null,
      phone: phone || null,
      pronouns: pronouns || null,
      role: 'client',
    });

    if (userError) {
      // Roll back auth user if profile creation fails
      await admin.auth.admin.deleteUser(userId);
      throw userError;
    }

    // 3. Insert into client_profiles
    const { data: profileData, error: profileError } = await admin
      .from('client_profiles')
      .insert({
        user_id: userId,
        clinician_id: clinicianId,
        primary_diagnosis: primaryDiagnosis || null,
        treatment_approach: treatmentApproach || null,
        current_risk_level: riskLevel || 'low',
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_phone: emergencyContactPhone || null,
        referrer_name: referrerName || null,
        notes: notes || null,
        status: 'active',
      })
      .select()
      .single();

    if (profileError) {
      await admin.auth.admin.deleteUser(userId);
      throw profileError;
    }

    // 4. Send password reset email so client can set their own password
    await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mindbridge.com.au'}/client/login`,
      },
    });

    return NextResponse.json({ success: true, clientId: profileData.id, userId });
  } catch (err: any) {
    console.error('Client creation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create client' }, { status: 500 });
  }
}
