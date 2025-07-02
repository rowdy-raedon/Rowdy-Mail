-- Create temp_emails table
CREATE TABLE temp_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_id VARCHAR(255),
  team_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  messages_count INTEGER DEFAULT 0,
  improvmx_alias_id INTEGER
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  temp_email_id UUID REFERENCES temp_emails(id) ON DELETE CASCADE,
  from_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  body_html TEXT,
  attachments JSONB,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_temp_emails_user_id ON temp_emails(user_id);
CREATE INDEX idx_temp_emails_team_id ON temp_emails(team_id);
CREATE INDEX idx_temp_emails_active ON temp_emails(is_active);
CREATE INDEX idx_messages_temp_email_id ON messages(temp_email_id);
CREATE INDEX idx_messages_received_at ON messages(received_at);

-- Enable Row Level Security
ALTER TABLE temp_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for temp_emails
CREATE POLICY "Users can view their own temp emails" ON temp_emails
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own temp emails" ON temp_emails
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own temp emails" ON temp_emails
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own temp emails" ON temp_emails
  FOR DELETE USING (user_id = auth.uid()::text);

-- Create policies for messages
CREATE POLICY "Users can view messages for their temp emails" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM temp_emails 
      WHERE temp_emails.id = messages.temp_email_id 
      AND temp_emails.user_id = auth.uid()::text
    )
  );

CREATE POLICY "System can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update messages for their temp emails" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM temp_emails 
      WHERE temp_emails.id = messages.temp_email_id 
      AND temp_emails.user_id = auth.uid()::text
    )
  );

-- Function to automatically clean up expired emails
CREATE OR REPLACE FUNCTION cleanup_expired_emails()
RETURNS void AS $$
BEGIN
  DELETE FROM temp_emails 
  WHERE expires_at IS NOT NULL 
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update message count when new message arrives
CREATE OR REPLACE FUNCTION update_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE temp_emails 
    SET messages_count = messages_count + 1 
    WHERE id = NEW.temp_email_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE temp_emails 
    SET messages_count = messages_count - 1 
    WHERE id = OLD.temp_email_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update message count
CREATE TRIGGER trigger_update_message_count
  AFTER INSERT OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_message_count();