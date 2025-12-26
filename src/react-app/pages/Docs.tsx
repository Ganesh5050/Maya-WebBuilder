import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Book, Code, Rocket, Download, MessageSquare,
    Terminal, Monitor, ArrowRight, Menu, X, Home
} from 'lucide-react';

const sections = [
    {
        id: 'intro',
        title: 'Introduction',
        icon: <Book className="w-5 h-5" />,
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Mocha Docs</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Mocha is an advanced AI website builder that helps you create full-stack React applications just by chatting.
                    Whether you need a landing page, a dashboard, or a complex SaaS application, Mocha writes the code, handles the styling, and sets up the project structure for you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Natural Language
                        </h3>
                        <p className="text-sm text-blue-700">Just describe what you want in plain English. No technical jargon required.</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                        <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4" /> Full Source Code
                        </h3>
                        <p className="text-sm text-purple-700">You own the code. Download it, modify it, or deploy it directly to Vercel.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: <Rocket className="w-5 h-5" />,
        content: (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">How to Build Your First App</h2>

                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Start a New Project</h3>
                            <p className="text-gray-600">Click "New App" on the dashboard. You'll be taken to the chat interface.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">2</div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Describe Your Vision</h3>
                            <p className="text-gray-600">Type a prompt like: <em>"Create a modern landing page for a coffee shop with a hero section, menu grid, and contact form."</em></p>
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono text-gray-700">
                                💡 Tip: Be specific about colors, style (e.g., "minimalist", "dark mode"), and specific sections you need.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">3</div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Iterate with AI</h3>
                            <p className="text-gray-600">The AI will generate the initial version. You can then ask for changes: <em>"Make the buttons blue,"</em> or <em>"Add a testimonials section."</em></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'deployment',
        title: 'Deployment',
        icon: <Monitor className="w-5 h-5" />,
        content: (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Publishing to the Web</h2>
                <p className="text-gray-600">Mocha integrates directly with Vercel for instant deployments.</p>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Prerequisites</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>A Vercel account (free or pro)</li>
                            <li>A Vercel API Token (Get it from Vercel Dashboard {'>'} Settings {'>'} Tokens)</li>
                        </ul>
                    </div>
                    <div className="p-6 bg-gray-50">
                        <h3 className="font-semibold text-gray-900 mb-2">Steps to Deploy</h3>
                        <ol className="list-decimal list-inside space-y-3 text-gray-600">
                            <li>Go to <strong>Settings {'>'} Secrets</strong> in the builder.</li>
                            <li>Enter your <strong>Vercel API Token</strong>.</li>
                            <li>Click the <strong>Publish</strong> button in the top right header.</li>
                            <li>Wait for the build to complete (usually ~60 seconds).</li>
                            <li>Get your live URL!</li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'export',
        title: 'Exporting Code',
        icon: <Download className="w-5 h-5" />,
        content: (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Downloading Your Project</h2>
                <p className="text-gray-600">
                    We believe in no vendor lock-in. You can download the complete source code of your project at any time.
                </p>

                <div className="p-6 bg-gray-900 text-white rounded-xl">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5" /> Local Development
                    </h3>
                    <p className="text-gray-300 mb-4">The downloaded ZIP contains a standard Vite + React project.</p>

                    <div className="font-mono text-sm bg-black/50 p-4 rounded-lg space-y-2 border border-white/10">
                        <div className="flex gap-2">
                            <span className="text-green-400">$</span>
                            <span>npm install</span>
                            <span className="text-gray-500"># Install dependencies</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-green-400">$</span>
                            <span>npm run dev</span>
                            <span className="text-gray-500"># Start local server</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('intro');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const activeContent = sections.find(s => s.id === activeSection)?.content;

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden h-16 border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur z-20">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 font-bold text-gray-900">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                        <Book className="w-4 h-4" />
                    </div>
                    Mocha Docs
                </button>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-full flex flex-col p-4">
                    <div className="hidden md:flex items-center gap-2 font-bold text-gray-900 mb-8 px-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                            <Book className="w-4 h-4" />
                        </div>
                        Mocha Docs
                    </div>

                    <nav className="space-y-1 flex-1">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 mb-4"
                        >
                            <Home className="w-4 h-4" />
                            Back to Home
                        </button>

                        <div className="pt-4 border-t border-gray-200 mb-2">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Guide</p>
                        </div>

                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    setActiveSection(section.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <div className={`${activeSection === section.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {section.icon}
                                </div>
                                {section.title}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs font-medium text-blue-800 mb-2">Need help?</p>
                        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            Join Discord <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 px-4 py-8 md:px-12 md:py-12 lg:px-16 max-w-4xl mx-auto w-full">
                <div className="animate-fade-in">
                    {activeContent}
                </div>
            </main>
        </div>
    );
}
