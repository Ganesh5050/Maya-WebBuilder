// React + TypeScript Project Generator
// Generates complete React projects with Vite, TypeScript, Tailwind, and Shadcn UI

import { getAvailableProvider, getNextAvailableProvider, formatRequest, parseResponse, AI_PROVIDERS } from '../config/aiProviders';
import { getBaseReactTemplate } from '../templates/react/baseTemplate';
import { getShadcnComponentFiles } from '../templates/react/shadcn-components';
import { ProfessionalReactGenerator } from './professionalReactGenerator';
import { AdvancedReactGenerator } from './advancedReactGenerator';

export interface GenerationStep {
  type: 'planning' | 'file' | 'complete' | 'error';
  message: string;
  fileName?: string;
  fileContent?: string;
  progress?: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface ReactProject {
  files: GeneratedFile[];
  structure: string;
  dependencies: Record<string, string>;
  packageJson: string;
}

export class ReactProjectGenerator {

  /**
   * Generate a complete React project with streaming updates
   */
  async generateReactProject(
    prompt: string,
    onProgress: (step: GenerationStep) => void,
    projectId?: string
  ): Promise<ReactProject> {

    // PHASE 9: Professional Generation with Quality Development Time (35+ seconds)
    console.log('🚀 Starting Professional AI Website Generation...');
    console.log('⏱️ Estimated time: 35+ seconds (giving AI proper time for quality development)');
    console.log('🎯 Features: Industry Intelligence + Premium Components + Professional Physics');
    console.log('💡 Why this takes time: AI needs proper development time without pressure for 100% quality');

    // PHASE 10: ENHANCED UNIQUE GENERATION (No more templates!)
    try {
      console.log('🚀 Starting ENHANCED unique website generation...');
      console.log('🎯 Features: Deep Analysis + Unique Colors + Custom Fonts + Original Layouts');
      console.log('⏱️ Estimated time: 25-35 seconds (AI needs time for quality unique design)');

      const { enhancedWebsiteGenerator } = await import('./enhancedWebsiteGenerator');

      const uniqueFiles = await enhancedWebsiteGenerator.generateUniqueWebsite(
        prompt,
        (progress) => {
          onProgress({
            type: (progress.type === 'thought' ? 'planning' : progress.type) as any,
            message: progress.message,
            progress: progress.data?.progress
          });
        }
      );

      if (uniqueFiles && uniqueFiles.length > 0) {
        onProgress({
          type: 'complete',
          message: `✅ UNIQUE website generated! Created ${uniqueFiles.length} files with custom colors, fonts, and layouts. No templates used!`,
          progress: 100
        });

        return {
          files: uniqueFiles.map(f => ({
            path: f.path,
            content: f.content,
            language: f.language
          })),
          structure: 'Unique React project with AI-generated design, custom colors, fonts, and layouts',
          dependencies: {
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            'framer-motion': '^10.16.0',
            'lucide-react': '^0.263.1'
          },
          packageJson: uniqueFiles.find(f => f.path === 'package.json')?.content || '{}'
        };
      } else {
        throw new Error('Enhanced generation returned no files');
      }
    } catch (error) {
      console.warn('⚠️ Enhanced generation failed, falling back to STANDARD dynamic generation:', error);

      onProgress({
        type: 'planning',
        message: '🔄 Optimizing design strategy (Retrying with agile model)...',
        progress: 40
      });

      try {
        // FALLBACK: Standard Dynamic Generation (AI-Driven, not a template)
        const plan = await this.generatePlan(prompt);

        onProgress({
          type: 'planning',
          message: `📋 Design Plan: ${plan.structure} (${plan.componentCount} unique components)`,
          progress: 50
        });

        const files: GeneratedFile[] = [];
        const generatedComponents: Record<string, string> = {};

        // Generate Components
        for (const component of plan.components) {
          onProgress({
            type: 'file',
            message: `Creating ${component.name}...`,
            progress: 50 + (plan.components.indexOf(component) * 5)
          });

          const content = await this.generateComponent(component, prompt, plan);
          generatedComponents[component.name] = content;

          files.push({
            path: component.path,
            content: content,
            language: 'typescript'
          });
        }

        // Generate Pages
        if (plan.pages) {
          for (const page of plan.pages) {
            const content = await this.generatePage(page, prompt, plan);
            files.push({
              path: page.path,
              content: content,
              language: 'typescript'
            });
          }
        }

        // Generate App.tsx
        const appContent = await this.generateAppComponent(plan, prompt);
        files.push({
          path: 'src/App.tsx',
          content: appContent,
          language: 'typescript'
        });

        // Generate Global CSS
        const cssContent = this.generateGlobalCSS(plan);
        files.push({
          path: 'src/index.css',
          content: cssContent,
          language: 'css'
        });

        // Add standard files (main.tsx, index.html, etc - simplified for fallback)
        // ... (We would usually need to add these, but let's assume the previous steps or a helper handles scaffolding. 
        // Actually, ReactProjectGenerator doesn't seem to have a helper for scaffolding in the class methods exposed here.
        // I need to replicate the basic scaffolding from SimpleWebsiteGenerator but inject MY dynamic files)

        const scaffolding = (await import('./simpleWebsiteGenerator')).SimpleWebsiteGenerator.generateSimpleWebsite(prompt);

        // Merge Dynamic files OVER the scaffolding
        const finalFiles = scaffolding.map(s => {
          const dynamic = files.find(f => f.path === s.path);
          return dynamic || s;
        });

        // Add completely new files that weren't in scaffolding (like components)
        files.forEach(f => {
          if (!finalFiles.find(existing => existing.path === f.path)) {
            finalFiles.push(f);
          }
        });

        onProgress({
          type: 'complete',
          message: `✅ Standard website generated! Created ${finalFiles.length} files.`,
          progress: 100
        });

        return {
          files: finalFiles.map(f => ({ path: f.path, content: f.content, language: f.language })),
          structure: plan.structure,
          dependencies: {
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            'react-router-dom': '^6.8.0',
            'lucide-react': '^0.263.1',
            'clsx': '^1.2.1'
          },
          packageJson: finalFiles.find(f => f.path === 'package.json')?.content || '{}'
        };

      } catch (fallbackError) {
        console.error('❌ Standard fallback also failed:', fallbackError);
        // LAST RESORT: Simple Generator
        const { SimpleWebsiteGenerator } = await import('./simpleWebsiteGenerator');
        const simpleFiles = SimpleWebsiteGenerator.generateSimpleWebsite(prompt);
        onProgress({
          type: 'complete',
          message: `✅ Basic website generated (Safety Mode).`,
          progress: 100
        });
        return {
          files: simpleFiles,
          structure: 'Basic React Template',
          dependencies: {},
          packageJson: simpleFiles.find(f => f.path === 'package.json')?.content || '{}'
        };
      }
    }
  }

  /**
   * Generate project plan using AI
   */
  private async generatePlan(prompt: string): Promise<{
    projectName: string;
    description: string;
    components: Array<{ name: string; path: string; description: string }>;
    structure: string;
    dependencies: Record<string, string>;
    componentCount: number;
    metadata: {
      industry: string;
      colorScheme: string;
      designStyle: string;
    };
    pages?: Array<{ name: string; path: string; route: string }>;
  }> {
    const provider = getAvailableProvider();
    if (!provider) {
      throw new Error('No AI provider available');
    }

    const providerKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
    if (!providerKey) {
      throw new Error('Provider not found');
    }

    console.log(`🤖 Using ${providerKey} for React planning...`);

    const planningPrompt = `You are an expert React + TypeScript developer creating a modern web application.

USER REQUEST: "${prompt}"

**Step 1: Deep Analysis**
- What is the INDUSTRY? (e.g., restaurant, tech, fashion, education)
- What is the PURPOSE? (e.g., landing page, dashboard, e-commerce)
- Who is the TARGET AUDIENCE?
- What FEATURES are needed?
- What DESIGN STYLE? (modern, minimal, bold, elegant)
- What COLORS fit this industry?

**Step 2: Plan React Components**

IMPORTANT: You have access to Shadcn UI components and React Router!

Available Shadcn Components:
- Button (with variants: default, destructive, outline, secondary, ghost, link)
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Input, Label, Textarea
- Badge

Available Routing:
- React Router DOM for multi-page navigation
- Use BrowserRouter, Routes, Route, Link

Return a JSON object with this EXACT structure:
{
  "projectName": "[kebab-case-name]",
  "description": "[Brief description]",
  "components": [
    {"name": "Header", "path": "src/components/Header.tsx", "description": "[Navigation with React Router Links]"},
    {"name": "Hero", "path": "src/components/Hero.tsx", "description": "[Hero with Shadcn Button]"},
    {"name": "Features", "path": "src/components/Features.tsx", "description": "[Features with Shadcn Cards]"},
    {"name": "Footer", "path": "src/components/Footer.tsx", "description": "[Footer content]"}
  ],
  "pages": [
    {"name": "Home", "path": "src/pages/Home.tsx", "route": "/"},
    {"name": "About", "path": "src/pages/About.tsx", "route": "/about"},
    {"name": "Contact", "path": "src/pages/Contact.tsx", "route": "/contact"}
  ],
  "structure": "[Detailed description with routing and Shadcn components]",
  "dependencies": {},
  "metadata": {
    "industry": "[detected industry]",
    "colorScheme": "[colors that fit]",
    "designStyle": "[modern/minimal/bold/elegant]",
    "hasRouting": true
  }
}

Return ONLY the JSON (no markdown, no explanation):`;

    try {
      const response = await this.callAI(provider, planningPrompt, providerKey);
      let cleanResponse = response.trim();
      // Robust JSON extraction: Find first { ... } block
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      } else {
        // Try cleaning markdown if regex failed (fallback)
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const plan = JSON.parse(cleanResponse);
      return {
        ...plan,
        componentCount: plan.components.length
      };
    } catch (error) {
      console.error('❌ Planning failed, using default structure:', error);
      // Fallback plan
      return {
        projectName: 'my-react-app',
        description: 'A modern React application',
        components: [
          { name: 'Header', path: 'src/components/Header.tsx', description: 'Navigation header' },
          { name: 'Hero', path: 'src/components/Hero.tsx', description: 'Hero section' },
          { name: 'Features', path: 'src/components/Features.tsx', description: 'Features showcase' },
          { name: 'Footer', path: 'src/components/Footer.tsx', description: 'Footer' }
        ],
        structure: 'Modern React app with TypeScript and Tailwind CSS',
        dependencies: {},
        componentCount: 4,
        metadata: {
          industry: 'general',
          colorScheme: 'blue',
          designStyle: 'modern'
        }
      };
    }
  }

  /**
   * Generate individual React component
   */
  private async generateComponent(
    componentInfo: { name: string; path: string; description: string },
    prompt: string,
    plan: any
  ): Promise<string> {
    const provider = getAvailableProvider();
    if (!provider) {
      throw new Error('No AI provider available');
    }

    const providerKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
    if (!providerKey) {
      throw new Error('Provider not found');
    }

    console.log(`🤖 Generating ${componentInfo.name} using ${providerKey}...`);

    const componentPrompt = `You are an expert React + TypeScript developer.

## PROJECT CONTEXT:
USER REQUEST: "${prompt}"
COMPONENT: ${componentInfo.name}
PURPOSE: ${componentInfo.description}
INDUSTRY: ${plan.metadata?.industry || 'general'}
COLOR SCHEME: ${plan.metadata?.colorScheme || 'modern'}
DESIGN STYLE: ${plan.metadata?.designStyle || 'professional'}

## REQUIREMENTS:

### Shadcn UI Components (USE THESE!):
- Import from "@/components/ui/button", "@/components/ui/card", etc.
- Use Button component instead of <button>
- Use Card components for content blocks
- Use Input, Label, Textarea for forms
- Example: <Button variant="default">Click Me</Button>

### React Router (USE THIS!):
- Import { Link } from 'react-router-dom'
- Use <Link to="/about">About</Link> instead of <a href>
- Navigation should use React Router Links

### TypeScript:
- Use proper TypeScript types
- Define interfaces for props
- Export as default

### Styling:
- Use Tailwind CSS classes
- Make it responsive (mobile-first)
- Use colors that match: ${plan.metadata?.colorScheme}
- Design style: ${plan.metadata?.designStyle}

### Code Quality:
- Clean, readable code
- Proper imports
- JSDoc comments
- No placeholders or TODOs

### Content:
- Use REAL content specific to "${prompt}"
- NO generic placeholders
- Industry-appropriate text

## EXAMPLE STRUCTURE:

\`\`\`typescript
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

interface ${componentInfo.name}Props {
  // Define props if needed
}

export default function ${componentInfo.name}({ }: ${componentInfo.name}Props) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-8">${componentInfo.name}</h2>
        
        {/* Use Shadcn components */}
        <Card>
          <CardHeader>
            <CardTitle>Example Card</CardTitle>
            <CardDescription>This uses Shadcn UI</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Click Me</Button>
            <Link to="/about" className="ml-4">
              <Button variant="outline">Learn More</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
\`\`\`

Generate the COMPLETE ${componentInfo.name} component NOW (TypeScript only, no markdown):`;

    try {
      const content = await this.callAI(provider, componentPrompt, providerKey);
      return this.cleanComponentContent(content);
    } catch (error) {
      console.error(`❌ Failed to generate ${componentInfo.name}:`, error);
      return this.getDefaultComponent(componentInfo.name);
    }
  }

  /**
   * Generate page component
   */
  private async generatePage(
    pageInfo: { name: string; path: string; route: string },
    prompt: string,
    plan: any
  ): Promise<string> {
    const provider = getAvailableProvider();
    if (!provider) {
      throw new Error('No AI provider available');
    }

    const providerKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
    if (!providerKey) {
      throw new Error('Provider not found');
    }

    const pagePrompt = `Generate a ${pageInfo.name} page component for a React + TypeScript project.

PROJECT: "${prompt}"
PAGE: ${pageInfo.name}
ROUTE: ${pageInfo.route}
INDUSTRY: ${plan.metadata?.industry || 'general'}

Requirements:
- Use Shadcn UI components (Button, Card, Input, etc.)
- Import from "@/components/ui/*"
- Use Tailwind CSS for styling
- Make it responsive
- Include real, meaningful content for "${prompt}"
- Use TypeScript with proper types

Example ${pageInfo.name} Page:
\`\`\`typescript
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ${pageInfo.name}() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-8">${pageInfo.name}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to ${pageInfo.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Content specific to "${prompt}"</p>
          <Button>Learn More</Button>
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\`

Generate the COMPLETE ${pageInfo.name} page NOW (TypeScript only, no markdown):`;

    try {
      const content = await this.callAI(provider, pagePrompt, providerKey);
      return this.cleanComponentContent(content);
    } catch (error) {
      console.error(`❌ Failed to generate ${pageInfo.name} page:`, error);
      return this.getDefaultPage(pageInfo.name);
    }
  }

  /**
   * Generate App.tsx component
   */
  private async generateAppComponent(plan: any, prompt: string): Promise<string> {
    const provider = getAvailableProvider();
    if (!provider) {
      throw new Error('No AI provider available');
    }

    const providerKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
    if (!providerKey) {
      throw new Error('Provider not found');
    }

    const componentNames = plan.components.map((c: any) => c.name).join(', ');

    const hasPages = (plan as any).pages && (plan as any).pages.length > 0;
    const pageNames = hasPages ? (plan as any).pages.map((p: any) => p.name).join(', ') : '';

    const appPrompt = `Generate the main App.tsx component for a React + TypeScript project with React Router.

PROJECT: "${prompt}"
COMPONENTS: ${componentNames}
${hasPages ? `PAGES: ${pageNames}` : ''}

Requirements:
- Use React Router (BrowserRouter, Routes, Route)
- Import all components and pages
- Set up routing if pages exist
- Header and Footer should be outside Routes (always visible)
- Use TypeScript
- Clean structure

Example with Routing:
\`\`\`typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
\`\`\`

Generate App.tsx NOW (TypeScript only, no markdown):`;

    try {
      const content = await this.callAI(provider, appPrompt, providerKey);
      return this.cleanComponentContent(content);
    } catch (error) {
      console.error('❌ Failed to generate App.tsx:', error);
      return this.getDefaultAppComponent(plan.components);
    }
  }

  /**
   * Generate global CSS with Tailwind
   */
  private generateGlobalCSS(_plan: any): string {
    // const colorScheme = plan.metadata?.colorScheme || 'blue';

    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
  }

  /**
   * Clean AI-generated component content
   */
  private cleanComponentContent(content: string): string {
    // Remove markdown code blocks
    content = content.replace(/```typescript\n?/g, '').replace(/```tsx\n?/g, '').replace(/```\n?/g, '');
    content = content.trim();
    return content;
  }

  /**
   * Get default component if AI fails
   */
  private getDefaultComponent(name: string): string {
    return `export default function ${name}() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold">${name}</h2>
        <p className="mt-4 text-gray-600">This is the ${name} component.</p>
      </div>
    </section>
  )
}
`;
  }

  /**
   * Get default page if AI fails
   */
  private getDefaultPage(name: string): string {
    return `import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ${name}() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-8">${name}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to ${name}</CardTitle>
          <CardDescription>This is the ${name} page</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Content for the ${name} page goes here.
          </p>
          <Button>Learn More</Button>
        </CardContent>
      </Card>
    </div>
  )
}
`;
  }

  /**
   * Get default App component if AI fails
   */
  private getDefaultAppComponent(components: any[]): string {
    const imports = components.map(c => `import ${c.name} from './components/${c.name}'`).join('\n');
    const componentTags = components.map(c => `      <${c.name} />`).join('\n');

    return `${imports}

export default function App() {
  return (
    <div className="min-h-screen">
${componentTags}
    </div>
  )
}
`;
  }

  /**
   * Get language from file path
   */
  private getLanguageFromPath(path: string): string {
    if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    if (path.endsWith('.html')) return 'html';
    return 'text';
  }

  /**
   * Call AI API with automatic provider fallback
   */
  private async callAI(provider: any, prompt: string, providerKey: string): Promise<string> {
    const maxRetries = 5; // Try up to 5 different providers
    let currentProvider = provider;
    let currentProviderKey = providerKey;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`🤖 Attempt ${attempt + 1}: Using ${currentProvider.name} (${currentProviderKey})`);

        const requestData = formatRequest(currentProviderKey, prompt);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        if (currentProviderKey === 'google') {
          const url = `${currentProvider.endpoint}?key=${currentProvider.apiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestData)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API Error: ${response.status} - ${errorText.substring(0, 100)}`);
          }

          const data = await response.json();
          const result = parseResponse(currentProviderKey, data).content;
          console.log(`✅ Success with ${currentProvider.name}`);
          return result;
        }

        if (currentProviderKey === 'anthropic') {
          headers['x-api-key'] = currentProvider.apiKey;
          headers['anthropic-version'] = '2023-06-01';
        } else {
          headers['Authorization'] = `Bearer ${currentProvider.apiKey}`;
        }

        const response = await fetch(currentProvider.endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`${currentProviderKey} API Error: ${response.status} - ${errorText.substring(0, 100)}`);
        }

        const data = await response.json();
        const result = parseResponse(currentProviderKey, data).content;
        console.log(`✅ Success with ${currentProvider.name}`);
        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`❌ ${currentProvider.name} failed:`, lastError.message);

        // Try next provider
        const nextProvider = getNextAvailableProvider(currentProviderKey);
        if (!nextProvider) {
          console.error('❌ No more providers available');
          break;
        }

        // Find the key for the next provider
        const nextProviderKey = Object.keys(AI_PROVIDERS).find(key =>
          AI_PROVIDERS[key] === nextProvider
        );

        if (!nextProviderKey) {
          console.error('❌ Could not find provider key');
          break;
        }

        currentProvider = nextProvider;
        currentProviderKey = nextProviderKey;

        // Small delay before retry
        await this.delay(1000);
      }
    }

    // All providers failed, throw the last error
    throw lastError || new Error('All AI providers failed');
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton
export const reactProjectGenerator = new ReactProjectGenerator();
