import { useState } from 'react';
import { LovableChatModule } from '../components/LovableChatModule';
import { ChatMessage, ThinkingState, FileEdit } from '../components/LovableChatModule/types';
import { enhancedWebsiteGenerator } from '../../services/enhancedWebsiteGenerator';

export function TestUniqueGeneration() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      status: 'complete'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    // 2. Initialize Assistant Message (Thinking State)
    const assistantId = crypto.randomUUID();
    const initialThinking: ThinkingState = {
      isActive: true,
      duration: 0,
      content: []
    };

    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      thinking: initialThinking,
      status: 'thinking',
      timestamp: Date.now()
    }]);

    // Timer for "Thought for Xs"
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id !== assistantId || !msg.thinking?.isActive) return msg;
        return {
          ...msg,
          thinking: {
            ...msg.thinking,
            duration: Math.floor((Date.now() - startTime) / 1000)
          }
        };
      }));
    }, 1000);

    try {
      // 3. Call the Enhanced Generator
      let summaryLength = 0;
      await enhancedWebsiteGenerator.generateUniqueWebsite(text, (step) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id !== assistantId) return msg;

          // 1. Handle Thinking Steps
          if (step.type === 'thought' || step.type === 'plan') {
            const currentContent = msg.thinking?.content || [];
            return {
              ...msg,
              thinking: {
                ...(msg.thinking || { isActive: true, duration: 0, content: [] }),
                content: [...currentContent, step.message]
              }
            };
          }

          // 2. Handle Text Streaming
          if (step.type === 'text') {
            const wasThinking = msg.status === 'thinking';
            return {
              ...msg,
              status: wasThinking ? 'streaming' : msg.status,
              content: (msg.content || '') + '\n' + step.message,
              thinking: wasThinking && msg.thinking ? { ...msg.thinking, isActive: false } : msg.thinking
            };
          }

          if (step.type === 'asset_intro') {
            return {
              ...msg,
              status: 'streaming',
              assetIntro: step.message
            };
          }

          if (step.type === 'file_intro') {
            return {
              ...msg,
              status: 'streaming',
              fileIntro: step.message
            };
          }

          // 3. Handle Images
          if (step.type === 'image') {
            const wasThinking = msg.status === 'thinking';
            const img = {
              url: step.data?.url || '',
              description: step.message || 'Generated Image',
              timestamp: Date.now()
            };
            return {
              ...msg,
              status: wasThinking ? 'streaming' : msg.status,
              thinking: wasThinking && msg.thinking ? { ...msg.thinking, isActive: false } : msg.thinking,
              images: [...(msg.images || []), img]
            };
          }

          // 4. Handle Files
          if (step.type === 'file') {
            const wasThinking = msg.status === 'thinking';
            const edit: FileEdit = {
              fileName: (step.data?.filename || 'unknown.tsx').split('/').pop() || 'unknown.tsx',
              action: 'created',
              timestamp: Date.now()
            };
            return {
              ...msg,
              status: 'streaming', // Force streaming to keep cursor
              thinking: wasThinking && msg.thinking ? { ...msg.thinking, isActive: false } : msg.thinking,
              fileEdits: [...(msg.fileEdits || []), edit]
            };
          }

          // New: Handle Summary
          // @ts-ignore
          if (step.type === 'summary') {
            summaryLength = step.message.length;
            return {
              ...msg,
              status: 'streaming', // Keep streaming while showing summary
              summary: step.message
            };
          }

          // 5. Handle Completion
          if (step.type === 'complete') {
            const delay = Math.max(1500, 1000 + (summaryLength * 30)); // Delay based on typing speed
            setTimeout(() => {
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? {
                  ...m,
                  status: 'complete',
                  thinking: m.thinking ? { ...m.thinking, isActive: false } : undefined
                } : m
              ));
            }, delay);
            return msg;
          }

          return msg;
        }));
      });

    } catch (error) {
      console.error("Generation Error:", error);
      setMessages(prev => prev.map(msg =>
        msg.id === assistantId ? { ...msg, content: `Error: ${error}`, status: 'error' } : msg
      ));
    } finally {
      setIsGenerating(false);
      clearInterval(timerInterval);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold">L</div>
          <h1 className="font-semibold text-lg">Lovable Builder</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">v2.0 Nuclear</span>
          <button className="bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium">Publish</button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <LovableChatModule
          initialMessages={messages}
          isGenerating={isGenerating}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default TestUniqueGeneration;