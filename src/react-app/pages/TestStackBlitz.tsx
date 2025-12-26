import { useState } from 'react';
import { SimpleWebsiteGenerator } from '../../services/simpleWebsiteGenerator';
import { BulletproofPreview } from '../components/BulletproofPreview';

export default function TestStackBlitz() {
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateTestWebsite = () => {
    setIsGenerating(true);
    
    try {
      console.log('🚀 Generating test website...');
      
      const files = SimpleWebsiteGenerator.generateSimpleWebsite(
        'Create a modern restaurant website for Bella Vista Italian Restaurant'
      );
      
      console.log('✅ Generated files:', files.length);
      console.log('📁 File list:', files.map(f => f.path));
      
      setGeneratedFiles(files);
      setShowPreview(true);
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            StackBlitz Preview Test
          </h1>
          <p className="text-gray-600">
            Test the StackBlitz preview functionality with a simple generated website.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <button
              onClick={generateTestWebsite}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-4"
            >
              {isGenerating ? 'Generating...' : 'Generate Test Website'}
            </button>
            
            {generatedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Generated {generatedFiles.length} files successfully!
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Generated Files:</h3>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {generatedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-blue-600">{file.path}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{file.language}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">StackBlitz Preview</h2>
            
            {showPreview && generatedFiles.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <BulletproofPreview
                  projectId="test-project"
                  projectName="Test Restaurant Website"
                  generatedFiles={generatedFiles.map(f => ({
                    path: f.path,
                    content: f.content
                  }))}
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">Generate a website to see the preview</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Debug Info */}
        {generatedFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">TypeScript Config:</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                  {generatedFiles.find(f => f.path === 'tsconfig.json')?.content || 'Not found'}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Package.json:</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                  {generatedFiles.find(f => f.path === 'package.json')?.content?.substring(0, 500) || 'Not found'}...
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}