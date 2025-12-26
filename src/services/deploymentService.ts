// Vercel Deployment Service
// Handles one-click deployment of React projects to Vercel

export interface DeploymentResult {
  success: boolean;
  url?: string;
  deploymentId?: string;
  error?: string;
  logs?: string[];
}

export interface DeploymentStatus {
  status: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  url?: string;
  deploymentId: string;
  createdAt: string;
}

export class VercelDeploymentService {
  private readonly VERCEL_API_URL = 'https://api.vercel.com';


  private getToken(): string {
    return import.meta.env.VITE_VERCEL_TOKEN || localStorage.getItem('VERCEL_TOKEN') || '';
  }

  /**
   * Deploy a React project to Vercel
   */
  async deployProject(
    projectFiles: Array<{ path: string; content: string }>,
    projectName: string,
    onProgress?: (message: string) => void
  ): Promise<DeploymentResult> {

    const token = this.getToken();

    if (!token) {
      return {
        success: false,
        error: 'Vercel token not configured. Please add VITE_VERCEL_TOKEN to env or set it in Settings > Secrets.'
      };
    }

    try {
      onProgress?.('🚀 Preparing deployment...');

      // Step 1: Create deployment payload
      const files = this.prepareFiles(projectFiles);

      onProgress?.('📦 Uploading files to Vercel...');

      // Step 2: Create deployment
      const deployment = await this.createDeployment(projectName, files);

      onProgress?.('🔨 Building project...');

      // Step 3: Wait for deployment to complete
      const finalStatus = await this.waitForDeployment(deployment.id, onProgress);

      if (finalStatus.status === 'READY') {
        onProgress?.('✅ Deployment successful!');
        return {
          success: true,
          url: finalStatus.url,
          deploymentId: deployment.id
        };
      } else {
        return {
          success: false,
          error: `Deployment failed with status: ${finalStatus.status}`,
          deploymentId: deployment.id
        };
      }

    } catch (error) {
      console.error('❌ Deployment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error'
      };
    }
  }

  /**
   * Prepare files for Vercel deployment
   */
  private prepareFiles(projectFiles: Array<{ path: string; content: string }>): Array<{ file: string; data: string; encoding: string }> {
    return projectFiles.map(file => ({
      file: file.path,
      data: btoa(unescape(encodeURIComponent(file.content))),
      encoding: 'base64'
    }));
  }

  /**
   * Create deployment on Vercel
   */
  private async createDeployment(projectName: string, files: Array<{ file: string; data: string; encoding: string }>) {
    const response = await fetch(`${this.VERCEL_API_URL}/v13/deployments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        files,
        projectSettings: {
          framework: 'vite',
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          installCommand: 'npm install'
        },
        target: 'production'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Vercel API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Wait for deployment to complete
   */
  private async waitForDeployment(
    deploymentId: string,
    onProgress?: (message: string) => void
  ): Promise<DeploymentStatus> {

    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.VERCEL_API_URL}/v13/deployments/${deploymentId}`, {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to check deployment status: ${response.status}`);
        }

        const deployment = await response.json();

        switch (deployment.readyState) {
          case 'BUILDING':
            onProgress?.(`🔨 Building... (${attempts * 5}s)`);
            break;
          case 'READY':
            return {
              status: 'READY',
              url: `https://${deployment.url}`,
              deploymentId,
              createdAt: deployment.createdAt
            };
          case 'ERROR':
            return {
              status: 'ERROR',
              deploymentId,
              createdAt: deployment.createdAt
            };
          case 'CANCELED':
            return {
              status: 'CANCELED',
              deploymentId,
              createdAt: deployment.createdAt
            };
        }

        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

      } catch (error) {
        console.error('Error checking deployment status:', error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Timeout
    return {
      status: 'ERROR',
      deploymentId,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus | null> {
    try {
      const response = await fetch(`${this.VERCEL_API_URL}/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const deployment = await response.json();

      return {
        status: deployment.readyState,
        url: deployment.readyState === 'READY' ? `https://${deployment.url}` : undefined,
        deploymentId,
        createdAt: deployment.createdAt
      };

    } catch (error) {
      console.error('Error getting deployment status:', error);
      return null;
    }
  }

  /**
   * List user's deployments
   */
  async listDeployments(): Promise<DeploymentStatus[]> {
    try {
      const response = await fetch(`${this.VERCEL_API_URL}/v6/deployments`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      return data.deployments.map((deployment: any) => ({
        status: deployment.readyState,
        url: deployment.readyState === 'READY' ? `https://${deployment.url}` : undefined,
        deploymentId: deployment.uid,
        createdAt: deployment.createdAt
      }));

    } catch (error) {
      console.error('Error listing deployments:', error);
      return [];
    }
  }
}

// Export lazy singleton
let _vercelDeploymentService: VercelDeploymentService | null = null;

export const vercelDeploymentService = {
  get instance() {
    if (!_vercelDeploymentService) {
      _vercelDeploymentService = new VercelDeploymentService();
    }
    return _vercelDeploymentService;
  },

  // Proxy methods to the instance
  deployProject: (...args: Parameters<VercelDeploymentService['deployProject']>) =>
    vercelDeploymentService.instance.deployProject(...args),

  getDeploymentStatus: (...args: Parameters<VercelDeploymentService['getDeploymentStatus']>) =>
    vercelDeploymentService.instance.getDeploymentStatus(...args),

  listDeployments: (...args: Parameters<VercelDeploymentService['listDeployments']>) =>
    vercelDeploymentService.instance.listDeployments(...args)
};