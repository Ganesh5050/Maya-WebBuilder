import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, ChevronRight, ChevronDown, CheckCircle2, Circle, Clock, FileCode, Check, Send, Paperclip, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ThinkingMessage } from './ThinkingMessage';

// --- Types ---
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    thinkingLog?: LogStep[]; // If assistant, can have thinking steps
    isComplete?: boolean; // If assistant, is the generation complete?
    timestamp: number;
}

interface LogStep {
    type: 'plan' | 'thought' | 'file' | 'text' | 'complete';
    content: string;
    data?: any;
}

interface BuilderChatSectionProps {
    onSendMessage: (text: string, files?: File[]) => Promise<void>;
    messages: Message[];
    isGenerating: boolean;
}

// --- Component ---
export function BuilderChatSection({ onSendMessage, messages, isGenerating }: BuilderChatSectionProps) {
    const [inputValue, setInputValue] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, messages.length]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [inputValue]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!inputValue.trim() && attachedFiles.length === 0) return;
        if (isGenerating) return;

        onSendMessage(inputValue, attachedFiles);
        setInputValue('');
        setAttachedFiles([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <Lightbulb className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">What would you like to build?</h3>
                            <p className="max-w-md mt-2">I can help you create unique, premium websites. Just describe your idea.</p>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? (
                            <div className="bg-gray-100 text-gray-900 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        ) : (
                            <div className="w-full max-w-3xl">
                                {/* If it has thinking log, use ThinkingMessage component */}
                                {msg.thinkingLog && msg.thinkingLog.length > 0 ? (
                                    <ThinkingMessage
                                        log={msg.thinkingLog}
                                        isComplete={msg.isComplete || false}
                                    />
                                ) : (
                                    // Regular text message fallback
                                    <div className="prose prose-slate max-w-none">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Thinking Indicator (Simulated for UX if needed, but usually covered by ThinkingMessage) */}
                {isGenerating && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm p-4 animate-pulse">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span>Thinking...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto relative">
                    {/* Attached Files Preview */}
                    {attachedFiles.length > 0 && (
                        <div className="flex gap-2 mb-2 overflow-x-auto py-2">
                            {attachedFiles.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                    <button onClick={() => removeFile(i)} className="hover:text-red-500">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden flex flex-col">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe your dream website..."
                            className="w-full max-h-[200px] p-4 resize-none outline-none text-gray-800 placeholder:text-gray-400 bg-transparent"
                            rows={1}
                            disabled={isGenerating}
                        />

                        <div className="flex justify-between items-center p-2 bg-gray-50 border-t border-gray-100">
                            <div className="flex gap-2">
                                <label className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                    <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>

                            <div className="flex gap-2 items-center">
                                {inputValue.trim() || attachedFiles.length > 0 ? (
                                    <button
                                        onClick={handleSend}
                                        disabled={isGenerating}
                                        className="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? 'Building...' : 'Build It'}
                                        <Send className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <span className="text-xs text-gray-400 px-2">Press Enter to send</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400">
                            Powered by Neuro-Symbolic AI • Generates uniquely crafted code
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
