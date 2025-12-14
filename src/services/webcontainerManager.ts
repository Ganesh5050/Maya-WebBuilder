// WebContainer Manager
// Manages WebContainer lifecycle and multiple instances

import { WebContainerService, WebContainerStatus } from './webcontainerService';

export interface ManagedWebContainer {
  projectId: string;
  containerId: string;
  previewURL: string;
  status: WebContainerStatus;
  service: WebContainerService;
  createdAt?: number;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export class WebContainerManager {
  private containers: Map<string, ManagedWebContainer> = new Map();
  private clientId: string;
  private statusCallbacks: Map<string, (status: WebContainerStatus) => void> = new Map();
  private currentContainerId: string | null = null;

  constructor(clientId: string) {
    this.clientId = clientId;
    console.log('🎯 WebContainerManager initialized');
  }

  registerStatusCallback(projectId: string, callback: (status: WebContainerStatus) => void) {
    this.statusCallbacks.set(projectId, callback);
  }

  /**
   * Create managed WebContainer (single instance approach)
   */
  async createManagedContainer(
    projectId: string,
    files: ProjectFile[]
  ): Promise<ManagedWebContainer> {
    try {
      // Clean up existing container first
      const existingContainer = this.containers.get(projectId);
      if (existingContainer) {
        console.log(`🧹 Cleaning up existing container for project: ${projectId}`);
        await this.cleanupContainer(projectId);
      }

      // Clean up all old containers if we have too many
      if (this.containers.size >= 2) {
        console.log('🧹 Too many containers, cleaning up oldest ones...');
        await this.cleanupOldContainers();
      }

      console.log(`🚀 Creating managed WebContainer for project: ${projectId}`);

      const statusCallback = this.statusCallbacks.get(projectId);

      // Create WebContainer service
      const service = new WebContainerService(this.clientId, statusCallback);

      // Initialize WebContainer
      await service.initialize();

      // Create files
      await service.createFiles(files);

      // Install dependencies
      await service.installDependencies();

      // Start dev server
      const previewURL = await service.startDevServer();

      // Create managed container object
      const managedContainer: ManagedWebContainer = {
        projectId,
        containerId: 'webcontainer-' + Date.now(),
        previewURL,
        status: {
          id: 'webcontainer-' + Date.now(),
          status: 'ready',
          message: '✅ WebContainer ready',
          previewURL
        },
        service,
        createdAt: Date.now()
      };

      // Store reference
      this.containers.set(projectId, managedContainer);
      this.currentContainerId = managedContainer.containerId;

      console.log(`✅ Managed WebContainer created for project: ${projectId}`);
      console.log(`📍 Preview URL: ${previewURL}`);

      return managedContainer;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to create managed WebContainer: ${errorMsg}`);
      throw error;
    }
  }

  /**
   * Get container for project
   */
  async getContainer(projectId: string): Promise<ManagedWebContainer | undefined> {
    return this.containers.get(projectId);
  }

  /**
   * Get current active container
   */
  getCurrentContainer(): ManagedWebContainer | null {
    if (!this.currentContainerId) return null;

    for (const container of this.containers.values()) {
      if (container.containerId === this.currentContainerId) {
        return container;
      }
    }
    return null;
  }

  /**
   * Execute command in container
   */
  async executeCommand(projectId: string, command: string, args: string[] = []): Promise<{ stdout: string; stderr: string }> {
    const container = this.containers.get(projectId);
    if (!container) {
      throw new Error(`Container not found for project: ${projectId}`);
    }

    return container.service.executeCommand(command, args);
  }

  /**
   * Cleanup specific container
   */
  async cleanupContainer(projectId: string): Promise<void> {
    const container = this.containers.get(projectId);
    if (container) {
      console.log(`🧹 Cleaning up WebContainer for project: ${projectId}`);

      if (this.currentContainerId === container.containerId) {
        this.currentContainerId = null;
      }

      await container.service.cleanup();
      this.containers.delete(projectId);
      this.statusCallbacks.delete(projectId);
      console.log(`✅ WebContainer cleaned up for project: ${projectId}`);
    }
  }

  /**
   * Cleanup old containers
   */
  async cleanupOldContainers(): Promise<void> {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes

    for (const [projectId, container] of this.containers) {
      if (container.createdAt && now - container.createdAt > maxAge) {
        console.log(`🧹 Cleaning up old container for project: ${projectId}`);
        await this.cleanupContainer(projectId);
      }
    }
  }

  /**
   * Cleanup all containers
   */
  async cleanupAll(): Promise<void> {
    console.log('🧹 Cleaning up all WebContainers...');

    this.currentContainerId = null;

    const cleanupPromises = Array.from(this.containers.entries()).map(async ([projectId, container]) => {
      try {
        await container.service.cleanup();
      } catch (error) {
        console.error(`❌ Failed to cleanup container ${projectId}:`, error);
      }
    });

    await Promise.all(cleanupPromises);
    this.containers.clear();
    this.statusCallbacks.clear();

    console.log('✅ All WebContainers cleaned up');
  }

  getContainerCount(): number {
    return this.containers.size;
  }

  getAllContainers(): ManagedWebContainer[] {
    return Array.from(this.containers.values());
  }
}

// Global singleton instance
let globalWebContainerManager: WebContainerManager | null = null;

export function initializeWebContainerManager(clientId: string): WebContainerManager {
  if (!globalWebContainerManager) {
    globalWebContainerManager = new WebContainerManager(clientId);
  }
  return globalWebContainerManager;
}

export function getWebContainerManager(): WebContainerManager {
  if (!globalWebContainerManager) {
    throw new Error('WebContainerManager not initialized. Call initializeWebContainerManager first.');
  }
  return globalWebContainerManager;
}
