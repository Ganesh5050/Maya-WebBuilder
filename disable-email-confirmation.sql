-- Disable email confirmation in Supabase
-- Run this in your Supabase SQL Editor

UPDATE auth.config 
SET enable_signup = true, 
    enable_confirmations = false;

-- Also update the site URL to your production domain
UPDATE auth.config 
SET site_url = 'https://maya-web-builder.vercel.app';

-- Allow users to sign up without email confirmation
UPDATE auth.config 
SET mailer_autoconfirm = true;