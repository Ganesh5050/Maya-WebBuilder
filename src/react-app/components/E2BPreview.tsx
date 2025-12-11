import { useEffect, useState } from 'react';
import { AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { useE2B } from '../hooks/useE2B';

export interface ProjectFile {
  path: string;
  content: string;
}

interface E2BPreviewProps {
  projectId: string;
  generatedFiles: ProjectFile[];
  onReady?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function E2BPreview({
  projectId,
  generatedFiles,
  onReady,
  onError
}: E2BPreviewProps) {
  const { previewURL, isLoading, error, status, retry } = useE2B(projectId, generatedFiles);
  const [showError, setShowError] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (previewURL) {
      onReady?.(previewURL);
      setIframeError(false);
      setIframeLoaded(false);
    }
  }, [previewURL, onReady]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      onError?.(error);
    }
  }, [error, onError]);

  // Check if we're running on localhost (development)
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Handle iframe load timeout
  useEffect(() => {
    if (previewURL && !iframeLoaded) {
      const timeout = setTimeout(() => {
        if (!iframeLoaded) {
          console.warn('⚠️ Iframe failed to load within 10 seconds');
          setIframeError(true);
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [previewURL, iframeLoaded]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">Setting up your environment</p>
            <p className="text-sm text-gray-600 mt-2">{status}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && showError) {
    const isLimitError = error.message.includes('maximum number of concurrent E2B sandboxes');
    const isNetworkError = error.message.includes('network error') || error.message.includes('QUIC_PROTOCOL_ERROR');
    
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">
              {isLimitError ? 'Sandbox Limit Reached' : 'Preview Error'}
            </h3>
          </div>
          
          {isLimitError ? (
            <div className="text-red-700 mb-6 text-sm">
              <p className="mb-3">You've reached the maximum number of concurrent E2B sandboxes (20).</p>
              <p className="mb-3">This happens when old sandboxes aren't cleaned up properly.</p>
              <p className="font-medium">Solutions:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Wait 5-10 minutes for auto-cleanup</li>
                <li>Deploy to production (Vercel) to avoid this limit</li>
                <li>Refresh the page to force cleanup</li>
              </ul>
            </div>
          ) : isNetworkError ? (
            <div className="text-red-700 mb-6 text-sm">
              <p className="mb-3">Network connection error with E2B servers.</p>
              <p className="font-medium">This usually resolves by:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Waiting a moment and retrying</li>
                <li>Checking your internet connection</li>
                <li>Deploying to production for better stability</li>
              </ul>
            </div>
          ) : (
            <p className="text-red-700 mb-6 text-sm">{error.message}</p>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowError(false);
                retry();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            
            {isLocalhost && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh Page
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!previewURL) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Initializing preview...</p>
        </div>
      </div>
    );
  }

  // Show iframe blocking message for localhost
  if (iframeError && isLocalhost) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Preview Blocked</h3>
          </div>
          
          <div className="text-yellow-800 mb-6 text-sm">
            <p className="mb-3">The live preview is blocked due to iframe security restrictions between localhost and E2B domains.</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="font-medium mb-2">🚀 Solution: Deploy to Production</p>
              <p className="text-sm">Deploy your app to Vercel to resolve this issue and get full live preview functionality.</p>
            </div>
            
            <p className="font-medium mb-2">Alternative options:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Open preview in new tab (link below)</li>
              <li>Use the Code tab to view generated files</li>
              <li>Download the project and run locally</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <a
              href={previewURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open in New Tab ↗
            </a>
            <button
              onClick={() => {
                setIframeError(false);
                setIframeLoaded(false);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
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
        <span className="text-sm text-gray-600">
          Live React Preview {isLocalhost && '(localhost)'}
        </span>
        <div className="flex items-center gap-2">
          {!iframeLoaded && (
            <span className="text-xs text-gray-500">Loading...</span>
          )}
          <a 
            href={previewURL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Open in New Tab ↗
          </a>
        </div>
      </div>
      
      {/* Preview iframe */}
      <iframe
        key={previewURL}
        src={previewURL}
        className="w-full h-full border-0"
        title="React Preview"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation"
        style={{
          backgroundColor: '#ffffff'
        }}
        onLoad={() => {
          console.log('✅ Iframe loaded successfully');
          setIframeLoaded(true);
          setIframeError(false);
        }}
        onError={(e) => {
          console.error('❌ Iframe error:', e);
          setIframeError(true);
        }}
      />
      
      {/* Loading overlay */}
      {!iframeLoaded && !iframeError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )}
    </div>
  );
}
