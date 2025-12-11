# 🚀 Deployment Guide - AI Website Builder

## Current Issues & Solutions

### 🔴 Issues You're Experiencing:
1. **E2B Sandbox Limit**: "Rate limit exceeded - maximum 20 concurrent sandboxes"
2. **Iframe Blocking**: E2B preview blocked between localhost and E2B domains
3. **Network Errors**: QUIC protocol errors when connecting to E2B

### ✅ Solutions Implemented:
1. **Auto Sandbox Cleanup**: Sandboxes now auto-cleanup after 30 minutes
2. **Smart Sandbox Management**: Reuse existing sandboxes, limit to 3 concurrent
3. **Better Error Handling**: Clear error messages with retry options
4. **Production Deployment**: Deploy to Vercel to resolve iframe blocking

---

## 🎯 Deploy to Vercel (Recommended Solution)

### Step 1: Prepare for Deployment

Your API keys are safely backed up in `API_KEYS_BACKUP.txt`. The code is already configured to use environment variables.

### Step 2: Deploy to Vercel

1. **Push to GitHub** (if not done already):
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `https://github.com/Ganesh5050/Maya-WebBuilder`
   - Vercel will auto-detect it's a Vite React app

### Step 3: Configure Environment Variables in Vercel

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

**📋 Copy these values from your `API_KEYS_BACKUP.txt` file:**

```
VITE_E2B_API_KEY=[your_e2b_api_key]
VITE_OPENAI_API_KEY=[your_openai_api_key]
VITE_GOOGLE_API_KEY=[your_google_api_key]
VITE_GROQ_API_KEY=[your_groq_api_key]
VITE_CHUTE_API_KEY=[your_chute_api_key]
VITE_AIML_API_KEY=[your_aiml_api_key]
VITE_VERCEL_TOKEN=[your_vercel_token]
```

**⚠️ Important**: Use the actual values from your `API_KEYS_BACKUP.txt` file, not the placeholders above.

### Step 4: Deploy and Test

1. Click **Deploy** in Vercel
2. Wait for deployment to complete
3. Test the live preview functionality
4. E2B iframe blocking should be resolved in production!

---

## 🛠️ Local Development Improvements

### Immediate Fixes Applied:

1. **Sandbox Cleanup**: 
   - Auto-cleanup after 30 minutes
   - Manual cleanup when hitting limits
   - Reuse existing sandboxes

2. **Better Error Messages**:
   - Clear explanations for sandbox limits
   - Network error guidance
   - Retry and refresh options

3. **Fallback for Iframe Blocking**:
   - Detect localhost environment
   - Show "Open in New Tab" option
   - Explain production deployment benefits

### Testing the Fixes:

1. **Generate a new website** - should work better now
2. **If you hit sandbox limit** - wait 5 minutes or refresh page
3. **For iframe issues** - click "Open in New Tab" to see preview

---

## 🎉 Expected Results After Deployment

### ✅ In Production (Vercel):
- ✅ E2B live preview works perfectly in iframe
- ✅ No CORS/iframe blocking issues
- ✅ Professional AI website builder experience
- ✅ All features work as intended

### ⚠️ In Development (localhost):
- ⚠️ E2B preview may be blocked in iframe
- ✅ "Open in New Tab" works perfectly
- ✅ All other features work normally
- ✅ Better error handling and cleanup

---

## 🔧 Quick Commands

### Deploy to Vercel:
```bash
# If not already pushed to GitHub
git add .
git commit -m "Production ready"
git push origin main

# Then deploy via Vercel dashboard
```

### Force Cleanup (if needed):
```bash
# Refresh the page to trigger cleanup
# Or wait 5-10 minutes for auto-cleanup
```

---

## 📞 Support

If you encounter any issues:

1. **Check the console** for detailed error messages
2. **Try the "Open in New Tab"** option for E2B previews
3. **Deploy to production** for the best experience
4. **Refresh the page** if you hit sandbox limits

The production deployment will resolve the main iframe blocking issue you're experiencing! 🚀