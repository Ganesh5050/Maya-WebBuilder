# 🚀 Vercel Deployment Setup Guide

## How to Enable One-Click Deployment

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Vercel API Token** - Generate from Vercel dashboard
3. **Supabase Database** - Add deployments table

---

## 🔑 Step 1: Get Vercel API Token

### 1. Login to Vercel
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub, GitLab, or Bitbucket

### 2. Generate API Token
- Go to **Settings** → **Tokens**
- Click **Create Token**
- Name: `AI Website Builder`
- Scope: **Full Account**
- Expiration: **No Expiration** (or set as needed)
- Click **Create**

### 3. Copy Token
- Copy the generated token (starts with `vercel_`)
- **Important**: Save it securely, you won't see it again!

---

## 🔧 Step 2: Configure Environment Variable

### Option A: Local Development (.env.local)
Create or update `.env.local` in your project root:

```bash
# Vercel Deployment
REACT_APP_VERCEL_TOKEN=vercel_your_token_here_1234567890abcdef
```

### Option B: Production Deployment
Add to your hosting platform's environment variables:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add: `REACT_APP_VERCEL_TOKEN` = `your_token_here`

**Netlify:**
- Go to Site Settings → Environment Variables
- Add: `REACT_APP_VERCEL_TOKEN` = `your_token_here`

---

## 🗄️ Step 3: Setup Database Table

### Run SQL Migration
In your Supabase SQL Editor, run:

```sql
-- Create deployments table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deployments_app_id ON deployments(app_id);
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);

-- Enable RLS
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own deployments" ON deployments
  FOR ALL USING (user_id = auth.uid());
```

---

## ✅ Step 4: Test Deployment

### 1. Generate a Website
- Create a new app
- Generate a React website
- Wait for generation to complete

### 2. Click Deploy
- Click the green **Deploy** button
- Watch the progress in chat
- Wait for deployment to complete (2-5 minutes)

### 3. Success!
- You'll get a live URL like: `https://my-restaurant-abc123.vercel.app`
- Website is live on the internet
- Share the URL with anyone!

---

## 🎯 How It Works

### User Flow:
1. **Generate** → AI creates React project
2. **Deploy** → Click Deploy button
3. **Upload** → Files sent to Vercel
4. **Build** → Vercel runs `npm install` + `npm run build`
5. **Live** → Website available at unique URL

### Technical Flow:
```
React Project Files
       ↓
Vercel API (with token)
       ↓
Vercel Build System
       ↓
Live Website URL
       ↓
Saved to Database
```

---

## 🔍 Troubleshooting

### "Vercel token not configured"
- Check environment variable is set correctly
- Restart your development server
- Verify token starts with `vercel_`

### "Deployment failed"
- Check Vercel dashboard for build logs
- Ensure React project has no TypeScript errors
- Check if token has correct permissions

### "API Error 401"
- Token is invalid or expired
- Generate a new token from Vercel
- Update environment variable

### "API Error 403"
- Token doesn't have sufficient permissions
- Regenerate token with **Full Account** scope

### "Build failed"
- Check generated React project for errors
- Ensure all dependencies are in package.json
- Check Vercel build logs for specific errors

---

## 📊 Deployment Status

### Status Types:
- **BUILDING** - Vercel is building the project
- **READY** - Deployment successful, website is live
- **ERROR** - Build or deployment failed
- **CANCELED** - Deployment was canceled

### Monitoring:
- Progress shown in chat during deployment
- Final status saved to database
- Can view deployment history per app

---

## 🎨 Customization

### Custom Domains (Vercel Pro)
- Add custom domain in Vercel dashboard
- Point DNS to Vercel
- SSL automatically configured

### Build Settings
The deployment uses these settings:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### Environment Variables
Add to deployed project via Vercel dashboard:
- API keys
- Database URLs
- Feature flags

---

## 🔒 Security

### Token Security:
- Never commit tokens to git
- Use environment variables only
- Rotate tokens periodically
- Use minimal required permissions

### Deployment Security:
- All deployments use HTTPS
- Vercel provides DDoS protection
- Automatic security headers
- Edge network for fast loading

---

## 💰 Pricing

### Vercel Pricing:
- **Hobby** (Free): 100GB bandwidth, unlimited projects
- **Pro** ($20/month): Custom domains, analytics, more bandwidth
- **Enterprise**: Custom pricing for teams

### What's Included:
- Unlimited deployments
- Global CDN
- Automatic HTTPS
- Git integration
- Build logs
- Analytics (Pro+)

---

## 🚀 Next Steps

### After Setup:
1. ✅ Test deployment with sample project
2. ✅ Share live URLs with users
3. ✅ Monitor deployment success rate
4. ✅ Add custom domains (optional)
5. ✅ Set up analytics (optional)

### Future Enhancements:
- **Netlify Support** - Alternative deployment platform
- **Custom Domains** - Automatic domain setup
- **Deployment History** - View all past deployments
- **Rollback** - Revert to previous versions
- **Preview Deployments** - Deploy branches for testing

---

## 📞 Support

### If You Need Help:
1. **Check Logs** - Vercel dashboard → Project → Functions tab
2. **Vercel Docs** - [vercel.com/docs](https://vercel.com/docs)
3. **Community** - Vercel Discord or GitHub discussions
4. **Status** - [vercel-status.com](https://vercel-status.com)

---

## ✅ Checklist

Before going live:

- [ ] Vercel account created
- [ ] API token generated and saved securely
- [ ] Environment variable configured
- [ ] Database table created
- [ ] Test deployment successful
- [ ] Live URL accessible
- [ ] Deployment saved to database
- [ ] Error handling tested

**You're ready for production deployments!** 🎉

---

**Status:** Setup Guide Complete ✅  
**Next:** Test deployment with real project  
**Time:** ~15 minutes setup + 5 minutes per deployment