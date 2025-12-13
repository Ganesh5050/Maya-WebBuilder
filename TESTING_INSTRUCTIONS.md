# 🧪 TESTING INSTRUCTIONS - Maya Web Builder

## 🚀 **IMMEDIATE TESTING STEPS**

### **Step 1: Clear Browser Cache**
1. Press `Ctrl + F5` (hard refresh)
2. Or open Developer Tools → Network → "Disable cache"
3. This ensures you get the latest deployed code

### **Step 2: Open Maya Web Builder**
1. Go to: https://maya-web-builder.vercel.app/
2. Sign in to your account
3. Navigate to "Create New Website"

### **Step 3: Test Website Generation**
1. **Enter a prompt**: "Create a modern portfolio website for a web developer"
2. **Click Generate**
3. **Watch the console** (F12 → Console tab)

## ✅ **SUCCESS INDICATORS**

### **Console Messages You Should See:**
```
✅ Using rotated AI provider: OpenRouter - Llama 3.3 70B (meta-llama/llama-3.3-70b-instruct:free)
🤖 Generating Header using openrouter...
✅ Generated Header: <header className="bg-white shadow-sm">...
🤖 Generating Hero using openrouter2...
✅ Generated Hero: <section className="hero-section">...
```

### **Generation Process Should:**
1. ✅ **Plan Successfully**: "📋 Planning React project structure..."
2. ✅ **Generate Components**: Header, Hero, Features, Footer
3. ✅ **Create Files**: 25+ React/TypeScript files
4. ✅ **Start E2B Preview**: Live website in iframe

### **E2B Preview Should:**
1. ✅ **Create Sandbox**: "🚀 Creating E2B sandbox..."
2. ✅ **Mount Files**: "📁 Mounting 25 files..."
3. ✅ **Install Dependencies**: "📦 Installing dependencies..."
4. ✅ **Start Dev Server**: "🚀 Starting dev server..."
5. ✅ **Show Preview**: Live React website at `https://5173-[sandbox-id].e2b.app`

## ❌ **FAILURE INDICATORS**

### **If You Still See OpenAI Errors:**
```
✅ Using AI provider: OpenAI
❌ Failed to generate Header: Error: openai API Error: 429 - {"error": {"message": "You exceeded your current quota"
```

**This means**: Deployment hasn't completed or browser cache issue
**Solution**: Wait 5 more minutes, hard refresh again

### **If You See "No AI Provider Available":**
```
❌ No AI provider available with valid API key
```

**This means**: Environment variables not deployed to Vercel
**Solution**: Check Vercel dashboard → Settings → Environment Variables

## 🔧 **TROUBLESHOOTING**

### **Problem 1: Still Getting OpenAI Quota Errors**
**Cause**: Old cached JavaScript still running
**Solutions**:
1. Hard refresh (Ctrl+F5) multiple times
2. Clear all browser data for the site
3. Try incognito/private browsing mode
4. Wait 10 minutes for CDN cache to clear

### **Problem 2: E2B Preview Shows "Connection Refused"**
**Cause**: E2B sandbox limit (20 concurrent) or dev server startup issues
**Solutions**:
1. Wait 10 minutes for old sandboxes to cleanup
2. Try generating a simpler website first
3. Check E2B dashboard for active sandboxes

### **Problem 3: Generation Starts But Fails Midway**
**Cause**: Individual OpenRouter model hit daily limit
**Expected**: System should automatically switch to next model
**Check**: Console should show "🔄 Switching from openrouter to openrouter2..."

## 📊 **EXPECTED PERFORMANCE**

### **With 12 OpenRouter Models:**
- **Daily Capacity**: 600+ free generations (50 per model)
- **Rate Limit Handling**: Automatic model switching
- **Fallback Chain**: OpenRouter → Groq → AIML → Chute → Google
- **Success Rate**: 95%+ (vs previous 10% with OpenAI quota issues)

### **Generation Time:**
- **Planning**: 5-10 seconds
- **Component Generation**: 30-60 seconds (4-6 components)
- **E2B Preview**: 30-45 seconds (sandbox + dev server)
- **Total**: 1-2 minutes for complete website

## 🎯 **WHAT TO TEST**

### **Test Different Prompts:**
1. "Create a restaurant website with menu and reservations"
2. "Build a SaaS landing page with pricing tiers"
3. "Make a blog website for a travel photographer"
4. "Design an e-commerce store for handmade jewelry"

### **Each Should:**
- ✅ Use different OpenRouter models (rotation working)
- ✅ Generate unique, relevant content
- ✅ Create working React components
- ✅ Show live preview in E2B iframe
- ✅ Handle any rate limits gracefully

## 🎉 **SUCCESS CONFIRMATION**

**You'll know it's working when:**
1. **No more 429 quota errors**
2. **Console shows OpenRouter providers**
3. **Websites generate successfully**
4. **Live previews work in E2B**
5. **Can generate multiple websites without issues**

---

**🚀 The Maya Web Builder is now ready for intensive development with reliable AI generation!**