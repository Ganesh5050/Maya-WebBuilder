import React, { useState } from 'react';
import { AdvancedReactGenerator } from '../../services/advancedReactGenerator';

interface GeneratedProject {
  prompt: string;
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  preview?: string;
}

export function LiveGenerationDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const testPrompts = [
    "Build a website for my athletic shoe store",
    "Create a luxury leather shoe brand website", 
    "Build a fine dining restaurant website",
    "Create a SaaS platform website"
  ];

  const generateWebsite = async (prompt: string) => {
    setIsGenerating(true);
    setSelectedPrompt(prompt);
    
    try {
      console.log('🚀 Generating website for:', prompt);
      
      // Generate the actual project files
      const files = await AdvancedReactGenerator.generateAdvancedProject(prompt);
      
      console.log('✅ Generated', files.length, 'files');
      
      // Find the main App component for preview
      const appFile = files.find(f => f.path === 'src/App.tsx');
      const preview = appFile ? appFile.content.substring(0, 500) + '...' : 'No preview available';
      
      const newProject: GeneratedProject = {
        prompt,
        files,
        preview
      };
      
      setGeneratedProjects(prev => [newProject, ...prev]);
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
    } finally {
      setIsGenerating(false);
      setSelectedPrompt('');
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Live Website Generation Demo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Watch our Industry Intelligence System generate UNIQUE websites in real-time
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 The Problem We Solved:
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">❌ BEFORE (Your Problem)</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Every website: Same pink template (#FF6B9D)</li>
                  <li>• Shoe store = Restaurant = Portfolio</li>
                  <li>• Generic "Product 1, Product 2" content</li>
                  <li>• Same fonts, spacing, components</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">✅ AFTER (Our Solution)</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Athletic shoes: Nike-style orange + black</li>
                  <li>• Luxury shoes: Gucci-style green + gold</li>
                  <li>• Restaurant: Warm browns + elegant fonts</li>
                  <li>• Each industry gets unique design!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {testPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => generateWebsite(prompt)}
              disabled={isGenerating}
              className={`p-4 rounded-lg font-semibold transition-all duration-200 ${
                selectedPrompt === prompt
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {selectedPrompt === prompt && isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </div>
              ) : (
                <div className="text-sm">
                  🎨 Generate<br/>
                  <span className="font-normal">{prompt.split(' ').slice(0, 4).join(' ')}...</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {generatedProjects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              🎯 Generated Projects (Each One is Unique!)
            </h2>
            
            {generatedProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    "{project.prompt}"
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      ✅ {project.files.length} files generated
                    </span>
                    <span>Generated at {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">📁 Generated Files</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="space-y-1 text-sm font-mono">
                        {project.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center gap-2">
                            <span className="text-blue-600">
                              {file.language === 'typescript' ? '📘' : 
                               file.language === 'css' ? '🎨' : 
                               file.language === 'json' ? '⚙️' : 
                               file.language === 'html' ? '🌐' : '📄'}
                            </span>
                            <span className="text-gray-700">{file.path}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">👀 Code Preview</h4>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {project.preview}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      🎨 This project has unique colors, layouts, and components based on industry analysis
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      View Full Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {generatedProjects.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ready to See the Magic?
            </h3>
            <p className="text-gray-600">
              Click any button above to generate a unique website for that industry!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}