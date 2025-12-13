// React + Vite + TypeScript Base Template
// This defines the structure and static files for React projects

export interface ReactProjectTemplate {
  name: string;
  description: string;
  files: Record<string, string>;
}

export const getBaseReactTemplate = (projectName: string, projectDescription: string): ReactProjectTemplate => {
  return {
    name: projectName,
    description: projectDescription,
    files: {
      // Root files
      '.gitignore': getGitignoreContent(),
      'index.html': getIndexHtmlContent(projectName),
      'package.json': getPackageJsonContent(projectName, projectDescription),
      'postcss.config.js': getPostcssConfigContent(),
      'tailwind.config.js': getTailwindConfigContent(),
      'tsconfig.json': getTsconfigContent(),
      'tsconfig.node.json': getTsconfigNodeContent(),
      'vite.config.ts': getViteConfigContent(),
      'README.md': getReadmeContent(projectName, projectDescription),
      
      // Source files (static)
      'src/main.tsx': getMainTsxContent(),
      'src/vite-env.d.ts': getViteEnvContent(),
      'src/lib/utils.ts': getUtilsContent(),
      
      // Public files
      'public/vite.svg': getViteSvgContent(),
    }
  };
};

// ============================================================================
// STATIC FILE CONTENTS
// ============================================================================

function getGitignoreContent(): string {
  return `# Logs
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
`;
}

function getIndexHtmlContent(projectName: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function getPackageJsonContent(projectName: string, description: string): string {
  const packageJson = {
    name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    private: true,
    version: '0.1.0',
    type: 'module',
    description: description,
    scripts: {
      dev: 'vite --host 0.0.0.0 --port 5173',
      build: 'tsc && vite build',
      preview: 'vite preview --host 0.0.0.0 --port 5173',
      lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
    },
    dependencies: {
      'react': '^18.3.1',
      'react-dom': '^18.3.1',
      'react-router-dom': '^6.22.0',
      '@radix-ui/react-slot': '^1.0.2',
      '@radix-ui/react-label': '^2.0.2',
      'class-variance-authority': '^0.7.0',
      'clsx': '^2.1.0',
      'tailwind-merge': '^2.2.0',
      'lucide-react': '^0.344.0'
    },
    devDependencies: {
      '@types/react': '^18.3.1',
      '@types/react-dom': '^18.3.0',
      '@vitejs/plugin-react': '^4.2.1',
      'autoprefixer': '^10.4.18',
      'postcss': '^8.4.35',
      'tailwindcss': '^3.4.1',
      'tailwindcss-animate': '^1.0.7',
      'typescript': '^5.3.3',
      'vite': '^5.1.4'
    }
  };
  
  return JSON.stringify(packageJson, null, 2);
}

function getPostcssConfigContent(): string {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
}

function getTailwindConfigContent(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`;
}

function getTsconfigContent(): string {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;
}

function getTsconfigNodeContent(): string {
  return `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`;
}

function getViteConfigContent(): string {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
})
`;
}

function getReadmeContent(projectName: string, description: string): string {
  return `# ${projectName}

${description}

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open your browser to [http://localhost:5173](http://localhost:5173)

## 📦 Build for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the \`dist\` directory.

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Lucide React** - Icons

## 📁 Project Structure

\`\`\`
src/
├── components/       # React components
│   ├── ui/          # Shadcn UI components
│   ├── Header.tsx
│   ├── Hero.tsx
│   └── ...
├── lib/             # Utilities
│   └── utils.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
\`\`\`

## 🎨 Customization

### Colors
Edit \`tailwind.config.js\` to customize the color scheme.

### Components
All components are in \`src/components/\`. Modify them to fit your needs.

### Styling
This project uses Tailwind CSS. Add custom styles in \`src/index.css\`.

## 📝 License

MIT

---

**Generated by AI Website Builder** 🤖
`;
}

function getMainTsxContent(): string {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
}

function getViteEnvContent(): string {
  return `/// <reference types="vite/client" />
`;
}

function getUtilsContent(): string {
  return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
}

function getViteSvgContent(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`;
}
