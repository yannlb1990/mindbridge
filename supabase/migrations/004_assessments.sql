-- =============================================
-- Migration 004: Assessments table
-- =============================================

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinician_id UUID REFERENCES users(id),
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('PHQ-9', 'GAD-7', 'EDE-Q', 'DASS-21', 'K10', 'CORE-10')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  score INTEGER,
  severity TEXT,
  responses JSONB DEFAULT '{}',
  notes TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_client_id ON assessments(client_id);
CREATE INDEX IF NOT EXISTS idx_assessments_clinician_id ON assessments(clinician_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Clients can read their own assessments and update (to complete them)
CREATE POLICY "assessments_client_select" ON assessments
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "assessments_client_update" ON assessments
  FOR UPDATE USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- Clinicians can read assessments for their clients
CREATE POLICY "assessments_clinician_read" ON assessments
  FOR SELECT USING (
    clinician_id = auth.uid()
    OR client_id IN (
      SELECT user_id FROM client_profiles WHERE clinician_id = auth.uid()
    )
  );

-- Clinicians can send (insert) assessments
CREATE POLICY "assessments_clinician_insert" ON assessments
  FOR INSERT WITH CHECK (
    clinician_id = auth.uid()
  );

-- Clinicians can update (add notes, etc.)
CREATE POLICY "assessments_clinician_update" ON assessments
  FOR UPDATE USING (clinician_id = auth.uid())
  WITH CHECK (clinician_id = auth.uid());
