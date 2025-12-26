import React, { useState } from 'react';
import { X, Search, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { projectTemplates, ProjectTemplate } from '../data/projectTemplates';

interface TemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (template: ProjectTemplate) => void;
}

export function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    if (!isOpen) return null;

    const categories = [
        { id: 'all', name: 'All Templates', icon: '✨' },
        { id: 'landing', name: 'Landing Pages', icon: '🚀' },
        { id: 'saas', name: 'SaaS & Dashboards', icon: '📊' },
        { id: 'ecommerce', name: 'E-Commerce', icon: '🛒' },
        { id: 'portfolio', name: 'Portfolio', icon: '🎨' },
        { id: 'blog', name: 'Blog & Content', icon: '📝' }
    ];

    const filteredTemplates = projectTemplates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const difficultyColors = {
        beginner: 'bg-green-100 text-green-700 border-green-200',
        intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        advanced: 'bg-red-100 text-red-700 border-red-200'
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-blue-600" />
                                Project Templates
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">Start with a professional template and customize it to your needs</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/50 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
                    <div className="flex gap-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                            <p className="text-gray-500">Try adjusting your search or category filter</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer"
                                    onClick={() => {
                                        onSelectTemplate(template);
                                        onClose();
                                    }}
                                >
                                    {/* Icon & Difficulty */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="text-4xl">{template.icon}</div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${difficultyColors[template.difficulty]}`}>
                                            {template.difficulty}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {template.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {template.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">Click to use</span>
                                        <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Zap className="w-4 h-4" />
                                            Start building
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Start from scratch instead
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
