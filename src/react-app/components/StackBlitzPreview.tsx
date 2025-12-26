import { useEffect, useState, useRef } from 'react';
import { AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { StackBlitzService } from '../../services/stackblitzService';

export interface ProjectFile {
  path: string;
  content: string;
}

interface StackBlitzPreviewProps {
  projectId: string;
  projectName: string;
  generatedFiles: ProjectFile[];
  onReady?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function StackBlitzPreview({
  projectId,
  projectName,
  generatedFiles,
  onReady,
  onError
}: StackBlitzPreviewProps) {
  console.log('🎯 StackBlitzPreview component rendered:', {
    projectId,
    projectName,
    filesCount: generatedFiles.length
  });
  
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState('Initializing...');
  const [showError, setShowError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<StackBlitzService | null>(null);

  const initializeStackBlitz = async () => {
    console.log('🔍 initializeStackBlitz called with', generatedFiles.length, 'files');
    
    if (generatedFiles.length === 0) {
      console.log('⚠️ No files to process, skipping initialization');
      return;
    }

    // Wait for container to be available
    let retries = 0;
    while (!containerRef.current && retries < 10) {
      console.log(`⏳ Waiting for container... retry ${retries + 1}/10`);
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    if (!containerRef.current) {
      console.error('❌ Container ref still null after retries');
      setError(new Error('Container not available'));
      setShowError(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setStatus('Creating StackBlitz project...');
      console.log('🚀 Starting StackBlitz project creation...');

      // Create StackBlitz service
      serviceRef.current = new StackBlitzService((status) => {
        console.log('📊 StackBlitz status update:', status);
        setStatus(status.message);
        if (status.previewURL) {
          setPreviewURL(status.previewURL);
        }
        if (status.status === 'error') {
          setError(new Error(status.error || 'StackBlitz error'));
        }
      });

      console.log('📁 Files to be sent to StackBlitz:', generatedFiles.map(f => ({
        path: f.path,
        size: f.content.length
      })));

      const uniqueId = `stackblitz-container-${projectId}`;
      console.log('🔧 Creating StackBlitz container:', uniqueId);
      
      containerRef.current.innerHTML = `<div id="${uniqueId}" style="width: 100%; height: 100%;"></div>`;
      
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify container exists
      const container = document.getElementById(uniqueId);
      if (!container) {
        throw new Error(`Container element ${uniqueId} not found in DOM after creation`);
      }
      
      console.log('✅ StackBlitz container created successfully:', uniqueId);

      // Create project with unique container ID with timeout
      console.log('🎯 Calling StackBlitz createProject...');
      
      // First, let's try a simple test to see if StackBlitz SDK works at all
      let url: string;
      try {
        console.log('🧪 Testing StackBlitz SDK availability...');
        const testFiles = [
          {
            path: 'package.json',
            content: JSON.stringify({
              name: 'test-project',
              dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0',
                'react-scripts': '5.0.1'
              },
              scripts: {
                start: 'react-scripts start'
              }
            }, null, 2)
          },
          {
            path: 'public/index.html',
            content: `<!DOCTYPE html>
<html><head><title>Test</title></head><body><div id="root"></div></body></html>`
          },
          {
            path: 'src/index.js',
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
          },
          {
            path: 'src/App.js',
            content: `import React from 'react';
export default function App() {
  return <div><h1>Hello StackBlitz!</h1></div>;
}`
          }
        ];
        
        console.log('🧪 Using test files instead of generated files for debugging');
        const createProjectPromise = serviceRef.current.createProject(projectName, testFiles, uniqueId);
        const timeoutPromise = new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('StackBlitz initialization timeout (30s)')), 30000)
        );
        
        url = await Promise.race([createProjectPromise, timeoutPromise]);
        console.log('✅ Test project created successfully!');
        
      } catch (testError) {
        console.error('❌ Test project failed, trying with original files:', testError);
        // Fallback to original files
        const createProjectPromise = serviceRef.current.createProject(projectName, generatedFiles, uniqueId);
        const timeoutPromise = new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('StackBlitz initialization timeout (30s)')), 30000)
        );
        
        url = await Promise.race([createProjectPromise, timeoutPromise]);
      }
      
      console.log('✅ StackBlitz project created successfully:', url);
      setPreviewURL(url);
      setIsLoading(false);
      onReady?.(url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ StackBlitz initialization failed:', error);
      setError(error);
      setShowError(true);
      setIsLoading(false);
      onError?.(error);
    }
  };

  useEffect(() => {
    console.log('🔍 StackBlitzPreview useEffect triggered:', {
      projectId,
      filesCount: generatedFiles.length,
      containerExists: !!containerRef.current
    });
    
    // Wait for the component to fully mount and containerRef to be available
    const timer = setTimeout(() => {
      console.log('🔍 StackBlitzPreview timer callback:', {
        containerExists: !!containerRef.current,
        filesCount: generatedFiles.length
      });
      
      if (containerRef.current && generatedFiles.length > 0) {
        console.log('🚀 Starting StackBlitz initialization...');
        initializeStackBlitz();
      } else {
        console.log('⚠️ StackBlitz initialization skipped:', {
          containerExists: !!containerRef.current,
          filesCount: generatedFiles.length
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup on unmount
      if (serviceRef.current) {
        serviceRef.current.cleanup();
      }
    };
  }, [projectId, generatedFiles.length]);

  const retry = () => {
    setShowError(false);
    setError(null);
    initializeStackBlitz();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">Setting up your React project</p>
            <p className="text-sm text-gray-600 mt-2">{status}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && showError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">StackBlitz Error</h3>
          </div>

          <p className="text-red-700 mb-6 text-sm">{error.message}</p>

          <div className="flex gap-2">
            <button
              onClick={retry}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <span className="text-sm text-gray-600">Live React Preview (StackBlitz)</span>
        <div className="flex items-center gap-2">
          {previewURL && (
            <a
              href={previewURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Open in New Tab ↗
            </a>
          )}
        </div>
      </div>

      {/* StackBlitz Embed Container */}
      <div ref={containerRef} className="w-full h-full">
        {!previewURL && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Loading StackBlitz...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}