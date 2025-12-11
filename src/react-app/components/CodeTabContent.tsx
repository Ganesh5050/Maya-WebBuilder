 import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Lock, Search, Plus } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  locked?: boolean;
  children?: FileNode[];
}

const fileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'react-app',
        type: 'folder',
        children: [
          { name: 'App.tsx', type: 'file' },
          { name: 'main.tsx', type: 'file' },
          { name: 'index.css', type: 'file' },
        ],
      },
      {
        name: 'worker',
        type: 'folder',
        children: [
          { name: 'index.ts', type: 'file' },
        ],
      },
    ],
  },
  { name: 'eslint.config.js', type: 'file' },
  { name: 'index.html', type: 'file' },
  { name: 'package.json', type: 'file', locked: true },
  { name: 'postcss.config.js', type: 'file', locked: true },
  { name: 'tailwind.config.js', type: 'file' },
  { name: 'tsconfig.app.json', type: 'file', locked: true },
  { name: 'tsconfig.json', type: 'file', locked: true },
  { name: 'tsconfig.node.json', type: 'file', locked: true },
  { name: 'tsconfig.worker.json', type: 'file', locked: true },
  { name: 'vite.config.ts', type: 'file', locked: true },
  { name: 'wrangler.json', type: 'file', locked: true },
];

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center space-x-2 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:opacity-90 rounded-lg ${
          depth === 0 ? '' : 'ml-' + (depth * 4)
        }`}
        style={{
          paddingLeft: `${depth * 16 + 12}px`,
          backgroundColor: 'rgb(245, 245, 245)',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
        }}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )}
            <Folder className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </>
        ) : (
          <>
            <File className="w-4 h-4 text-gray-500 flex-shrink-0 ml-4" />
          </>
        )}
        <span className="text-gray-900 truncate">{node.name}</span>
        {node.locked && <Lock className="w-3 h-3 text-gray-400 flex-shrink-0 ml-auto" />}
      </button>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CodeTabContent() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - File Tree */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">Code</h3>
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto">
          {fileTree.map((node, index) => (
            <FileTreeNode key={index} node={node} />
          ))}
        </div>
      </div>

      {/* Main Code Editor Area */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Editor Tabs */}
        <div className="border-b border-gray-200 flex items-center px-2 bg-gray-50">
          <div className="flex items-center space-x-1">
            <div className="px-4 py-2 bg-white border-b-2 border-blue-600 text-sm font-medium text-gray-900">
              eslint.config.js
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-auto">
          <div className="font-mono text-sm">
            {/* Line numbers */}
            <div className="flex">
              <div className="bg-gray-50 text-gray-400 text-right pr-4 pl-2 select-none border-r border-gray-200">
                {Array.from({ length: 29 }, (_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code content */}
              <div className="flex-1 pl-4 pr-4">
                <pre className="leading-6 text-gray-800">
{`import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".bun", "node_modules", "dist", "./worker-configuration.d.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
