-- Create apps table
CREATE TABLE IF NOT EXISTS apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Unpublished')),
  visibility TEXT NOT NULL DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private')),
  starred BOOLEAN DEFAULT false,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  files TEXT[] DEFAULT '{}',
  ai_response JSONB,
  message_type TEXT NOT NULL DEFAULT 'generation' CHECK (message_type IN ('generation', 'discussion')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create website_generations table
CREATE TABLE IF NOT EXISTS website_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  js TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apps_user_id ON apps(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_starred ON apps(user_id, starred);
CREATE INDEX IF NOT EXISTS idx_apps_last_accessed ON apps(user_id, last_accessed DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_app_id ON chat_messages(app_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_website_generations_app_id ON website_generations(app_id);
CREATE INDEX IF NOT EXISTS idx_website_generations_user_id ON website_generations(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for apps table
CREATE POLICY "Users can view own apps" ON apps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own apps" ON apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own apps" ON apps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own apps" ON apps FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for chat_messages table
CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat messages" ON chat_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat messages" ON chat_messages FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for website_generations table
CREATE POLICY "Users can view own website generations" ON website_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own website generations" ON website_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own website generations" ON website_generations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own website generations" ON website_generations FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
