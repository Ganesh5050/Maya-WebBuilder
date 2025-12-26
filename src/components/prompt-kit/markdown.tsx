import React from 'react';
import { cn } from '../../lib/utils';

// Simple markdown component for rendering formatted text
export function Markdown({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  // For now, this is a simple wrapper that handles basic markdown-like formatting
  // In a full implementation, you might use a library like react-markdown
  
  const formatText = (text: string) => {
    // Handle basic markdown formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>') // Inline code
      .replace(/\n/g, '<br />'); // Line breaks
  };

  if (typeof children === 'string') {
    return (
      <div 
        className={cn("prose prose-sm max-w-none w-full break-words overflow-hidden", className)}
        dangerouslySetInnerHTML={{ __html: formatText(children) }}
      />
    );
  }

  return (
    <div className={cn("prose prose-sm max-w-none w-full break-words overflow-hidden", className)}>
      {children}
    </div>
  );
}