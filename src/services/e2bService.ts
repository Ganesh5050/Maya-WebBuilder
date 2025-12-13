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

      // First, check if package.json exists and has the right scripts
      try {
        const packageJson = await this.sandbox.files.read('package.json');
        console.log('📋 Package.json found');
        
        // Parse and check if it has dev script
        const pkg = JSON.parse(packageJson);
        if (!pkg.scripts?.dev) {
          console.log('⚠️ No dev script found, adding one...');
          pkg.scripts = pkg.scripts || {};
          pkg.scripts.dev = 'vite --host 0.0.0.0 --port 5173';
          await this.sandbox.files.write('package.json', JSON.stringify(pkg, null, 2));
        }
      } catch (error) {
        console.log('⚠️ Could not read/update package.json:', error);
      }

      // Create or update vite.config.js to ensure proper server configuration
      const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
})`;

      await this.sandbox.files.write('vite.config.js', viteConfig);
      console.log('✅ Vite config updated');

      // Kill any existing processes on port 5173
      try {
        await this.sandbox.commands.run('pkill -f "vite\\|:5173" || true', {
          timeoutMs: 5000
        });
        console.log('🧹 Killed existing processes on port 5173');
      } catch (error) {
        console.log('⚠️ Could not kill existing processes (this is normal)');
      }

      // Wait a moment for processes to clean up
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Start dev server with explicit configuration
      console.log('🚀 Starting Vite dev server...');
      
      // Try multiple approaches to start the dev server
      let serverStarted = false;
      const commands = [
        'npm run dev',
        'npx vite --host 0.0.0.0 --port 5173',
        'node_modules/.bin/vite --host 0.0.0.0 --port 5173'
      ];
      
      for (const command of commands) {
        try {
          console.log(`🔧 Trying: ${command}`);
          await this.sandbox.commands.run(command, {
            background: true,
            timeoutMs: 15000
          });
          console.log('📊 Dev server process started');
          serverStarted = true;
          break;
        } catch (error) {
          console.log(`⚠️ ${command} failed:`, error);
          continue;
        }
      }
      
      if (!serverStarted) {
        throw new Error('Failed to start dev server with any command');
      }
      
      // Give the server more time to initialize
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Wait for server to be ready with better health checks
      console.log('⏳ Waiting for dev server to be ready...');
      let serverReady = false;
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds max wait
      
      while (!serverReady && attempts < maxAttempts) {
        try {
          // First check if any process is running on port 5173
          const processCheck = await this.sandbox.commands.run('lsof -i :5173 || echo "no process"', {
            timeoutMs: 3000
          });
          
          if (processCheck.stdout.includes('LISTEN')) {
            console.log('✅ Process listening on port 5173');
            
            // Try a simple HTTP request
            try {
              const httpCheck = await this.sandbox.commands.run('curl -s -I http://localhost:5173 | head -1 || echo "failed"', {
                timeoutMs: 5000
              });
              
              if (httpCheck.stdout.includes('200') || httpCheck.stdout.includes('404')) {
                serverReady = true;
                console.log('✅ Dev server is responding');
                break;
              } else {
                console.log('⏳ Server not responding yet...');
              }
            } catch (httpError) {
              console.log('⏳ HTTP check failed, retrying...');
            }
          } else {
            console.log('⏳ No process listening on port 5173 yet...');
          }
        } catch (error) {
          console.log('⏳ Health check failed, retrying...');
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`⏳ Waiting for dev server... (${attempts}/${maxAttempts})`);
      }

      if (!serverReady) {
        // Try to get more debugging info
        try {
          const processCheck = await this.sandbox.commands.run('ps aux | grep -E "(vite|node)" | grep -v grep || echo "no processes"');
          console.log('🔍 Running processes:', processCheck.stdout);
          
          const portCheck = await this.sandbox.commands.run('netstat -tlnp || echo "netstat failed"');
          console.log('🔍 Open ports:', portCheck.stdout);
        } catch (debugError) {
          console.log('⚠️ Could not get debug info');
        }
        
        throw new Error('Dev server failed to start after 40 seconds. Check sandbox logs for details.');
      }

      // Get preview URL
      const url = `https://5173-${this.sandbox.sandboxId}.e2b.app`;
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
      // Construct preview URL with correct E2B domain format
      const url = `https://5173-${this.sandbox.sandboxId}.e2b.app`;
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
