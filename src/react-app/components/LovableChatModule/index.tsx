import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType, FileEdit, ImageGen } from './types';
import './styles.css';

interface LovableChatModuleProps {
    initialMessages?: ChatMessageType[];
    onSendMessage: (text: string) => Promise<void>;
    isGenerating: boolean;
    hideInput?: boolean;
}

export const LovableChatModule: React.FC<LovableChatModuleProps> = ({
    initialMessages = [],
    onSendMessage,
    isGenerating,
    hideInput = false
}) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [initialMessages]);

    // Handle Resize
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [inputValue]);

    const handleSend = () => {
        if (!inputValue.trim() || isGenerating) return;
        onSendMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans text-slate-900">
            {/* Messages */}
            <div className={`flex-1 overflow-y-auto px-4 py-6 ${hideInput ? 'pb-4' : 'pb-32'}`}>
                <div className="max-w-3xl mx-auto">
                    {initialMessages.length === 0 && (
                        <div className="text-center mt-20 opacity-50">
                            <h2 className="text-xl font-semibold mb-2">What are we building today?</h2>
                            <p>Ask for any website, app, or component.</p>
                        </div>
                    )}

                    {initialMessages.map((msg, idx) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            isLast={idx === initialMessages.length - 1}
                        />
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {!hideInput && (
                <div className="border-t border-slate-100 bg-white/80 backdrop-blur pb-6 pt-4 px-4 sticky bottom-0">
                    <div className="max-w-3xl mx-auto relative bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isGenerating}
                            placeholder="Describe your app..."
                            rows={1}
                            className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[56px] resize-none text-base disabled:opacity-50"
                        />

                        <div className="flex justify-between items-center px-2 pb-2">
                            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 hidden sm:inline-block mr-2">
                                    {isGenerating ? 'Building...' : 'cmd+enter to send'}
                                </span>
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isGenerating}
                                    className={`p-2 rounded-lg transition-all transform ${inputValue.trim() && !isGenerating ? 'bg-black text-white hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
