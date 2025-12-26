import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';

interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

interface ProjectFileViewerProps {
  files: ProjectFile[];
  className?: string;
  selectedFilePath?: string | null;
}

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  content?: string;
  language?: string;
}

// Intermediate type for building the tree
interface FileTreeBuilderNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: Record<string, FileTreeBuilderNode>;
  content?: string;
  language?: string;
}

function buildFileTree(files: ProjectFile[]): FileTreeNode[] {
  const root: Record<string, FileTreeBuilderNode> = {};

  files.forEach(file => {
    const parts = file.path.split('/');
    let current = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!current[part]) {
        current[part] = {
          name: part,
          path: currentPath,
          type: index === parts.length - 1 ? 'file' : 'folder',
          children: index === parts.length - 1 ? undefined : {},
          content: index === parts.length - 1 ? file.content : undefined,
          language: index === parts.length - 1 ? file.language : undefined
        };
      }

      if (current[part].type === 'folder') {
        // Ensure children exists for folder type (handled by initialization above)
        // If it was created as a file earlier (shouldn't happen with correct split), this might error.
        // But assuming strict folder structure.
        current = current[part].children!;
      }
    });
  });

  // Convert to array and sort
  const sortNodes = (nodes: Record<string, FileTreeBuilderNode>): FileTreeNode[] => {
    return Object.values(nodes)
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map(node => ({
        name: node.name,
        path: node.path,
        type: node.type,
        content: node.content,
        language: node.language,
        children: node.children ? sortNodes(node.children) : undefined
      }));
  };

  return sortNodes(root);
}

function FileTreeItem({ node, selectedFile, onFileSelect, level = 0 }: {
  node: FileTreeNode;
  selectedFile: string | null;
  onFileSelect: (file: ProjectFile) => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else if (node.content !== undefined) {
      onFileSelect({
        path: node.path,
        content: node.content,
        language: node.language || 'text'
      });
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-100 text-blue-800' : ''
          }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <Folder className="w-4 h-4 text-blue-500" />
          </>
        ) : (
          <>
            <div className="w-4" /> {/* Spacer for alignment */}
            <File className="w-4 h-4 text-gray-500" />
          </>
        )}
        <span className="text-sm font-medium truncate">{node.name}</span>
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeItem
              key={child.path}
              node={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectFileViewer({ files, className = '', selectedFilePath }: ProjectFileViewerProps) {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const fileTree = buildFileTree(files);

  // Update selected file when selectedFilePath prop changes
  useEffect(() => {
    if (selectedFilePath) {
      const file = files.find(f => f.path === selectedFilePath);
      if (file) {
        setSelectedFile(file);
      }
    }
  }, [selectedFilePath, files]);

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file);
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* File Tree */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-semibold text-gray-700">Files ({files.length})</h3>
        </div>
        <div className="py-2">
          {fileTree.map(node => (
            <FileTreeItem
              key={node.path}
              node={node}
              selectedFile={selectedFile?.path || null}
              onFileSelect={handleFileSelect}
            />
          ))}
        </div>
      </div>

      {/* File Content */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="p-3 border-b border-gray-200 bg-white">
              <h4 className="text-sm font-medium text-gray-700">{selectedFile.path}</h4>
              <span className="text-xs text-gray-500">{selectedFile.language}</span>
            </div>
            <div className="flex-1 overflow-auto">
              <pre className="p-4 text-sm font-mono bg-gray-900 text-gray-100 h-full overflow-auto">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <File className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Select a file to view its content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}