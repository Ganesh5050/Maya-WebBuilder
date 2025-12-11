import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { X, Minimize2, Maximize2, RotateCcw, Copy } from 'lucide-react';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  sessionId?: string | null;
  onData?: (data: string) => void;
  onResize?: (cols: number, rows: number) => void;
  onClose?: () => void;
  className?: string;
  height?: number;
}

export const Terminal = forwardRef<any, TerminalProps>(({
  sessionId,
  onData,
  onResize,
  onClose,
  className = '',
  height = 300
}, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!terminalRef.current || !sessionId) return;

    // Create XTerm instance
    const xterm = new XTerm({
      theme: {
        background: '#1a1b26',
        foreground: '#a9b1d6',
        cursor: '#f7768e',
        cursorAccent: '#1a1b26',
        black: '#32344a',
        red: '#f7768e',
        green: '#9ece6a',
        yellow: '#e0af68',
        blue: '#7aa2f7',
        magenta: '#ad8ee6',
        cyan: '#449dab',
        white: '#787c99',
        brightBlack: '#444b6a',
        brightRed: '#ff7a93',
        brightGreen: '#b9f27c',
        brightYellow: '#ff9e64',
        brightBlue: '#7da6ff',
        brightMagenta: '#bb9af7',
        brightCyan: '#0db9d7',
        brightWhite: '#acb0d0'
      },
      fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Mono", "Roboto Mono", Consolas, "Courier New", monospace',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: 0,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4
    });

    // Create addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    // Load addons
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);

    // Open terminal
    xterm.open(terminalRef.current);

    // Store references
    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Fit terminal to container
    setTimeout(() => {
      fitAddon.fit();
      const { cols, rows } = xterm;
      onResize?.(cols, rows);
    }, 100);

    // Handle data input
    xterm.onData((data) => {
      onData?.(data);
    });

    // Handle resize
    xterm.onResize(({ cols, rows }) => {
      onResize?.(cols, rows);
    });

    // Welcome message
    xterm.writeln('\x1b[1;32m🚀 Terminal connected to E2B sandbox\x1b[0m');
    xterm.writeln('\x1b[90mType commands and press Enter to execute\x1b[0m');
    xterm.writeln('');

    // Cleanup function
    return () => {
      xterm.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [sessionId, onData, onResize]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current && !isMinimized) {
        setTimeout(() => {
          fitAddonRef.current?.fit();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  const writeToTerminal = (data: string) => {
    if (xtermRef.current) {
      xtermRef.current.write(data);
    }
  };

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln('\x1b[1;32m🚀 Terminal cleared\x1b[0m');
      xtermRef.current.writeln('');
    }
  };

  const copyTerminalContent = async () => {
    if (xtermRef.current) {
      try {
        const selection = xtermRef.current.getSelection();
        if (selection) {
          await navigator.clipboard.writeText(selection);
          console.log('📋 Terminal content copied to clipboard');
        }
      } catch (error) {
        console.error('❌ Failed to copy terminal content:', error);
      }
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized && fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 100);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 100);
    }
  };

  // Expose writeToTerminal method
  useImperativeHandle(ref, () => ({
    writeToTerminal,
    clearTerminal,
    fit: () => fitAddonRef.current?.fit()
  }));

  if (!sessionId) {
    return (
      <div className={`bg-gray-900 border border-gray-700 rounded-lg ${className}`}>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-2 text-sm font-medium text-gray-300">Terminal</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4">🖥️</div>
            <p className="text-lg font-medium mb-2">No Terminal Session</p>
            <p className="text-sm">Generate a React project to start a terminal session</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg ${className} ${
      isMaximized ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-sm font-medium text-gray-300">Terminal</span>
          <span className="text-xs text-gray-500">({sessionId?.slice(-8)})</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={copyTerminalContent}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title="Copy selection"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title="Clear terminal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMinimize}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title={isMinimized ? "Restore" : "Minimize"}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
              title="Close terminal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      {!isMinimized && (
        <div 
          ref={terminalRef}
          className="terminal-container"
          style={{ 
            height: isMaximized ? 'calc(100vh - 120px)' : `${height}px`,
            background: '#1a1b26'
          }}
        />
      )}
    </div>
  );
});