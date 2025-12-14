import { useEffect, useState } from 'react';
import { AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { useWebContainer } from '../hooks/useWebContainer';

export interface ProjectFile {
  path: string;
  content: string;
}

interface WebContainerPreviewProps {
  projectId: string;
  generatedFiles: ProjectFile[];
  onReady?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function WebContainerPreview({
  projectId,
  generatedFiles,
  onReady,
  onError
}: WebContainerPreviewProps) {
  const { previewURL, isLoading, error, status, retry } = useWebContainer(projectId, generatedFiles);
  const [showError, setShowError] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

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
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">WebContainer Error</h3>
          </div>

          <p className="text-red-700 mb-6 text-sm">{error.message}</p>

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
          <p className="text-gray-600">Initializing WebContainer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <span className="text-sm text-gray-600">Live React Preview (WebContainer)</span>
        <div className="flex items-center gap-2">
          {!iframeLoaded && <span className="text-xs text-gray-500">Loading...</span>}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            title="Toggle debug info"
          >
            Debug
          </button>
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

      {/* Debug Panel */}
      {showDebug && (
        <div className="p-3 bg-yellow-50 border-b text-xs font-mono">
          <div>
            <strong>Project ID:</strong> {projectId}
          </div>
          <div>
            <strong>Preview URL:</strong> {previewURL || 'None'}
          </div>
          <div>
            <strong>Status:</strong> {status}
          </div>
          <div>
            <strong>Files:</strong> {generatedFiles.length}
          </div>
          <div>
            <strong>Iframe Loaded:</strong> {iframeLoaded ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Iframe Error:</strong> {iframeError ? 'Yes' : 'No'}
          </div>
        </div>
      )}

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
