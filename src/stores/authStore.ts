import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isDemoMode } from '@/lib/supabase';
import type { User, ClinicianProfile } from '@/types/database';
import { getAgeGroup, type AgeGroup } from '@/lib/utils';

export interface ClientProfile {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  date_of_birth: string;
  clinician_name: string;
}

// Demo client user (teenager, 16yo)
const DEMO_CLIENT_USER: User = {
  id: 'demo-client-1',
  email: 'client@mindbridge.com.au',
  first_name: 'Alex',
  last_name: 'Rivera',
  preferred_name: 'Alex',
  role: 'client',
  phone: null,
  date_of_birth: '2009-08-15',
  pronouns: 'they/them',
  avatar_url: null,
  timezone: 'Australia/Sydney',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_active: new Date().toISOString(),
  is_active: true,
};

const DEMO_CLIENT_PROFILE: ClientProfile = {
  id: 'demo-client-profile-1',
  first_name: 'Alex',
  last_name: 'Rivera',
  preferred_name: 'Alex',
  date_of_birth: '2009-08-15',
  clinician_name: 'Dr. Sarah Mitchell',
};

// Demo user for testing without Supabase
const DEMO_USER: User = {
  id: 'demo-clinician-1',
  email: 'demo@mindbridge.com.au',
  first_name: 'Sarah',
  last_name: 'Mitchell',
  preferred_name: 'Dr. Sarah',
  role: 'clinician',
  phone: '+61 2 9000 0000',
  date_of_birth: '1985-03-15',
  pronouns: 'she/her',
  avatar_url: null,
  timezone: 'Australia/Sydney',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_active: new Date().toISOString(),
  is_active: true,
};

const DEMO_CLINICIAN_PROFILE: ClinicianProfile = {
  id: 'demo-profile-1',
  user_id: 'demo-clinician-1',
  credentials: 'PhD, MAPS, FCCLP',
  registration_number: 'PSY0001234',
  specializations: ['Eating Disorders', 'Anxiety', 'Youth Mental Health', 'CBT', 'DBT'],
  bio: 'Experienced clinical psychologist specializing in eating disorders and youth mental health.',
  practice_name: 'MindBridge Psychology',
  practice_address: '123 Collins Street, Melbourne VIC 3000',
  abn: null,
  medicare_provider_number: null,
  default_session_duration: 50,
  default_session_fee: 220,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface AuthState {
  user: User | null;
  clinicianProfile: ClinicianProfile | null;
  clientProfile: ClientProfile | null;
  ageGroup: AgeGroup | null;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  isDemoMode: boolean;

  // Actions
  setHasHydrated: (state: boolean) => void;
  checkAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
  enterDemoMode: () => void;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  registrationNumber: string;
  registrationBody: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      clinicianProfile: null,
      clientProfile: null,
      ageGroup: null,
      isLoading: true,
      hasHydrated: false,
      error: null,
      isDemoMode: isDemoMode,

      setHasHydrated: (value: boolean) => {
        set({ hasHydrated: value, isLoading: false });
      },

      checkAuth: async () => {
        const state = get();

        // If we already have a user (from hydration), just set loading to false
        if (state.user) {
          set({ isLoading: false });
          return;
        }

        if (isDemoMode) {
          // In demo mode, if no user persisted, set loading false
          set({ isLoading: false });
          return;
        }

        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();

          if (!authUser) {
            set({ user: null, clinicianProfile: null, isLoading: false });
            return;
          }

          // Fetch user profile
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          // Fetch clinician profile if user is a clinician
          let clinicianProfile: ClinicianProfile | null = null;
          if (userProfile?.role === 'clinician') {
            const { data } = await supabase
              .from('clinician_profiles')
              .select('*')
              .eq('user_id', authUser.id)
              .single();
            clinicianProfile = data;
          }

          set({
            user: userProfile,
            clinicianProfile,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, clinicianProfile: null, isLoading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // Demo client login
        if (email === 'client@mindbridge.com.au' && password === 'client123') {
          set({
            user: DEMO_CLIENT_USER,
            clinicianProfile: null,
            clientProfile: DEMO_CLIENT_PROFILE,
            ageGroup: getAgeGroup(DEMO_CLIENT_PROFILE.date_of_birth),
            isLoading: false,
            isDemoMode: true,
          });
          return { success: true, role: 'client' };
        }

        // Demo mode login - always allow demo credentials
        if (email === 'demo@mindbridge.com.au' && password === 'demo123') {
          set({
            user: DEMO_USER,
            clinicianProfile: DEMO_CLINICIAN_PROFILE,
            clientProfile: null,
            ageGroup: null,
            isLoading: false,
            isDemoMode: true,
          });
          return { success: true, role: 'clinician' };
        }

        // If in demo mode and not demo credentials
        if (isDemoMode) {
          set({ isLoading: false, error: 'Invalid demo credentials' });
          return { success: false, error: 'Use demo@mindbridge.com.au / demo123' };
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
          }

          if (data.user) {
            // Fetch user profile
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError || !userProfile) {
              // Auth succeeded but profile row missing — likely RLS or signup timing issue
              await supabase.auth.signOut();
              set({ isLoading: false, error: 'Account setup incomplete. Please contact support.' });
              return { success: false, error: 'Account setup incomplete. Please contact support.' };
            }

            // Fetch clinician profile
            let clinicianProfile: ClinicianProfile | null = null;
            if (userProfile.role === 'clinician') {
              const { data: profile } = await supabase
                .from('clinician_profiles')
                .select('*')
                .eq('user_id', data.user.id)
                .single();
              clinicianProfile = profile;
            }

            // Update last active (non-blocking)
            supabase
              .from('users')
              .update({ last_active: new Date().toISOString() })
              .eq('id', data.user.id);

            set({
              user: userProfile,
              clinicianProfile,
              isLoading: false,
            });
            return { success: true, role: userProfile.role };
          }

          set({ isLoading: false });
          return { success: false, error: 'Login failed' };
        } catch (error: any) {
          const message = error.message || 'An unexpected error occurred';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      signUp: async (data: SignUpData) => {
        set({ isLoading: true, error: null });

        if (isDemoMode) {
          set({ isLoading: false, error: 'Sign up not available in demo mode' });
          return { success: false, error: 'Sign up not available in demo mode' };
        }

        try {
          // Create auth user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                first_name: data.firstName,
                last_name: data.lastName,
              },
            },
          });

          if (authError) {
            set({ isLoading: false, error: authError.message });
            return { success: false, error: authError.message };
          }

          if (!authData.user) {
            set({ isLoading: false, error: 'Failed to create account' });
            return { success: false, error: 'Failed to create account' };
          }

          // Create user profile
          const { error: profileError } = await supabase.from('users').insert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'clinician',
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          // Create clinician profile
          const { error: clinicianError } = await supabase.from('clinician_profiles').insert({
            user_id: authData.user.id,
            credentials: data.title,
            registration_number: data.registrationNumber,
            specializations: [],
          });

          if (clinicianError) {
            console.error('Clinician profile creation error:', clinicianError);
          }

          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          const message = error.message || 'An unexpected error occurred';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      signOut: async () => {
        set({ isLoading: true });

        // Use store's isDemoMode (not module-level) so demo sessions
        // never call supabase.auth.signOut() and never hang.
        if (!get().isDemoMode) {
          await supabase.auth.signOut();
        }

        set({
          user: null,
          clinicianProfile: null,
          clientProfile: null,
          ageGroup: null,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      enterDemoMode: () => {
        set({
          user: DEMO_USER,
          clinicianProfile: DEMO_CLINICIAN_PROFILE,
          isLoading: false,
          isDemoMode: true,
        });
      },
    }),
    {
      name: 'mindbridge-auth',
      partialize: (state) => ({
        user: state.user,
        clinicianProfile: state.clinicianProfile,
        clientProfile: state.clientProfile,
        ageGroup: state.ageGroup,
        isDemoMode: state.isDemoMode,
      }),
      onRehydrateStorage: () => (state) => {
        // Use state directly — safer than useAuthStore.setState which may
        // be undefined if rehydration fires synchronously during store creation.
        state?.setHasHydrated(true);
      },
    }
  )
);
