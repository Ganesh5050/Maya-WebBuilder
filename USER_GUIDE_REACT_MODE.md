# 🎯 User Guide: React Mode

## How to Use the React Generator

---

## 🚀 Quick Start

### Step 1: Open Your App
1. Go to http://localhost:5174/
2. Click "Create New App" or open existing app

### Step 2: Choose Mode
In the chat input area, you'll see two buttons:
```
[Static] [React]
```

- **Static** = HTML/CSS/JS (simple, fast)
- **React** = React + TypeScript (modern, powerful)

### Step 3: Select React Mode
Click the **[React]** button. It will highlight to show it's selected.

### Step 4: Describe Your Website
Type what you want, for example:
- "Create a restaurant website"
- "Build a SaaS landing page"
- "Make a portfolio for a photographer"
- "Create an e-commerce store"

### Step 5: Watch It Generate
You'll see progress messages:
```
🚀 Building your React website...
🤔 Analyzing your requirements...
📋 Planning React project structure...
🎨 Will create: 4 components
📦 Base template created...
📝 Creating Header...
📝 Creating Hero...
📝 Creating Features...
📝 Creating Footer...
🎯 Creating App.tsx...
🎨 Creating styles...
🔧 Finalizing project...
✅ React project generated successfully!
```

### Step 6: Download
1. Click the ⋯ (three dots) menu
2. Click "Download website"
3. ZIP file downloads

### Step 7: Extract and Run
```bash
# Extract the ZIP
unzip my-restaurant-app.zip
cd my-restaurant-app

# Install dependencies (takes 1-2 minutes)
npm install

# Start development server
npm run dev
```

### Step 8: Open in Browser
Open http://localhost:5173

**Your React app is running!** 🎉

---

## 🎨 What You Get

### File Structure:
```
my-app/
├── src/
│   ├── components/
│   │   ├── Header.tsx       ← Navigation
│   │   ├── Hero.tsx         ← Hero section
│   │   ├── Features.tsx     ← Features
│   │   └── Footer.tsx       ← Footer
│   ├── lib/
│   │   └── utils.ts         ← Utilities
│   ├── App.tsx              ← Main app
│   ├── main.tsx             ← Entry point
│   └── index.css            ← Styles
├── package.json             ← Dependencies
├── vite.config.ts           ← Vite config
├── tailwind.config.js       ← Tailwind config
├── tsconfig.json            ← TypeScript config
└── README.md                ← Instructions
```

### Technologies:
- ✅ React 18
- ✅ TypeScript 5
- ✅ Vite 5 (fast dev server)
- ✅ Tailwind CSS 3
- ✅ Lucide React (icons)
- ✅ Hot Module Reload

---

## 🔄 Making Changes

### After Generation:

1. **Modify Components**
   - Edit files in `src/components/`
   - Changes appear instantly (hot reload)

2. **Change Colors**
   - Edit `tailwind.config.js`
   - Modify CSS variables in `src/index.css`

3. **Add New Components**
   - Create new `.tsx` file in `src/components/`
   - Import in `App.tsx`

4. **Add Pages**
   - Install React Router: `npm install react-router-dom`
   - Create page components
   - Set up routing

### Ask AI for Changes:
Just type in chat:
- "Add a pricing section"
- "Change colors to blue"
- "Add a contact form"
- "Make it more modern"

AI will update the code!

---

## 📊 Static vs React: When to Use Each

### Use Static Mode When:
- ✅ Simple website (landing page, portfolio)
- ✅ No complex interactions
- ✅ Want instant preview
- ✅ Don't want to run npm install
- ✅ Just need HTML/CSS/JS

### Use React Mode When:
- ✅ Complex web application
- ✅ Need components and reusability
- ✅ Want TypeScript type safety
- ✅ Need state management
- ✅ Building something you'll maintain
- ✅ Want modern development experience

---

## 🎯 Examples

### Example 1: Restaurant Website (React)

**Prompt:** "Create a restaurant website"

**What You Get:**
- Header with navigation (Home, Menu, Reservations, Contact)
- Hero section with restaurant name and tagline
- Menu section with food items
- Reservations form
- Footer with contact info
- Warm colors (orange, red, brown)
- Elegant design

**Files Generated:** 15+ files
**Setup Time:** 2 minutes (npm install)
**Result:** Full React app

---

### Example 2: SaaS Landing Page (React)

**Prompt:** "Create a SaaS landing page for a project management tool"

**What You Get:**
- Header with navigation and CTA
- Hero with product description
- Features section (3-4 features)
- Pricing table (3 tiers)
- Testimonials
- Footer with links
- Modern blue/purple colors
- Clean, professional design

**Files Generated:** 15+ files
**Setup Time:** 2 minutes
**Result:** Production-ready landing page

---

### Example 3: Portfolio (React)

**Prompt:** "Create a portfolio for a graphic designer"

**What You Get:**
- Header with navigation
- Hero with designer intro
- Projects gallery (grid layout)
- Skills section
- About section
- Contact form
- Footer
- Creative, colorful design

**Files Generated:** 15+ files
**Setup Time:** 2 minutes
**Result:** Beautiful portfolio site

---

## 🛠️ Customization

### Change Colors:

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3B82F6',  // Change this
        600: '#2563EB',  // And this
      },
    },
  },
}
```

### Add New Component:

1. Create `src/components/Pricing.tsx`:
```typescript
export default function Pricing() {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold">Pricing</h2>
      {/* Your pricing content */}
    </section>
  )
}
```

2. Import in `App.tsx`:
```typescript
import Pricing from './components/Pricing'

export default function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Pricing />  {/* Add here */}
      <Footer />
    </div>
  )
}
```

### Add Routing:

```bash
npm install react-router-dom
```

Update `App.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 🚀 Deployment

### Build for Production:

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify:

```bash
npm install -g netlify-cli
netlify deploy
```

### Deploy to GitHub Pages:

1. Push to GitHub
2. Go to Settings → Pages
3. Select branch and folder
4. Done!

---

## ❓ Troubleshooting

### "npm install" fails:
- Make sure Node.js 18+ is installed
- Try: `npm install --legacy-peer-deps`
- Delete `node_modules` and try again

### "npm run dev" doesn't work:
- Check if port 5173 is already in use
- Try: `npm run dev -- --port 3000`

### TypeScript errors:
- Run: `npm run build` to see all errors
- Check `tsconfig.json` settings
- Make sure all imports are correct

### Tailwind not working:
- Check `tailwind.config.js` content paths
- Make sure `@tailwind` directives are in `index.css`
- Restart dev server

### Components not showing:
- Check imports in `App.tsx`
- Make sure component is exported as default
- Check browser console for errors

---

## 💡 Tips

1. **Start Simple**
   - Generate basic site first
   - Add features incrementally
   - Test as you go

2. **Use TypeScript**
   - Define interfaces for props
   - Use proper types
   - Catch errors early

3. **Keep Components Small**
   - One component = one responsibility
   - Easy to understand and maintain
   - Reusable across project

4. **Use Tailwind**
   - Utility-first CSS
   - Fast development
   - Consistent design

5. **Test in Browser**
   - Check responsive design
   - Test on mobile
   - Verify all links work

---

## 🎉 You're Ready!

Now you can:
- ✅ Generate React + TypeScript projects
- ✅ Download and run them locally
- ✅ Customize to your needs
- ✅ Deploy to production
- ✅ Build modern web applications

**Happy coding!** 🚀

---

**Questions?** Just ask in the chat! The AI can help with:
- Code modifications
- Bug fixes
- Feature additions
- Design changes
- Deployment help
