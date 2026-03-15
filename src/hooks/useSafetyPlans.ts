'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface SafetyPlan {
  id: string;
  client_id: string;
  client_name?: string;
  clinician_id: string;
  warning_signs: string[];
  coping_strategies: string[];
  social_contacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  professional_contacts: Array<{
    name: string;
    phone: string;
    role: string;
  }>;
  safe_environment: string[];
  reasons_for_living: string[];
  crisis_resources: Array<{
    name: string;
    phone: string;
    available: string;
  }>;
  is_active: boolean;
  last_reviewed: string;
  next_review_date?: string;
  created_at: string;
  updated_at: string;
}

interface CreateSafetyPlanData {
  clientId: string;
  warningSigns: string[];
  copingStrategies: string[];
  socialContacts: SafetyPlan['social_contacts'];
  professionalContacts: SafetyPlan['professional_contacts'];
  safeEnvironment: string[];
  reasonsForLiving: string[];
  crisisResources?: SafetyPlan['crisis_resources'];
  nextReviewDate?: string;
}

// Australian crisis resources
export const AUSTRALIAN_CRISIS_RESOURCES = [
  { name: 'Lifeline Australia', phone: '13 11 14', available: '24/7' },
  { name: 'Beyond Blue', phone: '1300 22 4636', available: '24/7' },
  { name: 'Kids Helpline', phone: '1800 55 1800', available: '24/7' },
  { name: 'Suicide Call Back Service', phone: '1300 659 467', available: '24/7' },
  { name: 'Butterfly Foundation (Eating Disorders)', phone: '1800 33 4673', available: '8am-midnight AEST' },
  { name: 'Emergency Services', phone: '000', available: '24/7' },
  { name: 'Mental Health Crisis Line (VIC)', phone: '1300 558 030', available: '24/7' },
  { name: 'Mental Health Line (NSW)', phone: '1800 011 511', available: '24/7' },
];

// Demo safety plan
const DEMO_SAFETY_PLANS: SafetyPlan[] = [
  {
    id: 'sp-1',
    client_id: 'client-3',
    client_name: 'Sophie Williams',
    clinician_id: 'demo-user',
    warning_signs: [
      'Skipping meals',
      'Avoiding social situations',
      'Increased negative self-talk',
      'Difficulty sleeping',
      'Withdrawing from family',
    ],
    coping_strategies: [
      'Use 5-4-3-2-1 grounding technique',
      'Call a friend or family member',
      'Go for a walk outside',
      'Listen to calming music',
      'Write in journal',
      'Practice deep breathing',
    ],
    social_contacts: [
      { name: 'Mum (Sarah)', phone: '0412 345 678', relationship: 'Parent' },
      { name: 'Best friend (Lily)', phone: '0423 456 789', relationship: 'Friend' },
      { name: 'Aunt Jennifer', phone: '0434 567 890', relationship: 'Family' },
    ],
    professional_contacts: [
      { name: 'Dr. Sarah Chen (Psychologist)', phone: '03 9876 5432', role: 'Therapist' },
      { name: 'Dr. James Wilson (GP)', phone: '03 9765 4321', role: 'GP' },
    ],
    safe_environment: [
      'Keep medications locked away',
      'Remove sharps from bedroom',
      'Stay in common areas when struggling',
      'Keep phone charged and nearby',
    ],
    reasons_for_living: [
      'My family loves me',
      'I want to finish school',
      'My dog needs me',
      'Things can get better',
      'I have goals I want to achieve',
    ],
    crisis_resources: AUSTRALIAN_CRISIS_RESOURCES.slice(0, 5),
    is_active: true,
    last_reviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    next_review_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function useSafetyPlans() {
  const { user } = useAuthStore();
  const [safetyPlans, setSafetyPlans] = useState<SafetyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSafetyPlans = useCallback(async () => {
    if (!user) return;

    if (isEffectiveDemo(user?.id)) {
      setSafetyPlans(DEMO_SAFETY_PLANS);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('safety_plans')
        .select(`
          *,
          client:users!safety_plans_client_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('clinician_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedPlans: SafetyPlan[] = (data || []).map((sp: any) => ({
        ...sp,
        client_name: sp.client ? `${sp.client.first_name} ${sp.client.last_name}` : 'Unknown',
      }));

      setSafetyPlans(formattedPlans);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createSafetyPlan = async (data: CreateSafetyPlanData): Promise<{ success: boolean; error?: string; planId?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const crisisResources = data.crisisResources || AUSTRALIAN_CRISIS_RESOURCES.slice(0, 5);

    if (isEffectiveDemo(user?.id)) {
      const newPlan: SafetyPlan = {
        id: `sp-${Date.now()}`,
        client_id: data.clientId,
        clinician_id: user.id,
        warning_signs: data.warningSigns,
        coping_strategies: data.copingStrategies,
        social_contacts: data.socialContacts,
        professional_contacts: data.professionalContacts,
        safe_environment: data.safeEnvironment,
        reasons_for_living: data.reasonsForLiving,
        crisis_resources: crisisResources,
        is_active: true,
        last_reviewed: new Date().toISOString(),
        next_review_date: data.nextReviewDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSafetyPlans((prev) => [newPlan, ...prev]);
      return { success: true, planId: newPlan.id };
    }

    try {
      const { data: planData, error } = await supabase
        .from('safety_plans')
        .insert({
          client_id: data.clientId,
          clinician_id: user.id,
          warning_signs: data.warningSigns,
          coping_strategies: data.copingStrategies,
          social_contacts: data.socialContacts,
          professional_contacts: data.professionalContacts,
          safe_environment: data.safeEnvironment,
          reasons_for_living: data.reasonsForLiving,
          crisis_resources: crisisResources,
          is_active: true,
          last_reviewed: new Date().toISOString(),
          next_review_date: data.nextReviewDate,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchSafetyPlans();
      return { success: true, planId: planData.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateSafetyPlan = async (planId: string, data: Partial<CreateSafetyPlanData>): Promise<{ success: boolean; error?: string }> => {
    if (isEffectiveDemo(user?.id)) {
      setSafetyPlans((prev) =>
        prev.map((sp) =>
          sp.id === planId
            ? {
                ...sp,
                warning_signs: data.warningSigns || sp.warning_signs,
                coping_strategies: data.copingStrategies || sp.coping_strategies,
                social_contacts: data.socialContacts || sp.social_contacts,
                professional_contacts: data.professionalContacts || sp.professional_contacts,
                safe_environment: data.safeEnvironment || sp.safe_environment,
                reasons_for_living: data.reasonsForLiving || sp.reasons_for_living,
                updated_at: new Date().toISOString(),
              }
            : sp
        )
      );
      return { success: true };
    }

    try {
      const updates: any = { updated_at: new Date().toISOString() };
      if (data.warningSigns) updates.warning_signs = data.warningSigns;
      if (data.copingStrategies) updates.coping_strategies = data.copingStrategies;
      if (data.socialContacts) updates.social_contacts = data.socialContacts;
      if (data.professionalContacts) updates.professional_contacts = data.professionalContacts;
      if (data.safeEnvironment) updates.safe_environment = data.safeEnvironment;
      if (data.reasonsForLiving) updates.reasons_for_living = data.reasonsForLiving;
      if (data.nextReviewDate) updates.next_review_date = data.nextReviewDate;

      const { error } = await supabase
        .from('safety_plans')
        .update(updates)
        .eq('id', planId);

      if (error) throw error;

      await fetchSafetyPlans();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const markReviewed = async (planId: string, nextReviewDate?: string): Promise<{ success: boolean; error?: string }> => {
    if (isEffectiveDemo(user?.id)) {
      setSafetyPlans((prev) =>
        prev.map((sp) =>
          sp.id === planId
            ? {
                ...sp,
                last_reviewed: new Date().toISOString(),
                next_review_date: nextReviewDate,
                updated_at: new Date().toISOString(),
              }
            : sp
        )
      );
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('safety_plans')
        .update({
          last_reviewed: new Date().toISOString(),
          next_review_date: nextReviewDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId);

      if (error) throw error;

      await fetchSafetyPlans();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getClientSafetyPlan = (clientId: string): SafetyPlan | undefined => {
    return safetyPlans.find((sp) => sp.client_id === clientId && sp.is_active);
  };

  useEffect(() => {
    fetchSafetyPlans();
  }, [fetchSafetyPlans]);

  return {
    safetyPlans,
    isLoading,
    error,
    fetchSafetyPlans,
    createSafetyPlan,
    updateSafetyPlan,
    markReviewed,
    getClientSafetyPlan,
    AUSTRALIAN_CRISIS_RESOURCES,
  };
}
