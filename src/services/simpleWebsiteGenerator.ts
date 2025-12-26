// Simple Website Generator - Fallback for when complex generation fails
// This ensures users always get a working preview

export interface SimpleProjectFile {
  path: string;
  content: string;
  language: string;
}

export class SimpleWebsiteGenerator {
  
  static generateSimpleWebsite(prompt: string): SimpleProjectFile[] {
    console.log('🚀 SimpleWebsiteGenerator: Creating guaranteed working website for:', prompt);
    
    // Extract business info from prompt
    const businessName = this.extractBusinessName(prompt);
    const industry = this.extractIndustry(prompt);
    const colors = this.getIndustryColors(industry);
    
    console.log('📊 Extracted info:', { businessName, industry, colors });
    
    const files: SimpleProjectFile[] = [];
    
    // 1. Package.json
    files.push({
      path: 'package.json',
      language: 'json',
      content: JSON.stringify({
        name: businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '1.0.0',
        private: true,
        type: 'module',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          'react-router-dom': '^6.8.0',
          'lucide-react': '^0.263.1',
          'clsx': '^1.2.1'
        },
        devDependencies: {
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          '@vitejs/plugin-react': '^4.0.0',
          'typescript': '^4.9.5',
          'vite': '^4.4.5',
          'tailwindcss': '^3.3.3',
          'postcss': '^8.4.24',
          'autoprefixer': '^10.4.14'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vite build',
          'preview': 'vite preview',
          'start': 'vite'
        }
      }, null, 2)
    });
    
    // 2. Index.html
    files.push({
      path: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${businessName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
    });
    
    // 3. Public/index.html (for compatibility)
    files.push({
      path: 'public/index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${businessName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
    });
    
    // 4. Main.tsx (StackBlitz compatible)
    files.push({
      path: 'src/main.tsx',
      language: 'typescript',
      content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}`
    });
    
    // 5. Index.js (for compatibility)
    files.push({
      path: 'src/index.js',
      language: 'javascript',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    });
    
    // 6. App.tsx
    files.push({
      path: 'src/App.tsx',
      language: 'typescript',
      content: this.generateAppComponent(businessName, industry, colors)
    });
    
    // 7. Index.css
    files.push({
      path: 'src/index.css',
      language: 'css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-${colors.primary} hover:bg-${colors.primaryDark} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-105;
  }
  
  .btn-secondary {
    @apply border-2 border-${colors.primary} text-${colors.primary} hover:bg-${colors.primary} hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300;
  }
  
  .gradient-bg {
    background: linear-gradient(135deg, ${colors.gradientFrom} 0%, ${colors.gradientTo} 100%);
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.fade-in-delay-1 { animation-delay: 0.2s; }
.fade-in-delay-2 { animation-delay: 0.4s; }
.fade-in-delay-3 { animation-delay: 0.6s; }`
    });
    
    // 8. Component index
    files.push({
      path: 'src/components/index.js',
      language: 'javascript',
      content: `// Component exports
export { default as Header } from './Header';
export { default as Hero } from './Hero';
export { default as Features } from './Features';
export { default as Footer } from './Footer';`
    });
    
    // 9. Utils index
    files.push({
      path: 'src/utils/index.js',
      language: 'javascript',
      content: `// Utility exports
export * from './helpers';`
    });
    
    // 10. Helpers
    files.push({
      path: 'src/utils/helpers.js',
      language: 'javascript',
      content: `export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const truncate = (str, length) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};`
    });
    
    // 11. Vite config
    files.push({
      path: 'vite.config.ts',
      language: 'typescript',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`
    });
    
    // 12. TypeScript config (StackBlitz compatible - FIXED)
    files.push({
      path: 'tsconfig.json',
      language: 'json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ES2020',
          skipLibCheck: true,
          moduleResolution: 'node',
          allowImportingTsExtensions: false,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: false,
          noUnusedLocals: false,
          noUnusedParameters: false,
          noFallthroughCasesInSwitch: true,
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*']
          }
        },
        include: ['src/**/*'],
        exclude: ['node_modules']
      }, null, 2)
    });
    
    // 13. Tailwind config
    files.push({
      path: 'tailwind.config.js',
      language: 'javascript',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${colors.primary}',
        secondary: '${colors.secondary}',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`
    });
    
    console.log(`✅ Generated ${files.length} files for ${businessName}`);
    return files;
  }
  
  private static generateAppComponent(businessName: string, industry: string, colors: any): string {
    return `import React from 'react';

export default function App() {
  const businessData = {
    name: "${businessName}",
    industry: "${industry}",
    tagline: "Professional ${industry} Solutions",
    description: "Experience excellence with our innovative ${industry} services.",
    features: [
      { icon: "🚀", title: "Fast & Reliable", description: "Quick and dependable service" },
      { icon: "🎨", title: "Beautiful Design", description: "Stunning visual experience" },
      { icon: "📱", title: "Mobile Ready", description: "Perfect on all devices" },
      { icon: "⚡", title: "High Performance", description: "Optimized for speed" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">{businessData.name}</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-${colors.primary}">Home</a>
              <a href="#about" className="text-gray-700 hover:text-${colors.primary}">About</a>
              <a href="#services" className="text-gray-700 hover:text-${colors.primary}">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-${colors.primary}">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6 fade-in">
            Welcome to {businessData.name}
          </h2>
          <p className="text-xl mb-4 opacity-90 fade-in fade-in-delay-1">
            {businessData.tagline}
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto fade-in fade-in-delay-2">
            {businessData.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in fade-in-delay-3">
            <button className="btn-primary">
              Get Started
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose {businessData.name}?
            </h3>
            <p className="text-xl text-gray-600">
              Discover what makes us the best choice for your ${industry} needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessData.features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-2xl font-bold mb-4">{businessData.name}</h4>
          <p className="text-gray-400 mb-6">
            Professional ${industry} solutions built with modern technology.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 {businessData.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}`
  }
  
  private static extractBusinessName(prompt: string): string {
    // Try to extract business name from prompt
    const patterns = [
      /(?:for|called|named)\s+([A-Z][a-zA-Z\s&]+?)(?:\s|$|,|\.|!)/,
      /([A-Z][a-zA-Z\s&]+?)\s+(?:website|site|business|company)/i,
      /create.*?(?:for|called)\s+([A-Z][a-zA-Z\s&]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Fallback based on industry
    const industry = this.extractIndustry(prompt);
    return `${industry.charAt(0).toUpperCase() + industry.slice(1)} Pro`;
  }
  
  private static extractIndustry(prompt: string): string {
    const industries = {
      'restaurant': ['restaurant', 'food', 'dining', 'cafe', 'bistro', 'eatery'],
      'photography': ['photographer', 'photography', 'photo', 'portrait', 'wedding'],
      'fitness': ['gym', 'fitness', 'workout', 'training', 'health'],
      'tech': ['tech', 'software', 'app', 'digital', 'startup'],
      'business': ['business', 'corporate', 'company', 'professional'],
      'ecommerce': ['shop', 'store', 'ecommerce', 'retail', 'sell'],
      'education': ['school', 'education', 'learning', 'course', 'training'],
      'healthcare': ['medical', 'health', 'doctor', 'clinic', 'hospital']
    };
    
    const lowerPrompt = prompt.toLowerCase();
    
    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        return industry;
      }
    }
    
    return 'business';
  }
  
  private static getIndustryColors(industry: string) {
    const colorSchemes = {
      restaurant: {
        primary: 'orange-600',
        primaryDark: 'orange-700',
        secondary: 'red-600',
        gradientFrom: '#ea580c',
        gradientTo: '#dc2626'
      },
      photography: {
        primary: 'purple-600',
        primaryDark: 'purple-700',
        secondary: 'pink-600',
        gradientFrom: '#9333ea',
        gradientTo: '#db2777'
      },
      fitness: {
        primary: 'green-600',
        primaryDark: 'green-700',
        secondary: 'blue-600',
        gradientFrom: '#16a34a',
        gradientTo: '#2563eb'
      },
      tech: {
        primary: 'blue-600',
        primaryDark: 'blue-700',
        secondary: 'indigo-600',
        gradientFrom: '#2563eb',
        gradientTo: '#4f46e5'
      },
      ecommerce: {
        primary: 'indigo-600',
        primaryDark: 'indigo-700',
        secondary: 'purple-600',
        gradientFrom: '#4f46e5',
        gradientTo: '#9333ea'
      },
      default: {
        primary: 'blue-600',
        primaryDark: 'blue-700',
        secondary: 'gray-600',
        gradientFrom: '#2563eb',
        gradientTo: '#6366f1'
      }
    };
    
    return colorSchemes[industry] || colorSchemes.default;
  }
}