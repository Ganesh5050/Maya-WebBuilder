import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { X, Save, RotateCcw, Search, Settings } from 'lucide-react';
import { getFileExplorerService } from '../../services/fileExplorerService';

interface EditorTab {
  path: string;
  name: string;
  content: string;
  isDirty: boolean;
  language: string;
}

interface CodeEditorProps {
  selectedFile?: string;
  onFileChange?: (path: string, content: string) => void;
  className?: string;
}

export function CodeEditor({ selectedFile, onFileChange, className = '' }: CodeEditorProps) {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  
  const editorRef = useRef<any>(null);
  const fileExplorerService = getFileExplorerService();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Open file when selectedFile changes
  useEffect(() => {
    if (selectedFile && !tabs.find(tab => tab.path === selectedFile)) {
      openFile(selectedFile);
    } else if (selectedFile) {
      setActiveTab(selectedFile);
    }
  }, [selectedFile, tabs]);

  const openFile = useCallback(async (path: string) => {
    try {
      setLoading(true);
      setError(null);

      const content = await fileExplorerService.readFile(path);
      const fileName = path.split('/').pop() || 'Unknown';
      const language = fileExplorerService.getFileLanguage(fileName);

      const newTab: EditorTab = {
        path,
        name: fileName,
        content,
        isDirty: false,
        language
      };

      setTabs(prev => {
        const existing = prev.find(tab => tab.path === path);
        if (existing) {
          return prev.map(tab => 
            tab.path === path ? { ...tab, content, isDirty: false } : tab
          );
        }
        return [...prev, newTab];
      });

      setActiveTab(path);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to open file';
      setError(errorMsg);
      console.error('❌ Failed to open file:', err);
    } finally {
      setLoading(false);
    }
  }, [fileExplorerService]);

  const closeTab = useCallback((path: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.path !== path);
      
      // If closing active tab, switch to another tab
      if (activeTab === path) {
        const tabIndex = prev.findIndex(tab => tab.path === path);
        if (newTabs.length > 0) {
          const nextTab = newTabs[Math.min(tabIndex, newTabs.length - 1)];
          setActiveTab(nextTab.path);
        } else {
          setActiveTab(null);
        }
      }
      
      return newTabs;
    });
  }, [activeTab]);

  const saveFile = useCallback(async (path: string) => {
    const tab = tabs.find(t => t.path === path);
    if (!tab || !tab.isDirty) return;

    try {
      await fileExplorerService.writeFile(path, tab.content);
      
      setTabs(prev => prev.map(t => 
        t.path === path ? { ...t, isDirty: false } : t
      ));

      onFileChange?.(path, tab.content);
      console.log('✅ File saved:', path);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save file';
      alert(`Error saving file: ${errorMsg}`);
      console.error('❌ Failed to save file:', err);
    }
  }, [tabs, fileExplorerService, onFileChange]);

  const saveAllFiles = useCallback(async () => {
    const dirtyTabs = tabs.filter(tab => tab.isDirty);
    
    for (const tab of dirtyTabs) {
      await saveFile(tab.path);
    }
  }, [tabs, saveFile]);

  const handleEditorChange = useCallback((value: string | undefined, path: string) => {
    if (value === undefined) return;

    setTabs(prev => prev.map(tab => 
      tab.path === path 
        ? { ...tab, content: value, isDirty: true }
        : tab
    ));

    // Auto-save with debounce
    if (autoSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveFile(path);
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
  }, [autoSave, saveFile]);

  const handleEditorMount = useCallback((editor: any) => {
    editorRef.current = editor;

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeTab) {
        saveFile(activeTab);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS, () => {
      saveAllFiles();
    });
  }, [activeTab, saveFile, saveAllFiles]);

  const activeTabData = tabs.find(tab => tab.path === activeTab);

  if (!fileExplorerService.isConnected()) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">💻</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Code Editor</h3>
          <p className="text-sm text-gray-500">Generate a React project to start editing code</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200 min-h-[40px]">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.path}
              className={`flex items-center gap-2 px-3 py-2 text-sm border-r border-gray-200 cursor-pointer min-w-0 ${
                activeTab === tab.path
                  ? 'bg-white text-gray-900 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.path)}
            >
              <span className="text-base">
                {fileExplorerService.getFileIcon(tab.name, false)}
              </span>
              <span className="truncate max-w-[120px]">{tab.name}</span>
              {tab.isDirty && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (tab.isDirty) {
                    if (confirm(`"${tab.name}" has unsaved changes. Close anyway?`)) {
                      closeTab(tab.path);
                    }
                  } else {
                    closeTab(tab.path);
                  }
                }}
                className="p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Editor Controls */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => activeTab && saveFile(activeTab)}
            disabled={!activeTabData?.isDirty}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save File (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>
          
          <button
            onClick={saveAllFiles}
            disabled={!tabs.some(tab => tab.isDirty)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save All Files (Ctrl+Shift+S)"
          >
            <Save className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1"></div>

          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`p-1.5 rounded text-xs font-medium ${
              autoSave 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Toggle Auto-save"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading file...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-red-700 mb-2">Error Loading File</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {activeTabData ? (
          <Editor
            height="100%"
            language={activeTabData.language}
            value={activeTabData.content}
            onChange={(value) => handleEditorChange(value, activeTabData.path)}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Mono", "Roboto Mono", Consolas, "Courier New", monospace',
              fontLigatures: true,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: true },
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              detectIndentation: true,
              folding: true,
              foldingHighlight: true,
              showFoldingControls: 'always',
              unfoldOnClickAfterEndOfLine: false,
              contextmenu: true,
              mouseWheelZoom: true,
              multiCursorModifier: 'ctrlCmd',
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No File Open</h3>
              <p className="text-sm text-gray-500">Select a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {activeTabData && (
        <div className="flex items-center justify-between px-3 py-1 bg-gray-100 border-t border-gray-200 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>{activeTabData.language}</span>
            <span>{activeTabData.path}</span>
            {activeTabData.isDirty && (
              <span className="text-blue-600">● Unsaved changes</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {autoSave && <span className="text-green-600">Auto-save enabled</span>}
            <span>Monaco Editor</span>
          </div>
        </div>
      )}
    </div>
  );
}