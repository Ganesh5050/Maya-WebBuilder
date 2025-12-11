-- Add message_type column to existing chat_messages table
-- Run this in Supabase SQL Editor if you already have the table

ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS message_type TEXT NOT NULL DEFAULT 'generation' 
CHECK (message_type IN ('generation', 'discussion'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_type ON chat_messages(message_type);

-- Update existing messages to be 'generation' type
UPDATE chat_messages 
SET message_type = 'generation' 
WHERE message_type IS NULL;
