-- Create deployments table for tracking Vercel/Netlify deployments
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS deployments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  deployment_id TEXT NOT NULL,
  url TEXT,
  status TEXT NOT NULL CHECK (status IN ('BUILDING', 'READY', 'ERROR', 'CANCELED')),
  platform TEXT NOT NULL CHECK (platform IN ('vercel', 'netlify')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deployments_app_id ON deployments(app_id);
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON deployments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own deployments" ON deployments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own deployments" ON deployments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own deployments" ON deployments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own deployments" ON deployments
  FOR DELETE USING (user_id = auth.uid());

-- Add comments
COMMENT ON TABLE deployments IS 'Tracks website deployments to Vercel, Netlify, etc.';
COMMENT ON COLUMN deployments.deployment_id IS 'External deployment ID from the platform';
COMMENT ON COLUMN deployments.url IS 'Live URL of the deployed website';
COMMENT ON COLUMN deployments.status IS 'Current deployment status';
COMMENT ON COLUMN deployments.platform IS 'Deployment platform (vercel, netlify)';