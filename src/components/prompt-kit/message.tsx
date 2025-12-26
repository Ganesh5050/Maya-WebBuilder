import React from 'react';
import { cn } from '../../lib/utils';

// Message container component
export function Message({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 mb-4 w-full max-w-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

// Message avatar component
export function MessageAvatar({ 
  src, 
  alt, 
  fallback,
  className 
}: { 
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600", className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      ) : (
        fallback || 'AI'
      )}
    </div>
  );
}

// Message content component
export function MessageContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg px-4 py-3 max-w-[85%] sm:max-w-[75%] break-words overflow-hidden", className)}>
      {children}
    </div>
  );
}