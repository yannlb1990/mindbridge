-- MindBridge Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('clinician', 'client', 'admin', 'parent');
CREATE TYPE session_type AS ENUM ('individual', 'family', 'group', 'telehealth', 'phone');
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE risk_level AS ENUM ('low', 'moderate', 'high', 'critical');
CREATE TYPE homework_status AS ENUM ('assigned', 'in_progress', 'completed', 'overdue');
CREATE TYPE note_format AS ENUM ('soap', 'dap', 'birp', 'narrative', 'brief');

-- =============================================
-- TABLES
-- =============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    preferred_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    pronouns TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Australia/Sydney',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- Clinician profiles
CREATE TABLE clinician_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    credentials TEXT NOT NULL,
    registration_number TEXT,
    specializations TEXT[] DEFAULT '{}',
    bio TEXT,
    practice_name TEXT,
    practice_address TEXT,
    abn TEXT,
    medicare_provider_number TEXT,
    default_session_duration INTEGER DEFAULT 50,
    default_session_fee DECIMAL(10,2) DEFAULT 220.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client profiles
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    clinician_id UUID REFERENCES users(id),
    parent_id UUID REFERENCES users(id),
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    referrer_name TEXT,
    referrer_type TEXT,
    referral_date DATE,
    primary_diagnosis TEXT,
    diagnosis_code TEXT,
    secondary_diagnoses JSONB,
    current_risk_level risk_level DEFAULT 'low',
    treatment_start_date DATE,
    treatment_approach TEXT,
    session_count INTEGER DEFAULT 0,
    medicare_number TEXT,
    ndis_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinician_id UUID NOT NULL REFERENCES users(id),
    client_id UUID NOT NULL REFERENCES users(id),
    session_type session_type NOT NULL,
    status session_status DEFAULT 'scheduled',
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 50,
    fee DECIMAL(10,2),
    is_paid BOOLEAN DEFAULT false,
    telehealth_link TEXT,
    location TEXT,
    notes_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinical notes
CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id),
    clinician_id UUID NOT NULL REFERENCES users(id),
    client_id UUID NOT NULL REFERENCES users(id),
    note_format note_format NOT NULL,
    content JSONB NOT NULL,
    transcript TEXT,
    ai_generated BOOLEAN DEFAULT false,
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    risk_level risk_level,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mood entries
CREATE TABLE mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    emotions TEXT[] DEFAULT '{}',
    notes TEXT,
    shared_with_clinician BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal logs
CREATE TABLE meal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL,
    meal_time TIMESTAMPTZ NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    anxiety_before INTEGER DEFAULT 5 CHECK (anxiety_before >= 0 AND anxiety_before <= 10),
    anxiety_after INTEGER DEFAULT 5 CHECK (anxiety_after >= 0 AND anxiety_after <= 10),
    urges TEXT[] DEFAULT '{}',
    urge_acted_on BOOLEAN DEFAULT false,
    notes TEXT,
    shared_with_clinician BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homework assignments
CREATE TABLE homework_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinician_id UUID NOT NULL REFERENCES users(id),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    exercise_data JSONB,
    status homework_status DEFAULT 'assigned',
    due_date DATE,
    completed_at TIMESTAMPTZ,
    response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety plans
CREATE TABLE safety_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    warning_signs TEXT[] DEFAULT '{}',
    coping_strategies TEXT[] DEFAULT '{}',
    support_people JSONB DEFAULT '[]',
    professional_contacts JSONB DEFAULT '[]',
    crisis_helplines JSONB DEFAULT '[
        {"name": "Lifeline", "phone": "13 11 14"},
        {"name": "Beyond Blue", "phone": "1300 22 4636"},
        {"name": "Kids Helpline", "phone": "1800 55 1800"},
        {"name": "Butterfly Foundation", "phone": "1800 334 673"}
    ]',
    reasons_to_live TEXT[] DEFAULT '{}',
    safe_environment_steps TEXT[] DEFAULT '{}',
    last_reviewed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    emotions TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    shared_with_clinician BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clinician_id UUID REFERENCES users(id),
    assessment_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    severity TEXT NOT NULL,
    responses JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_client_profiles_clinician ON client_profiles(clinician_id);
CREATE INDEX idx_sessions_clinician ON sessions(clinician_id);
CREATE INDEX idx_sessions_client ON sessions(client_id);
CREATE INDEX idx_sessions_date ON sessions(scheduled_start);
CREATE INDEX idx_clinical_notes_client ON clinical_notes(client_id);
CREATE INDEX idx_mood_entries_client ON mood_entries(client_id);
CREATE INDEX idx_meal_logs_client ON meal_logs(client_id);
CREATE INDEX idx_homework_client ON homework_assignments(client_id);
CREATE INDEX idx_journal_client ON journal_entries(client_id);
CREATE INDEX idx_assessments_client ON assessments(client_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Clinicians can view their clients
CREATE POLICY "Clinicians can view their clients" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM client_profiles
            WHERE client_profiles.user_id = users.id
            AND client_profiles.clinician_id = auth.uid()
        )
    );

-- Sessions: Clinicians and clients can view their sessions
CREATE POLICY "Users can view their sessions" ON sessions
    FOR SELECT USING (
        auth.uid() = clinician_id OR auth.uid() = client_id
    );

CREATE POLICY "Clinicians can manage sessions" ON sessions
    FOR ALL USING (auth.uid() = clinician_id);

-- Clinical notes: Only clinicians can access
CREATE POLICY "Clinicians can manage notes" ON clinical_notes
    FOR ALL USING (auth.uid() = clinician_id);

-- Mood entries: Clients own their data, clinicians can view if shared
CREATE POLICY "Clients can manage mood entries" ON mood_entries
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Clinicians can view shared mood entries" ON mood_entries
    FOR SELECT USING (
        shared_with_clinician = true AND
        EXISTS (
            SELECT 1 FROM client_profiles
            WHERE client_profiles.user_id = mood_entries.client_id
            AND client_profiles.clinician_id = auth.uid()
        )
    );

-- Similar policies for other tables...
-- (Add more RLS policies as needed)

-- =============================================
-- FUNCTIONS
-- =============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clinician_profiles_timestamp
    BEFORE UPDATE ON clinician_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_client_profiles_timestamp
    BEFORE UPDATE ON client_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_timestamp
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clinical_notes_timestamp
    BEFORE UPDATE ON clinical_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_homework_timestamp
    BEFORE UPDATE ON homework_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_safety_plans_timestamp
    BEFORE UPDATE ON safety_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_journal_timestamp
    BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Uncomment to insert sample data for testing
/*
INSERT INTO users (id, email, role, first_name, last_name, credentials)
VALUES
    ('clinician-uuid-here', 'dr.smith@example.com', 'clinician', 'Jane', 'Smith');
*/
