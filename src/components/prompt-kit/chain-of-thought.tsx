import React, { createContext, useContext, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// Context for managing chain of thought state
const ChainOfThoughtContext = createContext<{
  expandedSteps: Set<number>;
  toggleStep: (stepIndex: number) => void;
}>({
  expandedSteps: new Set(),
  toggleStep: () => {},
});

// Main container component
export function ChainOfThought({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0])); // First step expanded by default

  const toggleStep = (stepIndex: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  return (
    <ChainOfThoughtContext.Provider value={{ expandedSteps, toggleStep }}>
      <div className={cn("space-y-3 w-full max-w-full overflow-hidden", className)}>
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, { stepIndex: index })
            : child
        )}
      </div>
    </ChainOfThoughtContext.Provider>
  );
}

// Individual step component
export function ChainOfThoughtStep({ 
  children, 
  stepIndex,
  className 
}: { 
  children: React.ReactNode;
  stepIndex?: number;
  className?: string;
}) {
  return (
    <div className={cn("border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm w-full max-w-full", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { stepIndex })
          : child
      )}
    </div>
  );
}

// Trigger component (clickable header)
export function ChainOfThoughtTrigger({ 
  children, 
  leftIcon, 
  stepIndex,
  className 
}: { 
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  stepIndex?: number;
  className?: string;
}) {
  const { expandedSteps, toggleStep } = useContext(ChainOfThoughtContext);
  const isExpanded = stepIndex !== undefined && expandedSteps.has(stepIndex);

  return (
    <button
      onClick={() => stepIndex !== undefined && toggleStep(stepIndex)}
      className={cn(
        "w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors",
        className
      )}
    >
      {/* Expand/Collapse Icon */}
      <div className="flex-shrink-0">
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </div>

      {/* Left Icon */}
      {leftIcon && (
        <div className="flex-shrink-0 text-gray-600">
          {leftIcon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 font-medium text-gray-800 min-w-0 break-words">
        {children}
      </div>
    </button>
  );
}

// Content container (expandable content)
export function ChainOfThoughtContent({ 
  children, 
  stepIndex,
  className 
}: { 
  children: React.ReactNode;
  stepIndex?: number;
  className?: string;
}) {
  const { expandedSteps } = useContext(ChainOfThoughtContext);
  const isExpanded = stepIndex !== undefined && expandedSteps.has(stepIndex);

  if (!isExpanded) return null;

  return (
    <div className={cn("px-4 pb-4 border-t border-gray-100 bg-gray-50/50 w-full max-w-full overflow-hidden", className)}>
      <div className="space-y-3 pt-4 w-full max-w-full">
        {children}
      </div>
    </div>
  );
}

// Individual content item
export function ChainOfThoughtItem({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 w-full max-w-full", className)}>
      {/* Bullet point */}
      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
      
      {/* Content */}
      <div className="flex-1 text-sm text-gray-700 leading-relaxed min-w-0 break-words overflow-hidden">
        {children}
      </div>
    </div>
  );
}