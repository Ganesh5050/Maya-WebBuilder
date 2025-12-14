// WebContainer Service
// Manages WebContainer instances for running React projects in browser

import { WebContainer } from '@webcontainer/api';

export interface WebContainerStatus {
  id: string;
  status: 'initializing' | 'ready' | 'running' | 'error';
  message: string;
  previewURL?: string;
  error?: string;
}

export class WebContainerService {
  private container: WebContainer | null = null;
  private clientId: string;
  private statusCallback?: (status: WebContainerStatus) => void;
  private previewURL: string | null = null;

  constructor(clientId: string, statusCallback?: (status: WebContainerStatus) => void) {
    this.clientId = clientId;
    this.statusCallback = statusCallback;
  }

  private updateStatus(status: WebContainerStatus) {
    console.log(`📊 WebContainer Status: ${status.status} - ${status.message}`);
    this.statusCallback?.(status);
  }

  /**
   * Initialize WebContainer
   */
  async initialize(): Promise<WebContainer> {
    try {
      this.updateStatus({
        id: 'new',
        status: 'initializing',
        message: '🚀 Initializing WebContainer...'
      });

      console.log('🚀 Initializing WebContainer with client ID:', this.clientId);

      // Initialize WebContainer
      this.container = await WebContainer.boot();

      console.log('✅ WebContainer initialized');
      this.updateStatus({
        id: 'webcontainer',
        status: 'initializing',
        message: '✅ WebContainer initialized'
      });

      return this.container;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to initialize WebContainer:', errorMsg);
      this.updateStatus({
        id: 'error',
        status: 'error',
        message: '❌ Failed to initialize WebContainer',
        error: errorMsg
      });
      throw error;
    }
  }

  /**
   * Create project files in WebContainer
   */
  async createFiles(files: Array<{ path: string; content: string }>): Promise<void> {
    if (!this.container) throw new Error('WebContainer not initialized');

    try {
      this.updateStatus({
        id: 'webcontainer',
        status: 'initializing',
        message: `📁 Creating ${files.length} files...`
      });

      console.log(`📁 Creating ${files.length} files in WebContainer...`);

      // Create files in WebContainer
      for (const file of files) {
        await this.container.fs.writeFile(file.path, file.content);
        console.log(`✅ Created: ${file.path}`);
      }

      console.log('✅ All files created');
      this.updateStatus({
        id: 'webcontainer',
        status: 'initializing',
        message: `✅ Created ${files.length} files`
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to create files:', errorMsg);
      this.updateStatus({
        id: 'webcontainer',
        status: 'error',
        message: '❌ Failed to create files',
        error: errorMsg
      });
      throw error;
    }
  }

  /**
   * Install dependencies
   */
  async installDependencies(): Promise<void> {
    if (!this.container) throw new Error('WebContainer not initialized');

    try {
      this.updateStatus({
        id: 'webcontainer',
        status: 'initializing',
        message: '📦 Installing dependencies...'
      });

      console.log('📦 Installing dependencies with npm...');

      // Install dependencies
      const installProcess = await this.container.spawn('npm', ['install']);

      // Wait for installation to complete
      const exitCode = await installProcess.exit;

      if (exitCode !== 0) {
        throw new Error(`npm install failed with exit code ${exitCode}`);
      }

      console.log('✅ Dependencies installed');
      this.updateStatus({
        id: 'webcontainer',
        status: 'initializing',
        message: '✅ Dependencies installed'
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to install dependencies:', errorMsg);
      this.updateStatus({
        id: 'webcontainer',
        status: 'error',
        message: '❌ Failed to install dependencies',
        error: errorMsg
      });
      throw error;
    }
  }

  /**
   * Start dev server
   */
  async startDevServer(): Promise<string> {
    if (!this.container) throw new Error('WebContainer not initialized');

    try {
      this.updateStatus({
        id: 'webcontainer',
        status: 'running',
        message: '🚀 Starting dev server...'
      });

      console.log('🚀 Starting Vite dev server...');

      // Start dev server
      const devProcess = await this.container.spawn('npm', ['run', 'dev']);

      // Listen for server ready message
      devProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            const output = chunk.toString();
            console.log('📊 Dev server output:', output);

            // Check if server is ready
            if (output.includes('Local:') || output.includes('localhost')) {
              console.log('✅ Dev server is ready');
            }
          }
        })
      );

      // Get preview URL from WebContainer
      const previewURL = await this.container.getUrl(5173);

      if (!previewURL) {
        throw new Error('Failed to get preview URL from WebContainer');
      }

      this.previewURL = previewURL;
      console.log('✅ Dev server started:', previewURL);

      this.updateStatus({
        id: 'webcontainer',
        status: 'ready',
        message: '✅ Dev server ready',
        previewURL
      });

      return previewURL;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to start dev server:', errorMsg);
      this.updateStatus({
        id: 'webcontainer',
        status: 'error',
        message: '❌ Failed to start dev server',
        error: errorMsg
      });
      throw error;
    }
  }

  /**
   * Execute command in WebContainer
   */
  async executeCommand(command: string, args: string[] = []): Promise<{ stdout: string; stderr: string }> {
    if (!this.container) throw new Error('WebContainer not initialized');

    try {
      console.log(`🔧 Executing: ${command} ${args.join(' ')}`);

      const process = await this.container.spawn(command, args);
      const exitCode = await process.exit;

      if (exitCode !== 0) {
        console.warn(`⚠️ Command exited with code ${exitCode}`);
      }

      return {
        stdout: 'Command executed',
        stderr: ''
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Command failed:', errorMsg);
      throw error;
    }
  }

  /**
   * Get preview URL
   */
  getPreviewURL(): string | null {
    return this.previewURL;
  }

  /**
   * Get WebContainer instance
   */
  getContainer(): WebContainer | null {
    return this.container;
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    if (this.container) {
      try {
        console.log('🧹 Cleaning up WebContainer...');
        // WebContainer cleanup is automatic
        this.container = null;
        this.previewURL = null;
        console.log('✅ WebContainer cleaned up');
      } catch (error) {
        console.error('❌ Failed to cleanup WebContainer:', error);
      }
    }
  }

  /**
   * Check if container is active
   */
  isActive(): boolean {
    return this.container !== null;
  }
}
