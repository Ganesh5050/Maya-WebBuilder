// StackBlitz Service - More Reliable than WebContainer
// Used by Bolt.new and other professional AI builders

import sdk from '@stackblitz/sdk';

export interface StackBlitzStatus {
  id: string;
  status: 'initializing' | 'ready' | 'error';
  message: string;
  previewURL?: string;
  error?: string;
}

export class StackBlitzService {
  private vm: any = null;
  private statusCallback?: (status: StackBlitzStatus) => void;
  private previewURL: string | null = null;

  constructor(statusCallback?: (status: StackBlitzStatus) => void) {
    this.statusCallback = statusCallback;
  }

  private updateStatus(status: StackBlitzStatus) {
    console.log(`📊 StackBlitz Status: ${status.status} - ${status.message}`);
    this.statusCallback?.(status);
  }

  /**
   * Create StackBlitz project with React files
   */
  async createProject(
    projectName: string,
    files: Array<{ path: string; content: string }>,
    containerId?: string
  ): Promise<string> {
    try {
      this.updateStatus({
        id: 'new',
        status: 'initializing',
        message: '🚀 Creating StackBlitz project...'
      });

      console.log('🚀 Creating StackBlitz project with', files.length, 'files');
      console.log('📁 File paths:', files.map(f => f.path));

      // Prepare files for StackBlitz
      const stackblitzFiles: Record<string, string> = {};
      
      files.forEach(file => {
        stackblitzFiles[file.path] = file.content;
        console.log(`📄 Added file: ${file.path} (${file.content.length} chars)`);
      });

      // Ensure we have essential files
      if (!stackblitzFiles['package.json']) {
        stackblitzFiles['package.json'] = JSON.stringify({
          name: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          version: '1.0.0',
          private: true,
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            'react-scripts': '5.0.1'
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build'
          },
          browserslist: {
            production: ['>0.2%', 'not dead', 'not op_mini all'],
            development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
          }
        }, null, 2);
      }

      if (!stackblitzFiles['public/index.html']) {
        stackblitzFiles['public/index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>
</html>`;
      }

      if (!stackblitzFiles['src/index.js'] && !stackblitzFiles['src/index.tsx']) {
        stackblitzFiles['src/index.js'] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`;
      }

      // Create StackBlitz project
      const targetContainer = containerId || 'stackblitz-container';
      console.log('🎯 Calling StackBlitz SDK embedProject with container:', targetContainer);
      console.log('📦 Project config:', {
        title: projectName,
        template: 'create-react-app',
        fileCount: Object.keys(stackblitzFiles).length
      });
      
      this.vm = await sdk.embedProject(
        targetContainer, // Use provided container ID or default
        {
          title: projectName,
          description: 'Generated React project',
          template: 'create-react-app',
          files: stackblitzFiles
        },
        {
          height: '100%',
          width: '100%',
          hideNavigation: false,
          hideDevTools: false,
          forceEmbedLayout: true,
          openFile: 'src/App.js,src/App.tsx',
          view: 'preview'
        }
      );
      
      console.log('🎉 StackBlitz SDK embedProject completed, VM:', this.vm);

      // Get preview URL
      this.previewURL = `https://${this.vm.id}.stackblitz.io`;

      console.log('✅ StackBlitz project created:', this.previewURL);
      this.updateStatus({
        id: this.vm.id,
        status: 'ready',
        message: '✅ StackBlitz project ready',
        previewURL: this.previewURL
      });

      return this.previewURL;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to create StackBlitz project:', errorMsg);
      this.updateStatus({
        id: 'error',
        status: 'error',
        message: '❌ Failed to create StackBlitz project',
        error: errorMsg
      });
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
   * Get StackBlitz VM
   */
  getVM(): any {
    return this.vm;
  }

  /**
   * Update files in existing project
   */
  async updateFiles(files: Array<{ path: string; content: string }>): Promise<void> {
    if (!this.vm) {
      throw new Error('StackBlitz project not initialized');
    }

    try {
      const fileUpdates: Record<string, string> = {};
      files.forEach(file => {
        fileUpdates[file.path] = file.content;
      });

      await this.vm.applyFsDiff({
        create: fileUpdates,
        destroy: []
      });

      console.log('✅ StackBlitz files updated');
    } catch (error) {
      console.error('❌ Failed to update StackBlitz files:', error);
      throw error;
    }
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    if (this.vm) {
      try {
        console.log('🧹 Cleaning up StackBlitz project...');
        // StackBlitz cleanup is automatic
        this.vm = null;
        this.previewURL = null;
        console.log('✅ StackBlitz project cleaned up');
      } catch (error) {
        console.error('❌ Failed to cleanup StackBlitz project:', error);
      }
    }
  }

  /**
   * Check if project is active
   */
  isActive(): boolean {
    return this.vm !== null;
  }
}