-- Messages system for MindBridge internal clinician-client communication

-- Conversations table (one per clinician-client pair)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  clinician_unread INT DEFAULT 0,
  client_unread INT DEFAULT 0,
  UNIQUE(clinician_id, client_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('clinician', 'client')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_clinician_id ON conversations(clinician_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);

-- RLS policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Clinicians can see their own conversations
CREATE POLICY "clinician_conversations" ON conversations
  FOR ALL USING (clinician_id = auth.uid());

-- Clients can see their own conversations
CREATE POLICY "client_conversations" ON conversations
  FOR ALL USING (client_id = auth.uid());

-- Users can see messages in their conversations
CREATE POLICY "conversation_messages" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE clinician_id = auth.uid() OR client_id = auth.uid()
    )
  );

-- Function to update conversation metadata on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    clinician_unread = CASE
      WHEN NEW.sender_type = 'client' THEN clinician_unread + 1
      ELSE clinician_unread
    END,
    client_unread = CASE
      WHEN NEW.sender_type = 'clinician' THEN client_unread + 1
      ELSE client_unread
    END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();
