import { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder,
  Plus,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';
import { FileNode, getFileExplorerService } from '../../services/fileExplorerService';

interface FileExplorerProps {
  onFileSelect?: (path: string) => void;
  selectedFile?: string;
  className?: string;
}

interface ContextMenuProps {
  x: number;
  y: number;
  node: FileNode;
  onClose: () => void;
  onAction: (action: string, node: FileNode) => void;
}

function ContextMenu({ x, y, node, onClose, onAction }: ContextMenuProps) {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  const menuItems = [
    { id: 'rename', label: 'Rename', icon: Edit3 },
    { id: 'copy', label: 'Copy Path', icon: Copy },
    { id: 'delete', label: 'Delete', icon: Trash2, danger: true }
  ];

  if (node.type === 'directory') {
    menuItems.unshift(
      { id: 'newFile', label: 'New File', icon: File },
      { id: 'newFolder', label: 'New Folder', icon: Folder }
    );
  }

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[160px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              onAction(item.id, node);
              onClose();
            }}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${
              item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface FileNodeProps {
  node: FileNode;
  level: number;
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
  onContextMenu: (e: React.MouseEvent, node: FileNode) => void;
  selectedFile?: string;
}

function FileNodeComponent({ 
  node, 
  level, 
  onToggle, 
  onSelect, 
  onContextMenu,
  selectedFile 
}: FileNodeProps) {
  const fileExplorerService = getFileExplorerService();
  const isSelected = selectedFile === node.path;
  const hasChildren = node.children && node.children.length > 0;
  const icon = fileExplorerService.getFileIcon(node.name, node.type === 'directory');

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.type === 'directory') {
            onToggle(node.path);
          } else {
            onSelect(node.path);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, node);
        }}
      >
        {node.type === 'directory' && (
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              node.isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )
            ) : null}
          </div>
        )}
        
        <span className="text-base mr-1">{icon}</span>
        <span className="flex-1 truncate">{node.name}</span>
        
        {node.size !== undefined && node.type === 'file' && (
          <span className="text-xs text-gray-400 ml-2">
            {formatFileSize(node.size)}
          </span>
        )}
      </div>

      {node.type === 'directory' && node.isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function FileExplorer({ onFileSelect, selectedFile, className = '' }: FileExplorerProps) {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: FileNode;
  } | null>(null);
  const [newItemDialog, setNewItemDialog] = useState<{
    type: 'file' | 'folder';
    parentPath: string;
  } | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const fileExplorerService = getFileExplorerService();

  // Load file tree
  useEffect(() => {
    const loadTree = async () => {
      if (!fileExplorerService.isConnected()) {
        setError('File explorer not connected to sandbox');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const tree = await fileExplorerService.loadFileTree('/');
        setFileTree(tree);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load files';
        setError(errorMsg);
        console.error('❌ Failed to load file tree:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTree();

    // Listen for file tree changes
    const handleTreeChange = (tree: FileNode) => {
      setFileTree(tree);
    };

    fileExplorerService.onChange(handleTreeChange);

    return () => {
      fileExplorerService.offChange(handleTreeChange);
    };
  }, [fileExplorerService]);

  const handleToggle = useCallback((path: string) => {
    if (!fileTree) return;

    const toggleNode = (node: FileNode): FileNode => {
      if (node.path === path) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(toggleNode)
        };
      }
      return node;
    };

    setFileTree(toggleNode(fileTree));
  }, [fileTree]);

  const handleSelect = useCallback((path: string) => {
    onFileSelect?.(path);
  }, [onFileSelect]);

  const handleContextMenu = useCallback((e: React.MouseEvent, node: FileNode) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node
    });
  }, []);

  const handleContextAction = useCallback(async (action: string, node: FileNode) => {
    try {
      switch (action) {
        case 'newFile':
          setNewItemDialog({ type: 'file', parentPath: node.path });
          setNewItemName('');
          break;
        
        case 'newFolder':
          setNewItemDialog({ type: 'folder', parentPath: node.path });
          setNewItemName('');
          break;
        
        case 'rename':
          const newName = prompt('Enter new name:', node.name);
          if (newName && newName !== node.name) {
            const parentPath = node.path.substring(0, node.path.lastIndexOf('/'));
            const newPath = parentPath === '' ? `/${newName}` : `${parentPath}/${newName}`;
            await fileExplorerService.renameFile(node.path, newPath);
          }
          break;
        
        case 'copy':
          await navigator.clipboard.writeText(node.path);
          console.log('📋 Path copied to clipboard:', node.path);
          break;
        
        case 'delete':
          if (confirm(`Are you sure you want to delete "${node.name}"?`)) {
            await fileExplorerService.deleteFile(node.path);
          }
          break;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      alert(`Error: ${errorMsg}`);
      console.error('❌ Context action failed:', err);
    }
  }, [fileExplorerService]);

  const handleCreateItem = useCallback(async () => {
    if (!newItemDialog || !newItemName.trim()) return;

    try {
      const itemPath = newItemDialog.parentPath === '/' 
        ? `/${newItemName.trim()}`
        : `${newItemDialog.parentPath}/${newItemName.trim()}`;

      if (newItemDialog.type === 'file') {
        await fileExplorerService.createFile(itemPath, '');
      } else {
        await fileExplorerService.createDirectory(itemPath);
      }

      setNewItemDialog(null);
      setNewItemName('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create item';
      alert(`Error: ${errorMsg}`);
      console.error('❌ Failed to create item:', err);
    }
  }, [newItemDialog, newItemName, fileExplorerService]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-sm text-red-600 mb-2">Failed to load files</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!fileTree) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-sm text-gray-600">No files found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">Explorer</h3>
        <button
          onClick={() => setNewItemDialog({ type: 'file', parentPath: '/' })}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
          title="New File"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* File Tree */}
      <div className="overflow-auto h-full">
        <FileNodeComponent
          node={fileTree}
          level={0}
          onToggle={handleToggle}
          onSelect={handleSelect}
          onContextMenu={handleContextMenu}
          selectedFile={selectedFile}
        />
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      {/* New Item Dialog */}
      {newItemDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">
              Create New {newItemDialog.type === 'file' ? 'File' : 'Folder'}
            </h3>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Enter ${newItemDialog.type} name`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateItem();
                } else if (e.key === 'Escape') {
                  setNewItemDialog(null);
                  setNewItemName('');
                }
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setNewItemDialog(null);
                  setNewItemName('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                disabled={!newItemName.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}