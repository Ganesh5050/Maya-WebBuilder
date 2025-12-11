// E2B Sandbox Service
// Handles sandbox creation, file mounting, and dev server management

import { Sandbox } from '@e2b/code-interpreter';

export interface ProjectFile {
  path: string;
  content: string;
}

export interface SandboxStatus {
  id: string;
  status: 'creating' | 'mounting' | 'installing' | 'starting' | 'ready' | 'error';
  message: string;
  previewURL?: string;
  error?: string;
}

export class E2BService {
  private sandbox: Sandbox | null = null;
  private apiKey: string;
  private statusCallback?: (status: SandboxStatus) => void;

  constructor(apiKey: string, statusCallback?: (status: SandboxStatus) => void) {
    this.apiKey = apiKey;
    this.statusCallback = statusCallback;
  }

  private updateStatus(status: SandboxStatus) {
    console.log(`📊 Status: ${status.status} - ${status.message}`);
    this.statusCallback?.(status);
  }

  async createSandbox(): Promise<Sandbox> {
    try {
      this.updateStatus({
        id: 'new',
        status: 'creating',
        message: '🚀 Creating E2B sandbox...'
      });

      console.log('🚀 Creating E2B sandbox...');
      this.sandbox = await Sandbox.create({
        apiKey: this.apiKey,
        timeoutMs: 60000
      });

      console.log('✅ Sandbox created:', this.sandbox.sandboxId);
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'creating',
        message: `✅ Sandbox created: ${this.sandbox.sandboxId}`
      });

      return this.sandbox;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to create sandbox:', errorMsg);
      this.updateStatus({
        id: 'error',
        status: 'error',
        message: '❌ Failed to create sandbox',
        error: errorMsg
      });
      throw error;
    }
  }

  async mountFiles(files: ProjectFile[]): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');

    try {
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'mounting',
        message: `📁 Mounting ${files.length} files...`
      });

      console.log(`📁 Mounting ${files.length} files...`);

      for (const file of files) {
        await this.sandbox.files.write(file.path, file.content);
        console.log(`✅ Mounted: ${file.path}`);
      }

      console.log('✅ All files mounted');
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'mounting',
        message: `✅ Mounted ${files.length} files`
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to mount files:', errorMsg);
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'error',
        message: '❌ Failed to mount files',
        error: errorMsg
      });
      throw error;
    }
  }

  async installDependencies(): Promise<void> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');

    try {
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'installing',
        message: '📦 Installing dependencies with npm install...'
      });

      console.log('📦 Installing dependencies...');
      const result = await this.sandbox.commands.run('npm install', {
        timeoutMs: 120000
      });

      console.log('✅ Dependencies installed');
      console.log('Output:', result.stdout);

      if (result.stderr) {
        console.warn('Warnings:', result.stderr);
      }

      // Verify package.json has dev script
      try {
        const packageCheck = await this.sandbox.commands.run('cat package.json | grep "dev"');
        console.log('📋 Dev script found:', packageCheck.stdout);
      } catch (error) {
        console.log('⚠️ Could not verify dev script');
      }

      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'installing',
        message: '✅ Dependencies installed'
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to install dependencies:', errorMsg);
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'error',
        message: '❌ Failed to install dependencies',
        error: errorMsg
      });
      throw error;
    }
  }

  async startDevServer(): Promise<string> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');

    try {
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'starting',
        message: '🚀 Starting dev server...'
      });

      console.log('🚀 Starting dev server...');

      // Start dev server in background
      try {
        await this.sandbox.commands.run('npm run dev', {
          background: true,
          timeoutMs: 60000
        });
        console.log('📊 Dev server process started with npm run dev');
      } catch (error) {
        console.log('⚠️ npm run dev failed, trying direct vite command...');
        try {
          await this.sandbox.commands.run('npx vite --host 0.0.0.0 --port 5173', {
            background: true,
            timeoutMs: 60000
          });
          console.log('📊 Dev server process started with direct vite command');
        } catch (viteError) {
          throw new Error(`Failed to start dev server: ${error}`);
        }
      }

      // Wait for server to start and check if it's responding
      console.log('⏳ Waiting for dev server to start...');
      let serverReady = false;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max wait
      
      while (!serverReady && attempts < maxAttempts) {
        try {
          // Check if port 5173 is responding
          await this.sandbox.commands.run('curl -f http://localhost:5173 || echo "not ready"', {
            timeoutMs: 2000
          });
          serverReady = true;
          console.log('✅ Dev server is responding');
        } catch (error) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`⏳ Waiting for dev server... (${attempts}/${maxAttempts})`);
        }
      }

      if (!serverReady) {
        throw new Error('Dev server failed to start after 30 seconds');
      }

      // Get preview URL
      const url = `https://5173-${this.sandbox.sandboxId}.${this.sandbox.sandboxDomain}`;
      console.log('✅ Dev server started:', url);

      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'ready',
        message: '✅ Dev server ready',
        previewURL: url
      });

      return url;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to start dev server:', errorMsg);
      this.updateStatus({
        id: this.sandbox.sandboxId,
        status: 'error',
        message: '❌ Failed to start dev server',
        error: errorMsg
      });
      throw error;
    }
  }

  async executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');

    try {
      console.log(`🔧 Executing: ${command}`);
      const result = await this.sandbox.commands.run(command, {
        timeoutMs: 60000
      });
      console.log('✅ Command executed');
      return {
        stdout: result.stdout,
        stderr: result.stderr
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Command failed:', errorMsg);
      throw error;
    }
  }

  async getPreviewURL(): Promise<string> {
    if (!this.sandbox) throw new Error('Sandbox not initialized');

    try {
      // Construct preview URL from sandbox domain and port
      const url = `https://5173-${this.sandbox.sandboxId}.${this.sandbox.sandboxDomain}`;
      return url;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to get preview URL:', errorMsg);
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
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Failed to cleanup sandbox:', errorMsg);
      }
    }
  }

  getSandboxId(): string | null {
    return this.sandbox?.sandboxId || null;
  }

  getSandbox(): Sandbox | null {
    return this.sandbox;
  }

  isActive(): boolean {
    return this.sandbox !== null;
  }
}
