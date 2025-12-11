-- Test database connection and check if message_type column exists
-- Run this in Supabase SQL Editor to verify your setup

-- Check if chat_messages table exists
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
ORDER BY ordinal_position;

-- Check current chat_messages data
SELECT COUNT(*) as total_messages FROM chat_messages;

-- If message_type column doesn't exist, run this:
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS message_type TEXT NOT NULL DEFAULT 'generation' 
CHECK (message_type IN ('generation', 'discussion'));

-- Test inserting a message
INSERT INTO chat_messages (app_id, user_id, message_text, files, ai_response, message_type)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'Test message',
  '{}',
  '{"response": "test"}',
  'generation'
) ON CONFLICT DO NOTHING;

-- Verify the test message was inserted
SELECT * FROM chat_messages WHERE message_text = 'Test message';

-- Clean up test message
DELETE FROM chat_messages WHERE message_text = 'Test message';
