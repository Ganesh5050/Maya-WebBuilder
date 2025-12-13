// Sandbox Manager
// Manages sandbox lifecycle and multiple sandboxes

import { E2BService, ProjectFile, SandboxStatus } from './e2bService';

export interface ManagedSandbox {
  projectId: string;
  sandboxId: string;
  previewURL: string;
  status: SandboxStatus;
  service: E2BService;
  createdAt?: number;
}

export class SandboxManager {
  private sandboxes: Map<string, ManagedSandbox> = new Map();
  private apiKey: string;
  private statusCallbacks: Map<string, (status: SandboxStatus) => void> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log('🎯 SandboxManager initialized');
    
    // Auto-cleanup old sandboxes every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldSandboxes();
    }, 5 * 60 * 1000);
    
    // Cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.cleanupAll();
      });
    }
  }

  registerStatusCallback(projectId: string, callback: (status: SandboxStatus) => void) {
    this.statusCallbacks.set(projectId, callback);
  }

  async createManagedSandbox(
    projectId: string,
    files: ProjectFile[]
  ): Promise<ManagedSandbox> {
    try {
      // Check if sandbox already exists for this project
      const existingSandbox = this.sandboxes.get(projectId);
      if (existingSandbox) {
        console.log(`♻️ Reusing existing sandbox for project: ${projectId}`);
        return existingSandbox;
      }

      // Clean up old sandboxes if we have too many
      if (this.sandboxes.size >= 3) {
        console.log('🧹 Too many sandboxes, cleaning up oldest ones...');
        await this.cleanupOldSandboxes();
      }

      console.log(`🚀 Creating managed sandbox for project: ${projectId}`);

      const statusCallback = this.statusCallbacks.get(projectId);

      // Create E2B service
      const e2bService = new E2BService(this.apiKey, statusCallback);

      // Create sandbox
      await e2bService.createSandbox();

      // Mount files
      await e2bService.mountFiles(files);

      // Install dependencies
      await e2bService.installDependencies();

      // Start dev server
      const previewURL = await e2bService.startDevServer();

      // Create managed sandbox object
      const managedSandbox: ManagedSandbox = {
        projectId,
        sandboxId: e2bService.getSandboxId() || 'unknown',
        previewURL,
        status: {
          id: e2bService.getSandboxId() || 'unknown',
          status: 'ready',
          message: '✅ Sandbox ready',
          previewURL
        },
        service: e2bService,
        createdAt: Date.now()
      };

      // Store reference
      this.sandboxes.set(projectId, managedSandbox);

      console.log(`✅ Managed sandbox created for project: ${projectId}`);
      console.log(`📍 Preview URL: ${previewURL}`);

      return managedSandbox;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to create managed sandbox: ${errorMsg}`);
      
      // If we hit the sandbox limit, try cleaning up and retrying with exponential backoff
      if (errorMsg.includes('maximum number of concurrent E2B sandboxes') || errorMsg.includes('429')) {
        console.log('🧹 Hit E2B rate limit, cleaning up all sandboxes...');
        await this.cleanupAll();
        
        // Wait longer for E2B to process cleanup
        console.log('⏳ Waiting for E2B cleanup to complete...');
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
        
        // Don't retry automatically - let user retry manually
        throw new Error('E2B sandbox limit reached. All sandboxes have been cleaned up. Please wait a moment and try again.');
      }
      
      throw error;
    }
  }

  async getSandbox(projectId: string): Promise<ManagedSandbox | undefined> {
    return this.sandboxes.get(projectId);
  }

  async getE2BSandbox(projectId: string): Promise<any | null> {
    const managedSandbox = this.sandboxes.get(projectId);
    return managedSandbox?.service.getSandbox() || null;
  }

  async executeCommand(projectId: string, command: string): Promise<{ stdout: string; stderr: string }> {
    const sandbox = this.sandboxes.get(projectId);
    if (!sandbox) {
      throw new Error(`Sandbox not found for project: ${projectId}`);
    }

    return sandbox.service.executeCommand(command);
  }

  async cleanupSandbox(projectId: string): Promise<void> {
    const sandbox = this.sandboxes.get(projectId);
    if (sandbox) {
      console.log(`🧹 Cleaning up sandbox for project: ${projectId}`);
      await sandbox.service.cleanup();
      this.sandboxes.delete(projectId);
      this.statusCallbacks.delete(projectId);
      console.log(`✅ Sandbox cleaned up for project: ${projectId}`);
    }
  }

  async cleanupOldSandboxes(): Promise<void> {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    for (const [projectId, sandbox] of this.sandboxes) {
      if (sandbox.createdAt && (now - sandbox.createdAt) > maxAge) {
        console.log(`🧹 Cleaning up old sandbox for project: ${projectId}`);
        await this.cleanupSandbox(projectId);
      }
    }
  }

  async cleanupAll(): Promise<void> {
    console.log('🧹 Cleaning up all sandboxes...');
    const cleanupPromises = Array.from(this.sandboxes.entries()).map(async ([projectId, sandbox]) => {
      try {
        await sandbox.service.cleanup();
      } catch (error) {
        console.error(`❌ Failed to cleanup sandbox ${projectId}:`, error);
      }
    });
    
    await Promise.all(cleanupPromises);
    this.sandboxes.clear();
    this.statusCallbacks.clear();
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    console.log('✅ All sandboxes cleaned up');
  }

  getSandboxCount(): number {
    return this.sandboxes.size;
  }

  getAllSandboxes(): ManagedSandbox[] {
    return Array.from(this.sandboxes.values());
  }
}

// Global singleton instance
let globalSandboxManager: SandboxManager | null = null;

export function initializeSandboxManager(apiKey: string): SandboxManager {
  if (!globalSandboxManager) {
    globalSandboxManager = new SandboxManager(apiKey);
  }
  return globalSandboxManager;
}

export function getSandboxManager(): SandboxManager {
  if (!globalSandboxManager) {
    throw new Error('SandboxManager not initialized. Call initializeSandboxManager first.');
  }
  return globalSandboxManager;
}
