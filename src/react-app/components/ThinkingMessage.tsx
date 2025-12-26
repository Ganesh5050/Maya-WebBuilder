import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, ChevronRight, ChevronDown, CheckCircle2, Circle, Clock, FileCode, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LogStep {
    type: 'plan' | 'thought' | 'file' | 'text' | 'complete';
    content: string;
    data?: any;
}

interface ThinkingMessageProps {
    log: LogStep[];
    isComplete: boolean;
    onViewFile?: (path: string) => void;
}

export function ThinkingMessage({ log, isComplete, onViewFile }: ThinkingMessageProps) {
    const [isExpanded, setIsExpanded] = useState(!isComplete);
    const [displayedContent, setDisplayedContent] = useState('');
    const [startTime] = useState<number>(Date.now());
    const [elapsedTime, setElapsedTime] = useState('0s');

    // Derived state
    const thinkingSteps = log.filter(step =>
        step.type === 'plan' || step.type === 'thought' || step.type === 'file'
    );
    const contentSteps = log.filter(step => step.type === 'text');
    const fullContent = contentSteps.map(s => s.content).join('\n\n');

    // Timer Effect
    useEffect(() => {
        if (isComplete) return;
        const interval = setInterval(() => {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            setElapsedTime(`${seconds}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, [isComplete, startTime]);

    // Collapse thinking when complete (after a delay)
    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => setIsExpanded(false), 800);
            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    // STREAMING TEXT SIMULATION
    useEffect(() => {
        if (!fullContent) return;

        // If complete and we haven't started showing anything, just show it (restore history)
        if (isComplete && displayedContent === '') {
            setDisplayedContent(fullContent);
            return;
        }

        let currentIndex = displayedContent.length;
        if (currentIndex >= fullContent.length) return;

        const interval = setInterval(() => {
            if (currentIndex < fullContent.length) {
                // Add 1-3 chars at a time for natural speed variation
                const charsToAdd = Math.floor(Math.random() * 3) + 1;
                const nextChunk = fullContent.slice(currentIndex, currentIndex + charsToAdd);

                setDisplayedContent(prev => prev + nextChunk);
                currentIndex += charsToAdd;
            } else {
                clearInterval(interval);
            }
        }, 15); // ~60fps typing speed

        return () => clearInterval(interval);
    }, [fullContent, isComplete]); // Re-run if content updates, but `displayedContent` ref in closure handles incremental

    // Determine current "Thinking Label"
    const lastThinkingStep = thinkingSteps[thinkingSteps.length - 1];
    const thinkingLabel = !isComplete
        ? (lastThinkingStep?.type === 'thought' ? lastThinkingStep.content : 'Thinking...')
        : `Thought for ${elapsedTime}`;

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in group">
            {/* 1. THINKING BLOCK - Lovable Style */}
            {(thinkingSteps.length > 0) && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${isComplete ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                            }`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${isComplete ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                                {isComplete ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-medium ${isComplete ? 'text-gray-600' : 'text-gray-900'}`}>
                                    {isComplete ? 'Reasoning complete' : 'Reasoning...'}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                    {isComplete ? `Duration: ${elapsedTime}` : thinkingLabel}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                                {isComplete ? 'Opus' : 'Thinking'}
                            </span>
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </div>
                    </div>

                    {/* Steps List */}
                    {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/30 p-2 max-h-[400px] overflow-y-auto">
                            <div className="space-y-1">
                                {thinkingSteps.map((step, i) => (
                                    <div key={i} className="flex gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white transition-colors group/item">
                                        <div className="mt-0.5 min-w-[16px]">
                                            {step.type === 'file' ? (
                                                <FileCode className="w-4 h-4 text-purple-500" />
                                            ) : step.type === 'plan' ? (
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                                            ) : (
                                                <div className="w-1 h-1 rounded-full bg-gray-300 mt-2" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {step.type === 'file' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-purple-700 font-medium">Created file</span>
                                                    <code className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100 font-mono truncate">
                                                        {step.data?.filename || step.content}
                                                    </code>
                                                </div>
                                            ) : (
                                                <div className={`text-gray-600 ${step.type === 'plan' ? 'font-medium text-gray-800' : ''}`}>
                                                    {step.content}
                                                </div>
                                            )}
                                        </div>

                                        {step.type === 'file' && onViewFile && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewFile(step.data?.filename || step.content);
                                                }}
                                                className="opacity-0 group-hover/item:opacity-100 text-xs bg-white border shadow-sm px-2 py-1 rounded text-gray-600 hover:text-blue-600 transition-all"
                                            >
                                                View Code
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {!isComplete && (
                                    <div className="px-3 py-2 flex items-center gap-2 text-gray-400 text-sm animate-pulse">
                                        <div className="thinking-dots flex"><span></span><span></span><span></span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 2. MAIN CONTENT - Streaming Effect */}
            {displayedContent && (
                <div className={`prose prose-slate max-w-none text-base leading-relaxed ${!isComplete || displayedContent.length < fullContent.length ? 'message-content streaming' : ''}`}>
                    <ReactMarkdown>{displayedContent}</ReactMarkdown>
                </div>
            )}

            {/* 3. COMPLETION BADGE */}
            {isComplete && displayedContent.length >= fullContent.length && (
                <div className="flex items-center gap-2 text-green-600 animate-slide-up mt-4 border-t pt-4 border-dashed border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Site Generation Complete</span>
                </div>
            )}
        </div>
    );
}
