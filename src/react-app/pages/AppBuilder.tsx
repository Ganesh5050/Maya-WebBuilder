import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ChevronUp, ChevronDown, Star, MoreHorizontal, 
  ArrowLeft, Home, RefreshCw, MousePointer2, 
  Monitor, Smartphone, Maximize2, Plus, 
  MessageCircle, Lock, ThumbsUp, ThumbsDown, Undo2,
  PanelLeftClose, X, ArrowUp, Download, Copy, Terminal as TerminalIcon, RotateCcw, Trash2,
  Pencil, ExternalLink, Play
} from 'lucide-react';
// import { generateSmartWebsite } from '../../services/websiteBuilder';
import { databaseService } from '../../services/databaseService';
import { useAuth } from '../../contexts/AuthContext';
import DataTabContent from '../components/DataTabContent';
import SettingsTabContent from '../components/SettingsTabContent';
// import { realWebsiteGenerator } from '../../services/websiteGenerator';
import { reactProjectGenerator } from '../../services/reactGenerator';
import { vercelDeploymentService } from '../../services/deploymentService';
import JSZip from 'jszip';
import { WebContainerPreview } from '../components/WebContainerPreview';
import { Terminal } from '../components/Terminal';
import { useTerminal } from '../hooks/useTerminal';
import { getWebContainerManager } from '../../services/webcontainerManager';
import { FileExplorer } from '../components/FileExplorer';
import { CodeEditor } from '../components/CodeEditor';
import { useFileManager } from '../hooks/useFileManager';

export default function AppBuilder() {
  const { appId } = useParams<{ appId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Build' | 'Code' | 'Terminal' | 'Data' | 'Settings'>('Build');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isDiscussMode, setIsDiscussMode] = useState(false);
  const [publishStatus] = useState<'Published' | 'Unpublished'>('Published');
  const [publishVisibility] = useState<'Public' | 'Private'>('Public');
  const [sidebarWidth, setSidebarWidth] = useState(480);
  const [isResizing, setIsResizing] = useState(false);
  const [showLogsPanel, setShowLogsPanel] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('/');
  const [publishUrl, setPublishUrl] = useState('jm36jsglgw76e');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [logs] = useState([
    { timestamp: '2025-12-04T13:00:02.0072', source: 'mocha', message: 'Starting sandbox...' }
  ]);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedWebsite, setGeneratedWebsite] = useState<string>('');
  const [appName, setAppName] = useState('My App');
  
  // Use these variables to avoid TypeScript warnings (only log once)
  // console.log('Stats:', { changesCount, filesCount, buildTime });
  const [creditsRemaining, setCreditsRemaining] = useState(35);
  const [attachedFiles, setAttachedFiles] = useState<Array<{name: string, size: number, type: string, url?: string}>>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  // All websites now generate as React projects with live preview
  const [websiteHistory, setWebsiteHistory] = useState<Array<{id: string, prompt: string, created_at: string, html: string}>>([]);
  const [lastError, setLastError] = useState<{message: string, prompt: string} | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Array<{path: string, content: string, language: string}>>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'thinking' | 'generating' | 'complete' | 'error'>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Terminal integration
  const terminal = useTerminal();
  const terminalRef = useRef<any>(null);
  
  // File manager integration
  const fileManager = useFileManager();

  // Set up terminal data handling
  useEffect(() => {
    terminal.onData((data) => {
      // Write data from terminal to XTerm
      terminalRef.current?.writeToTerminal(data);
    });

    terminal.onExit((code) => {
      console.log(`🔚 Terminal exited with code: ${code}`);
      terminalRef.current?.writeToTerminal(`\r\n\x1b[1;31m[Process exited with code ${code}]\x1b[0m\r\n`);
    });
  }, [terminal]);

  // Connect terminal and file manager when WebContainer is ready
  useEffect(() => {
    const connectServices = async () => {
      if (generatedWebsite === 'REACT_PROJECT_WEBCONTAINER_PREVIEW' && projectFiles.length > 0) {
        try {
          console.log('🔌 Attempting to connect services to WebContainer...');
          const containerManager = getWebContainerManager();
          
          // Wait a bit for the container to be fully ready
          setTimeout(async () => {
            try {
              const container = await containerManager.getContainer(appId || 'default');
              
              if (container) {
                console.log('✅ Found WebContainer, connecting services...');
                
                // Connect terminal
                if (!terminal.isConnected && !terminal.isConnecting) {
                  const webContainer = container.service.getContainer();
                  if (webContainer) {
                    await terminal.connect(webContainer, {
                      cols: 80,
                      rows: 24,
                      cwd: '/home/user'
                    });
                    console.log('🎉 Terminal connected successfully!');
                  }
                }
                
                // Connect file manager
                if (!fileManager.isConnected && !fileManager.isConnecting) {
                  await fileManager.connect(appId || 'default');
                  console.log('🎉 File manager connected successfully!');
                }
              } else {
                console.log('⏳ WebContainer not ready yet, will retry...');
              }
            } catch (error) {
              console.error('❌ Failed to connect services:', error);
            }
          }, 5000); // Wait 5 seconds for container to be ready
        } catch (error) {
          console.error('❌ Failed to get container manager:', error);
        }
      }
    };

    connectServices();
  }, [generatedWebsite, projectFiles, appId, terminal, fileManager]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load app data and chat history on mount
  useEffect(() => {
    const loadAppData = async () => {
      if (!appId || !user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('🔄 Loading app data for appId:', appId);
        
        // Try to load app details (skip if database tables don't exist)
        let app = null;
        try {
          app = await databaseService.getApp(appId, user.id);
        } catch (dbError) {
          console.log('⚠️ Database not available, using default app data');
          // Create default app data
          app = {
            id: appId,
            name: 'My Website',
            url: appId,
            description: '',
            user_id: user.id
          };
        }
        if (app) {
          console.log('✅ App loaded:', app.name);
          setAppName(app.name);
          setPublishUrl(app.url);
          
          // Check if this is a new app with description (initial prompt)
          if (app.description && !app.description.startsWith('http')) {
            // This is the initial prompt from CreateApp page
            let hasGenerations = [];
            try {
              hasGenerations = await databaseService.getWebsiteGenerations(appId, user.id);
            } catch (dbError) {
              console.log('⚠️ Website generations not available');
              hasGenerations = [];
            }
            if (hasGenerations.length === 0) {
              // No generations yet, auto-generate from description
              console.log('🚀 Auto-generating from initial prompt:', app.description);
              setCurrentMessage(app.description);
              // Trigger generation after component mounts
              setTimeout(() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                  textarea.dispatchEvent(event);
                }
              }, 500);
            }
          }
        }

        // Try to load chat history for this app
        let chatHistory: any[] = [];
        try {
          chatHistory = await databaseService.getAppChatMessages(appId, user.id);
        } catch (dbError) {
          console.log('⚠️ Chat history not available, starting fresh');
          chatHistory = [];
        }
        console.log('📜 Chat history loaded:', chatHistory.length, 'messages');
        
        const formattedMessages: Array<{role: 'user' | 'assistant', content: string}> = [];
        
        chatHistory.forEach((msg: any) => {
          formattedMessages.push({
            role: 'user',
            content: msg.message_text
          });
          
          if (msg.ai_response) {
            formattedMessages.push({
              role: 'assistant',
              content: typeof msg.ai_response === 'string' ? msg.ai_response : 'Website generated successfully.'
            });
          }
        });
        
        setMessages(formattedMessages);

        // Load latest generated website
        console.log('🔍 Attempting to load latest generation...');
        const latestGeneration = await databaseService.getLatestWebsiteGeneration(appId, user.id);
        console.log('📊 Latest generation result:', latestGeneration ? 'Found' : 'Not found');
        
        if (latestGeneration) {
          console.log('📦 Generation data:', {
            hasHtml: !!latestGeneration.html,
            htmlLength: latestGeneration.html?.length || 0,
            prompt: latestGeneration.prompt?.substring(0, 50) || 'No prompt',
            createdAt: latestGeneration.created_at
          });
          
          if (latestGeneration.html && latestGeneration.html.length > 0) {
            console.log('✅ Setting generated website, length:', latestGeneration.html.length);
            
            // Check if this is a React project placeholder
            if (latestGeneration.html.includes('React Project Generated')) {
              console.log('🎯 Detected React project, setting E2B preview mode');
              setGeneratedWebsite('REACT_PROJECT_E2B_PREVIEW');
              
              // Create dummy project files for now (since we don't store them in DB yet)
              const dummyFiles = [
                { path: 'package.json', content: '{"name": "react-app", "dependencies": {"react": "^18.0.0"}}', language: 'json' },
                { path: 'src/App.tsx', content: 'export default function App() { return <div>Loading...</div>; }', language: 'typescript' },
                { path: 'src/main.tsx', content: 'import React from "react"; import ReactDOM from "react-dom/client";', language: 'typescript' }
              ];
              setProjectFiles(dummyFiles);
              console.log('📁 Set dummy project files for preview');
            } else {
              setGeneratedWebsite(latestGeneration.html);
            }
          } else {
            console.log('⚠️ Generation found but HTML is empty');
          }
        } else {
          console.log('⚠️ No website generation found in database');
        }

        // Update last accessed
        await databaseService.updateLastAccessed(appId, user.id);
      } catch (error) {
        console.error('❌ Error loading app data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, [appId, user]);

  // Navigation button handlers
  const handleHomeClick = () => {
    setCurrentRoute('/');
  };

  const handleReloadClick = () => {
    // Reload preview
  };

  // Handle file attachment (max 3 images)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check current file count
    if (attachedFiles.length >= 3) {
      alert('⚠️ Maximum 3 files allowed. Please remove some files first.');
      e.target.value = '';
      return;
    }

    // Filter only image files
    const imageFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        console.warn(`⚠️ Skipping non-image file: ${file.name}`);
      }
      return isImage;
    });

    if (imageFiles.length === 0) {
      alert('⚠️ Please select image files only (PNG, JPG, GIF, etc.)');
      e.target.value = '';
      return;
    }

    // Calculate how many files we can add
    const remainingSlots = 3 - attachedFiles.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);

    if (filesToAdd.length < imageFiles.length) {
      alert(`⚠️ Only ${remainingSlots} file(s) can be added (maximum 3 total)`);
    }

    const newFiles = filesToAdd.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // Create temporary URL for preview
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    console.log('📎 Files attached:', newFiles.map(f => f.name).join(', '));
    console.log(`📊 Total files: ${attachedFiles.length + newFiles.length}/3`);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Load website history
  const loadHistory = async () => {
    if (!appId || !user) return;
    
    try {
      const history = await databaseService.getWebsiteGenerations(appId, user.id);
      console.log('📚 Loaded history:', history.length, 'versions');
      setWebsiteHistory(history);
    } catch (error) {
      console.error('❌ Error loading history:', error);
    }
  };

  // Load a specific version from history
  const loadHistoryVersion = (version: {id: string, prompt: string, created_at: string, html: string}) => {
    console.log('🔄 Loading version:', version.id);
    setGeneratedWebsite(version.html);
    setShowHistoryDropdown(false);
    
    // Add a message to chat indicating version loaded
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `📜 Loaded version from ${new Date(version.created_at).toLocaleString()}\nPrompt: "${version.prompt}"`
    }]);
  };

  // Download current React project
  const handleDownloadWebsite = async () => {
    if (!projectFiles.length) {
      alert('No React project to download. Please generate a website first.');
      return;
    }

    try {
      console.log('📦 Creating ZIP with', projectFiles.length, 'files...');
      
      const zip = new JSZip();
      const projectName = appName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      
      // Add all files to ZIP
      projectFiles.forEach(file => {
        zip.file(file.path, file.content);
      });
      
      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('✅ React project ZIP downloaded');
      
      // Show confirmation in chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `📥 React project downloaded as "${projectName}.zip"\n\n📦 Contains ${projectFiles.length} files:\n${projectFiles.map(f => `• ${f.path}`).join('\n')}\n\n## 🚀 Setup Instructions:\n\n1. Extract the ZIP file\n2. Open terminal in the project folder\n3. Run: \`npm install\`\n4. Run: \`npm run dev\`\n5. Open http://localhost:5173\n\n**Your React app will be running!** 🎉`
      }]);
    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Failed to download React project. Please try again.');
    }
  };

  // Handle sidebar resize by dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      // Allow resize from 280px to 50% of window width
      const maxWidth = window.innerWidth * 0.5;
      if (newWidth >= 280 && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isGenerating || creditsRemaining === 0 || !appId || !user) return;
    
    // Create new AbortController for this generation
    abortControllerRef.current = new AbortController();
    
    // Build message content with file info
    let messageContent = currentMessage;
    if (attachedFiles.length > 0) {
      messageContent += '\n\n📎 Attached files:\n' + attachedFiles.map(f => `- ${f.name} (${(f.size / 1024).toFixed(1)}KB)`).join('\n');
    }
    
    const userMessage = { role: 'user' as const, content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    const prompt = currentMessage;
    const fileNames = attachedFiles.map(f => f.name);
    
    setCurrentMessage('');
    setAttachedFiles([]); // Clear attached files after sending
    setIsGenerating(true);
    setGenerationStatus('thinking');
    
    // Deduct 1 credit per message
    setCreditsRemaining(prev => Math.max(0, prev - 1));
    
    try {
      // Check if discuss mode
      if (isDiscussMode) {
        // Discuss mode - just chat, don't generate
        setGenerationStatus('thinking');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '🤔 Thinking...'
        }]);
        
        const response = await databaseService.discussWithAI(appId, user.id, prompt, 
          generatedWebsite ? { html: generatedWebsite, css: '', js: '' } : undefined
        );
        
        // Replace loading message with actual response
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: response };
          return newMessages;
        });
        setGenerationStatus('complete');
      } else {
        // Generate React project with live preview (professional AI website builder)
        
        setGenerationStatus('generating');
        
        // Add initial assistant message that will accumulate all progress
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '🚀 Building your React website...\n'
        }]);
        
        // Track all progress messages
        let progressLog = '🚀 Building your React website...\n';
        
        // Generate React project with E2B live preview
        console.log('🚀 Generating React project with components and styling...');
        
        const project = await reactProjectGenerator.generateReactProject(prompt, (step) => {
          console.log('📊 Generation step:', step.type, step.message);
          progressLog += '\n' + step.message;
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1]?.role === 'assistant') {
              newMessages[newMessages.length - 1] = { role: 'assistant', content: progressLog };
            }
            return newMessages;
          });
        });
        
        console.log('✅ React project generated:', project.files.length, 'files');
        
        // Store project files for ZIP download AND E2B preview
        setProjectFiles(project.files);
        
        // For React projects, we'll use E2B for live preview
        // The E2BPreview component will handle the sandbox creation and preview
        console.log('🚀 React project ready for E2B preview');
        
        // Set a placeholder that will be replaced by WebContainer preview
        setGeneratedWebsite('REACT_PROJECT_WEBCONTAINER_PREVIEW');
        
        // Create a simple HTML preview for database storage
        const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName}</title>
</head>
<body>
    <div id="root">
        <h1>React Project Generated</h1>
        <p>This is a React project with ${project.files.length} files.</p>
        <p>Use the live preview above to see your website.</p>
    </div>
</body>
</html>`;
        
        // Save to database
        console.log('💾 Saving to database...');
        console.log('📝 Save params:', {
          appId,
          userId: user.id,
          htmlLength: previewHtml.length,
          promptLength: prompt.length,
          fileCount: project.files.length
        });
        
        try {
          const savedGeneration = await databaseService.saveWebsiteGeneration(
            appId, 
            user.id, 
            previewHtml, 
            '', 
            '', 
            prompt
          );
          console.log('✅ Website generation saved:', savedGeneration.id);
          
          const savedMessage = await databaseService.saveChatMessage(
            appId, 
            user.id, 
            prompt, 
            fileNames, 
            previewHtml, 
            'generation'
          );
          console.log('✅ Chat message saved:', savedMessage.id);
          
          // Verify save by loading it back
          const verification = await databaseService.getLatestWebsiteGeneration(appId, user.id);
          console.log('🔍 Verification load:', verification ? 'Success' : 'Failed');
        } catch (saveError) {
          console.error('❌ Save error:', saveError);
          throw saveError;
        }
        
        // Final success message - append to progress log
        progressLog += '\n\n✅ Website generated successfully!';
        progressLog += `\n\n📦 Created ${project.files.length} files:`;
        progressLog += '\n' + project.files.map(f => `• ${f.path}`).join('\n');
        progressLog += '\n\nYou can now preview your website or make changes by describing what you\'d like to modify.';
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: 'assistant', 
            content: progressLog
          };
          return newMessages;
        });
        setGenerationStatus('complete');
      }
    } catch (error) {
      console.error('❌ Generation error:', error);
      
      setGenerationStatus('error');
      
      // Store error details for retry
      setLastError({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        prompt: prompt
      });
      
      // Show error modal
      setShowErrorModal(true);
      
      // Update chat with user-friendly error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'assistant', 
          content: `❌ Oops! Something went wrong while generating your website.\n\n**Error:** ${error instanceof Error ? error.message : 'Unknown error'}\n\nDon't worry - your credits have been refunded. Click the Retry button to try again, or rephrase your request.`
        };
        return newMessages;
      });
      
      // Refund credit on error
      setCreditsRemaining(prev => prev + 1);
    } finally {
      setIsGenerating(false);
      setGenerationStatus('idle');
      abortControllerRef.current = null;
    }
  };

  // Retry last failed generation
  const handleRetry = () => {
    if (lastError) {
      setShowErrorModal(false);
      setCurrentMessage(lastError.prompt);
      setLastError(null);
      // Trigger send after a brief delay
      setTimeout(() => sendMessage(), 100);
    }
  };

  // Deploy to Vercel
  const handleDeploy = async () => {
    if (!projectFiles.length || !appId || !user) {
      alert('No project to deploy. Please generate a website first.');
      return;
    }

    setIsDeploying(true);
    setShowDeployModal(true);

    // Add deployment progress message to chat
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🚀 Starting deployment to Vercel...\n'
    }]);

    let progressLog = '🚀 Starting deployment to Vercel...\n';

    try {
      const result = await vercelDeploymentService.deployProject(
        projectFiles,
        appName.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
        (message) => {
          console.log('📊 Deployment progress:', message);
          progressLog += '\n' + message;
          
          // Update the last assistant message with progress
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1]?.role === 'assistant') {
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: progressLog
              };
            }
            return newMessages;
          });
        }
      );

      if (result.success && result.url) {
        // Save deployment to database
        await databaseService.saveDeployment(
          appId,
          user.id,
          result.deploymentId!,
          'vercel',
          'READY',
          result.url
        );

        setDeploymentUrl(result.url);
        
        // Final success message
        progressLog += '\n\n✅ Deployment successful!';
        progressLog += `\n\n🌐 Your website is live at: ${result.url}`;
        progressLog += '\n\nYou can share this URL with anyone!';
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: progressLog
          };
          return newMessages;
        });

      } else {
        // Deployment failed
        progressLog += '\n\n❌ Deployment failed: ' + (result.error || 'Unknown error');
        progressLog += '\n\nYou can try again or download the project to deploy manually.';
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: progressLog
          };
          return newMessages;
        });
      }

    } catch (error) {
      console.error('❌ Deployment error:', error);
      
      progressLog += '\n\n❌ Deployment failed: ' + (error instanceof Error ? error.message : 'Unknown error');
      progressLog += '\n\nPlease check your Vercel token configuration.';
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: progressLog
        };
        return newMessages;
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      {/* Header 1 - Top Navigation */}
      <header className="flex items-center justify-between gap-2 px-4 py-3 border-b bg-[#fafafa]">
        {/* Left: Logo + App Name */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            {/* Logo */}
            <button 
              onClick={() => navigate('/apps')}
              className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 transition-colors"
              title="Go to Apps"
            >
              <div className="w-7 h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-sm"></div>
            </button>
            {/* Chevron dropdown */}
            <button className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100">
              <div className="flex flex-col">
                <ChevronUp className="w-3.5 h-3.5 text-gray-700 -mb-1" />
                <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
              </div>
            </button>
          </div>
          {/* Separator */}
          <span className="text-sm font-medium text-gray-400 mx-1.5">/</span>
          {/* App Name */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-900">{appName}</span>
            <button className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100">
              <Star className="w-4 h-4 text-gray-600" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100"
              >
                <MoreHorizontal className="w-[18px] h-[18px] text-gray-600" />
              </button>
              {/* Three Dots Dropdown Menu */}
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button 
                      onClick={() => {
                        handleDownloadWebsite();
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4" />
                      Download website
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <TerminalIcon className="w-4 h-4" />
                        Show logs
                      </div>
                      <span className="text-xs text-gray-400">Ctrl B</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <RotateCcw className="w-4 h-4" />
                      Restart sandbox
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="hidden sm:flex sm:flex-grow justify-center">
          <div className="flex gap-2">
            {(['Build', 'Code', 'Terminal', 'Data', 'Settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative h-8 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeTab === tab 
                    ? 'text-gray-900 after:absolute after:inset-x-0 after:-bottom-3 after:h-0.5 after:bg-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Show Logs + Publish Button */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowLogsPanel(!showLogsPanel)}
            className={`inline-flex items-center gap-2 h-8 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
              showLogsPanel 
                ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Play className="w-4 h-4" />
            Show logs
          </button>
          {/* Deploy Button */}
          <button 
            onClick={handleDeploy}
            disabled={isDeploying || !projectFiles.length}
            className={`inline-flex items-center gap-2 h-8 px-3 py-2 text-sm font-semibold rounded-xl transition-colors ${
              isDeploying || !projectFiles.length
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            title={!projectFiles.length ? 'Generate a website first' : 'Deploy to Vercel'}
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deploying...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                Deploy
              </>
            )}
          </button>
          
          <button 
            onClick={() => setShowPublishModal(true)}
            className="inline-flex items-center gap-2 h-8 px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22V13M12 13L15.5 16.5M12 13L8.5 16.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 17.6073C21.4937 17.0221 23 15.6889 23 13C23 9 19.6667 8 18 8C18 6 18 2 12 2C6 2 6 6 6 8C4.33333 8 1 9 1 13C1 15.6889 2.50628 17.0221 4 17.6073" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Publish
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat (Only for Build tab) */}
        {activeTab === 'Build' && !sidebarCollapsed && (
          <div 
            className="flex flex-col bg-white border-r border-gray-200 relative"
            style={{ width: `${sidebarWidth}px`, minWidth: '280px', maxWidth: '50%' }}
          >
            {/* Resize Handle - Drag to resize sidebar */}
            <div
              onMouseDown={handleMouseDown}
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize z-20 transition-colors ${
                isResizing ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-400'
              }`}
              style={{ width: '4px', right: '-2px' }}
            />
            {/* Toolbar Row - Inside Sidebar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-[#fafafa]">
              <button 
                onClick={() => setSidebarCollapsed(true)}
                className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100"
              >
                <PanelLeftClose className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Last updated: 18:45, Nov 27, 2025</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  <div 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-300`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Only for AI messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 ml-2">
                      <button className="flex items-center justify-center size-8 rounded-lg hover:bg-gray-100 transition-colors">
                        <ThumbsUp className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="flex items-center justify-center size-8 rounded-lg hover:bg-gray-100 transition-colors">
                        <ThumbsDown className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="flex items-center justify-center size-8 rounded-lg hover:bg-gray-100 transition-colors">
                        <Undo2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 pb-4">
              <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0px_3px_8px_0px_rgba(0,0,0,0.05)]">
                {/* Attached Files Display */}
                {attachedFiles.length > 0 && (
                  <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-600 truncate max-w-[150px]">{file.name}</span>
                          <button
                            onClick={() => removeAttachedFile(index)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Text Input */}
                <div className="p-4 pb-2">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={isDiscussMode ? "What do you want to chat about?" : "What do you want to change?"}
                    className="w-full resize-none bg-transparent placeholder:text-gray-400 focus:outline-none text-[15px] leading-relaxed"
                    rows={2}
                    disabled={isGenerating}
                  />
                </div>
                {/* Bottom Actions */}
                <div className="flex items-center gap-2 px-3 pb-3">
                  {/* Add Attachments */}
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={attachedFiles.length >= 3}
                    className={`flex items-center justify-center size-10 rounded-full border border-gray-200 transition-colors ${
                      attachedFiles.length >= 3 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white hover:bg-gray-50 text-gray-600'
                    }`}
                    title={attachedFiles.length >= 3 ? 'Maximum 3 images (remove some first)' : `Attach images (${attachedFiles.length}/3)`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {/* Discuss */}
                  <button 
                    onClick={() => setIsDiscussMode(!isDiscussMode)}
                    className={`inline-flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-full transition-colors ${
                      isDiscussMode 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <MessageCircle className={`w-5 h-5 ${isDiscussMode ? 'text-blue-600' : 'text-gray-700'}`} />
                    <span>Discuss</span>
                  </button>
                  <div className="flex-1"></div>
                  {/* Send/Stop Button - Conditional based on generation state */}
                  {isGenerating ? (
                    <button 
                      onClick={() => {
                        if (abortControllerRef.current) {
                          abortControllerRef.current.abort();
                          setIsGenerating(false);
                          setGenerationStatus('idle');
                          setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: '⏹️ Generation stopped by user.'
                          }]);
                        }
                      }}
                      className="flex items-center justify-center size-10 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
                      title="Stop generation"
                    >
                      <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button 
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || creditsRemaining === 0}
                      className={`flex items-center justify-center size-10 rounded-full transition-all ${
                        creditsRemaining === 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-900 text-white hover:bg-black disabled:bg-gray-300 disabled:text-gray-500'
                      }`}
                      title="Send message"
                    >
                      {creditsRemaining > 0 ? (
                        <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Credits - Only show when 0 */}
              {creditsRemaining === 0 && (
                <div className="flex items-center justify-between gap-3 mt-4">
                  <p className="text-sm text-gray-500">
                    You have <span className="font-medium text-gray-700">0 credits remaining</span>
                  </p>
                  <button className="inline-flex items-center h-8 px-4 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors">
                    Upgrade plan
                  </button>
                </div>
              )}

              {/* Credits Display - Show when > 0 */}
              {creditsRemaining > 0 && (
                <div className="flex items-center justify-between gap-3 mt-4">
                  <p className="text-sm text-gray-500">
                    You have <span className="font-medium text-gray-700">{creditsRemaining} credits remaining</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Panel - Preview/Content */}
        <div className="flex-1 flex flex-col bg-[#fafafa]">
          {/* Preview Toolbar (Only for Build tab) */}
          {activeTab === 'Build' && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#fafafa] border-b border-gray-200">
              {/* Left Controls */}
              <div className="flex items-center gap-1">
                {sidebarCollapsed && (
                  <button 
                    onClick={() => setSidebarCollapsed(false)}
                    className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100"
                  >
                    <PanelLeftClose className="w-4 h-4 text-gray-600 rotate-180" />
                  </button>
                )}
                <button 
                  className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 opacity-50" 
                  disabled
                  title="Back (not available)"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={handleHomeClick}
                  className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100"
                  title="Go to home"
                >
                  <Home className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={handleReloadClick}
                  className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100"
                  title="Reload preview"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* URL/Route Input */}
              <input 
                className="flex-1 h-8 px-3 py-2 text-sm bg-white border border-gray-200 rounded-full hover:shadow-sm focus:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={currentRoute}
                onChange={(e) => setCurrentRoute(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    // Route changed, preview will update
                  }
                }}
                placeholder="/"
                title="Enter route and press Enter to navigate"
              />

              {/* Right Controls */}
              <div className="flex items-center gap-1">
                {/* History Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowHistoryDropdown(!showHistoryDropdown);
                      if (!showHistoryDropdown) loadHistory();
                    }}
                    className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100"
                    title="Version History"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  {/* History Dropdown Menu */}
                  {showHistoryDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowHistoryDropdown(false)} />
                      <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">Version History</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{websiteHistory.length} versions</p>
                        </div>
                        
                        {websiteHistory.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <p className="text-sm text-gray-500">No previous versions</p>
                          </div>
                        ) : (
                          <div className="py-1">
                            {websiteHistory.map((version, index) => (
                              <button
                                key={version.id}
                                onClick={() => loadHistoryVersion(version)}
                                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {version.prompt || 'Website Generation'}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {new Date(version.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                <button className="flex items-center justify-center size-8 rounded-xl bg-gray-100 hover:bg-gray-200">
                  <MousePointer2 className="w-[18px] h-[18px] text-gray-700" />
                </button>
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 ${previewMode === 'desktop' ? 'bg-gray-100' : ''}`}
                >
                  <Monitor className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 ${previewMode === 'mobile' ? 'bg-gray-100' : ''}`}
                >
                  <Smartphone className="w-4 h-4 text-gray-600" />
                </button>
                <button className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100">
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'Build' && (
            <div className="flex-1 flex flex-col relative">
              {/* Preview Area */}
              <div className={`flex-1 relative ${showLogsPanel ? 'pb-0' : ''}`}>
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-lg font-medium text-gray-700">Loading your app...</h3>
                    </div>
                  </div>
                ) : isGenerating && !generatedWebsite ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {generationStatus === 'thinking' && '🤔 Thinking...'}
                        {generationStatus === 'generating' && '🚀 Building your website...'}
                        {generationStatus === 'complete' && '✅ Complete!'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {generationStatus === 'thinking' && 'Analyzing your request...'}
                        {generationStatus === 'generating' && 'Creating files and components...'}
                        {generationStatus === 'complete' && 'Your website is ready!'}
                      </p>
                    </div>
                  </div>
                ) : generatedWebsite ? (
                  <div className={`w-full h-full flex items-center justify-center ${previewMode === 'mobile' ? 'bg-gray-100' : ''}`}>
                    <div className={previewMode === 'mobile' ? 'relative' : 'w-full h-full'}>
                      {/* Mobile Device Frame */}
                      {previewMode === 'mobile' && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="w-[375px] h-full mx-auto border-[14px] border-gray-800 rounded-[36px] shadow-2xl">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-800 rounded-b-3xl"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Live React Preview */}
                      {generatedWebsite === 'REACT_PROJECT_WEBCONTAINER_PREVIEW' && projectFiles.length > 0 ? (
                        // WebContainer Preview for React projects
                        <div className={`${
                          previewMode === 'mobile' 
                            ? 'w-[375px] h-[667px] mx-auto rounded-[22px] shadow-xl overflow-hidden' 
                            : 'w-full h-full'
                        }`}>
                          <WebContainerPreview
                            projectId={appId || 'default'}
                            generatedFiles={projectFiles.map(f => ({ path: f.path, content: f.content }))}
                            onReady={(url) => {
                              console.log('🎉 WebContainer Preview ready:', url);
                            }}
                            onError={(error) => {
                              console.error('❌ WebContainer Preview error:', error);
                              setLastError({ message: error.message, prompt: 'WebContainer Preview' });
                              setShowErrorModal(true);
                            }}
                          />
                        </div>
                      ) : (
                        // Empty state - no React project generated yet
                        <div className="flex items-center justify-center h-full bg-gray-50">
                          <div className="text-center">
                            <div className="text-6xl mb-4">⚛️</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No React project yet</h3>
                            <p className="text-gray-600">Describe your website to generate a React project with live preview</p>
                            

                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {/* Hourglass Image */}
                      <div className="text-7xl mb-6">💬</div>
                      {/* Empty State */}
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No website generated yet</h3>
                      <p className="text-sm text-gray-500 mb-1">Describe what you want to build in the chat.</p>
                      <p className="text-sm text-gray-500 mb-8">I'll generate a unique website for you!</p>
                      {/* Action Buttons */}
                      <div className="flex items-center justify-center gap-4">
                        <a 
                          href="#" 
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Read our docs
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a 
                          href="#" 
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Join our community
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Logs Panel - Appears above preview when enabled */}
              {showLogsPanel && (
                <div className="h-48 border-t border-gray-200 bg-white flex flex-col">
                  {/* Logs Header */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Logs</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => setShowLogsPanel(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  {/* Logs Content */}
                  <div className="flex-1 overflow-auto p-4 font-mono text-xs">
                    {logs.map((log, index) => (
                      <div key={index} className="flex gap-4 text-gray-600">
                        <span className="text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                        <span className="text-orange-500">{log.source}</span>
                        <span className="text-cyan-600">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'Code' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - File List */}
              <div className="w-72 border-r border-gray-200 flex flex-col bg-white">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-sm">Generated Files ({projectFiles.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {projectFiles.length > 0 ? (
                    projectFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFileIndex(index)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                          selectedFileIndex === index 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate">{file.path}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No files generated yet.<br/>Generate a website to see code here.
                    </div>
                  )}
                </div>
              </div>

              {/* Main Code Display Area */}
              <div className="flex-1 bg-white flex flex-col overflow-hidden">
                {projectFiles.length > 0 ? (
                  <>
                    <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{projectFiles[selectedFileIndex]?.path || 'index.html'}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(projectFiles[selectedFileIndex]?.content || '');
                        }}
                        className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto p-4 bg-gray-50">
                      <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {projectFiles[selectedFileIndex]?.content || '// No content'}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <p className="text-sm font-medium mb-2">No code files yet</p>
                      <p className="text-xs text-gray-400">Generate a website to view code here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'Code' && (
            <div className="flex-1 flex h-full">
              {/* File Explorer */}
              <div className="w-64 flex-shrink-0">
                <FileExplorer
                  selectedFile={fileManager.selectedFile || undefined}
                  onFileSelect={(path) => fileManager.setSelectedFile(path)}
                  className="h-full"
                />
              </div>
              
              {/* Code Editor */}
              <div className="flex-1">
                <CodeEditor
                  selectedFile={fileManager.selectedFile || undefined}
                  onFileChange={(path, content) => {
                    console.log('📝 File changed:', path, `(${content.length} chars)`);
                  }}
                  className="h-full"
                />
              </div>
            </div>
          )}
          {activeTab === 'Terminal' && (
            <div className="flex-1 flex flex-col p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Terminal</h2>
                <p className="text-sm text-gray-600">
                  Run commands directly in your E2B sandbox. Available when a React project is generated.
                </p>
              </div>
              
              <div className="flex-1">
                <Terminal
                  ref={terminalRef}
                  sessionId={terminal.sessionId || undefined}
                  onData={(data) => {
                    terminal.writeData(data).catch(err => {
                      console.error('❌ Failed to write terminal data:', err);
                    });
                  }}
                  onResize={(cols, rows) => {
                    terminal.resize(cols, rows).catch(err => {
                      console.error('❌ Failed to resize terminal:', err);
                    });
                  }}
                  height={400}
                  className="w-full"
                />
              </div>
              
              {terminal.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Terminal Error:</strong> {terminal.error.message}
                  </p>
                </div>
              )}
              
              {terminal.isConnecting && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔌 Connecting to terminal...
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'Data' && <DataTabContent />}
          {activeTab === 'Settings' && <SettingsTabContent />}
        </div>
      </div>

      {/* Deployment Success Modal */}
      {showDeployModal && deploymentUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeployModal(false)}>
          <div 
            className="bg-white rounded-2xl w-[500px] shadow-2xl border border-gray-200 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Deployment Successful!</h2>
              <p className="text-gray-600">Your website is now live on the internet</p>
            </div>

            {/* Live URL */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={deploymentUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deploymentUrl);
                    // Could add a toast notification here
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => window.open(deploymentUrl, '_blank')}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                🌐 Visit Website
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(deploymentUrl);
                  // Could add a toast notification here
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                📋 Share Link
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDeployModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-end pt-16 pr-4 z-50" onClick={() => setShowPublishModal(false)}>
          <div 
            className="bg-white rounded-xl w-[400px] shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Publish app</h2>
              <button 
                onClick={() => setShowPublishModal(false)}
                className="flex items-center justify-center size-7 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="px-5 py-5 space-y-5">
              {/* URL Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">URL</span>
                <div className="flex items-center gap-2">
                  {isEditingUrl ? (
                    <input
                      type="text"
                      value={publishUrl}
                      onChange={(e) => setPublishUrl(e.target.value)}
                      onBlur={() => setIsEditingUrl(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingUrl(false)}
                      className="text-sm text-gray-900 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{publishUrl}.mocha.app</span>
                  )}
                  <button 
                    onClick={() => setIsEditingUrl(!isEditingUrl)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Status Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="relative">
                  <button 
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    {publishStatus}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Visibility Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Visibility</span>
                <div className="relative">
                  <button 
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    {publishVisibility}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Publish app
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && lastError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Generation Failed</h3>
                  <p className="text-sm text-gray-600">Something went wrong</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700 mb-4">
                We encountered an error while generating your website:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-800 font-mono break-words">
                  {lastError.message}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Don't worry - your credit has been refunded. You can try again or rephrase your request.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowErrorModal(false);
                  setLastError(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Retry Generation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
