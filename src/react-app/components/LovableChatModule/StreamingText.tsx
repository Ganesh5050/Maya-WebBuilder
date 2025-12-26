import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './styles.css';

interface StreamingTextProps {
    content: string;
    isStreaming: boolean;
}

export const CursorSpinner = () => {
    const frames = ["-", "\\", "|", "/"];
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setFrameIndex((prev) => (prev + 1) % frames.length);
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return <span className="inline-block ml-1 font-mono text-black font-bold">{frames[frameIndex]}</span>;
};

export const StreamingText: React.FC<StreamingTextProps> = ({ content, isStreaming }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const contentRef = useRef(content);

    // Reset when new message starts (empty content)
    useEffect(() => {
        if (content === '') {
            setDisplayedContent('');
            contentRef.current = '';
        }
    }, [content]);

    // Streaming Effect
    useEffect(() => {
        // If not streaming anymore, just show full content immediately to be safe
        if (!isStreaming) {
            setDisplayedContent(content);
            return;
        }

        // Determine how much new content to add
        // In a real stream, 'content' prop grows.
        // We want to animate the characters from `displayedContent.length` to `content.length`

        if (displayedContent.length >= content.length) return;

        // Safety: if content changed drastically (e.g. from 100 chars to 5 chars), reset
        if (!content.startsWith(displayedContent.substring(0, Math.min(content.length, displayedContent.length)))) {
            setDisplayedContent(content); // Fallback sync
            return;
        }

        const charsToAdd = 1; // 1 char at a time for smooth typewriting
        const nextCharIndex = displayedContent.length;
        const nextChar = content[nextCharIndex];

        const delay = nextChar === '\n' ? 30 :
            nextChar === '.' ? 50 :
                20;

        const timer = setTimeout(() => {
            setDisplayedContent(content.substring(0, nextCharIndex + charsToAdd));
        }, delay);

        return () => clearTimeout(timer);

    }, [content, displayedContent, isStreaming]);

    return (
        <div className="prose prose-slate max-w-none text-gray-800 leading-relaxed">
            <ReactMarkdown>{displayedContent}</ReactMarkdown>
        </div>
    );
};
