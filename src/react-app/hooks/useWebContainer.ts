import { useEffect, useState, useCallback } from 'react';
import { initializeWebContainerManager, getWebContainerManager } from '../../services/webcontainerManager';
import { WebContainerStatus } from '../../services/webcontainerService';

export interface ProjectFile {
  path: string;
  content: string;
}

interface UseWebContainerReturn {
  previewURL: string | null;
  isLoading: boolean;
  error: Error | null;
  status: string;
  retry: () => void;
}

export function useWebContainer(projectId: string, files: ProjectFile[]): UseWebContainerReturn {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState('Initializing...');
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeContainer = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (isInitializing) {
      console.log('🔄 WebContainer initialization already in progress, skipping...');
      return;
    }

    try {
      setIsInitializing(true);
      setIsLoading(true);
      setError(null);
      setStatus('Getting API key...');

      const clientId = import.meta.env.VITE_WEBCONTAINER_CLIENT_ID;
      if (!clientId) {
        throw new Error('WebContainer Client ID not found in environment variables');
      }

      setStatus('Initializing WebContainer manager...');
      const manager = initializeWebContainerManager(clientId);

      // Register status callback
      manager.registerStatusCallback(projectId, (status: WebContainerStatus) => {
        console.log(`📊 Status update for ${projectId}: ${status.message} (ID: ${status.id})`);
        setStatus(status.message);
        if (status.previewURL) {
          console.log(`🎯 Setting preview URL: ${status.previewURL}`);
          setPreviewURL(status.previewURL);
        }
      });

      setStatus('Creating WebContainer...');
      const managedContainer = await manager.createManagedContainer(projectId, files);

      console.log(`✅ WebContainer ready - ID: ${managedContainer.containerId}, URL: ${managedContainer.previewURL}`);
      setStatus('Ready!');
      setPreviewURL(managedContainer.previewURL);
      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ WebContainer initialization failed:', error);
      setError(error);
      setStatus('Error');
      setIsLoading(false);
    } finally {
      setIsInitializing(false);
    }
  }, [projectId, files, isInitializing]);

  useEffect(() => {
    // Only initialize if we have files and not already initializing
    if (files.length === 0 || isInitializing) {
      return;
    }

    // Cleanup any existing container first
    const cleanup = async () => {
      try {
        const manager = getWebContainerManager();
        await manager.cleanupContainer(projectId);
      } catch (err) {
        console.log('No existing container to cleanup');
      }
    };

    cleanup().then(() => {
      initializeContainer();
    });

    return () => {
      // Cleanup on unmount
      try {
        const manager = getWebContainerManager();
        manager.cleanupContainer(projectId).catch(err => {
          console.error('Error cleaning up container:', err);
        });
      } catch (err) {
        console.error('Error getting container manager:', err);
      }
    };
  }, [projectId, files.length, initializeContainer, isInitializing]);

  const retry = useCallback(() => {
    setPreviewURL(null);
    setError(null);
    initializeContainer();
  }, [initializeContainer]);

  return {
    previewURL,
    isLoading,
    error,
    status,
    retry
  };
}
