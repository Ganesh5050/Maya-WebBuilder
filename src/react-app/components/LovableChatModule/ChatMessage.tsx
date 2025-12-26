import React from 'react';
import { ThinkingIndicator } from './ThinkingIndicator';
import { StreamingText, CursorSpinner } from './StreamingText';
import { FileEditList } from './FileEditList';
import { ChatMessage as ChatMessageType } from './types';
import { ChevronRight, Bookmark, ThumbsUp, ThumbsDown, Copy, MoreHorizontal, Code, CheckCircle2, Sparkles } from 'lucide-react';
import './styles.css';

interface ChatMessageProps {
    message: ChatMessageType;
    isLast: boolean;
}

const CompletionActionBar = () => (
    <div className="mt-6 animate-fade-in">
        {/* Main Preview Card */}
        <div className="flex items-start gap-4">
            <div className="flex-1 relative">
                <div className="bg-[#0f172a] hover:bg-[#1e293b] transition-all rounded-xl p-4 cursor-pointer border border-blue-900/30 group/card relative overflow-hidden shadow-sm">
                    {/* Left Accent Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>

                    <div className="flex items-center justify-between text-white mb-1 pl-2">
                        <span className="font-medium text-sm tracking-wide">Create photographer portfolio UI</span>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover/card:text-blue-400 transition-colors" />
                    </div>
                    <div className="text-blue-400 text-xs font-medium pl-2">Previewing latest version</div>
                </div>

                {/* Floating Code Info Badge */}
                <div
                    onClick={() => window.dispatchEvent(new CustomEvent('OPEN_CODE_TAB'))}
                    className="absolute -bottom-3 right-4 bg-[#1e293b] border border-gray-700 text-gray-300 text-[10px] flex items-center gap-1.5 px-3 py-1 rounded-full shadow-lg z-10 cursor-pointer hover:bg-gray-700 transition-colors"
                >
                    <Code className="w-3 h-3" />
                    <span>Code</span>
                </div>
            </div>

            {/* Bookmark Icon */}
            <button className="mt-3 text-gray-400 hover:text-gray-600 transition-colors">
                <Bookmark className="w-5 h-5" />
            </button>
        </div>

        {/* Bottom Action Row */}
        <div className="flex items-center gap-1 mt-4 ml-1">
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('OPEN_VARIATIONS_MENU'))}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mr-2"
            >
                <Sparkles className="w-3.5 h-3.5" />
                Variations
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <ThumbsDown className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <Copy className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
    const isUser = message.role === 'user';

    // Streaming status check logic
    const isStreaming = message.status === 'streaming' && isLast;

    if (isUser) {
        return (
            <div className="flex justify-end mb-6 user-message">
                <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start mb-8 w-full">
            <div className="max-w-[700px] w-full">
                {/* 1. THINKING BLOCK */}
                {message.thinking && (
                    <ThinkingIndicator
                        state={message.thinking}
                        isComplete={message.status !== 'thinking'}
                    />
                )}

                {/* 2. TEXT CONTENT (Only show if not thinking purely) */}
                {message.status !== 'thinking' && (
                    <div className="bg-white px-1 py-1 rounded-xl">
                        <StreamingText
                            content={message.content}
                            isStreaming={isStreaming}
                        />
                    </div>
                )}

                {/* 3. ASSETS & INTRO */}
                {(message.images?.length! > 0 || message.assetIntro) && (
                    <div className="mt-4">
                        {message.assetIntro && (
                            <div className="mb-3 px-1 text-gray-700 text-[15px] font-medium animate-fade-in">
                                <StreamingText content={message.assetIntro} isStreaming={isStreaming} />
                            </div>
                        )}
                        {message.images && message.images.length > 0 && (
                            <FileEditList
                                edits={[]}
                                images={message.images}
                                isComplete={message.status === 'complete'}
                            />
                        )}
                    </div>
                )}

                {/* 4. FILES & INTRO */}
                {(message.fileEdits?.length! > 0 || message.fileIntro) && (
                    <div className="mt-4">
                        {message.fileIntro && (
                            <div className="mb-3 px-1 text-gray-700 text-[15px] font-medium animate-fade-in">
                                <StreamingText content={message.fileIntro} isStreaming={isStreaming} />
                            </div>
                        )}
                        {message.fileEdits && message.fileEdits.length > 0 && (
                            <FileEditList
                                edits={message.fileEdits}
                                images={[]}
                                isComplete={message.status === 'complete'}
                            />
                        )}
                    </div>
                )}

                {/* 3.1 SUMMARY */}
                {message.summary && (
                    <div className="mt-4 flex items-start gap-3 animate-fade-in group px-1">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <div className="text-gray-600 text-[15px] leading-relaxed w-full">
                            <StreamingText
                                content={message.summary}
                                isStreaming={isStreaming}
                            />
                        </div>
                    </div>
                )}

                {/* 4. GLOBAL CURSOR (Streaming Only) */}
                {isStreaming && (
                    <div className="mt-4 px-1">
                        <CursorSpinner />
                    </div>
                )}

                {/* 5. COMPLETION ACTION BAR */}
                {message.status === 'complete' && <CompletionActionBar />}
            </div>
        </div>
    );
};
