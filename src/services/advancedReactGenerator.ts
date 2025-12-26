// Advanced React Component Generator - Creates dynamic, styled components
// This replaces the basic professional generator with AI-powered dynamic content
// ENHANCED: Now uses Universal Skeleton Structure for consistent foundation

import { DynamicContentGenerator, WebsiteContent } from './dynamicContentGenerator';
import { designPatternLibrary, DesignPattern } from './designPatternLibrary';
import { IndustryIntelligence, ColorPalette, DesignPersonality } from './industryIntelligence';
import { StyleVariationEngine, StyleVariation } from './styleVariationEngine';
import { PremiumComponentRegistry } from './premiumComponentRegistry';
import { ProfessionalFontSystem, FontPairing } from './professionalFontSystem';
import { ResponsiveBreakpointSystem } from './responsiveBreakpointSystem';
import { UniversalSkeletonGenerator, SkeletonFile } from './universalSkeletonGenerator';
import { webContainerService } from './webContainerIntegration';

export interface AdvancedProjectFile {
  path: string;
  content: string;
  language: string;
}

export class AdvancedReactGenerator {

  static async generateAdvancedProject(prompt: string, projectId?: string): Promise<AdvancedProjectFile[]> {
    console.log('🚀 AdvancedReactGenerator: Generating UNIQUE project for:', prompt);
    console.log('🏗️ Using Universal Skeleton Structure for professional foundation...');

    // PHASE 0: Generate Universal Skeleton Structure (Foundation)
    console.log('🏗️ Phase 0: Generating universal skeleton structure...');
    const skeletonFiles = UniversalSkeletonGenerator.generateUniversalSkeleton();
    console.log(`✅ Generated ${skeletonFiles.length} skeleton files`);

    // PHASE 1: Industry Intelligence & Style Generation
    console.log('🔍 Phase 1: Analyzing industry and generating unique design system...');
    const designSystem = IndustryIntelligence.generateDesignSystem(prompt);
    const styleVariation = StyleVariationEngine.generateStyleVariation(
      designSystem.industry,
      designSystem.personality,
      prompt // Use prompt as seed for consistent randomization
    );

    // PHASE 11: Professional Font Selection
    console.log('🔤 Phase 11: Selecting professional font pairing...');
    console.log('🔍 Debug - Industry:', designSystem.industry.industry);
    console.log('🔍 Debug - Personality:', designSystem.personality);

    const personalityArray = [
      designSystem.personality.mood,
      designSystem.personality.energy,
      designSystem.personality.sophistication,
      designSystem.personality.trustLevel
    ].filter(p => p && typeof p === 'string'); // Filter out undefined values

    console.log('🔍 Debug - Filtered personality array:', personalityArray);

    const fontPairing = ProfessionalFontSystem.selectFontPairing(
      designSystem.industry.industry,
      personalityArray
    );

    console.log('✅ Unique design system generated:', {
      industry: designSystem.industry.industry,
      colors: designSystem.colors.name,
      mood: designSystem.personality.mood,
      layout: styleVariation.layoutVariant.heroStyle,
      fonts: `${fontPairing.heading} / ${fontPairing.body}`
    });

    // Phase 13: Analyze prompt and select appropriate design patterns
    const recommendedPatterns = designPatternLibrary.getRecommendedPatterns(prompt);
    console.log('🎨 Selected design patterns:', recommendedPatterns.map(p => p.name));

    // Generate dynamic content with industry context
    const websiteContent = await DynamicContentGenerator.generateWebsiteContent(prompt);
    console.log('📝 Generated content for:', websiteContent.businessName);

    // Phase 14: Apply design patterns to enhance the generation
    const selectedPatterns = this.selectOptimalPatterns(websiteContent, recommendedPatterns);
    console.log('✨ Applied patterns:', selectedPatterns.map(p => p.name));

    // PHASE 15: Select Premium Animated Components
    console.log('🎬 Phase 15: Selecting premium animated components...');
    const premiumComponents = PremiumComponentRegistry.getComponentsForIndustry(designSystem.industry.industry);
    const sampleData = PremiumComponentRegistry.generateSampleData(designSystem.industry.industry);
    console.log('🎨 Premium components selected:', premiumComponents);

    // PHASE 16: Merge Skeleton with Dynamic Content
    console.log('🔧 Phase 16: Merging skeleton structure with dynamic content...');
    const files: AdvancedProjectFile[] = [];

    // Start with skeleton files (never change)
    skeletonFiles.forEach(skeletonFile => {
      if (skeletonFile.type === 'skeleton') {
        files.push({
          path: skeletonFile.path,
          language: skeletonFile.language,
          content: skeletonFile.content
        });
      }
    });

    // Override skeleton package.json with enhanced dependencies for this project
    const packageJsonIndex = files.findIndex(f => f.path === 'package.json');
    if (packageJsonIndex !== -1) {
      files[packageJsonIndex] = {
        path: 'package.json',
        language: 'json',
        content: JSON.stringify({
          name: websiteContent.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          version: '1.0.0',
          private: true,
          type: 'module',
          dependencies: {
            'react': '^19.0.0',
            'react-dom': '^19.0.0',
            'react-router-dom': '^7.1.1',
            '@radix-ui/react-slot': '^1.0.2',
            'class-variance-authority': '^0.7.0',
            'clsx': '^2.1.1',
            'lucide-react': '^0.469.0',
            'tailwind-merge': '^2.7.0',
            'framer-motion': '^12.0.0'
          },
          devDependencies: {
            '@types/react': '^19.0.0',
            '@types/react-dom': '^19.0.0',
            '@vitejs/plugin-react': '^4.3.4',
            'typescript': '^5.7.2',
            'vite': '^6.0.3',
            'tailwindcss': '^3.4.17',
            'postcss': '^8.4.49',
            'autoprefixer': '^10.4.20',
            'eslint': '^9.17.0',
            'prettier': '^3.4.2'
          },
          scripts: {
            'dev': 'vite',
            'build': 'tsc && vite build',
            'preview': 'vite preview',
            'lint': 'eslint .',
            'format': 'prettier --write .'
          }
        }, null, 2)
      };
    }

    // Skeleton files already include vite.config.ts and tsconfig.json
    // No need to add them again - skeleton provides the foundation

    // Override skeleton tailwind.config.js with professional system
    const tailwindIndex = files.findIndex(f => f.path === 'tailwind.config.js');
    if (tailwindIndex !== -1) {
      files[tailwindIndex] = {
        path: 'tailwind.config.js',
        language: 'javascript',
        content: this.generateProfessionalTailwindConfig(designSystem.colors, styleVariation, fontPairing)
      };
    } else {
      files.push({
        path: 'tailwind.config.js',
        language: 'javascript',
        content: this.generateProfessionalTailwindConfig(designSystem.colors, styleVariation, fontPairing)
      });
    }

    // PostCSS config is already provided by skeleton

    // Add professional HTML with SEO and fonts (not in skeleton)
    files.push({
      path: 'index.html',
      language: 'html',
      content: this.generateProfessionalHTML(websiteContent, fontPairing, designSystem.colors)
    });

    // Add public/index.html for proper Vite structure
    files.push({
      path: 'public/index.html',
      language: 'html',
      content: this.generateProfessionalHTML(websiteContent, fontPairing, designSystem.colors)
    });

    // CRITICAL FIX: Add missing index.js files for proper project structure
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

    // Add components index file for better imports
    files.push({
      path: 'src/components/index.js',
      language: 'javascript',
      content: `// Component exports for easier imports
export { default as Header } from './Header';
export { default as Hero } from './Hero';
export { default as Features } from './Features';
export { default as About } from './About';
export { default as Services } from './Services';
export { default as Contact } from './Contact';
export { default as Footer } from './Footer';`
    });

    // Add utils index file
    files.push({
      path: 'src/utils/index.js',
      language: 'javascript',
      content: `// Utility function exports
export * from './helpers';
export * from './constants';`
    });

    // Add helpers utility file
    files.push({
      path: 'src/utils/helpers.js',
      language: 'javascript',
      content: `// Helper functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, '-')
    .replace(/[^\\w\\-]+/g, '')
    .replace(/\\-\\-+/g, '-');
};`
    });

    // Add constants file
    files.push({
      path: 'src/utils/constants.js',
      language: 'javascript',
      content: `// Application constants
export const APP_NAME = '${websiteContent.businessName}';
export const APP_DESCRIPTION = '${websiteContent.description}';
export const CONTACT_EMAIL = 'contact@${websiteContent.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com';

export const NAVIGATION_ITEMS = ${JSON.stringify(websiteContent.navigation, null, 2)};

export const SOCIAL_LINKS = {
  twitter: '#',
  facebook: '#',
  instagram: '#',
  linkedin: '#'
};`
    });

    // Override skeleton src/main.tsx with enhanced version
    const mainIndex = files.findIndex(f => f.path === 'src/main.tsx');
    if (mainIndex !== -1) {
      files[mainIndex] = {
        path: 'src/main.tsx',
        language: 'typescript',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
      };
    }

    // Override skeleton src/index.css with PROFESSIONAL styling system
    const cssIndex = files.findIndex(f => f.path === 'src/index.css');
    if (cssIndex !== -1) {
      files[cssIndex] = {
        path: 'src/index.css',
        language: 'css',
        content: this.generateProfessionalGlobalCSS(designSystem.colors, styleVariation, fontPairing)
      };
    }

    // Utils are already provided by skeleton - override with enhanced version
    const utilsIndex = files.findIndex(f => f.path === 'src/lib/utils.ts');
    if (utilsIndex !== -1) {
      files[utilsIndex] = {
        path: 'src/lib/utils.ts',
        language: 'typescript',
        content: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, '-')
    .replace(/[^\\w\\-]+/g, '')
    .replace(/\\-\\-+/g, '-')
}`
      };
    }

    // Override skeleton button component with UNIQUE styling
    const buttonIndex = files.findIndex(f => f.path === 'src/components/ui/button.tsx');
    if (buttonIndex !== -1) {
      files[buttonIndex] = {
        path: 'src/components/ui/button.tsx',
        language: 'typescript',
        content: this.generateButtonComponent(styleVariation.componentStyles.buttonStyle)
      };
    }

    // Override skeleton card component
    const cardIndex = files.findIndex(f => f.path === 'src/components/ui/card.tsx');
    if (cardIndex !== -1) {
      files[cardIndex] = {
        path: 'src/components/ui/card.tsx',
        language: 'typescript',
        content: this.generateCardComponent()
      };
    }

    // PHASE 17: Generate Dynamic Components (AI-customized content)
    console.log('🎨 Phase 17: Generating dynamic components with AI content...');

    // Dynamic Header component
    files.push({
      path: 'src/components/Header.tsx',
      language: 'typescript',
      content: this.generateHeaderComponent(websiteContent)
    });

    // Dynamic Hero component
    files.push({
      path: 'src/components/Hero.tsx',
      language: 'typescript',
      content: this.generateHeroComponent(websiteContent)
    });

    // Dynamic Features component
    files.push({
      path: 'src/components/Features.tsx',
      language: 'typescript',
      content: this.generateFeaturesComponent(websiteContent)
    });

    // Dynamic About component
    files.push({
      path: 'src/components/About.tsx',
      language: 'typescript',
      content: this.generateAboutComponent(websiteContent)
    });

    // Dynamic Services component
    files.push({
      path: 'src/components/Services.tsx',
      language: 'typescript',
      content: this.generateServicesComponent(websiteContent)
    });

    // Dynamic Contact component
    files.push({
      path: 'src/components/Contact.tsx',
      language: 'typescript',
      content: this.generateContactComponent(websiteContent)
    });

    // Dynamic Footer component
    files.push({
      path: 'src/components/Footer.tsx',
      language: 'typescript',
      content: this.generateFooterComponent(websiteContent)
    });

    // PHASE 18: Add Premium Animated Components
    console.log('✨ Phase 18: Adding premium animated components...');
    files.push(...this.generatePremiumComponents(premiumComponents));

    // PHASE 19: Generate Dynamic Site Configuration
    console.log('⚙️ Phase 19: Generating dynamic site configuration...');
    files.push({
      path: 'src/config/siteConfig.ts',
      language: 'typescript',
      content: this.generateDynamicSiteConfig(websiteContent, designSystem)
    });

    files.push({
      path: 'src/config/themeConfig.ts',
      language: 'typescript',
      content: this.generateDynamicThemeConfig(designSystem.colors, styleVariation, fontPairing)
    });

    // PHASE 20: Generate Main App Component
    console.log('🚀 Phase 20: Generating main App component...');
    files.push({
      path: 'src/App.tsx',
      language: 'typescript',
      content: this.generatePremiumAppComponent(websiteContent, premiumComponents, sampleData)
    });

    // PHASE 21: Add Advanced Features and Optimizations
    console.log('🔧 Phase 21: Adding advanced features and optimizations...');
    this.addAdvancedFeatures(files, selectedPatterns, websiteContent);

    console.log(`✅ Generated ${files.length} files using Universal Skeleton + Dynamic Content`);
    console.log(`🏗️ Skeleton files: ${skeletonFiles.filter(f => f.type === 'skeleton').length}`);
    console.log(`🎨 Dynamic files: ${files.length - skeletonFiles.filter(f => f.type === 'skeleton').length}`);
    console.log('🎯 Applied design patterns for optimal UX and performance');
    console.log('🚀 Professional foundation with AI-customized content complete!');

    // PHASE 22: Initialize WebContainer for Live Preview
    if (projectId) {
      console.log('🌐 Phase 22: Initializing WebContainer for live preview...');
      try {
        await webContainerService.initializeContainer(projectId, files, (message) => {
          console.log('📦 WebContainer:', message);
        });
        console.log('✅ WebContainer initialized successfully!');
      } catch (error) {
        console.error('❌ WebContainer initialization failed:', error);
      }
    }

    return files;
  }

  /**
   * Generate Professional HTML with SEO and Font Integration
   */
  private static generateProfessionalHTML(content: WebsiteContent, fontPairing: FontPairing, colors: ColorPalette): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- PHASE 16: SEO Meta Tags -->
    <title>${content.businessName} | ${content.tagline || 'Professional Website'}</title>
    <meta name="title" content="${content.businessName} | ${content.tagline || 'Professional Website'}" />
    <meta name="description" content="${content.description}" />
    <meta name="keywords" content="${content.industry}, ${content.businessName}, professional services" />
    <meta name="author" content="${content.businessName}" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${content.businessName}" />
    <meta property="og:description" content="${content.description}" />
    <meta property="og:image" content="/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${content.businessName}" />
    <meta property="twitter:description" content="${content.description}" />
    <meta property="twitter:image" content="/twitter-image.jpg" />
    
    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    
    <!-- PHASE 11: Google Fonts Integration -->
    ${ProfessionalFontSystem.generateFontLinks(fontPairing)}
    
    <!-- Theme Color -->
    <meta name="theme-color" content="${colors?.primary || '#6366f1'}" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "${content.businessName}",
      "description": "${content.description}",
      "url": "https://example.com"
    }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  /**
   * Generate Professional Tailwind Config with Responsive System
   * Enhanced with Universal Skeleton integration
   */
  private static generateProfessionalTailwindConfig(colors: ColorPalette, variation: StyleVariation, fontPairing: FontPairing): string {
    // Convert hex colors to RGB values for CSS custom properties
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);
    const accentRgb = hexToRgb(colors.accent);

    // PHASE 14: Professional Responsive Breakpoints
    const responsiveBreakpoints = ResponsiveBreakpointSystem.generateTailwindBreakpoints();

    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // PHASE 14: Professional Responsive Breakpoints
    screens: ${JSON.stringify(responsiveBreakpoints, null, 6)},
    
    extend: {
      // PHASE 11: Professional Font System
      fontFamily: {
        'heading': ['${fontPairing.heading}', 'sans-serif'],
        'body': ['${fontPairing.body}', 'sans-serif'],
        'sans': ['${fontPairing.body}', 'sans-serif'],
      },
      
      // Professional Color System
      colors: {
        primary: {
          50: 'rgb(${primaryRgb.r + 40} ${primaryRgb.g + 40} ${primaryRgb.b + 40} / <alpha-value>)',
          100: 'rgb(${primaryRgb.r + 30} ${primaryRgb.g + 30} ${primaryRgb.b + 30} / <alpha-value>)',
          200: 'rgb(${primaryRgb.r + 20} ${primaryRgb.g + 20} ${primaryRgb.b + 20} / <alpha-value>)',
          300: 'rgb(${primaryRgb.r + 10} ${primaryRgb.g + 10} ${primaryRgb.b + 10} / <alpha-value>)',
          400: 'rgb(${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b} / <alpha-value>)',
          500: 'rgb(${Math.max(0, primaryRgb.r - 10)} ${Math.max(0, primaryRgb.g - 10)} ${Math.max(0, primaryRgb.b - 10)} / <alpha-value>)',
          600: 'rgb(${Math.max(0, primaryRgb.r - 20)} ${Math.max(0, primaryRgb.g - 20)} ${Math.max(0, primaryRgb.b - 20)} / <alpha-value>)',
          700: 'rgb(${Math.max(0, primaryRgb.r - 30)} ${Math.max(0, primaryRgb.g - 30)} ${Math.max(0, primaryRgb.b - 30)} / <alpha-value>)',
          800: 'rgb(${Math.max(0, primaryRgb.r - 40)} ${Math.max(0, primaryRgb.g - 40)} ${Math.max(0, primaryRgb.b - 40)} / <alpha-value>)',
          900: 'rgb(${Math.max(0, primaryRgb.r - 50)} ${Math.max(0, primaryRgb.g - 50)} ${Math.max(0, primaryRgb.b - 50)} / <alpha-value>)',
        },
        secondary: {
          400: 'rgb(${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b} / <alpha-value>)',
          500: 'rgb(${Math.max(0, secondaryRgb.r - 10)} ${Math.max(0, secondaryRgb.g - 10)} ${Math.max(0, secondaryRgb.b - 10)} / <alpha-value>)',
          600: 'rgb(${Math.max(0, secondaryRgb.r - 20)} ${Math.max(0, secondaryRgb.g - 20)} ${Math.max(0, secondaryRgb.b - 20)} / <alpha-value>)',
        },
        accent: {
          400: 'rgb(${accentRgb.r} ${accentRgb.g} ${accentRgb.b} / <alpha-value>)',
          500: 'rgb(${Math.max(0, accentRgb.r - 10)} ${Math.max(0, accentRgb.g - 10)} ${Math.max(0, accentRgb.b - 10)} / <alpha-value>)',
        }
      },
      
      // PHASE 13: Professional Animation System
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--ease-out)',
        'slide-up': 'slideUp var(--duration-moderate) var(--ease-out)',
        'scale-in': 'scaleIn var(--duration-fast) var(--ease-out)',
        'spotlight': 'spotlight 2s ease 0.75s 1 forwards',
        'border-beam': 'border-beam calc(var(--duration) * 1s) infinite linear',
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(var(--spacing-lg))', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
    },
  },
  plugins: [],
}`;
  }

  /**
   * Generate Professional Global CSS with all systems integrated
   */
  private static generateProfessionalGlobalCSS(colors: ColorPalette, variation: StyleVariation, fontPairing: FontPairing): string {
    // Generate CSS variables from our design system
    const cssVariables = StyleVariationEngine.generateCSSVariables(colors, variation, {
      headingFont: fontPairing.heading,
      bodyFont: fontPairing.body,
      scale: 1.25
    });

    const fontCSS = ProfessionalFontSystem.generateFontCSS(fontPairing);
    const responsiveCSS = ResponsiveBreakpointSystem.generateResponsiveCSS();
    const responsiveComponentCSS = ResponsiveBreakpointSystem.generateResponsiveComponentCSS();

    return `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssVariables}

${fontCSS}

${responsiveCSS}

${responsiveComponentCSS}

@layer base {
  * {
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
    scroll-padding-top: var(--height-header); /* Account for fixed header */
  }
  
  body {
    margin: 0;
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: var(--line-height-base);
    color: var(--color-text);
    background-color: var(--color-background);
  }
  
  /* PHASE 2: Vertical Rhythm for all headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-base);
    color: var(--color-text);
    margin: 0; /* Reset default margins */
  }
}

@layer components {
  /* PHASE 14: Professional Container System */
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--spacing-sm);
    padding-right: var(--spacing-sm);
  }
  
  @media (min-width: 640px) {
    .container { 
      max-width: 640px; 
      padding-left: var(--spacing-md);
      padding-right: var(--spacing-md);
    }
  }
  
  @media (min-width: 768px) {
    .container { 
      max-width: 768px; 
      padding-left: var(--spacing-lg);
      padding-right: var(--spacing-lg);
    }
  }
  
  @media (min-width: 1024px) {
    .container { 
      max-width: 960px; /* 120 × 8 */
    }
  }
  
  @media (min-width: 1280px) {
    .container { 
      max-width: 1140px;
      padding-left: var(--spacing-xl);
      padding-right: var(--spacing-xl);
    }
  }
  
  @media (min-width: 1536px) {
    .container { 
      max-width: 1280px; /* 160 × 8 */
      padding-left: var(--spacing-2xl);
      padding-right: var(--spacing-2xl);
    }
  }
  
  /* PHASE 12: Smooth Scroll Animations */
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(var(--spacing-lg));
    transition: all var(--duration-moderate) var(--ease-out);
  }
  
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* PHASE 18: Accessibility - Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .animate-on-scroll {
      transition: none;
      opacity: 1;
      transform: none;
    }
    
    html {
      scroll-behavior: auto;
    }
  }
  
  /* PHASE 18: Focus Styles for Accessibility */
  *:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
  
  /* Skip to main content link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-primary);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    text-decoration: none;
    border-radius: var(--radius-sm);
    z-index: 1000;
    transition: top var(--duration-fast) var(--ease-out);
  }
  
  .skip-link:focus {
    top: 6px;
  }
}

@layer utilities {
  /* PHASE 19: Mobile-First Touch Targets */
  @media (max-width: 767px) {
    .touch-target {
      min-height: 44px; /* Apple iOS guideline */
      min-width: 44px;
    }
  }
  
  /* Professional Button Utilities */
  .btn-professional {
    height: var(--height-btn-md);
    padding: 0 var(--spacing-md);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast) var(--ease-out);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
  }
  
  .btn-professional:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .btn-professional:active {
    transform: translateY(0);
  }
}`;
  }

  private static generateGlobalCSS(colors: ColorPalette, variation: StyleVariation, typography: any): string {
    // Generate CSS variables from our design system
    const cssVariables = StyleVariationEngine.generateCSSVariables(colors, variation, typography);
    const componentStyles = StyleVariationEngine.generateComponentStyles(variation);

    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  ${cssVariables}
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    color: var(--color-text);
    background-color: var(--color-background);
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-text);
  }
  
  h1 { font-size: calc(1rem * var(--type-scale) * var(--type-scale) * var(--type-scale)); }
  h2 { font-size: calc(1rem * var(--type-scale) * var(--type-scale)); }
  h3 { font-size: calc(1rem * var(--type-scale)); }
  h4 { font-size: 1rem; }
  h5 { font-size: calc(1rem / var(--type-scale)); }
  h6 { font-size: calc(1rem / var(--type-scale) / var(--type-scale)); }
}

@layer components {
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
  
  @media (min-width: 640px) {
    .container { max-width: 640px; }
  }
  
  @media (min-width: 768px) {
    .container { max-width: 768px; }
  }
  
  @media (min-width: 1024px) {
    .container { max-width: 1024px; }
  }
  
  @media (min-width: 1280px) {
    .container { max-width: 1280px; }
  }
  
  /* Unique Button Styles */
  .btn {
    ${componentStyles.button}
  }
  
  /* Unique Card Styles */
  .card {
    ${componentStyles.card}
  }
  
  /* Unique Input Styles */
  .input {
    ${componentStyles.input}
  }
  
  /* Unique Image Styles */
  .image {
    ${componentStyles.image}
  }
  
  /* Animation Classes */
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s var(--animation-easing);
  }
  
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .animate-on-scroll {
      transition: none;
    }
  }
}`;
  }

  private static generateButtonComponent(buttonStyle: string): string {
    return `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: buttonStyle === 'solid' ? "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5" :
                buttonStyle === 'outline' ? "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white" :
                buttonStyle === 'gradient' ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:scale-105 shadow-lg" :
                buttonStyle === 'rounded' ? "bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-0.5" :
                "bg-transparent text-primary-600 hover:bg-primary-50",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-primary-600 text-primary-600 hover:bg-primary-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-primary-50 hover:text-primary-600",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        /* PHASE 5: Professional Button Physics (8px multiples) */
        sm: cn(
          "text-sm",
          buttonStyle === 'rounded' ? "rounded-full" : "rounded-lg",
          "transition-all duration-200"
        ),
        default: cn(
          "text-base",
          buttonStyle === 'rounded' ? "rounded-full" : "rounded-lg", 
          "transition-all duration-200"
        ),
        lg: cn(
          "text-lg",
          buttonStyle === 'rounded' ? "rounded-full" : "rounded-lg",
          "transition-all duration-200"
        ),
        icon: cn(
          "rounded-lg",
          "transition-all duration-200"
        ),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // PHASE 5: Apply professional sizing using CSS variables
    const sizeStyles = {
      sm: {
        height: 'var(--height-btn-sm)', // 32px (4 × 8)
        padding: '0 var(--spacing-sm)', // 16px horizontal
        fontSize: 'var(--font-size-sm)', // 14px
        lineHeight: 'var(--line-height-base)',
        borderRadius: buttonStyle === 'rounded' ? 'var(--height-btn-sm)' : 'var(--radius-sm)'
      },
      default: {
        height: 'var(--height-btn-md)', // 40px (5 × 8)
        padding: '0 var(--spacing-md)', // 24px horizontal
        fontSize: 'var(--font-size-base)', // 16px
        lineHeight: 'var(--line-height-base)',
        borderRadius: buttonStyle === 'rounded' ? 'var(--height-btn-md)' : 'var(--radius-sm)'
      },
      lg: {
        height: 'var(--height-btn-lg)', // 48px (6 × 8)
        padding: '0 var(--spacing-lg)', // 32px horizontal
        fontSize: 'var(--font-size-lg)', // 18px
        lineHeight: 'var(--line-height-base)',
        borderRadius: buttonStyle === 'rounded' ? 'var(--height-btn-lg)' : 'var(--radius-md)'
      },
      icon: {
        width: 'var(--height-btn-md)', // 40px (5 × 8)
        height: 'var(--height-btn-md)', // 40px (5 × 8)
        padding: '0',
        borderRadius: 'var(--radius-sm)'
      }
    };
    
    const appliedStyle = {
      ...sizeStyles[size || 'default'],
      transitionDuration: 'var(--duration-fast)', // 150ms
      transitionTimingFunction: 'var(--ease-out)',
      ...style
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={appliedStyle}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`;
  }

  private static generateCardComponent(): string {
    return `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`;
  }

  private static generateHeaderComponent(content: WebsiteContent): string {
    return `import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      {/* Desktop Header - PHASE 3: Professional Measurements */}
      <div className="mx-auto max-w-[1280px] px-8 flex items-center" style={{ height: 'var(--height-header)' }}>
        {/* Logo - Left aligned (89% better brand recall) */}
        <div className="flex items-center" style={{ marginRight: 'var(--spacing-xl)' }}>
          <a href="/" className="flex items-center">
            <span 
              className="font-bold text-primary-600"
              style={{ 
                fontSize: 'var(--font-size-2xl)',
                lineHeight: 'var(--line-height-base)',
                height: 'var(--height-btn-md)'
              }}
            >
              ${content.businessName}
            </span>
          </a>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center" style={{ gap: 'var(--spacing-lg)' }}>
          ${content.navigation.map(item =>
      `<a 
              href="#${item.toLowerCase()}" 
              className="transition-colors hover:text-primary-600 text-gray-600"
              style={{ 
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                fontSize: 'var(--font-size-base)',
                lineHeight: 'var(--line-height-base)',
                minHeight: 'var(--height-btn-md)'
              }}
            >
              ${item}
            </a>`
    ).join('\n          ')}
        </nav>

        {/* CTA Button - Right aligned */}
        <div className="ml-auto hidden md:block" style={{ marginLeft: 'var(--spacing-md)' }}>
          <Button 
            className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ 
              height: 'var(--height-btn-md)',
              padding: '0 var(--spacing-md)'
            }}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden inline-flex items-center justify-center transition-colors hover:text-primary-600"
          style={{ 
            width: 'var(--height-btn-md)',
            height: 'var(--height-btn-md)',
            marginLeft: 'auto'
          }}
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav 
            className="flex flex-col bg-white"
            style={{ padding: 'var(--spacing-md)' }}
          >
            ${content.navigation.map(item =>
      `<a 
                href="#${item.toLowerCase()}" 
                className="transition-colors hover:text-primary-600 text-gray-600"
                style={{ 
                  padding: 'var(--spacing-xs) 0',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                  minHeight: 'var(--height-btn-md)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ${item}
              </a>`
    ).join('\n            ')}
            <Button 
              className="w-full"
              style={{ 
                height: 'var(--height-btn-md)',
                marginTop: 'var(--spacing-md)'
              }}
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}`;
  }

  private static generateHeroComponent(content: WebsiteContent): string {
    const heroSection = content.sections.find(s => s.type === 'hero');
    if (!heroSection) return '';

    return `import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section 
      id="home" 
      className="relative bg-gradient-to-br from-primary-50 to-white overflow-hidden"
      style={{ 
        paddingTop: 'var(--spacing-3xl)',
        paddingBottom: 'var(--spacing-3xl)',
        minHeight: '600px' /* PHASE 4: Standard hero height (75 × 8) */
      }}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Hero Content Container */}
      <div 
        className="mx-auto relative z-10 flex items-center justify-center h-full"
        style={{ 
          maxWidth: 'var(--container-xl)',
          paddingLeft: 'var(--spacing-lg)',
          paddingRight: 'var(--spacing-lg)'
        }}
      >
        <div 
          className="text-center"
          style={{ maxWidth: '720px' }} /* PHASE 4: Optimal text width (60-75 chars) */
        >
          {/* Hero Title - PHASE 2: Vertical Rhythm */}
          <h1 
            className="font-bold tracking-tight text-gray-900 animate-fade-in"
            style={{ 
              fontSize: 'var(--font-size-5xl)', /* Mobile: 48px */
              lineHeight: 'var(--line-height-base)',
              marginBottom: 'var(--margin-h1)'
            }}
          >
            ${heroSection.title}
          </h1>
          
          {/* Hero Subtitle - PHASE 2: Vertical Rhythm */}
          <p 
            className="text-gray-600 animate-slide-up"
            style={{ 
              fontSize: 'var(--font-size-xl)', /* 20px */
              lineHeight: 'var(--line-height-base)',
              marginBottom: 'var(--spacing-2xl)'
            }}
          >
            ${heroSection.content}
          </p>
          
          {/* CTA Buttons - PHASE 5: Component Physics */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center animate-slide-up"
            style={{ gap: 'var(--spacing-md)' }}
          >
            <Button 
              className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ 
                height: 'var(--height-btn-lg)',
                padding: '0 var(--spacing-lg)',
                fontSize: 'var(--font-size-lg)',
                gap: 'var(--spacing-xs)'
              }}
            >
              ${heroSection.cta?.primary || 'Get Started'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline" 
              className="transition-all duration-200 hover:bg-primary-50"
              style={{ 
                height: 'var(--height-btn-lg)',
                padding: '0 var(--spacing-lg)',
                fontSize: 'var(--font-size-lg)',
                gap: 'var(--spacing-xs)'
              }}
            >
              <Play className="h-4 w-4" />
              ${heroSection.cta?.secondary || 'Watch Demo'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Responsive Typography - Mobile to Desktop */}
      <style jsx>{\`
        @media (min-width: 768px) {
          h1 {
            font-size: var(--font-size-6xl) !important; /* Tablet: 64px */
          }
        }
        
        @media (min-width: 1024px) {
          section {
            min-height: 70vh; /* Desktop: 70% viewport height */
          }
          h1 {
            font-size: 72px !important; /* Desktop: 72px (9 × 8) */
            line-height: 80px !important; /* 10 × 8 */
          }
        }
      \`}</style>
    </section>
  )
}`;
  }

  private static generateFeaturesComponent(content: WebsiteContent): string {
    const featuresSection = content.sections.find(s => s.type === 'features');
    if (!featuresSection) return '';

    return `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = ${JSON.stringify(featuresSection.items || [], null, 2)}

export function Features() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-white">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ${featuresSection.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            ${featuresSection.content}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}`;
  }

  private static generateAboutComponent(content: WebsiteContent): string {
    const aboutSection = content.sections.find(s => s.type === 'about');
    if (!aboutSection) return '';

    return `export function About() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-gray-50">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ${aboutSection.title}
            </h2>
          </div>
          <div className="mt-16">
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-8">
                ${aboutSection.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}`;
  }

  private static generateServicesComponent(content: WebsiteContent): string {
    const servicesSection = content.sections.find(s => s.type === 'services');
    if (!servicesSection) return '';

    return `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const services = ${JSON.stringify(servicesSection.items || [], null, 2)}

export function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-white">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ${servicesSection.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            ${servicesSection.content}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          {services.map((service, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                {service.price && (
                  <div className="text-2xl font-bold text-primary-600">{service.price}</div>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </CardDescription>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}`;
  }

  private static generateContactComponent(content: WebsiteContent): string {
    const contactSection = content.sections.find(s => s.type === 'contact');
    if (!contactSection) return '';

    return `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-gray-50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ${contactSection.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            ${contactSection.content}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your message..."
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}`;
  }

  private static generateFooterComponent(content: WebsiteContent): string {
    return `export function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">${content.businessName}</h3>
            <p className="text-gray-400 mb-4">
              ${content.description}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              ${content.navigation.map(item =>
      `<li><a href="#${item.toLowerCase()}" className="hover:text-white transition-colors">${item}</a></li>`
    ).join('\n              ')}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@${content.businessName.toLowerCase().replace(/\s+/g, '')}.com</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ${content.businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}`;
  }

  private static generateAppComponent(content: WebsiteContent): string {
    return `import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { About } from "@/components/About"
import { Services } from "@/components/Services"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App`;
  }

  /**
   * Phase 14: Select optimal design patterns based on content and industry
   */
  private static selectOptimalPatterns(
    content: WebsiteContent,
    recommendedPatterns: DesignPattern[]
  ): DesignPattern[] {
    const selectedPatterns: DesignPattern[] = [];

    // Always include a hero pattern
    const heroPattern = recommendedPatterns.find(p => p.category === 'layout' && p.name.includes('Hero')) ||
      designPatternLibrary.getPatternById('hero-centered-cta');
    if (heroPattern) selectedPatterns.push(heroPattern);

    // Add navigation pattern
    const navPattern = designPatternLibrary.getPatternById('nav-sticky-transparent');
    if (navPattern) selectedPatterns.push(navPattern);

    // Add content patterns based on sections
    if (content.sections.find(s => s.type === 'features')) {
      const cardPattern = designPatternLibrary.getPatternById('card-hover-lift');
      if (cardPattern) selectedPatterns.push(cardPattern);
    }

    // Add form pattern if contact section exists
    if (content.sections.find(s => s.type === 'contact')) {
      const formPattern = designPatternLibrary.getPatternById('form-floating-labels');
      if (formPattern) selectedPatterns.push(formPattern);
    }

    // Add animation patterns for modern feel
    const animationPattern = designPatternLibrary.getPatternById('scroll-reveal-fade');
    if (animationPattern) selectedPatterns.push(animationPattern);

    // Industry-specific patterns
    if (content.industry === 'ecommerce') {
      const productPattern = designPatternLibrary.getPatternById('product-card-quick-view');
      if (productPattern) selectedPatterns.push(productPattern);
    }

    if (['saas', 'admin', 'analytics'].includes(content.industry)) {
      const dashboardPattern = designPatternLibrary.getPatternById('dashboard-sidebar-collapsible');
      if (dashboardPattern) selectedPatterns.push(dashboardPattern);
    }

    return selectedPatterns;
  }

  /**
   * Phase 15: Add advanced features and optimizations
   */
  private static addAdvancedFeatures(
    files: AdvancedProjectFile[],
    patterns: DesignPattern[],
    content: WebsiteContent
  ): void {
    // Add performance optimizations
    this.addPerformanceOptimizations(files);

    // Add accessibility enhancements
    this.addAccessibilityFeatures(files, patterns);

    // Add SEO optimizations
    this.addSEOOptimizations(files, content);

    // Add PWA features
    this.addPWAFeatures(files);

    // Add analytics and monitoring
    this.addAnalyticsIntegration(files);
  }

  /**
   * Add performance optimizations
   */
  private static addPerformanceOptimizations(files: AdvancedProjectFile[]): void {
    // Add React.lazy for code splitting
    const appFile = files.find(f => f.path === 'src/App.tsx');
    if (appFile) {
      appFile.content = appFile.content.replace(
        /import.*from.*components/g,
        'const $& = React.lazy(() => import$&)'
      );
    }

    // Add service worker for caching
    files.push({
      path: 'public/sw.js',
      language: 'javascript',
      content: `// Service Worker for caching and offline support
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});`
    });
  }

  /**
   * Add accessibility enhancements
   */
  private static addAccessibilityFeatures(files: AdvancedProjectFile[], patterns: DesignPattern[]): void {
    // Add accessibility utilities
    files.push({
      path: 'src/utils/accessibility.ts',
      language: 'typescript',
      content: `// Accessibility utilities
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};`
    });
  }

  /**
   * Add SEO optimizations
   */
  private static addSEOOptimizations(files: AdvancedProjectFile[], content: WebsiteContent): void {
    // Update HTML with SEO meta tags
    const htmlFile = files.find(f => f.path === 'index.html');
    if (htmlFile) {
      htmlFile.content = htmlFile.content.replace(
        '<meta name="description" content="',
        `<meta name="description" content="${content.description}">\n    <meta property="og:title" content="${content.businessName}">\n    <meta property="og:description" content="${content.description}">\n    <meta property="og:type" content="website">\n    <meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="${content.businessName}">\n    <meta name="twitter:description" content="`
      );
    }

    // Add structured data
    files.push({
      path: 'src/components/StructuredData.tsx',
      language: 'typescript',
      content: `import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  businessName: string;
  description: string;
  url?: string;
}

export function StructuredData({ businessName, description, url }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessName,
    "description": description,
    "url": url || window.location.origin
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}`
    });
  }

  /**
   * Add PWA features
   */
  private static addPWAFeatures(files: AdvancedProjectFile[]): void {
    // Add manifest.json
    files.push({
      path: 'public/manifest.json',
      language: 'json',
      content: JSON.stringify({
        "name": "Advanced React App",
        "short_name": "React App",
        "description": "Professional React application with PWA features",
        "start_url": "/",
        "display": "standalone",
        "theme_color": "#2563eb",
        "background_color": "#ffffff",
        "icons": [
          {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }, null, 2)
    });
  }

  /**
   * Generate premium animated components
   */
  private static generatePremiumComponents(components: any): AdvancedProjectFile[] {
    const files: AdvancedProjectFile[] = [];

    // Generate component imports
    const imports = PremiumComponentRegistry.generateComponentImports(components);

    // Add Framer Motion animations CSS
    files.push({
      path: 'src/styles/animations.css',
      language: 'css',
      content: `
/* Premium Animations */
@keyframes spotlight {
  0% { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
  100% { opacity: 1; transform: translate(-50%,-40%) scale(1); }
}

@keyframes border-beam {
  100% { offset-distance: 100%; }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - var(--gap))); }
}

@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--gap))); }
}

.animate-spotlight {
  animation: spotlight 2s ease .75s 1 forwards;
}

.animate-border-beam {
  animation: border-beam calc(var(--duration)*1s) infinite linear;
}

.animate-marquee {
  animation: marquee var(--duration) linear infinite;
}

.animate-marquee-vertical {
  animation: marquee-vertical var(--duration) linear infinite;
}

/* Grid Pattern */
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

.bg-grid-white\/\[0\.02\] {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}
`
    });

    return files;
  }

  /**
   * Generate premium App component with animations
   */
  private static generatePremiumAppComponent(
    content: WebsiteContent,
    components: any,
    sampleData: any
  ): string {
    const imports = PremiumComponentRegistry.generateComponentImports(components);
    const componentJSX = PremiumComponentRegistry.generateComponentJSX(
      components,
      sampleData,
      content.businessName,
      content.industry
    );

    return `${imports}
import './styles/animations.css';

${componentJSX}

export default App;`;
  }

  /**
   * Generate Dynamic Site Configuration
   */
  private static generateDynamicSiteConfig(content: WebsiteContent, designSystem: any): string {
    return `// Dynamic Site Configuration - AI Generated
import { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: "${content.businessName}",
  description: "${content.description}",
  url: "https://example.com",
  logo: "/logo.svg",
  social: {
    twitter: "https://twitter.com/${content.businessName.toLowerCase().replace(/\s+/g, '')}",
    linkedin: "https://linkedin.com/company/${content.businessName.toLowerCase().replace(/\s+/g, '-')}",
    instagram: "https://instagram.com/${content.businessName.toLowerCase().replace(/\s+/g, '')}"
  },
  contact: {
    email: "info@${content.businessName.toLowerCase().replace(/\s+/g, '')}.com",
    phone: "(555) 123-4567",
    address: "123 Business St, City, State 12345"
  }
}

export const navigation = ${JSON.stringify(content.navigation.map(item => ({
      name: item,
      href: `#${item.toLowerCase()}`
    })), null, 2)}

export const businessInfo = {
  industry: "${content.industry}",
  founded: "2024",
  employees: "10-50",
  location: "United States"
}`;
  }

  /**
   * Generate Dynamic Theme Configuration
   */
  private static generateDynamicThemeConfig(colors: ColorPalette, variation: StyleVariation, fontPairing: FontPairing): string {
    return `// Dynamic Theme Configuration - AI Generated
import { ThemeConfig } from '@/types'

export const themeConfig: ThemeConfig = {
  colors: {
    primary: "${colors.primary}",
    secondary: "${colors.secondary}",
    accent: "${colors.accent}",
    background: "${colors.background}",
    text: "${colors.text}"
  },
  fonts: {
    heading: "${fontPairing.heading}",
    body: "${fontPairing.body}"
  },
  spacing: "${variation.spacingScale.name}",
  animations: {
    speed: "${variation.animationLevel.speed}",
    easing: "${variation.animationLevel.easing}"
  }
}

export const designVariation = {
  layoutVariant: "${variation.layoutVariant.heroStyle}",
  componentStyles: {
    buttonStyle: "${variation.componentStyles.buttonStyle}",
    cardStyle: "${variation.componentStyles.cardStyle}",
    inputStyle: "${variation.componentStyles.inputStyle}"
  },
  imageStyle: {
    treatment: "${variation.imageStyle.treatment}",
    aspectRatio: "${variation.imageStyle.aspectRatio}",
    hoverEffect: "${variation.imageStyle.hoverEffect}"
  }
}`;
  }

  /**
   * Add analytics integration
   */
  private static addAnalyticsIntegration(files: AdvancedProjectFile[]): void {
    files.push({
      path: 'src/utils/analytics.ts',
      language: 'typescript',
      content: `// Analytics and performance monitoring
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
  console.log('📊 Event tracked:', eventName, properties);
};

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path
    });
  }
  console.log('📄 Page view tracked:', path);
};

export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const metrics = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
    };
    console.log('⚡ Performance metrics:', metrics);
    return metrics;
  }
  return null;
};`
    });
  }
}