# 🚀 PHASE 1: IN-BROWSER CODE EXECUTION WITH E2B

## 📋 PHASE OVERVIEW

**Goal:** Implement E2B Sandbox integration for live React preview

**Duration:** 3-4 days
**Complexity:** Medium
**Priority:** CRITICAL

**What users will see:**
1. Generate React app
2. E2B sandbox creates
3. npm install runs
4. Dev server starts
5. Live preview appears in browser
6. No download needed!

---

## 🎯 DETAILED REQUIREMENTS

### **1. E2B Sandbox Initialization**

**What it does:**
- Creates isolated cloud sandbox
- Mounts generated React project files
- Installs dependencies
- Starts dev server
- Provides preview URL

**Technical Details:**
```javascript
// Sandbox lifecycle:
1. Create sandbox (E2B API)
2. Mount files (filesystem.write)
3. Run npm install (commands.run)
4. Start dev server (npm run dev)
5. Get preview URL (getURL)
6. Display in iframe
7. Monitor for errors
8. Handle cleanup
```

### **2. File Mounting System**

**What it does:**
- Takes generated React files
- Writes to sandbox filesystem
- Creates proper directory structure
- Handles package.json
- Handles tsconfig.json
- Handles all source files

**File Structure:**
```
/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   └── components/
│       ├── Header.tsx
│       ├── Hero.tsx
│       └── Footer.tsx
└── public/
    └── favicon.svg
```

### **3. Dependency Installation**

**What it does:**
- Runs npm install in sandbox
- Shows progress in terminal
- Handles errors
- Caches dependencies
- Manages package versions

**Process:**
```
1. User generates React app
2. E2B mounts files
3. npm install starts
4. Terminal shows: "npm install"
5. Progress: "added 150 packages"
6. Installation complete
7. Ready for dev server
```

### **4. Dev Server Startup**

**What it does:**
- Runs npm run dev
- Starts Vite dev server
- Listens on port 5173
- Enables hot reload
- Provides preview URL

**Process:**
```
1. npm run dev executes
2. Vite starts
3. Server listens on 5173
4. HMR enabled
5. URL: https://sandbox-url:5173
6. Preview ready
```

### **5. Preview URL Generation**

**What it does:**
- Gets public URL from E2B
- Displays in iframe
- Handles URL changes
- Manages session lifecycle

**Implementation:**
```javascript
const url = await sandbox.getURL(5173);
// Returns: https://abc123.e2b.dev:5173
// Display in iframe: <iframe src={url} />
```

### **6. Error Handling**

**What it does:**
- Catches sandbox errors
- Catches npm errors
- Catches dev server errors
- Shows user-friendly messages
- Provides retry option

**Error Types:**
- Sandbox creation failed
- File mounting failed
- npm install failed
- Dev server failed to start
- Network errors

---

## 📁 FILES TO CREATE

### **1. `src/services/e2bService.ts`**

**Responsibilities:**
- E2B API integration
- Sandbox creation
- File mounting
- Command execution
- URL management
- Error handling

**Key Functions:**
```typescript
// Create sandbox
async createSandbox(): Promise<Sandbox>

// Mount files
async mountFiles(files: ProjectFile[]): Promise<void>

// Install dependencies
async installDependencies(): Promise<void>

// Start dev server
async startDevServer(): Promise<string>

// Get preview URL
async getPreviewURL(): Promise<string>

// Execute command
async executeCommand(command: string): Promise<CommandResult>

// Cleanup
async cleanup(): Promise<void>
```

### **2. `src/services/sandboxManager.ts`**

**Responsibilities:**
- Sandbox lifecycle management
- Session tracking
- Resource cleanup
- Error recovery
- Status monitoring

**Key Functions:**
```typescript
// Create managed sandbox
async createManagedSandbox(projectId: string): Promise<ManagedSandbox>

// Get sandbox status
async getSandboxStatus(sandboxId: string): Promise<SandboxStatus>

// Monitor sandbox
async monitorSandbox(sandboxId: string): Promise<void>

// Cleanup sandbox
async cleanupSandbox(sandboxId: string): Promise<void>

// Handle errors
async handleSandboxError(error: Error): Promise<void>
```

### **3. `src/components/E2BPreview.tsx`**

**Responsibilities:**
- Display preview iframe
- Show loading state
- Handle errors
- Manage preview lifecycle
- Display status messages

**Key Features:**
```typescript
// Props
interface E2BPreviewProps {
  projectId: string;
  generatedFiles: ProjectFile[];
  onReady: (url: string) => void;
  onError: (error: Error) => void;
}

// States
- loading: boolean
- error: Error | null
- previewURL: string | null
- status: 'initializing' | 'mounting' | 'installing' | 'starting' | 'ready'

// UI Elements
- Loading spinner
- Status message
- Error message
- Iframe for preview
- Retry button
```

### **4. `src/hooks/useE2B.ts`**

**Responsibilities:**
- E2B hook for components
- Sandbox lifecycle
- Error handling
- State management

**Key Functions:**
```typescript
// Hook
function useE2B(projectId: string) {
  // Returns:
  - sandbox: Sandbox | null
  - isLoading: boolean
  - error: Error | null
  - previewURL: string | null
  - status: SandboxStatus
  - executeCommand: (cmd: string) => Promise<void>
  - cleanup: () => Promise<void>
}
```

---

## 🔧 IMPLEMENTATION STEPS

### **Step 1: Setup E2B Service (Day 1)**

```typescript
// src/services/e2bService.ts

import { Sandbox } from '@e2b/code-interpreter';

export class E2BService {
  private sandbox: Sandbox | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createSandbox(): Promise<Sandbox> {
    try {
      console.log('🚀 Creating E2B sandbox...');
      this.sandbox = await Sandbox.create({
        apiKey: this.apiKey,
        timeout: 60000
      });
      console.log('✅ Sandbox created:', this.sandbox.sandboxId);
      return this.sandbox;
    } catch (error) {
      console.error('❌ Failed to create sandbox:', error);
      throw error;
    }
  }

  async mountFiles(files: ProjectFile[]): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    
    try {
      console.log('📁 Mounting files...');
      for (const file of files) {
        await this.sandbox.filesystem.write(file.path, file.content);
        console.log(`✅ Mounted: ${file.path}`);
      }
    } catch (error) {
      console.error('❌ Failed to mount files:', error);
      throw error;
    }
  }

  async installDependencies(): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    
    try {
      console.log('📦 Installing dependencies...');
      const result = await this.sandbox.commands.run('npm install');
      console.log('✅ Dependencies installed');
      console.log(result.stdout);
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error);
      throw error;
    }
  }

  async startDevServer(): Promise<string> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');
    
    try {
      console.log('🚀 Starting dev server...');
      await this.sandbox.commands.run('npm run dev', {
        background: true
      });
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const url = await this.sandbox.getURL(5173);
      console.log('✅ Dev server started:', url);
      return url;
    } catch (error) {
      console.error('❌ Failed to start dev server:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.sandbox) {
      try {
        console.log('🧹 Cleaning up sandbox...');
        await this.sandbox.kill();
        this.sandbox = null;
        console.log('✅ Sandbox cleaned up');
      } catch (error) {
        console.error('❌ Failed to cleanup sandbox:', error);
      }
    }
  }
}
```

### **Step 2: Create Sandbox Manager (Day 1-2)**

```typescript
// src/services/sandboxManager.ts

import { E2BService } from './e2bService';

export class SandboxManager {
  private sandboxes: Map<string, E2BService> = new Map();
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createManagedSandbox(projectId: string, files: ProjectFile[]): Promise<string> {
    try {
      console.log(`🚀 Creating managed sandbox for project: ${projectId}`);
      
      // Create E2B service
      const e2bService = new E2BService(this.apiKey);
      
      // Create sandbox
      await e2bService.createSandbox();
      
      // Mount files
      await e2bService.mountFiles(files);
      
      // Install dependencies
      await e2bService.installDependencies();
      
      // Start dev server
      const previewURL = await e2bService.startDevServer();
      
      // Store reference
      this.sandboxes.set(projectId, e2bService);
      
      console.log(`✅ Managed sandbox created for project: ${projectId}`);
      return previewURL;
    } catch (error) {
      console.error(`❌ Failed to create managed sandbox: ${error}`);
      throw error;
    }
  }

  async cleanupSandbox(projectId: string): Promise<void> {
    const e2bService = this.sandboxes.get(projectId);
    if (e2bService) {
      await e2bService.cleanup();
      this.sandboxes.delete(projectId);
    }
  }

  async cleanupAll(): Promise<void> {
    for (const [projectId, e2bService] of this.sandboxes) {
      await e2bService.cleanup();
    }
    this.sandboxes.clear();
  }
}
```

### **Step 3: Create Preview Component (Day 2)**

```typescript
// src/components/E2BPreview.tsx

import React, { useEffect, useState } from 'react';
import { useE2B } from '../hooks/useE2B';

interface E2BPreviewProps {
  projectId: string;
  generatedFiles: ProjectFile[];
  onReady?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function E2BPreview({
  projectId,
  generatedFiles,
  onReady,
  onError
}: E2BPreviewProps) {
  const { previewURL, isLoading, error, status } = useE2B(projectId, generatedFiles);

  useEffect(() => {
    if (previewURL) {
      onReady?.(previewURL);
    }
  }, [previewURL, onReady]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-red-50">
        <p className="text-red-600 font-semibold">Error: {error.message}</p>
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!previewURL) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-600">Initializing preview...</p>
      </div>
    );
  }

  return (
    <iframe
      src={previewURL}
      className="w-full h-full border-0"
      title="React Preview"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
    />
  );
}
```

### **Step 4: Create Hook (Day 2)**

```typescript
// src/hooks/useE2B.ts

import { useEffect, useState } from 'react';
import { SandboxManager } from '../services/sandboxManager';

export function useE2B(projectId: string, files: ProjectFile[]) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const initializeSandbox = async () => {
      try {
        setStatus('Creating sandbox...');
        const apiKey = import.meta.env.VITE_E2B_API_KEY;
        const manager = new SandboxManager(apiKey);
        
        setStatus('Mounting files...');
        const url = await manager.createManagedSandbox(projectId, files);
        
        setStatus('Starting dev server...');
        setPreviewURL(url);
        setStatus('Ready!');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setStatus('Error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSandbox();

    return () => {
      // Cleanup on unmount
    };
  }, [projectId, files]);

  return { previewURL, isLoading, error, status };
}
```

### **Step 5: Integration with AppBuilder (Day 3)**

```typescript
// In src/react-app/pages/AppBuilder.tsx

import { E2BPreview } from '../components/E2BPreview';

// In the preview section:
{generationMode === 'react' && generatedFiles.length > 0 ? (
  <E2BPreview
    projectId={appId}
    generatedFiles={generatedFiles}
    onReady={(url) => {
      console.log('✅ Preview ready:', url);
      setPreviewURL(url);
    }}
    onError={(error) => {
      console.error('❌ Preview error:', error);
      setShowErrorModal(true);
    }}
  />
) : (
  <div>Select React mode and generate a project</div>
)}
```

---

## 🧪 TESTING CHECKLIST

### **Unit Tests**
- [ ] E2BService creates sandbox
- [ ] E2BService mounts files
- [ ] E2BService installs dependencies
- [ ] E2BService starts dev server
- [ ] E2BService handles errors

### **Integration Tests**
- [ ] SandboxManager creates managed sandbox
- [ ] SandboxManager cleans up sandbox
- [ ] E2BPreview component renders
- [ ] useE2B hook works correctly

### **End-to-End Tests**
- [ ] Generate React app
- [ ] E2B sandbox creates
- [ ] Files mount correctly
- [ ] npm install completes
- [ ] Dev server starts
- [ ] Preview displays in iframe
- [ ] Hot reload works
- [ ] Cleanup on unmount

### **Error Scenarios**
- [ ] Invalid API key
- [ ] Sandbox creation fails
- [ ] File mounting fails
- [ ] npm install fails
- [ ] Dev server fails to start
- [ ] Network errors handled

---

## 📊 SUCCESS CRITERIA

✅ **Phase 1 Complete When:**
1. E2B sandbox creates successfully
2. React projects run in sandbox
3. Live preview shows in iframe
4. npm install works
5. Hot reload works
6. Errors handled gracefully
7. No console errors
8. Performance acceptable (<5s startup)

---

## 🚀 NEXT STEPS

1. **Get E2B API Key** from https://e2b.dev
2. **Add to .env**: `VITE_E2B_API_KEY=your_key_here`
3. **Install dependencies**: `npm install @e2b/code-interpreter`
4. **Create files** in order (Step 1-5)
5. **Test thoroughly** with checklist
6. **Fix issues** as they arise
7. **Move to Phase 2** when complete

---

## 💡 TIPS

- Start simple, add features later
- Test each step before moving on
- Monitor E2B usage (free tier: 10 hrs/month)
- Handle errors gracefully
- Log everything for debugging
- Use TypeScript for type safety
- Keep code modular and testable

**Ready to start Phase 1?** 🚀
