// Terminal Service
// Manages terminal connections to E2B sandboxes

import { Sandbox } from '@e2b/code-interpreter';

export interface TerminalSession {
  id: string;
  sandboxId: string;
  pty: any; // E2B PTY instance
  isConnected: boolean;
  lastActivity: Date;
}

export interface TerminalOptions {
  cols: number;
  rows: number;
  cwd?: string;
  env?: Record<string, string>;
}

export class TerminalService {
  private sessions: Map<string, TerminalSession> = new Map();
  private onDataCallbacks: Map<string, (data: string) => void> = new Map();
  private onExitCallbacks: Map<string, (code: number) => void> = new Map();

  constructor() {
    console.log('🖥️ TerminalService initialized');
  }

  async createTerminalSession(
    sandbox: Sandbox,
    options: TerminalOptions = { cols: 80, rows: 24 }
  ): Promise<string> {
    try {
      console.log(`🚀 Creating terminal session for sandbox: ${sandbox.sandboxId}`);

      // Create PTY session in E2B sandbox
      const pty = await sandbox.pty.create({
        command: '/bin/bash',
        size: {
          cols: options.cols,
          rows: options.rows
        },
        cwd: options.cwd || '/home/user',
        env: {
          TERM: 'xterm-256color',
          SHELL: '/bin/bash',
          ...options.env
        }
      });

      const sessionId = `terminal_${sandbox.sandboxId}_${Date.now()}`;

      // Create session object
      const session: TerminalSession = {
        id: sessionId,
        sandboxId: sandbox.sandboxId,
        pty: pty,
        isConnected: true,
        lastActivity: new Date()
      };

      // Set up data handling using E2B PTY events
      (async () => {
        try {
          for await (const event of pty.events) {
            session.lastActivity = new Date();
            
            if (event.event?.event?.case === 'data') {
              const data = event.event.event.value.data;
              // Convert Uint8Array to string
              const textData = new TextDecoder().decode(data);
              const callback = this.onDataCallbacks.get(sessionId);
              if (callback) {
                callback(textData);
              }
            } else if (event.event?.event?.case === 'exit') {
              const exitCode = event.event.event.value.exitCode || 0;
              console.log(`🔚 Terminal session ${sessionId} exited with code: ${exitCode}`);
              session.isConnected = false;
              const callback = this.onExitCallbacks.get(sessionId);
              if (callback) {
                callback(exitCode);
              }
              break;
            }
          }
        } catch (error) {
          console.error(`❌ Terminal session ${sessionId} event loop error:`, error);
          session.isConnected = false;
        }
      })();

      // Store session
      this.sessions.set(sessionId, session);

      console.log(`✅ Terminal session created: ${sessionId}`);
      return sessionId;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to create terminal session:', errorMsg);
      throw error;
    }
  }

  async writeToTerminal(sessionId: string, data: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Terminal session not found: ${sessionId}`);
    }

    if (!session.isConnected) {
      throw new Error(`Terminal session is not connected: ${sessionId}`);
    }

    try {
      // Convert string to Uint8Array for E2B PTY
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(data);
      
      // Send input to PTY (the exact method may vary - we'll need to check E2B docs)
      // For now, we'll try the most likely method
      if (typeof session.pty.sendInput === 'function') {
        await session.pty.sendInput(dataBytes);
      } else if (typeof session.pty.write === 'function') {
        await session.pty.write(dataBytes);
      } else {
        console.warn('⚠️ No input method found on PTY, data not sent');
      }
      
      session.lastActivity = new Date();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to write to terminal ${sessionId}:`, errorMsg);
      throw error;
    }
  }

  async resizeTerminal(sessionId: string, cols: number, rows: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Terminal session not found: ${sessionId}`);
    }

    try {
      // E2B PTY resize method (may need adjustment based on actual API)
      if (typeof session.pty.resize === 'function') {
        await session.pty.resize({ cols, rows });
      } else {
        console.warn(`⚠️ Resize not supported on PTY ${sessionId}`);
      }
      console.log(`📏 Terminal ${sessionId} resized to ${cols}x${rows}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to resize terminal ${sessionId}:`, errorMsg);
      throw error;
    }
  }

  onData(sessionId: string, callback: (data: string) => void): void {
    this.onDataCallbacks.set(sessionId, callback);
  }

  onExit(sessionId: string, callback: (code: number) => void): void {
    this.onExitCallbacks.set(sessionId, callback);
  }

  async killTerminalSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ Terminal session not found for cleanup: ${sessionId}`);
      return;
    }

    try {
      console.log(`🧹 Killing terminal session: ${sessionId}`);
      
      if (session.isConnected) {
        await session.pty.kill();
      }

      // Clean up callbacks
      this.onDataCallbacks.delete(sessionId);
      this.onExitCallbacks.delete(sessionId);

      // Remove session
      this.sessions.delete(sessionId);

      console.log(`✅ Terminal session killed: ${sessionId}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to kill terminal session ${sessionId}:`, errorMsg);
    }
  }

  getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): TerminalSession[] {
    return Array.from(this.sessions.values());
  }

  getSessionsForSandbox(sandboxId: string): TerminalSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.sandboxId === sandboxId
    );
  }

  async cleanupInactiveSessions(maxInactiveMinutes: number = 30): Promise<void> {
    const now = new Date();
    const inactiveSessions: string[] = [];

    for (const [sessionId, session] of this.sessions) {
      const inactiveMinutes = (now.getTime() - session.lastActivity.getTime()) / (1000 * 60);
      if (inactiveMinutes > maxInactiveMinutes) {
        inactiveSessions.push(sessionId);
      }
    }

    console.log(`🧹 Cleaning up ${inactiveSessions.length} inactive terminal sessions`);

    for (const sessionId of inactiveSessions) {
      await this.killTerminalSession(sessionId);
    }
  }

  async cleanupAllSessions(): Promise<void> {
    console.log('🧹 Cleaning up all terminal sessions...');
    
    const sessionIds = Array.from(this.sessions.keys());
    for (const sessionId of sessionIds) {
      await this.killTerminalSession(sessionId);
    }

    console.log('✅ All terminal sessions cleaned up');
  }

  getSessionCount(): number {
    return this.sessions.size;
  }

  isSessionActive(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    return session ? session.isConnected : false;
  }
}

// Global singleton instance
let globalTerminalService: TerminalService | null = null;

export function getTerminalService(): TerminalService {
  if (!globalTerminalService) {
    globalTerminalService = new TerminalService();
  }
  return globalTerminalService;
}

export function cleanupTerminalService(): void {
  if (globalTerminalService) {
    globalTerminalService.cleanupAllSessions();
    globalTerminalService = null;
  }
}