import { useState } from 'react';
import { SimpleWebsiteGenerator } from '../../services/simpleWebsiteGenerator';
import { reactProjectGenerator } from '../../services/reactGenerator';

export default function TestGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testSimpleGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setLogs([]);
    
    try {
      addLog('🚀 Starting simple website generation...');
      
      const files = SimpleWebsiteGenerator.generateSimpleWebsite('Create a modern restaurant website for Bella Vista Italian Restaurant');
      
      addLog(`✅ Generated ${files.length} files successfully!`);
      setGeneratedFiles(files);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`❌ Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const testFullGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setLogs([]);
    
    try {
      addLog('🚀 Starting full React project generation...');
      
      const project = await reactProjectGenerator.generateReactProject(
        'Create a modern restaurant website for Bella Vista Italian Restaurant',
        (step) => {
          addLog(`📊 ${step.type}: ${step.message} (${step.progress}%)`);
        }
      );
      
      addLog(`✅ Generated ${project.files.length} files successfully!`);
      setGeneratedFiles(project.files);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`❌ Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Website Generation Test
          </h1>
          <p className="text-gray-600">
            Test the website generation functionality to debug preview issues.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={testSimpleGeneration}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Test Simple Generation'}
              </button>
              
              <button
                onClick={testFullGeneration}
                disabled={isGenerating}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Test Full Generation'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}
            
            {/* Generation Logs */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Generation Logs:</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No logs yet...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Files</h2>
            
            {generatedFiles.length === 0 ? (
              <p className="text-gray-500">No files generated yet...</p>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Successfully generated {generatedFiles.length} files!
                  </p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {generatedFiles.map((file, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-blue-600">{file.path}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{file.language}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                        {file.content.substring(0, 200)}
                        {file.content.length > 200 && '...'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}