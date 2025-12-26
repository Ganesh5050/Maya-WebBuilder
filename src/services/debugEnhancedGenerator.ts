// Debug version of enhanced generator for immediate testing
import { designVariationEngine } from './designVariationEngine';
import { designHistoryService } from './designHistoryService';

export interface DebugGeneratedFile {
  path: string;
  content: string;
  language: string;
}

export class DebugEnhancedGenerator {

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateUniqueWebsite(
    prompt: string,
    onProgress: (step: { type: string; message: string; data?: any }) => void
  ): Promise<DebugGeneratedFile[]> {
    console.log('🧪 DEBUG: Starting unique website generation (paced)...');

    // Helper to send updates
    const update = async (type: string, message: string, data?: any, delayMs: number = 800) => {
      onProgress({ type, message, data });
      await this.delay(delayMs);
    };

    // Detect if this is likely a refinement or a new project
    const isRefinement = prompt.length < 50 && (prompt.toLowerCase().includes('change') || prompt.toLowerCase().includes('add') || prompt.toLowerCase().includes('make') || prompt.toLowerCase().includes('remove'));

    // Determine industry from prompt
    const industry = prompt.toLowerCase().includes('restaurant') ? 'restaurant' :
      prompt.toLowerCase().includes('photographer') ? 'photography' :
        prompt.toLowerCase().includes('luxury') ? 'luxury' : 'business';

    if (isRefinement) {
      // SHORTER FLOW FOR REFINEMENTS
      await update('thought', 'Analyzing requested changes...', { duration: 800 }, 800);
      await update('plan', `I will update the design based on your request: "${prompt}"\n\n**Modifications:**\n• Applying stylistic updates to components\n• refactoring code to match new preferences`, null, 1000);
    } else {
      // FULL FLOW FOR NEW PROJECTS
      await update('thought', 'Thinking about the requirements...', { duration: 1500 }, 1500);

      const planMessage = `I'll create a sophisticated, custom-designed ${industry} website with a modern aesthetic, responsive layout, and interactive elements.
  
  **Design Strategy:**
  • **Theme:** ${industry === 'luxury' ? 'Dark, gold accents, elegant' : industry === 'photography' ? 'Minimalist, image-focused, editorial' : 'Clean, professional, trustworthy'}
  • **Typography:** ${industry === 'luxury' ? 'Playfair Display + Inter' : 'Outfit + Roboto'}
  • **Layout:** Full-width hero, asymmetry, breathing room
  • **Vibe:** ${industry === 'luxury' ? 'Exclusive & Premium' : 'Modern & Dynamic'}
  
  **Key Features:**
  • Custom Hero Section with animations
  • Responsive Navigation
  • Service/Portfolio Grid
  • Contact/Booking Form
  • Interactive Hover Effects`;

      await update('plan', planMessage, null, 2000);
    }

    // STEP 2: Configuration Files
    await update('text', 'Initializing project structure and configuration...', null, 1000);

    const commonFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'tailwind.config.js', 'postcss.config.js'];
    for (const file of commonFiles) {
      await update('file', `Created ${file}`, { status: 'created', filename: file }, 400);
    }

    await update('thought', 'Configuring design system and theming...', { duration: 1200 }, 1200);

    await update('file', 'Created src/index.css', { status: 'created', filename: 'src/index.css' }, 600);
    await update('file', 'Created src/index.html', { status: 'created', filename: 'index.html' }, 600);

    // STEP 3: Component Generation
    await update('text', 'Now creating the components and pages:', null, 1000);

    // Generate Design Brief (Internal)
    const designBrief = designVariationEngine.generateDesignBrief(industry, 'modern', 'modern');

    // Mock analysis data
    const mockAnalysis = {
      industry,
      subCategory: 'generic',
      targetAudience: { age: '25-45', income: 'any', values: [] },
      personality: ['modern'],
      competitors: [],
      differentiators: [],
      mood: 'modern'
    };

    const components = ['Header', 'Hero', 'Features', 'About', 'Contact', 'Footer'];
    const files: DebugGeneratedFile[] = [];

    // Generate components with pacing
    for (const componentName of components) {
      // Occasional "thought" break
      if (componentName === 'Features') {
        await update('thought', 'Designing interactive feature grid layout...', { duration: 1000 }, 1000);
      }
      if (componentName === 'Contact') {
        await update('thought', 'Implementing form validation and accessible inputs...', { duration: 1000 }, 1000);
      }

      await update('file', `Created src/components/${componentName}.tsx`, { status: 'created', filename: `src/components/${componentName}.tsx` }, 800);

      const content = this.generateMockComponent(componentName, designBrief, mockAnalysis, prompt);
      files.push({
        path: `src/components/${componentName}.tsx`,
        content: content,
        language: 'typescript'
      });
    }

    // STEP 4: Application Assembly
    await update('thought', 'Assembling application and routing...', { duration: 1000 }, 1000);

    const appContent = this.generateAppComponent(components, designBrief);
    files.push({ path: 'src/App.tsx', content: appContent, language: 'typescript' });
    await update('file', 'Created src/App.tsx', { status: 'created', filename: 'src/App.tsx' }, 600);

    const mainContent = this.generateMainTsx();
    files.push({ path: 'src/main.tsx', content: mainContent, language: 'typescript' });
    await update('file', 'Created src/main.tsx', { status: 'created', filename: 'src/main.tsx' }, 600);

    // Add other files to the return array (config files etc) - mocked for now
    files.push({ path: 'package.json', content: this.generatePackageJson(mockAnalysis), language: 'json' });
    files.push({ path: 'src/index.css', content: this.generateIndexCSS(designBrief), language: 'css' });
    files.push({ path: 'index.html', content: this.generateIndexHtml(mockAnalysis), language: 'html' });
    files.push({ path: 'vite.config.ts', content: 'export default {}', language: 'typescript' });

    // STEP 5: Finalization
    await update('thought', 'Finalizing build and preparing preview...', { duration: 1500 }, 1500);

    const finalMessage = `Your ${industry} website is ready! I've created a sophisticated, editorial-style website featuring:

• **Dramatic Hero** with full-screen imagery and elegant typography
• **Interactive Grid** for services/portfolio with hover effects
• **Smooth Navigation** that changes on scroll
• **Responsive Design** optimized for all devices
• **Custom Theme** with curated colors and fonts

**What's next?**
• **Customize Content:** Update the text and images to match your brand
• **Refine Design:** Ask me to change colors, fonts, or layouts
• **Deploy:** Publish your site to the world with one click`;

    // Send completion without "complete" type yet, just the text
    // The AppBuilder will handle the "Completion" UI state separately

    return files;
  }

  private generateMockComponent(
    componentName: string,
    designBrief: any,
    analysis: any,
    prompt: string
  ): string {

    if (componentName === 'Hero') {
      return `import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section 
      className="relative min-h-[${designBrief.spacing.heroHeight}] flex items-center justify-center"
      style={{ 
        backgroundColor: '${designBrief.colorPalette.primary[50]}',
        fontFamily: '${designBrief.typography.body}'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h1 
          className="text-6xl font-bold mb-6"
          style={{ 
            color: '${designBrief.colorPalette.primary[700]}',
            fontFamily: '${designBrief.typography.heading}'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Your ${analysis.industry.charAt(0).toUpperCase() + analysis.industry.slice(1)} Business
        </motion.h1>
        
        <motion.p 
          className="text-xl mb-8"
          style={{ color: '${designBrief.colorPalette.neutral[600]}' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience excellence with our innovative ${analysis.industry} solutions
        </motion.p>
        
        <motion.button 
          className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          style={{ 
            backgroundColor: '${designBrief.colorPalette.primary[500]}',
            color: 'white'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Get Started Today
        </motion.button>
      </div>
      
      {/* Unique Element: ${designBrief.layouts.hero.uniqueElement} */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-10 right-10 w-20 h-20 rounded-full opacity-20"
          style={{ backgroundColor: '${designBrief.colorPalette.accent[500]}' }}
        />
        <div 
          className="absolute bottom-10 left-10 w-16 h-16 rounded-full opacity-30"
          style={{ backgroundColor: '${designBrief.colorPalette.secondary[500]}' }}
        />
      </div>
    </section>
  );
}`;
    }

    // Default component
    return `import React from 'react';

export default function ${componentName}() {
  return (
    <section 
      className="py-20 px-4"
      style={{ 
        backgroundColor: '${designBrief.colorPalette.primary[50]}',
        fontFamily: '${designBrief.typography.body}'
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 
          className="text-4xl font-bold mb-6"
          style={{ 
            color: '${designBrief.colorPalette.primary[700]}',
            fontFamily: '${designBrief.typography.heading}'
          }}
        >
          ${componentName} Section
        </h2>
        <p 
          className="text-lg"
          style={{ color: '${designBrief.colorPalette.neutral[600]}' }}
        >
          This is the ${componentName} section with unique ${analysis.industry} styling.
        </p>
      </div>
    </section>
  );
}`;
  }

  private generateAppComponent(components: string[], designBrief: any): string {
    const imports = components.map(name => `import ${name} from './components/${name}';`).join('\n');
    const componentTags = components.map(name => `      <${name} />`).join('\n');

    return `${imports}

export default function App() {
  return (
    <div className="min-h-screen" style={{ fontFamily: '${designBrief.typography.body}' }}>
${componentTags}
    </div>
  );
}`;
  }

  private generatePackageJson(analysis: any): string {
    return JSON.stringify({
      name: analysis.industry.replace(/[^a-z0-9]/g, '-'),
      version: '1.0.0',
      type: 'module',
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'framer-motion': '^10.16.0'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.0.0',
        'typescript': '^4.9.5',
        'vite': '^4.4.5',
        'tailwindcss': '^3.3.3'
      },
      scripts: {
        'dev': 'vite',
        'build': 'vite build'
      }
    }, null, 2);
  }

  private generateMainTsx(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  private generateIndexCSS(designBrief: any): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=${designBrief.typography.heading.replace(' ', '+')}:wght@400;600;700&family=${designBrief.typography.body.replace(' ', '+')}:wght@400;500;600&display=swap');

:root {
  --primary-50: ${designBrief.colorPalette.primary[50]};
  --primary-500: ${designBrief.colorPalette.primary[500]};
  --primary-700: ${designBrief.colorPalette.primary[700]};
  --secondary-500: ${designBrief.colorPalette.secondary[500]};
  --accent-500: ${designBrief.colorPalette.accent[500]};
}

body {
  font-family: '${designBrief.typography.body}', sans-serif;
  line-height: 1.6;
  margin: 0;
}

h1, h2, h3, h4, h5, h6 {
  font-family: '${designBrief.typography.heading}', serif;
}

/* Unique styling based on design brief */
.unique-${designBrief.layouts.hero.name} {
  /* Custom styles for ${designBrief.layouts.hero.name} layout */
}`;
  }

  private generateIndexHtml(analysis: any): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Unique ${analysis.industry.charAt(0).toUpperCase() + analysis.industry.slice(1)} Website</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }
}

export const debugEnhancedGenerator = new DebugEnhancedGenerator();