// UNIVERSAL SKELETON STRUCTURE
// The base template for ALL AI-generated websites
// This creates the consistent foundation that never changes

export interface SkeletonFile {
  path: string;
  content: string;
  language: string;
  type: 'skeleton' | 'dynamic'; // skeleton = never changes, dynamic = AI generates
}

export class UniversalSkeletonGenerator {
  
  /**
   * Generate the complete universal skeleton structure
   * This is the foundation that EVERY website gets
   */
  static generateUniversalSkeleton(): SkeletonFile[] {
    const files: SkeletonFile[] = [];
    
    // PHASE 1: Core Configuration Files (Never Change)
    files.push(...this.generateCoreConfig());
    
    // PHASE 2: Base TypeScript Files (Never Change)
    files.push(...this.generateBaseTypeScript());
    
    // PHASE 3: Base Styles (Never Change)
    files.push(...this.generateBaseStyles());
    
    // PHASE 4: Utility Functions (Never Change)
    files.push(...this.generateUtilities());
    
    // PHASE 5: Base UI Components (Never Change)
    files.push(...this.generateBaseUIComponents());
    
    // PHASE 6: Static Assets Structure (Never Change)
    files.push(...this.generateStaticAssets());
    
    console.log(`✅ Universal skeleton generated: ${files.length} files`);
    return files;
  }

  /**
   * PHASE 1: Core Configuration Files
   */
  private static generateCoreConfig(): SkeletonFile[] {
    return [
      {
        path: 'package.json',
        language: 'json',
        type: 'skeleton',
        content: JSON.stringify({
          "name": "ai-generated-website",
          "version": "1.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "tsc && vite build",
            "preview": "vite preview",
            "lint": "eslint .",
            "format": "prettier --write ."
          },
          "dependencies": {
            "react": "^19.0.0",
            "react-dom": "^19.0.0",
            "react-router-dom": "^7.1.1",
            "lucide-react": "^0.469.0",
            "clsx": "^2.1.1",
            "tailwind-merge": "^2.7.0",
            "framer-motion": "^12.0.0"
          },
          "devDependencies": {
            "@types/react": "^19.0.0",
            "@types/react-dom": "^19.0.0",
            "@vitejs/plugin-react": "^4.3.4",
            "typescript": "^5.7.2",
            "vite": "^6.0.3",
            "tailwindcss": "^3.4.17",
            "postcss": "^8.4.49",
            "autoprefixer": "^10.4.20",
            "eslint": "^9.17.0",
            "prettier": "^3.4.2"
          }
        }, null, 2)
      },
      
      {
        path: 'vite.config.ts',
        language: 'typescript',
        type: 'skeleton',
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`
      },
      
      {
        path: 'tsconfig.json',
        language: 'json',
        type: 'skeleton',
        content: JSON.stringify({
          "compilerOptions": {
            "target": "ES2020",
            "useDefineForClassFields": true,
            "lib": ["ES2020", "DOM", "DOM.Iterable"],
            "module": "ESNext",
            "skipLibCheck": true,
            "moduleResolution": "bundler",
            "allowImportingTsExtensions": true,
            "resolveJsonModule": true,
            "isolatedModules": true,
            "noEmit": true,
            "jsx": "react-jsx",
            "strict": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "noFallthroughCasesInSwitch": true,
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"]
            }
          },
          "include": ["src"],
          "references": [{ "path": "./tsconfig.node.json" }]
        }, null, 2)
      },
      
      {
        path: 'tsconfig.node.json',
        language: 'json',
        type: 'skeleton',
        content: JSON.stringify({
          "compilerOptions": {
            "composite": true,
            "skipLibCheck": true,
            "module": "ESNext",
            "moduleResolution": "bundler",
            "allowSyntheticDefaultImports": true
          },
          "include": ["vite.config.ts"]
        }, null, 2)
      },
      
      {
        path: 'postcss.config.js',
        language: 'javascript',
        type: 'skeleton',
        content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
      }
    ];
  }

  /**
   * PHASE 2: Base TypeScript Files
   */
  private static generateBaseTypeScript(): SkeletonFile[] {
    return [
      {
        path: 'src/main.tsx',
        language: 'typescript',
        type: 'skeleton',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
      },
      
      {
        path: 'src/vite-env.d.ts',
        language: 'typescript',
        type: 'skeleton',
        content: `/// <reference types="vite/client" />`
      }
    ];
  }

  /**
   * PHASE 3: Base Styles (8px Grid System)
   */
  private static generateBaseStyles(): SkeletonFile[] {
    return [
      {
        path: 'src/index.css',
        language: 'css',
        type: 'skeleton',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* 8px Spacing Scale - NEVER CHANGE */
    --spacing-xs: 8px;
    --spacing-sm: 16px;
    --spacing-md: 24px;
    --spacing-lg: 32px;
    --spacing-xl: 48px;
    --spacing-2xl: 64px;
    --spacing-3xl: 96px;
    
    /* Typography Scale - NEVER CHANGE */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 32px;
    --font-size-4xl: 40px;
    --font-size-5xl: 48px;
    --font-size-6xl: 64px;
    
    /* Line Heights (Vertical Rhythm) - NEVER CHANGE */
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Animation Durations - NEVER CHANGE */
    --duration-fast: 150ms;
    --duration-normal: 300ms;
    --duration-slow: 500ms;
    
    /* Easing Functions - NEVER CHANGE */
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Breakpoints (match Tailwind) - NEVER CHANGE */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px; /* Account for fixed header */
  }
  
  body {
    font-family: var(--font-body), sans-serif;
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading), sans-serif;
    font-weight: 700;
    line-height: var(--line-height-tight);
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  button {
    font-family: inherit;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`
      }
    ];
  }

  /**
   * PHASE 4: Utility Functions
   */
  private static generateUtilities(): SkeletonFile[] {
    return [
      {
        path: 'src/lib/utils.ts',
        language: 'typescript',
        type: 'skeleton',
        content: `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
      },
      
      {
        path: 'src/types/index.ts',
        language: 'typescript',
        type: 'skeleton',
        content: `// Base types for all AI-generated websites

export interface SiteConfig {
  name: string
  description: string
  url: string
  logo: string
  social: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  contact: {
    email: string
    phone?: string
    address?: string
  }
}

export interface NavigationItem {
  name: string
  href: string
  children?: NavigationItem[]
}

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: string
  animations: {
    speed: 'fast' | 'normal' | 'slow'
    easing: string
  }
}`
      }
    ];
  }

  /**
   * PHASE 5: Base UI Components (ShadCN-style)
   */
  private static generateBaseUIComponents(): SkeletonFile[] {
    return [
      {
        path: 'src/components/ui/button.tsx',
        language: 'typescript',
        type: 'skeleton',
        content: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`
      },
      
      {
        path: 'src/components/ui/card.tsx',
        language: 'typescript',
        type: 'skeleton',
        content: `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
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
    className={cn("text-sm text-muted-foreground", className)}
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

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`
      }
    ];
  }

  /**
   * PHASE 6: Static Assets Structure
   */
  private static generateStaticAssets(): SkeletonFile[] {
    return [
      {
        path: 'public/robots.txt',
        language: 'text',
        type: 'skeleton',
        content: `User-agent: *
Allow: /

Sitemap: /sitemap.xml`
      },
      
      {
        path: 'public/manifest.json',
        language: 'json',
        type: 'skeleton',
        content: JSON.stringify({
          "name": "AI Generated Website",
          "short_name": "AI Site",
          "description": "Professional website generated by AI",
          "start_url": "/",
          "display": "standalone",
          "theme_color": "#000000",
          "background_color": "#ffffff",
          "icons": [
            {
              "src": "/favicon-192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "/favicon-512.png",
              "sizes": "512x512",
              "type": "image/png"
            }
          ]
        }, null, 2)
      },
      
      {
        path: '.gitignore',
        language: 'text',
        type: 'skeleton',
        content: `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`
      }
    ];
  }

  /**
   * Get the total number of skeleton files
   */
  static getSkeletonFileCount(): number {
    return this.generateUniversalSkeleton().length;
  }

  /**
   * Get skeleton files by type
   */
  static getSkeletonFilesByType(type: 'skeleton' | 'dynamic'): SkeletonFile[] {
    return this.generateUniversalSkeleton().filter(file => file.type === type);
  }
}