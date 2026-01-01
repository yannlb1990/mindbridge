/**
 * MindBridge - Database Types
 *
 * TypeScript types for Supabase database tables.
 * These will be auto-generated once you connect to Supabase,
 * but this provides the initial structure.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enums
export type UserRole = 'clinician' | 'client' | 'admin' | 'parent';
export type SessionType = 'individual' | 'family' | 'group' | 'telehealth' | 'phone';
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type MoodRating = 1 | 2 | 3 | 4 | 5; // 1 = struggling, 5 = great
export type HomeworkStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue';
export type NoteFormat = 'soap' | 'dap' | 'birp' | 'narrative' | 'brief';

export interface Database {
  public: {
    Tables: {
      // Users table (clinicians, clients, parents)
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          first_name: string;
          last_name: string;
          preferred_name: string | null;
          phone: string | null;
          date_of_birth: string | null;
          pronouns: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
          last_active: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          role: UserRole;
          first_name: string;
          last_name: string;
          preferred_name?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          pronouns?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
          last_active?: string | null;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          role?: UserRole;
          first_name?: string;
          last_name?: string;
          preferred_name?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          pronouns?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          updated_at?: string;
          last_active?: string | null;
          is_active?: boolean;
        };
      };

      // Clinician profiles
      clinician_profiles: {
        Row: {
          id: string;
          user_id: string;
          credentials: string;
          registration_number: string | null;
          specializations: string[];
          bio: string | null;
          practice_name: string | null;
          practice_address: string | null;
          abn: string | null;
          medicare_provider_number: string | null;
          default_session_duration: number;
          default_session_fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          credentials: string;
          registration_number?: string | null;
          specializations?: string[];
          bio?: string | null;
          practice_name?: string | null;
          practice_address?: string | null;
          abn?: string | null;
          medicare_provider_number?: string | null;
          default_session_duration?: number;
          default_session_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          credentials?: string;
          registration_number?: string | null;
          specializations?: string[];
          bio?: string | null;
          practice_name?: string | null;
          practice_address?: string | null;
          abn?: string | null;
          medicare_provider_number?: string | null;
          default_session_duration?: number;
          default_session_fee?: number;
          updated_at?: string;
        };
      };

      // Client profiles
      client_profiles: {
        Row: {
          id: string;
          user_id: string;
          clinician_id: string;
          parent_id: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          emergency_contact_relationship: string | null;
          referrer_name: string | null;
          referrer_type: string | null;
          referral_date: string | null;
          primary_diagnosis: string | null;
          diagnosis_code: string | null;
          secondary_diagnoses: Json | null;
          current_risk_level: RiskLevel;
          treatment_start_date: string | null;
          treatment_approach: string | null;
          session_count: number;
          medicare_number: string | null;
          ndis_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          clinician_id: string;
          parent_id?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_relationship?: string | null;
          referrer_name?: string | null;
          referrer_type?: string | null;
          referral_date?: string | null;
          primary_diagnosis?: string | null;
          diagnosis_code?: string | null;
          secondary_diagnoses?: Json | null;
          current_risk_level?: RiskLevel;
          treatment_start_date?: string | null;
          treatment_approach?: string | null;
          session_count?: number;
          medicare_number?: string | null;
          ndis_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          clinician_id?: string;
          parent_id?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_relationship?: string | null;
          referrer_name?: string | null;
          referrer_type?: string | null;
          referral_date?: string | null;
          primary_diagnosis?: string | null;
          diagnosis_code?: string | null;
          secondary_diagnoses?: Json | null;
          current_risk_level?: RiskLevel;
          treatment_start_date?: string | null;
          treatment_approach?: string | null;
          session_count?: number;
          medicare_number?: string | null;
          ndis_number?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };

      // Sessions
      sessions: {
        Row: {
          id: string;
          clinician_id: string;
          client_id: string;
          session_type: SessionType;
          status: SessionStatus;
          scheduled_start: string;
          scheduled_end: string;
          actual_start: string | null;
          actual_end: string | null;
          duration_minutes: number;
          fee: number;
          is_paid: boolean;
          telehealth_link: string | null;
          location: string | null;
          notes_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinician_id: string;
          client_id: string;
          session_type: SessionType;
          status?: SessionStatus;
          scheduled_start: string;
          scheduled_end: string;
          actual_start?: string | null;
          actual_end?: string | null;
          duration_minutes?: number;
          fee?: number;
          is_paid?: boolean;
          telehealth_link?: string | null;
          location?: string | null;
          notes_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          session_type?: SessionType;
          status?: SessionStatus;
          scheduled_start?: string;
          scheduled_end?: string;
          actual_start?: string | null;
          actual_end?: string | null;
          duration_minutes?: number;
          fee?: number;
          is_paid?: boolean;
          telehealth_link?: string | null;
          location?: string | null;
          notes_id?: string | null;
          updated_at?: string;
        };
      };

      // Clinical notes
      clinical_notes: {
        Row: {
          id: string;
          session_id: string;
          clinician_id: string;
          client_id: string;
          note_format: NoteFormat;
          content: Json;
          transcript: string | null;
          ai_generated: boolean;
          is_signed: boolean;
          signed_at: string | null;
          risk_level: RiskLevel | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          clinician_id: string;
          client_id: string;
          note_format: NoteFormat;
          content: Json;
          transcript?: string | null;
          ai_generated?: boolean;
          is_signed?: boolean;
          signed_at?: string | null;
          risk_level?: RiskLevel | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          note_format?: NoteFormat;
          content?: Json;
          transcript?: string | null;
          ai_generated?: boolean;
          is_signed?: boolean;
          signed_at?: string | null;
          risk_level?: RiskLevel | null;
          updated_at?: string;
        };
      };

      // Mood entries (client app)
      mood_entries: {
        Row: {
          id: string;
          client_id: string;
          rating: MoodRating;
          emotions: string[];
          notes: string | null;
          shared_with_clinician: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          rating: MoodRating;
          emotions?: string[];
          notes?: string | null;
          shared_with_clinician?: boolean;
          created_at?: string;
        };
        Update: {
          rating?: MoodRating;
          emotions?: string[];
          notes?: string | null;
          shared_with_clinician?: boolean;
        };
      };

      // Meal logs (eating disorder clients)
      meal_logs: {
        Row: {
          id: string;
          client_id: string;
          meal_type: string;
          meal_time: string;
          description: string;
          photo_url: string | null;
          anxiety_before: number;
          anxiety_after: number;
          urges: string[];
          urge_acted_on: boolean;
          notes: string | null;
          shared_with_clinician: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          meal_type: string;
          meal_time: string;
          description: string;
          photo_url?: string | null;
          anxiety_before?: number;
          anxiety_after?: number;
          urges?: string[];
          urge_acted_on?: boolean;
          notes?: string | null;
          shared_with_clinician?: boolean;
          created_at?: string;
        };
        Update: {
          meal_type?: string;
          meal_time?: string;
          description?: string;
          photo_url?: string | null;
          anxiety_before?: number;
          anxiety_after?: number;
          urges?: string[];
          urge_acted_on?: boolean;
          notes?: string | null;
          shared_with_clinician?: boolean;
        };
      };

      // Homework assignments
      homework_assignments: {
        Row: {
          id: string;
          clinician_id: string;
          client_id: string;
          title: string;
          description: string;
          exercise_type: string;
          exercise_data: Json | null;
          status: HomeworkStatus;
          due_date: string | null;
          completed_at: string | null;
          response: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinician_id: string;
          client_id: string;
          title: string;
          description: string;
          exercise_type: string;
          exercise_data?: Json | null;
          status?: HomeworkStatus;
          due_date?: string | null;
          completed_at?: string | null;
          response?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          exercise_type?: string;
          exercise_data?: Json | null;
          status?: HomeworkStatus;
          due_date?: string | null;
          completed_at?: string | null;
          response?: Json | null;
          updated_at?: string;
        };
      };

      // Safety plans
      safety_plans: {
        Row: {
          id: string;
          client_id: string;
          warning_signs: string[];
          coping_strategies: string[];
          support_people: Json[];
          professional_contacts: Json[];
          crisis_helplines: Json[];
          reasons_to_live: string[];
          safe_environment_steps: string[];
          last_reviewed: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          warning_signs?: string[];
          coping_strategies?: string[];
          support_people?: Json[];
          professional_contacts?: Json[];
          crisis_helplines?: Json[];
          reasons_to_live?: string[];
          safe_environment_steps?: string[];
          last_reviewed?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          warning_signs?: string[];
          coping_strategies?: string[];
          support_people?: Json[];
          professional_contacts?: Json[];
          crisis_helplines?: Json[];
          reasons_to_live?: string[];
          safe_environment_steps?: string[];
          last_reviewed?: string;
          updated_at?: string;
        };
      };

      // Journal entries
      journal_entries: {
        Row: {
          id: string;
          client_id: string;
          title: string | null;
          content: string;
          mood_rating: MoodRating | null;
          emotions: string[];
          tags: string[];
          shared_with_clinician: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title?: string | null;
          content: string;
          mood_rating?: MoodRating | null;
          emotions?: string[];
          tags?: string[];
          shared_with_clinician?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          content?: string;
          mood_rating?: MoodRating | null;
          emotions?: string[];
          tags?: string[];
          shared_with_clinician?: boolean;
          updated_at?: string;
        };
      };

      // Assessments (PHQ-9, GAD-7, etc.)
      assessments: {
        Row: {
          id: string;
          client_id: string;
          clinician_id: string | null;
          assessment_type: string;
          score: number;
          severity: string;
          responses: Json;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          clinician_id?: string | null;
          assessment_type: string;
          score: number;
          severity: string;
          responses: Json;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          score?: number;
          severity?: string;
          responses?: Json;
          notes?: string | null;
        };
      };

      // Messages
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
          read_at?: string | null;
        };
      };
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Commonly used types
export type User = Tables<'users'>;
export type ClinicianProfile = Tables<'clinician_profiles'>;
export type ClientProfile = Tables<'client_profiles'>;
export type Session = Tables<'sessions'>;
export type ClinicalNote = Tables<'clinical_notes'>;
export type MoodEntry = Tables<'mood_entries'>;
export type MealLog = Tables<'meal_logs'>;
export type HomeworkAssignment = Tables<'homework_assignments'>;
export type SafetyPlan = Tables<'safety_plans'>;
export type JournalEntry = Tables<'journal_entries'>;
export type Assessment = Tables<'assessments'>;
export type Message = Tables<'messages'>;
