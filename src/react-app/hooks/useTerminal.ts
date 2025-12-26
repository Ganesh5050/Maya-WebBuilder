import { useEffect, useState, useCallback, useRef } from 'react';
import { Sandbox } from '@e2b/code-interpreter';
import { getTerminalService, TerminalOptions } from '../../services/terminalService';

interface UseTerminalReturn {
  sessionId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: (sandbox: Sandbox | null, options?: TerminalOptions) => Promise<void>;
  disconnect: () => Promise<void>;
  writeData: (data: string) => Promise<void>;
  resize: (cols: number, rows: number) => Promise<void>;
  onData: (callback: (data: string) => void) => void;
  onExit: (callback: (code: number) => void) => void;
}

export function useTerminal(): UseTerminalReturn {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const terminalService = getTerminalService();
  const onDataCallbackRef = useRef<((data: string) => void) | null>(null);
  const onExitCallbackRef = useRef<((code: number) => void) | null>(null);

  const connect = useCallback(async (sandbox: Sandbox | null, options?: TerminalOptions) => {
    try {
      setIsConnecting(true);
      setError(null);

      console.log('🔌 Connecting to terminal...');

      let newSessionId: string;

      if (sandbox) {
        // Create real terminal session
        newSessionId = await terminalService.createTerminalSession(sandbox, options);
      } else {
        // Create mock session for local/preview
        console.log('⚠️ No sandbox provided, using mock terminal');
        newSessionId = await terminalService.createMockSession();
      }

      // Set up data callback
      if (onDataCallbackRef.current) {
        terminalService.onData(newSessionId, onDataCallbackRef.current);
      }

      // Set up exit callback
      if (onExitCallbackRef.current) {
        terminalService.onExit(newSessionId, onExitCallbackRef.current);
      }

      setSessionId(newSessionId);
      setIsConnected(true);
      setIsConnecting(false);

      console.log('✅ Terminal connected:', newSessionId);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect terminal');
      console.error('❌ Terminal connection failed:', error);
      setError(error);
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [terminalService]);

  const disconnect = useCallback(async () => {
    if (sessionId) {
      try {
        console.log('🔌 Disconnecting terminal...');
        await terminalService.killTerminalSession(sessionId);
        setSessionId(null);
        setIsConnected(false);
        setError(null);
        console.log('✅ Terminal disconnected');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to disconnect terminal');
        console.error('❌ Terminal disconnect failed:', error);
        setError(error);
      }
    }
  }, [sessionId, terminalService]);

  const writeData = useCallback(async (data: string) => {
    if (!sessionId) {
      throw new Error('No terminal session active');
    }

    try {
      await terminalService.writeToTerminal(sessionId, data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to write to terminal');
      console.error('❌ Terminal write failed:', error);
      setError(error);
      throw error;
    }
  }, [sessionId, terminalService]);

  const resize = useCallback(async (cols: number, rows: number) => {
    if (!sessionId) {
      return;
    }

    try {
      await terminalService.resizeTerminal(sessionId, cols, rows);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to resize terminal');
      console.error('❌ Terminal resize failed:', error);
      setError(error);
    }
  }, [sessionId, terminalService]);

  const onData = useCallback((callback: (data: string) => void) => {
    onDataCallbackRef.current = callback;
    if (sessionId) {
      terminalService.onData(sessionId, callback);
    }
  }, [sessionId, terminalService]);

  const onExit = useCallback((callback: (code: number) => void) => {
    onExitCallbackRef.current = callback;
    if (sessionId) {
      terminalService.onExit(sessionId, callback);
    }
  }, [sessionId, terminalService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        terminalService.killTerminalSession(sessionId).catch(err => {
          console.error('Error cleaning up terminal session:', err);
        });
      }
    };
  }, [sessionId, terminalService]);

  // Monitor session status
  useEffect(() => {
    if (sessionId) {
      const checkStatus = () => {
        const isActive = terminalService.isSessionActive(sessionId);
        if (!isActive && isConnected) {
          console.log('⚠️ Terminal session became inactive');
          setIsConnected(false);
        }
      };

      const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [sessionId, isConnected, terminalService]);

  return {
    sessionId,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    writeData,
    resize,
    onData,
    onExit
  };
}