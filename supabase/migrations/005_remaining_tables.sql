-- Migration 005: Remaining tables for MindBridge
-- Run in Supabase SQL Editor

-- clinician_tasks table
CREATE TABLE IF NOT EXISTS clinician_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  client_name TEXT,
  client_id UUID REFERENCES users(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT,
  due_label TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE clinician_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clinician_tasks_own" ON clinician_tasks FOR ALL USING (clinician_id = auth.uid()) WITH CHECK (clinician_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_clinician_tasks_clinician_id ON clinician_tasks(clinician_id);

-- clinician_library_documents table
CREATE TABLE IF NOT EXISTS clinician_library_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'pdf',
  category TEXT NOT NULL DEFAULT 'Other',
  tags TEXT[] DEFAULT '{}',
  size_bytes BIGINT,
  storage_path TEXT,
  url TEXT,
  starred BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE clinician_library_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clinician_docs_own" ON clinician_library_documents FOR ALL USING (clinician_id = auth.uid()) WITH CHECK (clinician_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_clinician_docs_clinician_id ON clinician_library_documents(clinician_id);

-- clinician_custom_templates table
CREATE TABLE IF NOT EXISTS clinician_custom_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'custom',
  note_format TEXT DEFAULT 'structured',
  tags TEXT[] DEFAULT '{}',
  sections JSONB DEFAULT '[]',
  suggested_duration INTEGER DEFAULT 50,
  color TEXT DEFAULT 'bg-stone-500',
  is_starred BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE clinician_custom_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clinician_templates_own" ON clinician_custom_templates FOR ALL USING (clinician_id = auth.uid()) WITH CHECK (clinician_id = auth.uid());

-- RLS INSERT fix for users table
DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (id = auth.uid());

-- treatment_goals (if not exists)
CREATE TABLE IF NOT EXISTS treatment_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'paused', 'discontinued')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  milestones JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE treatment_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "treatment_goals_clinician" ON treatment_goals FOR ALL USING (clinician_id = auth.uid()) WITH CHECK (clinician_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_treatment_goals_client_id ON treatment_goals(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_clinician_id ON treatment_goals(clinician_id);

-- onboarding_invites (if not exists)
CREATE TABLE IF NOT EXISTS onboarding_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES users(id),
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE onboarding_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onboarding_invites_clinician" ON onboarding_invites FOR ALL USING (clinician_id = auth.uid()) WITH CHECK (clinician_id = auth.uid());
CREATE POLICY "onboarding_invites_token_select" ON onboarding_invites FOR SELECT USING (TRUE);

-- MHTP columns on client_profiles (if not exists)
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS mhtp_sessions_total INTEGER DEFAULT 10;
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS mhtp_sessions_used INTEGER DEFAULT 0;
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS referral_expiry DATE;
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS gp_referral_number TEXT;

-- Session reminder columns
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS reminder_48h_sent BOOLEAN DEFAULT FALSE;

-- Storage bucket for clinician documents (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('clinician-documents', 'clinician-documents', false) ON CONFLICT DO NOTHING;
-- CREATE POLICY "clinician_docs_storage_own" ON storage.objects FOR ALL USING (bucket_id = 'clinician-documents' AND auth.uid()::text = (storage.foldername(name))[1]) WITH CHECK (bucket_id = 'clinician-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
