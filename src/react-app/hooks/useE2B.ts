import { useEffect, useState, useCallback } from 'react';
import { initializeSandboxManager, getSandboxManager } from '../../services/sandboxManager';
import { SandboxStatus } from '../../services/e2bService';

export interface ProjectFile {
  path: string;
  content: string;
}

interface UseE2BReturn {
  previewURL: string | null;
  isLoading: boolean;
  error: Error | null;
  status: string;
  retry: () => void;
}

export function useE2B(projectId: string, files: ProjectFile[]): UseE2BReturn {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState('Initializing...');

  const initializeSandbox = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus('Getting API key...');

      const apiKey = import.meta.env.VITE_E2B_API_KEY;
      if (!apiKey) {
        throw new Error('E2B API key not found in environment variables');
      }

      setStatus('Initializing sandbox manager...');
      const manager = initializeSandboxManager(apiKey);

      // Register status callback
      manager.registerStatusCallback(projectId, (status: SandboxStatus) => {
        setStatus(status.message);
        if (status.previewURL) {
          setPreviewURL(status.previewURL);
        }
      });

      setStatus('Creating sandbox...');
      const managedSandbox = await manager.createManagedSandbox(projectId, files);

      setStatus('Ready!');
      setPreviewURL(managedSandbox.previewURL);
      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ E2B initialization failed:', error);
      setError(error);
      setStatus('Error');
      setIsLoading(false);
    }
  }, [projectId, files]);

  useEffect(() => {
    // Cleanup any existing sandbox first
    const cleanup = async () => {
      try {
        const manager = getSandboxManager();
        await manager.cleanupSandbox(projectId);
      } catch (err) {
        console.log('No existing sandbox to cleanup');
      }
    };

    cleanup().then(() => {
      initializeSandbox();
    });

    return () => {
      // Cleanup on unmount
      try {
        const manager = getSandboxManager();
        manager.cleanupSandbox(projectId).catch(err => {
          console.error('Error cleaning up sandbox:', err);
        });
      } catch (err) {
        console.error('Error getting sandbox manager:', err);
      }
    };
  }, [projectId, files, initializeSandbox]);

  const retry = useCallback(() => {
    setPreviewURL(null);
    setError(null);
    initializeSandbox();
  }, [initializeSandbox]);

  return {
    previewURL,
    isLoading,
    error,
    status,
    retry
  };
}
