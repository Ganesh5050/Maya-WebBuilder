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

      // Check if WebContainer is supported
      if (typeof window === 'undefined') {
        throw new Error('WebContainer requires browser environment');
      }

      // Initialize WebContainer with proper configuration
      this.container = await WebContainer.boot({
        // Add any configuration options here
      });

      if (!this.container) {
        throw new Error('WebContainer failed to initialize - returned null');
      }

      console.log('✅ WebContainer initialized successfully');
      this.updateStatus({
        id: 'webcontainer',
        status: 'initializing',
        message: '✅ WebContainer initialized'
      });

      return this.container;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to initialize WebContainer:', errorMsg);

      // Provide specific error messages for common issues
      let userMessage = '❌ Failed to initialize WebContainer';
      if (errorMsg.includes('Unable to create more instances')) {
        userMessage = '❌ WebContainer limit reached. Please wait a few minutes and try again.';
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        userMessage = '❌ Network error. Check your internet connection.';
      } else if (errorMsg.includes('domain') || errorMsg.includes('origin')) {
        userMessage = '❌ Domain not whitelisted. Please add localhost:5173 to WebContainer dashboard.';
      }

      this.updateStatus({
        id: 'error',
        status: 'error',
        message: userMessage,
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

    return new Promise(async (resolve, reject) => {
      // Set a timeout to avoid hanging indefinitely
      const timeout = setTimeout(() => {
        reject(new Error('Dev server start timeout (60s)'));
      }, 60000);

      try {
        this.updateStatus({
          id: 'webcontainer',
          status: 'running',
          message: '🚀 Starting dev server...'
        });

        console.log('🚀 Starting Vite dev server...');

        // Listen for server-ready event (Correct API usage)
        this.container!.on('server-ready', (port, url) => {
          console.log(`✅ Server ready on port ${port}: ${url}`);
          // Accept 5173 (Vite default) or any other port if we are flexible
          if (port === 5173 || port === 3000) {
            clearTimeout(timeout);
            this.previewURL = url;

            this.updateStatus({
              id: 'webcontainer',
              status: 'ready',
              message: '✅ Dev server ready',
              previewURL: url
            });

            resolve(url);
          }
        });

        // Start dev server process
        const devProcess = await this.container!.spawn('npm', ['run', 'dev']);

        // Log output for debugging
        devProcess.output.pipeTo(
          new WritableStream({
            write(chunk) {
              // console.log('[DevServer]', chunk.toString()); // Optional: too verbose?
            }
          })
        );

        // Handle process exit
        devProcess.exit.then((code) => {
          if (code !== 0) {
            clearTimeout(timeout);
            const msg = `Dev server exited with code ${code}`;
            console.error(msg);
            this.updateStatus({
              id: 'webcontainer',
              status: 'error',
              message: '❌ Dev server crashed',
              error: msg
            });
            // Only reject if we haven't resolved yet
            if (!this.previewURL) reject(new Error(msg));
          }
        });

      } catch (error) {
        clearTimeout(timeout);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Failed to start dev server:', errorMsg);
        this.updateStatus({
          id: 'webcontainer',
          status: 'error',
          message: '❌ Failed to start dev server',
          error: errorMsg
        });
        reject(error);
      }
    });
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
