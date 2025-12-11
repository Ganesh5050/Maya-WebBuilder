# Phase 2: React + TypeScript Generator

## 🎯 GOAL
Build a React + Vite + TypeScript + Shadcn UI generator that creates modern, dynamic web applications.

---

## 📋 WHAT WE'RE BUILDING

### Current (Phase 1):
```
website.zip
├── index.html      (Static HTML)
├── styles.css      (CSS)
└── script.js       (Vanilla JS)
```
**User:** Extract → Open index.html → Done

### New (Phase 2):
```
project.zip
├── src/
│   ├── components/
│   │   ├── ui/              (Shadcn components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── vite.svg
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```
**User:** Extract → `npm install` → `npm run dev` → Full React app!

---

## 🏗️ ARCHITECTURE

### 1. Template System
Create base templates for different project types:
- **Portfolio** (React + TypeScript + Tailwind)
- **SaaS Landing** (React + TypeScript + Shadcn)
- **E-commerce** (React + TypeScript + Shadcn + State)
- **Blog** (React + TypeScript + Routing)
- **Dashboard** (React + TypeScript + Shadcn + Charts)

### 2. File Generator
AI generates these files dynamically:
- ✅ **Components** (Header, Hero, Features, etc.)
- ✅ **Styles** (Tailwind config, global CSS)
- ✅ **Config** (package.json, vite.config.ts, tsconfig.json)
- ✅ **Utils** (lib/utils.ts for Shadcn)
- ✅ **README** (Setup instructions)

### 3. Dual Mode System
```typescript
enum GeneratorMode {
  STATIC = 'static',    // HTML/CSS/JS (Phase 1)
  REACT = 'react'       // React/TS (Phase 2)
}
```

User can choose:
- **Quick Static** → Fast, simple websites
- **Dynamic React** → Complex, interactive apps

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Create React Template Files (Static)
**Files to create:**
- `src/templates/react/base-template.ts` - Base React project structure
- `src/templates/react/package.json.template` - Dependencies
- `src/templates/react/vite.config.template` - Vite config
- `src/templates/react/tailwind.config.template` - Tailwind config
- `src/templates/react/tsconfig.template` - TypeScript config
- `src/templates/react/components/` - Reusable component templates

**Time:** 2-3 hours

---

### Step 2: Update AI Prompts for React
**Files to modify:**
- `src/services/websiteGenerator.ts` - Add React generation mode
- `src/config/aiProviders.ts` - Update prompts for React/TypeScript

**New Prompts:**
```typescript
const REACT_GENERATION_PROMPT = `
You are generating a React + TypeScript component.

REQUIREMENTS:
- Use TypeScript with proper types
- Use Tailwind CSS for styling
- Use Shadcn UI components where appropriate
- Export as default
- Include proper imports
- Add JSDoc comments
- Make it responsive

EXAMPLE:
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="text-xl mt-4">{subtitle}</p>
        <Button className="mt-8">Get Started</Button>
      </div>
    </section>
  )
}

Generate the component now:
`;
```

**Time:** 1-2 hours

---

### Step 3: Build React Project Generator
**New file:** `src/services/reactGenerator.ts`

```typescript
export class ReactProjectGenerator {
  
  async generateReactProject(
    prompt: string,
    onProgress: (step: GenerationStep) => void
  ): Promise<ReactProject> {
    
    // 1. Analyze prompt
    const analysis = await this.analyzePrompt(prompt);
    
    // 2. Choose template
    const template = this.selectTemplate(analysis.type);
    
    // 3. Generate components
    const components = await this.generateComponents(analysis);
    
    // 4. Generate config files
    const configs = this.generateConfigs(analysis);
    
    // 5. Generate package.json
    const packageJson = this.generatePackageJson(analysis);
    
    // 6. Combine all files
    return {
      files: [...components, ...configs],
      packageJson,
      readme: this.generateReadme(analysis)
    };
  }
  
  private async generateComponents(analysis: ProjectAnalysis) {
    const components = [];
    
    // Generate App.tsx
    components.push(await this.generateAppComponent(analysis));
    
    // Generate Header
    components.push(await this.generateHeaderComponent(analysis));
    
    // Generate Hero
    components.push(await this.generateHeroComponent(analysis));
    
    // Generate Features
    components.push(await this.generateFeaturesComponent(analysis));
    
    // Generate Footer
    components.push(await this.generateFooterComponent(analysis));
    
    return components;
  }
  
  private generatePackageJson(analysis: ProjectAnalysis) {
    return {
      name: analysis.projectName,
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        "class-variance-authority": "^0.7.0",
        clsx: "^2.1.0",
        "tailwind-merge": "^2.2.0",
        "lucide-react": "^0.344.0"
      },
      devDependencies: {
        "@types/react": "^18.3.1",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.2.1",
        autoprefixer: "^10.4.18",
        postcss: "^8.4.35",
        tailwindcss: "^3.4.1",
        typescript: "^5.3.3",
        vite: "^5.1.4"
      }
    };
  }
}
```

**Time:** 3-4 hours

---

### Step 4: Add Mode Selector UI
**File to modify:** `src/react-app/pages/AppBuilder.tsx`

Add toggle in chat input:
```tsx
<div className="flex items-center gap-2">
  {/* Mode Selector */}
  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
    <button
      onClick={() => setGeneratorMode('static')}
      className={`px-3 py-1.5 text-sm rounded ${
        generatorMode === 'static' 
          ? 'bg-white shadow-sm font-medium' 
          : 'text-gray-600'
      }`}
    >
      Static
    </button>
    <button
      onClick={() => setGeneratorMode('react')}
      className={`px-3 py-1.5 text-sm rounded ${
        generatorMode === 'react' 
          ? 'bg-white shadow-sm font-medium' 
          : 'text-gray-600'
      }`}
    >
      React
    </button>
  </div>
  
  {/* Discuss button */}
  <button>Discuss</button>
  
  {/* Send button */}
  <button>Send</button>
</div>
```

**Time:** 1 hour

---

### Step 5: Update Download Logic
**File to modify:** `src/react-app/pages/AppBuilder.tsx`

```typescript
const handleDownloadWebsite = async () => {
  const zip = new JSZip();
  const projectName = appName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  if (generatorMode === 'react') {
    // React project structure
    projectFiles.forEach(file => {
      zip.file(file.path, file.content);
    });
    
    // Add package.json
    zip.file('package.json', JSON.stringify(packageJson, null, 2));
    
    // Add README with instructions
    zip.file('README.md', generateReadme());
    
  } else {
    // Static HTML (existing logic)
    projectFiles.forEach(file => {
      zip.file(file.path, file.content);
    });
  }
  
  // Download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}.zip`);
};
```

**Time:** 1 hour

---

### Step 6: Add Shadcn UI Components
**New folder:** `src/templates/react/components/ui/`

Pre-built Shadcn components:
- `button.tsx`
- `card.tsx`
- `input.tsx`
- `label.tsx`
- `select.tsx`
- `textarea.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`

These are included in every React project.

**Time:** 2 hours

---

### Step 7: Testing & Polish
- Test React project generation
- Verify `npm install` works
- Verify `npm run dev` works
- Test different project types
- Fix any TypeScript errors
- Ensure Tailwind compiles correctly

**Time:** 2-3 hours

---

## 📦 DEPENDENCIES TO ADD

```json
{
  "dependencies": {
    "jszip": "^3.10.1"  // Already installed
  }
}
```

No new dependencies needed! ✅

---

## 🎯 EXPECTED RESULTS

### User Flow:
1. User types: "Create a SaaS landing page"
2. User selects: **React mode**
3. AI generates React project
4. User downloads ZIP
5. User extracts ZIP
6. User runs: `npm install`
7. User runs: `npm run dev`
8. Full React app opens at localhost:5173

### Generated Project:
- ✅ TypeScript configured
- ✅ Vite dev server
- ✅ Tailwind CSS working
- ✅ Shadcn UI components
- ✅ Hot module reload
- ✅ Production build ready
- ✅ Responsive design
- ✅ Clean code structure

---

## 🚀 IMPLEMENTATION ORDER

### Day 1 (4-5 hours):
1. ✅ Create React template files
2. ✅ Build ReactProjectGenerator class
3. ✅ Update AI prompts

### Day 2 (3-4 hours):
4. ✅ Add mode selector UI
5. ✅ Update download logic
6. ✅ Add Shadcn components

### Day 3 (2-3 hours):
7. ✅ Testing & debugging
8. ✅ Polish & documentation

**Total Time:** 9-12 hours (1.5-2 days)

---

## 🎨 EXAMPLE OUTPUT

### Restaurant Website (React Mode):

**Generated Files:**
```
bella-italia-restaurant/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── dialog.tsx
│   │   ├── Header.tsx        // Custom navigation
│   │   ├── Hero.tsx          // Restaurant hero
│   │   ├── Menu.tsx          // Food menu
│   │   ├── Reservations.tsx  // Booking form
│   │   └── Footer.tsx        // Contact info
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

**README.md:**
```markdown
# Bella Italia Restaurant

A modern restaurant website built with React, TypeScript, and Tailwind CSS.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173

## Build for Production

```bash
npm run build
```

## Features
- Responsive design
- Menu showcase
- Online reservations
- Contact form
- Gallery
```

---

## ✅ SUCCESS CRITERIA

Phase 2 is complete when:
1. ✅ User can toggle between Static/React mode
2. ✅ React projects generate successfully
3. ✅ Downloaded ZIP contains all files
4. ✅ `npm install` works without errors
5. ✅ `npm run dev` starts dev server
6. ✅ Website displays correctly
7. ✅ TypeScript compiles without errors
8. ✅ Tailwind CSS works
9. ✅ Shadcn components render
10. ✅ Different project types look unique

---

## 🎯 READY TO START?

**First Step:** Create React template files

Shall I begin? 🚀
