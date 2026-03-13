'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface Client {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  date_of_birth?: string;
  phone?: string;
  pronouns?: string;
  gender?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  current_risk_level: 'low' | 'moderate' | 'high' | 'critical';
  primary_diagnosis?: string;
  secondary_diagnoses?: string[];
  treatment_approach?: string;
  treatment_start_date?: string;
  session_count: number;
  status: 'active' | 'inactive' | 'discharged' | 'waitlist';

  // Medicare & Referral
  medicare_number?: string;
  referral_source?: string;
  referrer_name?: string;
  referral_date?: string;

  // Healthcare Team
  gp_name?: string;
  gp_phone?: string;
  gp_address?: string;
  psychiatrist_name?: string;
  psychiatrist_phone?: string;

  // Emergency Contacts
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  secondary_contact_name?: string;
  secondary_contact_phone?: string;
  secondary_contact_relationship?: string;

  // Billing
  billing_type?: 'private' | 'medicare' | 'dva' | 'insurance' | 'ndis';
  health_fund?: string;
  health_fund_number?: string;
  ndis_number?: string;
  ndis_manager?: string;
  invoice_email?: string;

  // Preferences
  preferred_session_time?: string;
  preferred_session_day?: string;
  session_reminders?: boolean;
  reminder_method?: 'sms' | 'email' | 'both';
  consent_to_telehealth?: boolean;
  consent_to_recording?: boolean;

  notes?: string;
  created_at: string;
}

interface CreateClientData {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
  pronouns?: string;
  primaryDiagnosis?: string;
  treatmentApproach?: string;
  riskLevel?: 'low' | 'moderate' | 'high' | 'critical';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  referrerName?: string;
  notes?: string;
}

// Demo clients
const DEMO_CLIENTS: Client[] = [
  {
    id: 'client-1',
    user_id: 'user-1',
    email: 'emma@example.com',
    first_name: 'Emma',
    last_name: 'Thompson',
    date_of_birth: '2010-05-15',
    phone: '0412 345 678',
    current_risk_level: 'moderate',
    primary_diagnosis: 'Anorexia Nervosa',
    secondary_diagnoses: ['Generalized Anxiety Disorder'],
    treatment_approach: 'FBT + CBT-E',
    treatment_start_date: '2024-06-15',
    session_count: 12,
    status: 'active',
    medicare_number: '2345 67890 1',
    referral_source: 'GP',
    referrer_name: 'Dr. Sarah Mitchell',
    gp_name: 'Dr. Sarah Mitchell',
    gp_phone: '02 9876 5432',
    emergency_contact_name: 'Jane Thompson',
    emergency_contact_phone: '0423 456 789',
    emergency_contact_relationship: 'Mother',
    billing_type: 'medicare',
    consent_to_telehealth: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'client-2',
    user_id: 'user-2',
    email: 'liam@example.com',
    first_name: 'Liam',
    last_name: 'Nguyen',
    date_of_birth: '2015-08-22',
    phone: '0434 567 890',
    current_risk_level: 'low',
    primary_diagnosis: 'Generalized Anxiety Disorder',
    treatment_approach: 'CBT',
    treatment_start_date: '2024-09-01',
    session_count: 8,
    status: 'active',
    referral_source: 'School Counselor',
    emergency_contact_name: 'Minh Nguyen',
    emergency_contact_phone: '0445 678 901',
    emergency_contact_relationship: 'Father',
    billing_type: 'private',
    consent_to_telehealth: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'client-3',
    user_id: 'user-3',
    email: 'sophie@example.com',
    first_name: 'Sophie',
    last_name: 'Williams',
    date_of_birth: '2006-02-10',
    phone: '0456 789 012',
    current_risk_level: 'high',
    primary_diagnosis: 'Bulimia Nervosa',
    secondary_diagnoses: ['Major Depressive Disorder', 'PTSD'],
    treatment_approach: 'CBT-E + DBT Skills',
    treatment_start_date: '2024-01-10',
    session_count: 24,
    status: 'active',
    medicare_number: '3456 78901 2',
    referral_source: 'Psychiatrist',
    referrer_name: 'Dr. Michael Chen',
    psychiatrist_name: 'Dr. Michael Chen',
    psychiatrist_phone: '02 8765 4321',
    emergency_contact_name: 'Rebecca Williams',
    emergency_contact_phone: '0467 890 123',
    emergency_contact_relationship: 'Mother',
    billing_type: 'medicare',
    consent_to_telehealth: true,
    consent_to_recording: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'client-4',
    user_id: 'user-4',
    email: 'oliver@example.com',
    first_name: 'Oliver',
    last_name: 'Chen',
    date_of_birth: '2012-11-30',
    phone: '0478 901 234',
    current_risk_level: 'low',
    primary_diagnosis: 'Social Anxiety',
    treatment_approach: 'CBT',
    treatment_start_date: '2024-10-01',
    session_count: 6,
    status: 'active',
    referral_source: 'Self',
    emergency_contact_name: 'Wei Chen',
    emergency_contact_phone: '0489 012 345',
    emergency_contact_relationship: 'Father',
    billing_type: 'private',
    created_at: new Date().toISOString(),
  },
  {
    id: 'client-5',
    user_id: 'user-5',
    email: 'mia@example.com',
    first_name: 'Mia',
    last_name: 'Patel',
    date_of_birth: '1998-07-18',
    phone: '0490 123 456',
    current_risk_level: 'moderate',
    primary_diagnosis: 'Major Depressive Disorder',
    secondary_diagnoses: ['Anxiety'],
    treatment_approach: 'CBT + ACT',
    treatment_start_date: '2024-04-20',
    session_count: 15,
    status: 'active',
    medicare_number: '4567 89012 3',
    gp_name: 'Dr. Amanda Lee',
    gp_phone: '02 7654 3210',
    emergency_contact_name: 'Raj Patel',
    emergency_contact_phone: '0401 234 567',
    emergency_contact_relationship: 'Partner',
    billing_type: 'medicare',
    health_fund: 'Medibank',
    health_fund_number: 'MED123456',
    consent_to_telehealth: true,
    created_at: new Date().toISOString(),
  },
];

export function useClients() {
  const { user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user) return;

    if (isEffectiveDemo(user.id)) {
      setClients(DEMO_CLIENTS);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_profiles')
        .select(`
          *,
          users!client_profiles_user_id_fkey (
            id,
            email,
            first_name,
            last_name,
            preferred_name,
            date_of_birth,
            phone,
            pronouns
          )
        `)
        .eq('clinician_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedClients: Client[] = (data || []).map((cp: any) => ({
        id: cp.id,
        user_id: cp.user_id,
        email: cp.users?.email || '',
        first_name: cp.users?.first_name || '',
        last_name: cp.users?.last_name || '',
        preferred_name: cp.users?.preferred_name,
        date_of_birth: cp.users?.date_of_birth,
        phone: cp.users?.phone,
        pronouns: cp.users?.pronouns,
        current_risk_level: cp.current_risk_level || 'low',
        status: cp.status || 'active',
        primary_diagnosis: cp.primary_diagnosis,
        treatment_approach: cp.treatment_approach,
        session_count: cp.session_count || 0,
        emergency_contact_name: cp.emergency_contact_name,
        emergency_contact_phone: cp.emergency_contact_phone,
        referrer_name: cp.referrer_name,
        notes: cp.notes,
        created_at: cp.created_at,
      }));

      setClients(formattedClients);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createClient = async (data: CreateClientData): Promise<{ success: boolean; error?: string; clientId?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    if (isEffectiveDemo(user?.id)) {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        phone: data.phone,
        pronouns: data.pronouns,
        current_risk_level: data.riskLevel || 'low',
        status: 'active',
        primary_diagnosis: data.primaryDiagnosis,
        treatment_approach: data.treatmentApproach,
        session_count: 0,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        referrer_name: data.referrerName,
        notes: data.notes,
        created_at: new Date().toISOString(),
      };
      setClients((prev) => [newClient, ...prev]);
      return { success: true, clientId: newClient.id };
    }

    try {
      // Create user record first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          email: data.email,
          role: 'client',
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth || null,
          phone: data.phone || null,
          pronouns: data.pronouns || null,
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create client profile
      const { data: clientData, error: clientError } = await supabase
        .from('client_profiles')
        .insert({
          user_id: userData.id,
          clinician_id: user.id,
          primary_diagnosis: data.primaryDiagnosis || null,
          treatment_approach: data.treatmentApproach || null,
          current_risk_level: data.riskLevel || 'low',
          emergency_contact_name: data.emergencyContactName || null,
          emergency_contact_phone: data.emergencyContactPhone || null,
          referrer_name: data.referrerName || null,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      await fetchClients();
      return { success: true, clientId: clientData.id };
    } catch (err: any) {
      console.error('Error creating client:', err);
      return { success: false, error: err.message };
    }
  };

  const updateClient = async (clientId: string, data: Partial<Client>): Promise<{ success: boolean; error?: string }> => {
    if (isEffectiveDemo(user?.id)) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? { ...c, ...data }
            : c
        )
      );
      return { success: true };
    }

    try {
      const client = clients.find((c) => c.id === clientId);
      if (!client) throw new Error('Client not found');

      // Update user record
      const userUpdates: Record<string, any> = {};
      if (data.first_name) userUpdates.first_name = data.first_name;
      if (data.last_name) userUpdates.last_name = data.last_name;
      if (data.preferred_name !== undefined) userUpdates.preferred_name = data.preferred_name;
      if (data.email) userUpdates.email = data.email;
      if (data.phone !== undefined) userUpdates.phone = data.phone;
      if (data.date_of_birth !== undefined) userUpdates.date_of_birth = data.date_of_birth;
      if (data.pronouns !== undefined) userUpdates.pronouns = data.pronouns;
      if (data.gender !== undefined) userUpdates.gender = data.gender;
      if (data.address !== undefined) userUpdates.address = data.address;
      if (data.suburb !== undefined) userUpdates.suburb = data.suburb;
      if (data.state !== undefined) userUpdates.state = data.state;
      if (data.postcode !== undefined) userUpdates.postcode = data.postcode;

      if (Object.keys(userUpdates).length > 0) {
        await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', client.user_id);
      }

      // Update client profile
      const profileUpdates: Record<string, any> = {};
      if (data.primary_diagnosis !== undefined) profileUpdates.primary_diagnosis = data.primary_diagnosis;
      if (data.secondary_diagnoses !== undefined) profileUpdates.secondary_diagnoses = data.secondary_diagnoses;
      if (data.treatment_approach !== undefined) profileUpdates.treatment_approach = data.treatment_approach;
      if (data.treatment_start_date !== undefined) profileUpdates.treatment_start_date = data.treatment_start_date;
      if (data.current_risk_level !== undefined) profileUpdates.current_risk_level = data.current_risk_level;
      if (data.medicare_number !== undefined) profileUpdates.medicare_number = data.medicare_number;
      if (data.referral_source !== undefined) profileUpdates.referral_source = data.referral_source;
      if (data.referrer_name !== undefined) profileUpdates.referrer_name = data.referrer_name;
      if (data.referral_date !== undefined) profileUpdates.referral_date = data.referral_date;
      if (data.gp_name !== undefined) profileUpdates.gp_name = data.gp_name;
      if (data.gp_phone !== undefined) profileUpdates.gp_phone = data.gp_phone;
      if (data.gp_address !== undefined) profileUpdates.gp_address = data.gp_address;
      if (data.psychiatrist_name !== undefined) profileUpdates.psychiatrist_name = data.psychiatrist_name;
      if (data.psychiatrist_phone !== undefined) profileUpdates.psychiatrist_phone = data.psychiatrist_phone;
      if (data.emergency_contact_name !== undefined) profileUpdates.emergency_contact_name = data.emergency_contact_name;
      if (data.emergency_contact_phone !== undefined) profileUpdates.emergency_contact_phone = data.emergency_contact_phone;
      if (data.emergency_contact_relationship !== undefined) profileUpdates.emergency_contact_relationship = data.emergency_contact_relationship;
      if (data.secondary_contact_name !== undefined) profileUpdates.secondary_contact_name = data.secondary_contact_name;
      if (data.secondary_contact_phone !== undefined) profileUpdates.secondary_contact_phone = data.secondary_contact_phone;
      if (data.secondary_contact_relationship !== undefined) profileUpdates.secondary_contact_relationship = data.secondary_contact_relationship;
      if (data.billing_type !== undefined) profileUpdates.billing_type = data.billing_type;
      if (data.health_fund !== undefined) profileUpdates.health_fund = data.health_fund;
      if (data.health_fund_number !== undefined) profileUpdates.health_fund_number = data.health_fund_number;
      if (data.ndis_number !== undefined) profileUpdates.ndis_number = data.ndis_number;
      if (data.ndis_manager !== undefined) profileUpdates.ndis_manager = data.ndis_manager;
      if (data.invoice_email !== undefined) profileUpdates.invoice_email = data.invoice_email;
      if (data.preferred_session_time !== undefined) profileUpdates.preferred_session_time = data.preferred_session_time;
      if (data.preferred_session_day !== undefined) profileUpdates.preferred_session_day = data.preferred_session_day;
      if (data.session_reminders !== undefined) profileUpdates.session_reminders = data.session_reminders;
      if (data.reminder_method !== undefined) profileUpdates.reminder_method = data.reminder_method;
      if (data.consent_to_telehealth !== undefined) profileUpdates.consent_to_telehealth = data.consent_to_telehealth;
      if (data.consent_to_recording !== undefined) profileUpdates.consent_to_recording = data.consent_to_recording;
      if (data.notes !== undefined) profileUpdates.notes = data.notes;

      if (Object.keys(profileUpdates).length > 0) {
        await supabase
          .from('client_profiles')
          .update(profileUpdates)
          .eq('id', clientId);
      }

      await fetchClients();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
  };
}
