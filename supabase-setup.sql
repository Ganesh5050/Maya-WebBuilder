-- =====================================================
-- MAYA WEBSITE BUILDER - SUPABASE SETUP SQL
-- =====================================================
-- Run these commands in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/simngjnepjayqkwmkau/sql

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  domain TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create components table
CREATE TABLE IF NOT EXISTS public.components (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- header, hero, about, contact, etc.
  props JSONB DEFAULT '{}',
  styles JSONB DEFAULT '{}',
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'business', -- business, portfolio, blog, ecommerce
  preview_image TEXT,
  components JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create pages table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_components_project_id ON public.components(project_id);
CREATE INDEX IF NOT EXISTS idx_pages_project_id ON public.pages(project_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies

-- Profiles: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects: Users can view their own projects
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

-- Projects: Users can create their own projects
CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects: Users can update their own projects
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Projects: Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Components: Users can view components of their own projects
CREATE POLICY "Users can view own project components" ON public.components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = components.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Components: Users can manage components of their own projects
CREATE POLICY "Users can manage own project components" ON public.components
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = components.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Templates: Everyone can view public templates
CREATE POLICY "Everyone can view public templates" ON public.templates
  FOR SELECT USING (is_public = true);

-- Pages: Users can view pages of their own projects
CREATE POLICY "Users can view own project pages" ON public.pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = pages.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Pages: Users can manage pages of their own projects
CREATE POLICY "Users can manage own project pages" ON public.pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = pages.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- 10. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Insert some sample templates
INSERT INTO public.templates (name, description, category, components) VALUES
('Business Landing', 'Professional business landing page template', 'business', '[
  {"type": "header", "props": {"title": "Your Company", "logo": ""}, "order": 0},
  {"type": "hero", "props": {"title": "Welcome to Our Business", "subtitle": "We create amazing solutions"}, "order": 1},
  {"type": "about", "props": {"title": "About Us", "content": "Learn more about our company"}, "order": 2},
  {"type": "contact", "props": {"title": "Contact Us", "email": "contact@example.com"}, "order": 3}
]'),
('Portfolio', 'Creative portfolio template for designers and artists', 'portfolio', '[
  {"type": "header", "props": {"title": "My Portfolio", "logo": ""}, "order": 0},
  {"type": "hero", "props": {"title": "John Doe", "subtitle": "Full Stack Developer"}, "order": 1},
  {"type": "about", "props": {"title": "About Me", "content": "Passionate developer with 5+ years experience"}, "order": 2},
  {"type": "contact", "props": {"title": "Get In Touch", "email": "john@example.com"}, "order": 3}
]'),
('Blog', 'Clean and modern blog template', 'blog', '[
  {"type": "header", "props": {"title": "My Blog", "logo": ""}, "order": 0},
  {"type": "hero", "props": {"title": "Welcome to My Blog", "subtitle": "Sharing thoughts and ideas"}, "order": 1},
  {"type": "about", "props": {"title": "About the Author", "content": "Writer, thinker, creator"}, "order": 2}
]') ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE! 🎉
-- =====================================================
-- 
-- Next Steps:
-- 1. Test signup/login functionality
-- 2. Verify tables were created in Table Editor
-- 3. Check RLS policies in Authentication > Policies
-- 
-- Your authentication should now work properly!
