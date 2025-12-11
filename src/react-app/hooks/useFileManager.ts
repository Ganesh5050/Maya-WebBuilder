import { useEffect, useState, useCallback } from 'react';
import { getFileExplorerService } from '../../services/fileExplorerService';
import { getSandboxManager } from '../../services/sandboxManager';

interface UseFileManagerReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  selectedFile: string | null;
  setSelectedFile: (path: string | null) => void;
  refreshFiles: () => Promise<void>;
  connect: (projectId: string) => Promise<void>;
  disconnect: () => void;
}

export function useFileManager(): UseFileManagerReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const fileExplorerService = getFileExplorerService();

  const connect = useCallback(async (projectId: string) => {
    try {
      setIsConnecting(true);
      setError(null);

      console.log('🔌 Connecting file manager to project:', projectId);

      // Get the E2B sandbox from the sandbox manager
      const sandboxManager = getSandboxManager();
      const e2bSandbox = await sandboxManager.getE2BSandbox(projectId);

      if (!e2bSandbox) {
        throw new Error('E2B sandbox not found for project');
      }

      // Connect file explorer service to the sandbox
      fileExplorerService.setSandbox(e2bSandbox);

      // Load initial file tree
      await fileExplorerService.loadFileTree('/');

      setIsConnected(true);
      setIsConnecting(false);

      console.log('✅ File manager connected successfully');

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect file manager');
      console.error('❌ File manager connection failed:', error);
      setError(error);
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [fileExplorerService]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting file manager...');
    setIsConnected(false);
    setSelectedFile(null);
    setError(null);
    console.log('✅ File manager disconnected');
  }, []);

  const refreshFiles = useCallback(async () => {
    if (!isConnected) return;

    try {
      await fileExplorerService.refreshFileTree();
      console.log('🔄 File tree refreshed');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh files');
      console.error('❌ Failed to refresh files:', error);
      setError(error);
    }
  }, [isConnected, fileExplorerService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [isConnected, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    selectedFile,
    setSelectedFile,
    refreshFiles,
    connect,
    disconnect
  };
}