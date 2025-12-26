import React from 'react';
import { cn } from '../../lib/utils';

// Chat container root component
export function ChatContainerRoot({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col h-full overflow-hidden w-full max-w-full", className)}>
      {children}
    </div>
  );
}

// Chat container content component with scrolling
export function ChatContainerContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full", className)}>
      {children}
    </div>
  );
}