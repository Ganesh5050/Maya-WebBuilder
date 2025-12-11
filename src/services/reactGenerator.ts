// React + TypeScript Project Generator
// Generates complete React projects with Vite, TypeScript, Tailwind, and Shadcn UI

import { getAvailableProvider, formatRequest, parseResponse, AI_PROVIDERS } from '../config/aiProviders';
import { getBaseReactTemplate } from '../templates/react/baseTemplate';
import { getShadcnComponentFiles } from '../templates/react/shadcn-components';

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
    onProgress: (step: GenerationStep) => void
  ): Promise<ReactProject> {
    
    try {
      // Phase 1: Planning
      onProgress({ type: 'planning', message: '🤔 Analyzing your requirements...', progress: 5 });
      await this.delay(1000);
      
      const plan = await this.generatePlan(prompt);
      onProgress({ type: 'planning', message: '📋 Planning React project structure...', progress: 10 });
      await this.delay(1000);
      
      onProgress({ type: 'planning', message: `🎨 Will create: ${plan.componentCount} components`, progress: 15 });
      await this.delay(800);
      
      // Phase 2: Get base template
      const baseTemplate = getBaseReactTemplate(plan.projectName, plan.description);
      const files: GeneratedFile[] = [];
      
      // Add all base template files
      for (const [path, content] of Object.entries(baseTemplate.files)) {
        files.push({
          path,
          content,
          language: this.getLanguageFromPath(path)
        });
      }
      
      onProgress({ type: 'planning', message: '📦 Base template created...', progress: 15 });
      await this.delay(500);
      
      // Add Shadcn UI components
      const shadcnComponents = getShadcnComponentFiles();
      for (const [path, content] of Object.entries(shadcnComponents)) {
        files.push({
          path,
          content,
          language: 'typescript'
        });
      }
      
      onProgress({ type: 'planning', message: '🎨 Added Shadcn UI components...', progress: 20 });
      await this.delay(500);
      
      // Phase 3: Generate custom components
      const totalItems = plan.components.length + ((plan as any).pages?.length || 0);
      let currentItem = 0;
      
      for (let i = 0; i < plan.components.length; i++) {
        const component = plan.components[i];
        currentItem++;
        const progress = 20 + (currentItem / totalItems) * 60; // 20% to 80%
        
        onProgress({ 
          type: 'file', 
          message: `📝 Creating ${component.name}...`,
          fileName: component.path,
          progress 
        });
        
        const content = await this.generateComponent(component, prompt, plan);
        files.push({
          path: component.path,
          content,
          language: 'typescript'
        });
        
        await this.delay(500);
      }
      
      // Generate pages if they exist
      if ((plan as any).pages && (plan as any).pages.length > 0) {
        for (let i = 0; i < (plan as any).pages.length; i++) {
          const page = (plan as any).pages[i];
          currentItem++;
          const progress = 20 + (currentItem / totalItems) * 60;
          
          onProgress({ 
            type: 'file', 
            message: `📄 Creating ${page.name} page...`,
            fileName: page.path,
            progress 
          });
          
          const content = await this.generatePage(page, prompt, plan);
          files.push({
            path: page.path,
            content,
            language: 'typescript'
          });
          
          await this.delay(500);
        }
      }
      
      // Phase 4: Generate App.tsx
      onProgress({ type: 'file', message: '🎯 Creating App.tsx...', progress: 85 });
      const appContent = await this.generateAppComponent(plan, prompt);
      files.push({
        path: 'src/App.tsx',
        content: appContent,
        language: 'typescript'
      });
      await this.delay(500);
      
      // Phase 5: Generate global CSS
      onProgress({ type: 'file', message: '🎨 Creating styles...', progress: 90 });
      const cssContent = this.generateGlobalCSS(plan);
      files.push({
        path: 'src/index.css',
        content: cssContent,
        language: 'css'
      });
      await this.delay(500);
      
      // Phase 6: Finalization
      onProgress({ type: 'planning', message: '🔧 Finalizing project...', progress: 95 });
      await this.delay(1000);
      
      onProgress({ type: 'complete', message: '✅ React project generated successfully!', progress: 100 });
      
      return {
        files,
        structure: plan.structure,
        dependencies: plan.dependencies,
        packageJson: baseTemplate.files['package.json']
      };
      
    } catch (error) {
      onProgress({ 
        type: 'error', 
        message: `❌ Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      throw error;
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
      if (cleanResponse.startsWith('```')) {
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
   * Call AI API
   */
  private async callAI(provider: any, prompt: string, providerKey: string): Promise<string> {
    const requestData = formatRequest(providerKey, prompt);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (providerKey === 'google') {
      const url = `${provider.endpoint}?key=${provider.apiKey}`;
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
      return parseResponse(providerKey, data).content;
    }
    
    if (providerKey === 'anthropic') {
      headers['x-api-key'] = provider.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${provider.apiKey}`;
    }
    
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${providerKey} API Error: ${response.status} - ${errorText.substring(0, 100)}`);
    }
    
    const data = await response.json();
    return parseResponse(providerKey, data).content;
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
