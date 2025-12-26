import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { ThinkingState } from './types';
import './styles.css';

const ThinkingIconSvg = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%" className={className}>
        <path fill="currentColor" d="M14.25 17.75h-4.5V18a2.25 2.25 0 0 0 4.5 0zm3.5-8.25a5.75 5.75 0 1 0-9.653 4.223c.688.637 1.346 1.496 1.571 2.527h4.664c.225-1.03.883-1.89 1.571-2.527A5.73 5.73 0 0 0 17.75 9.5m1.5 0c0 2.105-.898 4-2.33 5.324-.712.66-1.17 1.414-1.17 2.176v1a3.75 3.75 0 1 1-7.5 0v-1c0-.762-.458-1.516-1.17-2.176A7.25 7.25 0 1 1 19.25 9.5"></path>
    </svg>
);

const DotSpinner = () => {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setFrameIndex((prev) => (prev + 1) % frames.length);
        }, 80);
        return () => clearInterval(timer);
    }, []);

    return <span className="text-purple-500 font-mono text-lg leading-none inline-block ml-2">{frames[frameIndex]}</span>;
};

const TypewriterLine = ({ text }: { text: string }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayed(text.substring(0, i + 1));
            i++;
            if (i > text.length) clearInterval(timer);
        }, 10); // Fast typing speed
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayed}</span>;
}

interface ThinkingIndicatorProps {
    state: ThinkingState;
    isComplete: boolean;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ state, isComplete }) => {
    // Collapsed by default if complete, expanded if active
    const [isExpanded, setIsExpanded] = useState(!isComplete);

    // Auto-collapse when complete
    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => setIsExpanded(false), 800);
            return () => clearTimeout(timer);
        } else {
            setIsExpanded(true);
        }
    }, [isComplete]);

    if (!state.isActive && state.content.length === 0) return null;

    return (
        <div className="mb-4">
            {/* Header / Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl transition-all w-full border ${isComplete ? 'bg-white border-gray-200 text-gray-600' : 'bg-purple-50 border-purple-100 text-purple-700 shadow-sm'}`}
            >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isComplete ? 'bg-gray-100 text-gray-500' : 'bg-white text-yellow-500 shadow-sm'}`}>
                    {isComplete ? (
                        <ThinkingIconSvg className="w-4 h-4" />
                    ) : (
                        <ThinkingIconSvg className="w-4 h-4 animate-pulse" />
                    )}
                </div>

                <div className="flex-1 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {isComplete ? (
                            <>Thought for {state.duration}s</>
                        ) : (
                            <>Thinking process... <span className="opacity-60 font-normal">({state.duration}s)</span></>
                        )}
                    </span>

                    {isExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                </div>
            </button>


            {/* Content Accordion */}
            <div
                className={`thinking-accordion-content mt-2 border-l-2 border-purple-100 pl-4 space-y-1 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {state.content.map((step, idx) => (
                    <div key={idx} className="text-sm text-gray-500 font-mono">
                        <span className="text-purple-300 mr-2">›</span>
                        <TypewriterLine text={step} />
                    </div>
                ))}
                {!isComplete && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 py-1">
                        <span className="text-purple-300 mr-2">›</span>
                        <DotSpinner />
                    </div>
                )}
            </div>
        </div>
    );
};
