// File Explorer Service
// Manages file system operations with E2B sandbox

import { Sandbox } from '@e2b/code-interpreter';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
  children?: FileNode[];
  isExpanded?: boolean;
  content?: string; // Cached content for files
}

export interface FileOperation {
  type: 'create' | 'update' | 'delete' | 'rename';
  path: string;
  newPath?: string;
  content?: string;
}

export class FileExplorerService {
  private sandbox: Sandbox | null = null;
  private fileTree: FileNode | null = null;
  private onChangeCallbacks: Set<(tree: FileNode) => void> = new Set();

  constructor() {
    console.log('📁 FileExplorerService initialized');
  }

  setSandbox(sandbox: Sandbox): void {
    this.sandbox = sandbox;
    console.log('📁 Sandbox connected to file explorer');
  }

  onChange(callback: (tree: FileNode) => void): void {
    this.onChangeCallbacks.add(callback);
  }

  offChange(callback: (tree: FileNode) => void): void {
    this.onChangeCallbacks.delete(callback);
  }

  private notifyChange(): void {
    if (this.fileTree) {
      this.onChangeCallbacks.forEach(callback => callback(this.fileTree!));
    }
  }

  async loadFileTree(rootPath: string = '/'): Promise<FileNode> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      console.log(`📁 Loading file tree from: ${rootPath}`);
      
      const tree = await this.buildFileTree(rootPath, 'root');
      this.fileTree = tree;
      
      console.log('✅ File tree loaded:', tree);
      this.notifyChange();
      
      return tree;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to load file tree:', errorMsg);
      throw error;
    }
  }

  private async buildFileTree(path: string, id: string): Promise<FileNode> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      // For root path, create a virtual root node
      if (path === '/') {
        const entries = await this.sandbox.files.list(path);
        
        const node: FileNode = {
          id,
          name: 'Project',
          path,
          type: 'directory',
          isExpanded: true,
          children: []
        };

        for (const entry of entries) {
          const childPath = `/${entry.name}`;
          const childId = `${id}_${entry.name}`;
          
          // Skip system directories and hidden files for performance
          if (entry.name.startsWith('.') || 
              ['bin', 'boot', 'dev', 'etc', 'lib', 'lib64', 'lost+found', 'media', 'mnt', 'opt', 'proc', 'root', 'run', 'sbin', 'srv', 'swap', 'sys', 'tmp', 'usr', 'var'].includes(entry.name)) {
            continue;
          }

          const childNode: FileNode = {
            id: childId,
            name: entry.name,
            path: childPath,
            type: entry.type === 'directory' ? 'directory' : 'file',
            size: entry.size,
            modified: entry.modifiedTime ? new Date(entry.modifiedTime) : undefined,
            isExpanded: false
          };

          // If it's a directory, recursively load children
          if (entry.type === 'directory') {
            try {
              const subEntries = await this.sandbox.files.list(childPath);
              childNode.children = [];

              for (const subEntry of subEntries) {
                const subChildPath = `${childPath}/${subEntry.name}`;
                const subChildId = `${childId}_${subEntry.name}`;
                
                // Skip node_modules and hidden files for performance
                if (subEntry.name.startsWith('.') || subEntry.name === 'node_modules') {
                  continue;
                }

                const subChildNode: FileNode = {
                  id: subChildId,
                  name: subEntry.name,
                  path: subChildPath,
                  type: subEntry.type === 'directory' ? 'directory' : 'file',
                  size: subEntry.size,
                  modified: subEntry.modifiedTime ? new Date(subEntry.modifiedTime) : undefined,
                  isExpanded: false
                };

                childNode.children.push(subChildNode);
              }

              // Sort children: directories first, then files
              childNode.children.sort((a, b) => {
                if (a.type !== b.type) {
                  return a.type === 'directory' ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
              });
            } catch (error) {
              console.warn(`⚠️ Failed to list directory ${childPath}:`, error);
              childNode.children = [];
            }
          }

          node.children!.push(childNode);
        }

        // Sort root children: directories first, then files
        node.children!.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });

        return node;
      } else {
        // For non-root paths, this shouldn't be called in the current implementation
        // But we'll handle it gracefully
        const entries = await this.sandbox.files.list(path);
        const parentEntry = entries[0]; // This is a fallback

        return {
          id,
          name: path.split('/').pop() || 'Unknown',
          path,
          type: 'directory',
          isExpanded: false,
          children: []
        };
      }
    } catch (error) {
      console.error(`❌ Failed to build file tree for ${path}:`, error);
      // Return a placeholder node for failed paths
      return {
        id,
        name: path === '/' ? 'Project' : (path.split('/').pop() || 'Unknown'),
        path,
        type: path === '/' ? 'directory' : 'file',
        size: 0,
        isExpanded: false
      };
    }
  }

  async readFile(path: string): Promise<string> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      console.log(`📄 Reading file: ${path}`);
      const content = await this.sandbox.files.read(path);
      console.log(`✅ File read successfully: ${path} (${content.length} chars)`);
      return content;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to read file ${path}:`, errorMsg);
      throw error;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      console.log(`💾 Writing file: ${path} (${content.length} chars)`);
      await this.sandbox.files.write(path, content);
      console.log(`✅ File written successfully: ${path}`);
      
      // Update file tree if needed
      await this.refreshFileTree();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to write file ${path}:`, errorMsg);
      throw error;
    }
  }

  async createFile(path: string, content: string = ''): Promise<void> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      console.log(`📄 Creating file: ${path}`);
      await this.sandbox.files.write(path, content);
      console.log(`✅ File created successfully: ${path}`);
      
      // Refresh file tree
      await this.refreshFileTree();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to create file ${path}:`, errorMsg);
      throw error;
    }
  }

  async createDirectory(path: string): Promise<void> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      console.log(`📁 Creating directory: ${path}`);
      await this.sandbox.files.makeDir(path);
      console.log(`✅ Directory created successfully: ${path}`);
      
      // Refresh file tree
      await this.refreshFileTree();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to create directory ${path}:`, errorMsg);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      console.log(`🗑️ Deleting file: ${path}`);
      await this.sandbox.files.remove(path);
      console.log(`✅ File deleted successfully: ${path}`);
      
      // Refresh file tree
      await this.refreshFileTree();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to delete file ${path}:`, errorMsg);
      throw error;
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    if (!this.sandbox) {
      throw new Error('Sandbox not connected');
    }

    try {
      console.log(`📝 Renaming file: ${oldPath} → ${newPath}`);
      await this.sandbox.files.move(oldPath, newPath);
      console.log(`✅ File renamed successfully: ${oldPath} → ${newPath}`);
      
      // Refresh file tree
      await this.refreshFileTree();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to rename file ${oldPath} → ${newPath}:`, errorMsg);
      throw error;
    }
  }

  async refreshFileTree(): Promise<void> {
    if (this.fileTree) {
      await this.loadFileTree(this.fileTree.path);
    }
  }

  findFileNode(path: string, tree?: FileNode): FileNode | null {
    const searchTree = tree || this.fileTree;
    if (!searchTree) return null;

    if (searchTree.path === path) {
      return searchTree;
    }

    if (searchTree.children) {
      for (const child of searchTree.children) {
        const found = this.findFileNode(path, child);
        if (found) return found;
      }
    }

    return null;
  }

  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  }

  getFileLanguage(filename: string): string {
    const ext = this.getFileExtension(filename);
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'ini': 'ini',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'fish': 'shell'
    };

    return languageMap[ext] || 'plaintext';
  }

  getFileIcon(filename: string, isDirectory: boolean): string {
    if (isDirectory) {
      return '📁';
    }

    const ext = this.getFileExtension(filename);
    
    const iconMap: Record<string, string> = {
      'js': '🟨',
      'jsx': '⚛️',
      'ts': '🔷',
      'tsx': '⚛️',
      'html': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'sass': '🎨',
      'json': '📋',
      'md': '📝',
      'py': '🐍',
      'java': '☕',
      'cpp': '⚙️',
      'c': '⚙️',
      'php': '🐘',
      'rb': '💎',
      'go': '🐹',
      'rs': '🦀',
      'xml': '📄',
      'yaml': '📄',
      'yml': '📄',
      'toml': '📄',
      'ini': '📄',
      'sh': '🐚',
      'bash': '🐚',
      'zsh': '🐚',
      'fish': '🐚',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'gif': '🖼️',
      'svg': '🖼️',
      'ico': '🖼️'
    };

    return iconMap[ext] || '📄';
  }

  getFileTree(): FileNode | null {
    return this.fileTree;
  }

  isConnected(): boolean {
    return this.sandbox !== null;
  }
}

// Global singleton instance
let globalFileExplorerService: FileExplorerService | null = null;

export function getFileExplorerService(): FileExplorerService {
  if (!globalFileExplorerService) {
    globalFileExplorerService = new FileExplorerService();
  }
  return globalFileExplorerService;
}