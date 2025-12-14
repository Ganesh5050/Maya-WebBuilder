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
  private currentSandboxId: string | null = null; // Track current active sandbox

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
      // CRITICAL: Always cleanup existing sandbox first to prevent state mismatch
      const existingSandbox = this.sandboxes.get(projectId);
      if (existingSandbox) {
        console.log(`🧹 Cleaning up existing sandbox for project: ${projectId} to prevent state mismatch`);
        await this.cleanupSandbox(projectId);
      }

      // Clean up old sandboxes if we have too many
      if (this.sandboxes.size >= 2) {
        console.log('🧹 Too many sandboxes, cleaning up oldest ones...');
        await this.cleanupOldSandboxes();
      }

      console.log(`🚀 Creating NEW managed sandbox for project: ${projectId}`);

      const statusCallback = this.statusCallbacks.get(projectId);

      // Create E2B service
      const e2bService = new E2BService(this.apiKey, statusCallback);

      // Create sandbox
      await e2bService.createSandbox();
      const newSandboxId = e2bService.getSandboxId();
      
      if (!newSandboxId) {
        throw new Error('Failed to get sandbox ID after creation');
      }

      // Update current sandbox tracking
      this.currentSandboxId = newSandboxId;
      console.log(`🎯 Current sandbox ID set to: ${newSandboxId}`);

      // Mount files
      await e2bService.mountFiles(files);

      // Install dependencies
      await e2bService.installDependencies();

      // Start dev server
      const previewURL = await e2bService.startDevServer();

      // Create managed sandbox object
      const managedSandbox: ManagedSandbox = {
        projectId,
        sandboxId: newSandboxId,
        previewURL,
        status: {
          id: newSandboxId,
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
      console.log(`📍 Sandbox ID: ${newSandboxId}`);
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

  // NEW: Get current sandbox for state synchronization
  getCurrentSandbox(): ManagedSandbox | null {
    if (!this.currentSandboxId) return null;
    
    // Find sandbox by current ID
    for (const sandbox of this.sandboxes.values()) {
      if (sandbox.sandboxId === this.currentSandboxId) {
        return sandbox;
      }
    }
    return null;
  }

  // NEW: Get or create sandbox with proper state sync
  async getOrCreateSandbox(projectId: string, files: ProjectFile[]): Promise<ManagedSandbox> {
    const existing = this.sandboxes.get(projectId);
    
    // If we have an existing sandbox and it matches current sandbox ID, reuse it
    if (existing && existing.sandboxId === this.currentSandboxId) {
      console.log(`♻️ Reusing existing sandbox: ${existing.sandboxId}`);
      return existing;
    }
    
    // Otherwise create new sandbox (this will cleanup existing ones)
    console.log(`🔄 Creating new sandbox (current: ${this.currentSandboxId})`);
    return await this.createManagedSandbox(projectId, files);
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
      console.log(`🧹 Cleaning up sandbox for project: ${projectId} (ID: ${sandbox.sandboxId})`);
      
      // Clear current sandbox ID if this is the current one
      if (this.currentSandboxId === sandbox.sandboxId) {
        this.currentSandboxId = null;
        console.log(`🎯 Cleared current sandbox ID`);
      }
      
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
    
    // Clear current sandbox tracking
    this.currentSandboxId = null;
    
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

  // NUCLEAR OPTION: Single sandbox approach
  async createSingleSandbox(
    projectId: string,
    files: ProjectFile[]
  ): Promise<ManagedSandbox> {
    try {
      console.log('🔥 NUCLEAR OPTION: Creating single sandbox, cleaning up ALL existing sandboxes first');
      
      // Clean up ALL existing sandboxes first
      await this.cleanupAll();
      
      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log(`🚀 Creating SINGLE managed sandbox for project: ${projectId}`);

      const statusCallback = this.statusCallbacks.get(projectId);

      // Create E2B service
      const e2bService = new E2BService(this.apiKey, statusCallback);

      // Create sandbox
      await e2bService.createSandbox();
      const newSandboxId = e2bService.getSandboxId();
      
      if (!newSandboxId) {
        throw new Error('Failed to get sandbox ID after creation');
      }

      // Update current sandbox tracking
      this.currentSandboxId = newSandboxId;
      console.log(`🎯 SINGLE sandbox ID set to: ${newSandboxId}`);

      // Mount files
      await e2bService.mountFiles(files);

      // Install dependencies
      await e2bService.installDependencies();

      // Start dev server
      const previewURL = await e2bService.startDevServer();

      // Create managed sandbox object
      const managedSandbox: ManagedSandbox = {
        projectId,
        sandboxId: newSandboxId,
        previewURL,
        status: {
          id: newSandboxId,
          status: 'ready',
          message: '✅ Single sandbox ready',
          previewURL
        },
        service: e2bService,
        createdAt: Date.now()
      };

      // Store reference (should be the only one)
      this.sandboxes.set(projectId, managedSandbox);

      console.log(`✅ SINGLE managed sandbox created for project: ${projectId}`);
      console.log(`📍 Sandbox ID: ${newSandboxId}`);
      console.log(`📍 Preview URL: ${previewURL}`);
      console.log(`📊 Total sandboxes: ${this.sandboxes.size} (should be 1)`);

      return managedSandbox;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to create single sandbox: ${errorMsg}`);
      throw error;
    }
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
