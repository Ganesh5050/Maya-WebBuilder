import React from 'react';
import { Sparkles, ShoppingBag, Briefcase, LayoutTemplate, Coffee, Zap, Camera, PenTool } from 'lucide-react';

interface PromptSuggestionsProps {
    onSelect: (prompt: string) => void;
}

const SUGGESTIONS = [
    { icon: ShoppingBag, label: 'E-Commerce', prompt: 'Create a modern minimalist e-commerce store for handmade jewelry with a product gallery and cart.' },
    { icon: Briefcase, label: 'Portfolio', prompt: 'Build a sleek dark-themed portfolio for a creative director with a masonry project grid.' },
    { icon: PenTool, label: 'Blog', prompt: 'Design a clean, typography-focused personal blog with categories and a newsletter signup.' },
    { icon: LayoutTemplate, label: 'SaaS Landing', prompt: 'Create a high-converting landing page for an AI productivity tool with pricing tables.' },
    { icon: Coffee, label: 'Restaurant', prompt: 'Build a cozy, rustic website for an artisan coffee shop with a menu and reservation form.' }
];

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
    return (
        <div className="absolute bottom-4 left-0 right-0 px-6 pb-2 pointer-events-none z-10 animate-fade-in">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center pointer-events-auto">
                {SUGGESTIONS.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(s.prompt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md 
                       border border-gray-200/50 rounded-full shadow-sm hover:shadow-md
                       hover:-translate-y-0.5 hover:bg-white transition-all duration-200
                       text-xs font-medium text-gray-600 hover:text-gray-900 group"
                    >
                        <s.icon className="w-3.5 h-3.5 text-purple-500 group-hover:text-purple-600" />
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
