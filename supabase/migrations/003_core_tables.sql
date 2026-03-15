-- Core tables for MindBridge clinical platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('clinician', 'client', 'admin')) DEFAULT 'client',
  phone TEXT,
  date_of_birth DATE,
  pronouns TEXT,
  gender TEXT,
  address TEXT,
  suburb TEXT,
  state TEXT,
  postcode TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Australia/Sydney',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Clinician profiles table
CREATE TABLE IF NOT EXISTS clinician_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  credentials TEXT,
  registration_number TEXT,
  registration_body TEXT,
  specializations TEXT[] DEFAULT '{}',
  bio TEXT,
  practice_name TEXT,
  practice_address TEXT,
  practice_phone TEXT,
  abn TEXT,
  medicare_provider_number TEXT,
  default_session_duration INT DEFAULT 50,
  default_session_fee DECIMAL(10,2) DEFAULT 220,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client profiles table
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  clinician_id UUID REFERENCES users(id) ON DELETE SET NULL,
  current_risk_level TEXT DEFAULT 'low' CHECK (current_risk_level IN ('low','moderate','high','critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','discharged','waitlist')),
  primary_diagnosis TEXT,
  secondary_diagnoses TEXT[] DEFAULT '{}',
  treatment_approach TEXT,
  treatment_start_date DATE,
  session_count INT DEFAULT 0,
  medicare_number TEXT,
  referral_source TEXT,
  referrer_name TEXT,
  referral_date DATE,
  gp_name TEXT,
  gp_phone TEXT,
  gp_address TEXT,
  psychiatrist_name TEXT,
  psychiatrist_phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  secondary_contact_name TEXT,
  secondary_contact_phone TEXT,
  secondary_contact_relationship TEXT,
  billing_type TEXT CHECK (billing_type IN ('private','medicare','dva','insurance','ndis')),
  health_fund TEXT,
  health_fund_number TEXT,
  ndis_number TEXT,
  ndis_manager TEXT,
  invoice_email TEXT,
  preferred_session_time TEXT,
  preferred_session_day TEXT,
  session_reminders BOOLEAN DEFAULT TRUE,
  reminder_method TEXT DEFAULT 'email' CHECK (reminder_method IN ('sms','email','both')),
  consent_to_telehealth BOOLEAN DEFAULT FALSE,
  consent_to_recording BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('individual','family','group','telehealth','phone')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed','cancelled','no_show')),
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 50,
  fee DECIMAL(10,2),
  telehealth_link TEXT,
  location TEXT,
  notes_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinical notes table
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  note_format TEXT NOT NULL CHECK (note_format IN ('soap','dap','birp','narrative','brief','structured')),
  content JSONB NOT NULL DEFAULT '{}',
  transcript TEXT,
  ai_generated BOOLEAN DEFAULT FALSE,
  is_signed BOOLEAN DEFAULT FALSE,
  signed_at TIMESTAMPTZ,
  risk_level TEXT CHECK (risk_level IN ('low','moderate','high','critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homework assignments table
CREATE TABLE IF NOT EXISTS homework_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other' CHECK (category IN ('worksheet','exercise','reading','practice','journal','other')),
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned','in_progress','completed','overdue')),
  client_response TEXT,
  clinician_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety plans table
CREATE TABLE IF NOT EXISTS safety_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  warning_signs TEXT[] DEFAULT '{}',
  coping_strategies TEXT[] DEFAULT '{}',
  social_contacts JSONB DEFAULT '[]',
  professional_contacts JSONB DEFAULT '[]',
  safe_environment TEXT[] DEFAULT '{}',
  reasons_for_living TEXT[] DEFAULT '{}',
  crisis_resources JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  last_reviewed TIMESTAMPTZ DEFAULT NOW(),
  next_review_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  emotions TEXT[] DEFAULT '{}',
  notes TEXT,
  shared_with_clinician BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood INT CHECK (mood BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_clinician_profiles_user_id ON clinician_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_client_profiles_clinician_id ON client_profiles(clinician_id);
CREATE INDEX IF NOT EXISTS idx_sessions_clinician_id ON sessions(clinician_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_id ON sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_start ON sessions(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_clinician_id ON clinical_notes(clinician_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_client_id ON clinical_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_session_id ON clinical_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_clinician_id ON homework_assignments(clinician_id);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_client_id ON homework_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_safety_plans_client_id ON safety_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_safety_plans_clinician_id ON safety_plans(clinician_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_client_id ON mood_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_client_id ON journal_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS: users
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());

-- RLS: clinician_profiles
CREATE POLICY "clinician_profiles_own" ON clinician_profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "clinician_profiles_read_client_clinician" ON clinician_profiles
  FOR SELECT USING (
    user_id IN (
      SELECT clinician_id FROM client_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS: client_profiles
CREATE POLICY "client_profiles_clinician_crud" ON client_profiles
  FOR ALL USING (clinician_id = auth.uid());

CREATE POLICY "client_profiles_read_own" ON client_profiles
  FOR SELECT USING (user_id = auth.uid());

-- RLS: sessions
CREATE POLICY "sessions_clinician_crud" ON sessions
  FOR ALL USING (clinician_id = auth.uid());

CREATE POLICY "sessions_client_read" ON sessions
  FOR SELECT USING (client_id = auth.uid());

-- RLS: clinical_notes
CREATE POLICY "clinical_notes_clinician_crud" ON clinical_notes
  FOR ALL USING (clinician_id = auth.uid());

-- RLS: homework_assignments
CREATE POLICY "homework_clinician_crud" ON homework_assignments
  FOR ALL USING (clinician_id = auth.uid());

CREATE POLICY "homework_client_read_update" ON homework_assignments
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "homework_client_update" ON homework_assignments
  FOR UPDATE USING (client_id = auth.uid());

-- RLS: safety_plans
CREATE POLICY "safety_plans_clinician_crud" ON safety_plans
  FOR ALL USING (clinician_id = auth.uid());

CREATE POLICY "safety_plans_client_read" ON safety_plans
  FOR SELECT USING (client_id = auth.uid());

-- RLS: mood_entries
CREATE POLICY "mood_entries_client_crud" ON mood_entries
  FOR ALL USING (client_id = auth.uid());

CREATE POLICY "mood_entries_clinician_read_shared" ON mood_entries
  FOR SELECT USING (
    shared_with_clinician = TRUE AND
    client_id IN (
      SELECT user_id FROM client_profiles WHERE clinician_id = auth.uid()
    )
  );

-- RLS: journal_entries
CREATE POLICY "journal_entries_client_crud" ON journal_entries
  FOR ALL USING (client_id = auth.uid());
