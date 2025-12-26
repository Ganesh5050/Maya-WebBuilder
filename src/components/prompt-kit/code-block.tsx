import React from 'react';
import { cn } from '../../lib/utils';

// Main code block container
export function CodeBlock({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-gray-900 overflow-hidden w-full", className)}>
      {children}
    </div>
  );
}

// Code content component
export function CodeBlockCode({ 
  code, 
  language,
  className 
}: { 
  code: string;
  language?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Language label */}
      {language && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 font-mono">
          {language}
        </div>
      )}
      
      {/* Code content */}
      <pre className="p-4 text-sm text-gray-100 font-mono overflow-x-auto whitespace-pre-wrap break-words max-w-full">
        <code className="break-words">{code}</code>
      </pre>
    </div>
  );
}