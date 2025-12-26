import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ChevronUp, ChevronDown, Star, MoreHorizontal,
  ArrowLeft, Home, RefreshCw, MousePointer2,
  Monitor, Smartphone, Tablet, Maximize2, Plus,
  MessageCircle, Lock, ThumbsUp, ThumbsDown,
  PanelLeftClose, X, ArrowUp, Download, Copy, Terminal as TerminalIcon, RotateCcw, Trash2,
  Pencil, ExternalLink, Play, Clock, Camera, GitBranch, Globe, Check
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
import { BulletproofPreview } from '../components/BulletproofPreview';
// Terminal and file management imports kept for potential future use
import { Terminal } from '../components/Terminal';
import { useTerminal } from '../hooks/useTerminal';
import { useFileManager } from '../hooks/useFileManager';
import { ProjectFileViewer } from '../components/ProjectFileViewer';
import { ThinkingMessage } from '../components/ThinkingMessage';
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger
} from '../../components/prompt-kit/chain-of-thought';
import { CodeBlock, CodeBlockCode } from '../../components/prompt-kit/code-block';
import { Lightbulb, Search, Target, Zap, Settings, FileText } from 'lucide-react';
import { ChatMessage as LovableChatMessageComponent } from '../components/LovableChatModule/ChatMessage';
import { ChatMessage as LovableChatMessage } from '../components/LovableChatModule/types';
import { LovableChatModule } from '../components/LovableChatModule';
import { PromptSuggestions } from '../components/PromptSuggestions';
import { OnboardingModal } from '../components/OnboardingModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/Tooltip';
import { FeedbackModule } from '../components/FeedbackModule';
import { DeploymentModal } from '../components/DeploymentModal';


const CodeEditor = lazy(() => import('../components/CodeEditor').then(module => ({ default: module.CodeEditor })));

// Helper to convert AppBuilder's serialized messages to LovableChatMessage format

const parseToLovable = (msg: { role: 'user' | 'assistant', content: string }, index: number): LovableChatMessage => {
  const isAssistant = msg.role === 'assistant';
  let content = msg.content;
  let thinking = undefined;
  let fileEdits = undefined;
  let images = undefined;
  let summary = undefined;
  let assetIntro = undefined;
  let fileIntro = undefined;
  let status: 'sending' | 'thinking' | 'streaming' | 'complete' | 'error' = 'complete';

  // Handle Assistant Messages with Chain of Thought
  if (isAssistant) {
    // 1. Check for CHAIN_OF_THOUGHT_LOVABLE format (New Generator)
    // 1. Check for CHAIN_OF_THOUGHT_LOVABLE format (New Generator)
    // Check for standard prefix
    const prefixRegex = /CHAIN_OF_THOUGHT_LOVABLE:\s*/i;
    const hasPrefix = prefixRegex.test(content);
    // Check for raw JSON log format (fallback if prefix is stripped or missing)
    const isRawJson = content.trim().startsWith('{"log":');

    if (hasPrefix || isRawJson) {
      let parsedSuccessfully = false;
      try {
        let jsonStr = '';

        if (hasPrefix) {
          // Use [\s\S]+ for reliable multiline matching across all environments
          const match = content.match(/CHAIN_OF_THOUGHT_LOVABLE:\s*([\s\S]+)/i);
          if (match && match[1]) {
            jsonStr = match[1];
          } else {
            // Substring fallback if regex fails
            const matchStart = content.match(prefixRegex);
            if (matchStart && matchStart.index !== undefined) {
              jsonStr = content.substring(matchStart.index + matchStart[0].length);
            }
          }
        } else {
          jsonStr = content;
        }

        if (jsonStr) {
          const data = JSON.parse(jsonStr); // { log: [], isComplete: boolean }

          // Thoughts
          const thoughts = data.log.filter((s: any) => s.type === 'thought' || s.type === 'plan').map((s: any) => s.message || s.content);
          if (thoughts.length > 0) {
            const totalDuration = data.log
              .filter((s: any) => s.type === 'thought' || s.type === 'plan')
              .reduce((acc: number, s: any) => acc + (s.data?.duration || 0), 0);

            thinking = {
              isActive: !data.isComplete,
              duration: Math.ceil(totalDuration / 1000),
              content: thoughts
            };
            if (data.isComplete) thinking.isActive = false;
          }

          // File Edits
          const files = data.log.filter((s: any) => s.type === 'file').map((s: any) => ({
            fileName: (s.data?.filename || 'unknown').split('/').pop() || 'unknown',
            action: 'created',
            timestamp: Date.now()
          }));
          if (files.length > 0) fileEdits = files;

          // Images
          const imgs = data.log.filter((s: any) => s.type === 'image').map((s: any) => ({
            description: s.message || s.content,
            url: s.data?.url,
            timestamp: Date.now()
          }));
          if (imgs.length > 0) images = imgs;

          // Summary
          const sumStep = data.log.find((s: any) => s.type === 'summary');
          if (sumStep) summary = sumStep.message || sumStep.content;

          // Intros
          const assetIntroStep = data.log.find((s: any) => s.type === 'asset_intro');
          if (assetIntroStep) assetIntro = assetIntroStep.message || assetIntroStep.content;

          const fileIntroStep = data.log.find((s: any) => s.type === 'file_intro');
          if (fileIntroStep) fileIntro = fileIntroStep.message || fileIntroStep.content;

          // Content (Text steps)
          const textSteps = data.log.filter((s: any) => s.type === 'text');
          if (textSteps.length > 0) {
            content = textSteps.map((s: any) => s.message || s.content).join('\n');
          } else {
            content = ''; // Clean view
          }

          // Status Logic
          if (data.isComplete) {
            status = 'complete';
          } else if (
            (files.length > 0) ||
            (imgs.length > 0) ||
            content.length > 0 ||
            summary ||
            assetIntro ||
            fileIntro
          ) {
            status = 'streaming';
          } else {
            status = 'thinking';
          }
          parsedSuccessfully = true;
        }
      } catch (e) {
        // Fallback: If parse fails, HIDE raw content
        console.error('Parse Lovable Log Error:', e);
      }

      // Hide raw content if not parsed successfully
      if (!parsedSuccessfully) {
        content = '';
        status = 'thinking';
      }
    }
  }

  return {
    id: `msg-${index}`,
    role: msg.role,
    content: content,
    timestamp: Date.now(),
    thinking,
    fileEdits,
    images,
    summary,
    assetIntro,
    fileIntro,
    status
  };
};

export default function AppBuilder() {
  const { appId } = useParams<{ appId: string }>();
  const { user, signInWithGitHub } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Build' | 'Code' | 'Terminal' | 'Data' | 'Settings'>('Build');
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);



  // Debug logging for chat visibility
  useEffect(() => {
    console.log('🔍 Chat visibility check:', {
      activeTab,
      sidebarCollapsed,
      chatVisible: !sidebarCollapsed
    });
  }, [activeTab, sidebarCollapsed]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showGitModal, setShowGitModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isDiscussMode, setIsDiscussMode] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'Published' | 'Unpublished'>('Published');
  const [publishVisibility, setPublishVisibility] = useState<'Public' | 'Private'>('Public');
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(480);
  const [isResizing, setIsResizing] = useState(false);
  const [showLogsPanel, setShowLogsPanel] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('/');
  const [publishUrl, setPublishUrl] = useState('jm36jsglgw76e');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [logs] = useState([
    { timestamp: '2025-12-04T13:00:02.0072', source: 'mocha', message: 'Starting sandbox...' }
  ]);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedWebsite, setGeneratedWebsite] = useState<string>('');
  const [appName, setAppName] = useState('My App');

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Only show if we have an appId (wait for init)
    if (!isLoading && appId) {
      const hasSeen = localStorage.getItem('mocha_onboarding_seen');
      if (!hasSeen) {
        setTimeout(() => setShowOnboarding(true), 1500);
      }
    }
  }, [isLoading, appId]);

  const handleCloseOnboarding = () => {
    localStorage.setItem('mocha_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  // Use these variables to avoid TypeScript warnings (only log once)
  // console.log('Stats:', { changesCount, filesCount, buildTime });
  const [creditsRemaining, setCreditsRemaining] = useState(35);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string, size: number, type: string, url?: string }>>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  // All websites now generate as React projects with live preview
  const [websiteHistory, setWebsiteHistory] = useState<Array<{ id: string, prompt: string, created_at: string, html: string }>>([]);
  const [lastError, setLastError] = useState<{ message: string, prompt: string } | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Array<{ path: string, content: string, language: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'thinking' | 'generating' | 'complete' | 'error'>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const [hasActiveConversation, setHasActiveConversation] = useState(false);
  // Ref to track if initial generation has been triggered (prevent duplicates)
  const initialGenerationTriggeredRef = useRef(false);
  const conversationProtectedRef = useRef(false);
  const messagesLockedRef = useRef(false);
  const conversationRestoredRef = useRef(false);

  const permanentMessagesRef = useRef<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const messageUpdateTrigger = useRef(0);

  // Terminal integration
  const terminal = useTerminal();
  const terminalRef = useRef<any>(null);

  // File manager integration (kept for potential future use)
  useFileManager();

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

  // Connect to terminal (Mock mode) on mount
  useEffect(() => {
    if (!terminal.isConnected && !terminal.isConnecting && !terminal.sessionId) {
      terminal.connect(null);
    }
  }, [terminal.connect]);

  // StackBlitz doesn't need terminal/file manager connection like WebContainer
  // This effect is kept for potential future WebContainer fallback
  useEffect(() => {
    // StackBlitz handles everything internally, no need for manual connections
    if (generatedWebsite === 'REACT_PROJECT_STACKBLITZ_PREVIEW' && projectFiles.length > 0) {
      console.log('🎯 StackBlitz preview mode active with', projectFiles.length, 'files');
    }
  }, [generatedWebsite, projectFiles]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // BULLETPROOF MESSAGE MANAGEMENT SYSTEM
  const addMessageToPermanentStore = (message: { role: 'user' | 'assistant', content: string }) => {
    permanentMessagesRef.current = [...permanentMessagesRef.current, message];
    messageUpdateTrigger.current += 1;
    console.log('💾 Message added to permanent store. Total:', permanentMessagesRef.current.length);

    // Update the display messages
    setMessages([...permanentMessagesRef.current]);

    // Mark conversation as active
    if (permanentMessagesRef.current.length > 1) {
      setHasActiveConversation(true);
      conversationProtectedRef.current = true;
      messagesLockedRef.current = true;
      console.log('🔒 Conversation protection activated');
    }

    // PERSIST TO DATABASE
    if (appId && user) {
      // Args: appId, userId, message, files, aiResponse (role for now), messageType
      databaseService.saveChatMessage(appId, user.id, message.content, [], message.role)
        .catch(err => console.error('❌ Failed to save message to DB:', err));
    }
  };

  const updateLastMessageInPermanentStore = (content: string) => {
    if (permanentMessagesRef.current.length > 0) {
      const lastIndex = permanentMessagesRef.current.length - 1;

      // Safety check: Ensure we are updating an assistant message
      if (permanentMessagesRef.current[lastIndex].role !== 'assistant') {
        console.warn('⚠️ Attempted to update a non-assistant message');
        return;
      }

      permanentMessagesRef.current[lastIndex] = {
        ...permanentMessagesRef.current[lastIndex],
        content
      };
      messageUpdateTrigger.current += 1;
      // console.log('✏️ Last message updated'); // Reduce log noise

      // Update resolution: direct mutation ok since we force update via trigger
      setMessages([...permanentMessagesRef.current]);
    }
  };

  // Sync permanent store with display messages
  useEffect(() => {
    setMessages([...permanentMessagesRef.current]);
  }, [messageUpdateTrigger.current]);

  // Monitor conversation state to prevent message loss
  useEffect(() => {
    // If we have more than just the welcome message, mark as active conversation
    if (permanentMessagesRef.current.length > 1) {
      setHasActiveConversation(true);
      conversationProtectedRef.current = true;
      messagesLockedRef.current = true;
      console.log('🔄 Active conversation detected with', permanentMessagesRef.current.length, 'messages - PROTECTION ENABLED');
    }
  }, [messageUpdateTrigger.current]);

  // Keep a ref to sendMessage for event listeners to avoid dependency cycles
  const sendMessageRef = useRef<(text?: string) => Promise<void>>(async () => { });
  // We'll update this ref later when sendMessage is defined, or we can move the definition up.
  // Actually, due to React hoisting mechanism in functional components not working for const,
  // we need to initialize it or update it in a useEffect or render body.
  // Let's use a trusted approach: Render-cycle update.

  // Listen for Code Tab Navigation Events from deeper components (e.g. Chat)
  useEffect(() => {
    const handleOpenCodeTab = () => {
      setActiveTab('Code');
      // Also uncollapse sidebar if needed to see context, though Code tab is full width
      setSidebarCollapsed(true); // Optional: collapse sidebar to give more space for code
    };

    const handleVariationsData = () => {
      console.log('✨ Variations requested via UI');
      if (sendMessageRef.current) {
        sendMessageRef.current("Please generate 3 distinct design variations for the current website options (focusing on hero section, colors, and fonts). Show me the options.");
      }
    };

    window.addEventListener('OPEN_CODE_TAB', handleOpenCodeTab);
    window.addEventListener('OPEN_VARIATIONS_MENU', handleVariationsData);

    return () => {
      window.removeEventListener('OPEN_CODE_TAB', handleOpenCodeTab);
      window.removeEventListener('OPEN_VARIATIONS_MENU', handleVariationsData);
    };
  }, []);

  // Listen for Visual Inspector Selection
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ELEMENT_SELECTED') {
        const { tagName, id, text, className } = event.data.element;
        console.log('🎯 Element Selected:', tagName, id);

        let desc = tagName.toLowerCase();
        if (id) desc += `#${id}`;

        // Provide friendly name
        if (tagName === 'footer') desc = 'Footer section';
        else if (tagName === 'header') desc = 'Header section';
        else if (tagName === 'nav') desc = 'Navigation menu';
        else if (tagName === 'section') desc = 'Section';
        else if (tagName === 'button') desc = 'Button';
        else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') desc = 'Heading';

        setCurrentMessage(`I want to change the ${desc}. `);
        setSidebarCollapsed(false); // Ensure chat is open
        setIsInspectorActive(false); // Turn off inspector after selection

        // Focus chat input (hacky but works)
        setTimeout(() => document.querySelector('textarea')?.focus(), 100);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Load app data and chat history on mount
  useEffect(() => {
    const loadAppData = async () => {
      if (!appId || !user) {
        setIsLoading(false);
        return;
      }

      // CRITICAL: Don't load app data during generation to prevent message overwriting
      if (isGenerating || conversationProtectedRef.current || messagesLockedRef.current || hasActiveConversation || conversationRestoredRef.current) {
        console.log('🚫 BLOCKING app data load - conversation is protected');
        console.log('🔒 Block reasons:', {
          isGenerating,
          conversationProtected: conversationProtectedRef.current,
          messagesLocked: messagesLockedRef.current,
          hasActiveConversation,
          conversationRestored: conversationRestoredRef.current
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('🔄 Loading app data for appId:', appId);
        console.log('🔍 Current conversation state - messages:', messages.length, 'hasActiveConversation:', hasActiveConversation);

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
            if (hasGenerations.length === 0 && !initialGenerationTriggeredRef.current) {
              // No generations yet, auto-generate from description
              initialGenerationTriggeredRef.current = true;
              console.log('🚀 Auto-generating from initial prompt:', app.description);
              // Trigger generation directly
              setTimeout(() => {
                sendMessage(app.description);
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

        const formattedMessages: Array<{ role: 'user' | 'assistant', content: string }> = [];
        const seenContent = new Set<string>();

        const addMessage = (role: 'user' | 'assistant', content: string) => {
          if (!content) return;
          // Ultra-Aggressive Deduplication
          // Normalize content to ensure fuzzy matches (whitespace, case, newlines) are caught
          // This fixes persistence duplicates where storage formats differ slightly
          const dedupKey = content.replace(/\s+/g, '').toLowerCase().slice(0, 1000);

          if (seenContent.has(dedupKey)) return;

          seenContent.add(dedupKey);
          formattedMessages.push({ role, content });
        };

        chatHistory.forEach((msg: any) => {
          // Check if this row is actually an Assistant Log stored in message_text
          const isAssistantLog = msg.ai_response === 'assistant' ||
            (typeof msg.message_text === 'string' &&
              (msg.message_text.includes('CHAIN_OF_THOUGHT_LOVABLE') || msg.message_text.trim().startsWith('{"log":')));

          if (isAssistantLog) {
            addMessage('assistant', msg.message_text);
          } else {
            // It's a standard row (User + AI Response)
            let historyRestored = false;

            if (msg.ai_response) {
              try {
                const parsedResponse = JSON.parse(msg.ai_response);
                if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
                  // This row contains a complete conversation history snapshot
                  console.log('📜 Restoring complete conversation history:', parsedResponse.length, 'messages');
                  parsedResponse.forEach((savedMsg: any) => {
                    addMessage(savedMsg.role, savedMsg.content);
                  });
                  historyRestored = true;
                }
              } catch (parseError) {
                // Not a history array, continue to standard handling
              }
            }

            // If we didn't restore a history snapshot from this row, treat it as a single request/response
            if (!historyRestored) {
              addMessage('user', msg.message_text);

              if (msg.ai_response) {
                addMessage('assistant', typeof msg.ai_response === 'string' ? msg.ai_response : 'Website generated successfully.');
              }
            }
          }
        });

        // BULLETPROOF PROTECTION: Never overwrite permanent message store
        if (permanentMessagesRef.current.length > 1) {
          console.log('🚫 BULLETPROOF BLOCK - Permanent store has active conversation');
          console.log('🔒 Permanent store protected with', permanentMessagesRef.current.length, 'messages');
          // Don't load anything - permanent store is the source of truth
          return;
        }

        // Only restore from database if permanent store is empty (first load only)
        if (permanentMessagesRef.current.length <= 1 && formattedMessages.length > 0 && !conversationRestoredRef.current) {
          console.log('📜 FIRST LOAD: Restoring', formattedMessages.length, 'messages to permanent store');
          permanentMessagesRef.current = [...formattedMessages];
          setMessages([...formattedMessages]); // Sync display state
          messageUpdateTrigger.current += 1;
          conversationRestoredRef.current = true;

          if (formattedMessages.length > 1) {
            setHasActiveConversation(true);
            conversationProtectedRef.current = true;
            messagesLockedRef.current = true;
            console.log('🔒 Restored conversation is now in permanent store and PROTECTED');
          }
        } else {
          console.log('👋 Keeping default welcome message in permanent store');
        }

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

            // Check if this is a React project with saved files
            if (latestGeneration.html.includes('React Project Generated')) {
              console.log('🎯 Detected React project, loading saved files...');
              setGeneratedWebsite('REACT_PROJECT_STACKBLITZ_PREVIEW');

              // Load the actual saved project files from database
              if ((latestGeneration as any).project_files && Array.isArray((latestGeneration as any).project_files)) {
                const savedFiles = (latestGeneration as any).project_files;
                console.log('📁 Loaded', savedFiles.length, 'saved project files from database');
                setProjectFiles(savedFiles);
              } else {
                console.log('⚠️ No saved project files found, regenerating from prompt...');
                // Regenerate the files from the original prompt for backward compatibility
                try {
                  const { ProfessionalReactGenerator } = await import('../../services/professionalReactGenerator');
                  const regeneratedFiles = ProfessionalReactGenerator.generateCompleteProject(latestGeneration.prompt);
                  const convertedFiles = regeneratedFiles.map(f => ({
                    path: f.path,
                    content: f.content,
                    language: f.language
                  }));
                  setProjectFiles(convertedFiles);

                  // Save the regenerated files to database for future use
                  await databaseService.updateWebsiteGenerationFiles(latestGeneration.id, convertedFiles);
                  console.log('✅ Regenerated and saved', convertedFiles.length, 'files for backward compatibility');
                } catch (regenError) {
                  console.error('❌ Failed to regenerate files:', regenError);
                  // Fallback to minimal files
                  const minimalFiles = [
                    { path: 'package.json', content: '{"name": "react-app", "dependencies": {"react": "^18.0.0"}}', language: 'json' },
                    { path: 'src/App.tsx', content: 'export default function App() { return <div>Please regenerate this project to get the full files.</div>; }', language: 'typescript' }
                  ];
                  setProjectFiles(minimalFiles);
                }
              }
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
  const loadHistoryVersion = (version: { id: string, prompt: string, created_at: string, html: string }) => {
    console.log('🔄 Loading version:', version.id);
    setGeneratedWebsite(version.html);
    setShowHistoryDropdown(false);

    // Add a message to chat indicating version loaded
    addMessageToPermanentStore({
      role: 'assistant',
      content: `📜 Loaded version from ${new Date(version.created_at).toLocaleString()}\nPrompt: "${version.prompt}"`
    });
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

      // Show enhanced confirmation in chat
      addMessageToPermanentStore({
        role: 'assistant',
        content: `📥 **Download Complete!**

**✅ Successfully Downloaded:** "${projectName}.zip"

**🚀 Quick Start Guide:**
1. **Extract** the ZIP file to your preferred development folder
2. **Navigate** to the project folder in your terminal
3. **Install** dependencies: \`npm install\`
4. **Start** development server: \`npm run dev\`
5. **Open** http://localhost:5173 in your browser

**💻 What You Get:**
• **${projectFiles.length} Professional Files** - Complete React project structure
• **Modern Development Setup** - Vite, TypeScript, Tailwind CSS
• **Production Ready** - Optimized build configuration
• **Full Source Code** - Customize everything to your needs

**FILES_CREATED:${projectFiles.length}**
**PROGRESS:100**
**STATUS:🎯 Ready for local development**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}**

**🎉 Happy Coding!** Your professional React website is now ready for local development and customization. Build something amazing! 💻✨`
      });
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

  const sendMessage = async (text?: string) => {
    const promptText = text || currentMessage;
    if (!promptText.trim() || isGenerating || creditsRemaining === 0 || !appId || !user) return;

    // Create new AbortController for this generation
    // Create new AbortController for this generation
    abortControllerRef.current = new AbortController();
    const currentAbortController = abortControllerRef.current;

    // Build message content with file info
    let messageContent = promptText;
    if (attachedFiles.length > 0) {
      messageContent += '\n\n📎 Attached files:\n' + attachedFiles.map(f => `- ${f.name} (${(f.size / 1024).toFixed(1)}KB)`).join('\n');
    }

    const userMessage = { role: 'user' as const, content: messageContent };
    addMessageToPermanentStore(userMessage);
    const prompt = promptText;
    const fileNames = attachedFiles.map(f => f.name);

    // Mark that we have an active conversation to prevent message overwriting
    setHasActiveConversation(true);
    conversationProtectedRef.current = true;
    messagesLockedRef.current = true;
    console.log('🔒 BULLETPROOF PROTECTION ACTIVATED - Messages in permanent store');

    if (!text) setCurrentMessage('');
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
        addMessageToPermanentStore({
          role: 'assistant',
          content: '🤔 Thinking...'
        });

        const response = await databaseService.discussWithAI(appId, user.id, prompt,
          generatedWebsite ? { html: generatedWebsite, css: '', js: '' } : undefined
        );

        // Replace loading message with actual response
        updateLastMessageInPermanentStore(response);
        setGenerationStatus('complete');
      } else {
        // Generate UNIQUE React project with enhanced AI (no templates!)

        setGenerationStatus('generating');



        // Import and use the REAL enhanced generator
        const { enhancedWebsiteGenerator } = await import('../../services/enhancedWebsiteGenerator');

        // Initialize the log message
        const initialLogState = [{ type: 'thought', message: 'Initializing AI context...', data: { duration: 500 } }];

        addMessageToPermanentStore({
          role: 'assistant',
          content: `CHAIN_OF_THOUGHT_LOVABLE:${JSON.stringify({
            log: initialLogState,
            isComplete: false
          })}`
        });

        // Use the same initial state so the log doesn't "jump" from empty to populated
        const generationLog: any[] = [...initialLogState];

        // THINKING TIMER: Real-time duration updates
        const thinkingTimer = setInterval(() => {
          // STOP CHECK: If user aborted, stop this timer immediately and don't update
          if (currentAbortController.signal.aborted) {
            clearInterval(thinkingTimer);
            return;
          }

          const lastStep = generationLog[generationLog.length - 1];
          if (lastStep && (lastStep.type === 'thought' || lastStep.type === 'plan')) {
            if (!lastStep.data) lastStep.data = { duration: 0 };
            lastStep.data.duration = (lastStep.data.duration || 0) + 1000;

            // Force update UI
            updateLastMessageInPermanentStore(`CHAIN_OF_THOUGHT_LOVABLE:${JSON.stringify({
              log: generationLog,
              isComplete: false
            })}`);
          }
        }, 1000);

        const projectFiles = await enhancedWebsiteGenerator.generateUniqueWebsite(prompt, (step) => {
          // STOP CHECK: Ignore updates if aborted
          if (currentAbortController.signal.aborted) return;

          console.log('📊 Generation Step:', step.type, step.message);

          if (step.type !== 'complete') {
            generationLog.push(step);
          }

          // REAL-TIME FILE STREAMING: "Everything slowly appears as the thing develops"
          if (step.type === 'file' && step.data?.content) {
            setProjectFiles(prev => {
              const newFile = {
                path: step.data.filename,
                content: step.data.content,
                language: step.data.language || 'typescript'
              };

              // Avoid duplicates or update existing
              const existingIndex = prev.findIndex(f => f.path === newFile.path);
              if (existingIndex >= 0) {
                const newFiles = [...prev];
                newFiles[existingIndex] = newFile;
                return newFiles;
              }
              return [...prev, newFile];
            });

            // If this is the App.tsx or main.tsx, we might want to trigger a preview refresh if we had a live preview system
            // For now, seeing the files list populate is the "vehicle appearing" effect.
          }

          const isCompleteStep = step.type === 'complete';
          let delay = 0;

          if (isCompleteStep) {
            const summaryStep = generationLog.find(s => s.type === 'summary');
            const summaryLength = summaryStep ? summaryStep.message.length : 0;
            delay = Math.max(1500, 1000 + (summaryLength * 30));
          }

          const performUpdate = () => {
            const chainContent = `CHAIN_OF_THOUGHT_LOVABLE:${JSON.stringify({
              log: generationLog,
              isComplete: isCompleteStep
            })}`;

            updateLastMessageInPermanentStore(chainContent);

            if (isCompleteStep && appId && user) {
              databaseService.saveChatMessage(appId, user.id, chainContent, [], 'assistant')
                .catch(err => console.error('❌ Failed to save final generation log:', err));
            }
          };

          if (isCompleteStep && delay > 0) {
            setTimeout(performUpdate, delay);
          } else {
            performUpdate();
          }
        });

        clearInterval(thinkingTimer);
        console.log('✅ UNIQUE React project generated:', projectFiles.length, 'files');

        // Add preview preparation message


        // Store project files for ZIP download AND preview (enhanced format)
        const formattedFiles = projectFiles.map(f => ({
          path: f.path,
          content: f.content,
          language: f.language
        }));
        setProjectFiles(formattedFiles);

        // For enhanced React projects, we'll use StackBlitz for live preview
        console.log('🚀 Enhanced React project ready for StackBlitz preview');

        // Set a placeholder that will be replaced by StackBlitz preview
        setGeneratedWebsite('REACT_PROJECT_STACKBLITZ_PREVIEW');

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
        <h1>Enhanced Unique React Project Generated</h1>
        <p>This is a unique React project with ${projectFiles.length} files.</p>
        <p>Generated with custom colors, fonts, and layouts - no templates used!</p>
        <p>Use the live preview above to see your unique website.</p>
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
          fileCount: projectFiles.length,
          projectFiles: projectFiles.map(f => ({ path: f.path, size: f.content.length }))
        });

        try {
          const savedGeneration = await databaseService.saveWebsiteGeneration(
            appId,
            user.id,
            previewHtml,
            '',
            '',
            prompt,
            formattedFiles  // Save the enhanced project files
          );
          console.log('✅ Website generation saved:', savedGeneration.id);

          // CRITICAL FIX: Save the ENTIRE conversation history from permanent store
          const currentConversation = permanentMessagesRef.current.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date().toISOString()
          }));

          const savedMessage = await databaseService.saveChatMessage(
            appId,
            user.id,
            prompt,
            fileNames,
            JSON.stringify(currentConversation), // Save complete conversation history
            'generation'
          );
          console.log('✅ Complete conversation saved:', savedMessage.id, 'messages:', currentConversation.length);

          // Verify save by loading it back
          const verification = await databaseService.getLatestWebsiteGeneration(appId, user.id);
          console.log('🔍 Verification load:', verification ? 'Success' : 'Failed');
        } catch (saveError) {
          console.error('❌ Save error:', saveError);
          throw saveError;
        }

        // Final success message - Enhanced Unique Generation completion
        const businessType = prompt.toLowerCase().includes('photographer') ? 'Photography Portfolio' :
          prompt.toLowerCase().includes('restaurant') ? 'Restaurant Website' :
            prompt.toLowerCase().includes('business') ? 'Business Website' :
              prompt.toLowerCase().includes('luxury') ? 'Luxury Brand Website' :
                prompt.toLowerCase().includes('tech') ? 'Tech Startup Website' :
                  'Professional Website';

        const finalMessage = `🎉 **UNIQUE Website Generated Successfully!**

I've created a **completely unique ${businessType}** with custom design - NO TEMPLATES USED! Your project includes:

**✨ What Makes This Unique:**
• **${projectFiles.length} Custom Files** - Generated from scratch with unique design
• **Custom Color Palette** - Dynamically generated colors, not hardcoded templates
• **Unique Typography** - Randomly selected from 25+ professional font pairings
• **Original Layout** - Chosen from 8 different layout variations
• **Signature Elements** - Unique visual features specific to your site
• **Industry Intelligence** - Design tailored to your specific business type

**🎨 Design Features:**
• **No Template Feel** - Every element designed specifically for your business
• **Professional Quality** - Maintains high standards while being unique
• **Responsive Design** - Mobile-first, works perfectly on all devices
• **Modern Technology** - React + TypeScript + Tailwind CSS + Framer Motion
• **Performance Optimized** - Fast loading, SEO-ready structure

**🚀 Ready to Launch:**
Your **unique ${businessType}** is now ready for the next steps. You can:

• **👀 Preview** - See your unique website in the preview panel
• **✏️ Customize** - Describe any changes you'd like to make
• **📥 Download** - Get the complete project files for local development  
• **🌐 Deploy** - Launch your site live on the internet
• **💻 View Code** - Inspect the generated files in the Code tab

**📁 Type:** Unique ${businessType} (No Template)
**FILES_CREATED:${projectFiles.length}**
**PROGRESS:100**
**STATUS:🎯 Ready to preview and deploy!**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}**
**UNIQUENESS:✅ Custom colors, fonts, and layouts**

**Congratulations!** Your **unique ${businessType}** is complete and ready to impress your visitors. 🎊

---

**📋 Enhanced Generation Summary:**
✅ Deep business analysis completed
✅ Custom design brief created
✅ Unique color palette generated
✅ Professional font pairing selected
✅ Original layout structure implemented
✅ Custom components built from scratch
✅ All ${projectFiles.length} files created with unique design

**🎨 Uniqueness Guaranteed:**
• **Colors:** Dynamically generated, not from templates
• **Fonts:** Randomly selected from curated professional pairings
• **Layout:** Chosen from 8+ different structural variations
• **Content:** Industry-specific, tailored to your business

**💬 Continue the conversation above to make any changes or ask questions!**

**📜 Your complete conversation history is preserved** - scroll up to see all the progress steps that led to your finished unique website!`;

        // Add a separator message to show preview is ready
        addMessageToPermanentStore({
          role: 'assistant',
          content: `🎉 **Preview Ready!**

Your website is now live in the preview panel on the right! 

**👀 Check out your new website** - it should be loading now with all the features we built together.

**🔒 PERMANENT MEMORY:** All conversation history above is preserved forever!

---`
        });

        // CRITICAL FIX: Add the final message to permanent store
        console.log('🎯 Adding final success message to permanent store (bulletproof preservation)');
        addMessageToPermanentStore({
          role: 'assistant',
          content: finalMessage
        });
        console.log('✅ Final message added to permanent store, total messages:', permanentMessagesRef.current.length);
        console.log('🔒 BULLETPROOF: Complete conversation preserved in permanent memory');
        console.log('💾 This complete conversation will be saved to database to prevent loss on preview');

        setGenerationStatus('complete');

        // CRITICAL: Ensure conversation remains protected after completion
        console.log('🔒 Ensuring conversation remains protected after generation completion');

        // Keep protection active even after generation completes
        setTimeout(() => {
          console.log('🔒 Maintaining conversation protection after preview appears');
        }, 1000);
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

      // Update chat with user-friendly error message using permanent store
      updateLastMessageInPermanentStore(`❌ Oops! Something went wrong while generating your website.\n\n**Error:** ${error instanceof Error ? error.message : 'Unknown error'}\n\nDon't worry - your credits have been refunded. Click the Retry button to try again, or rephrase your request.`);

      // Refund credit on error
      setCreditsRemaining(prev => prev + 1);
    } finally {
      setIsGenerating(false);
      setGenerationStatus('idle');
      abortControllerRef.current = null;
    }
  };

  // Update ref for event listeners
  sendMessageRef.current = sendMessage;

  // Retry last failed generation
  const handleRetry = () => {
    if (lastError) {
      setShowErrorModal(false);
      setCurrentMessage(lastError.prompt);
      setLastError(null);
      // Trigger send after a brief delay
      setTimeout(() => sendMessage(lastError.prompt), 100);
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
    addMessageToPermanentStore({
      role: 'assistant',
      content: `🚀 **Deploying your website to Vercel...**

**Deployment Process:**
• Preparing project files for deployment
• Uploading to Vercel infrastructure  
• Building production version
• Configuring domain and SSL
• Going live!

**FILES_CREATED:${projectFiles.length}**
**PROGRESS:0**
**STATUS:Starting deployment**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}`
    });

    let progressLog = `🚀 **Deploying your website to Vercel...**

**Deployment Process:**
• Preparing project files for deployment
• Uploading to Vercel infrastructure  
• Building production version
• Configuring domain and SSL
• Going live!

**FILES_CREATED:${projectFiles.length}**
**PROGRESS:0**
**STATUS:Starting deployment**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}`;

    try {
      const result = await vercelDeploymentService.deployProject(
        projectFiles,
        appName.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
        (message) => {
          console.log('📊 Deployment progress:', message);

          // Update deployment progress with Lovable-style format
          const deploymentProgress = `🚀 **Deploying your website to Vercel...**

**Deployment Process:**
• Preparing project files for deployment
• Uploading to Vercel infrastructure  
• Building production version
• Configuring domain and SSL
• Going live!

**Current Status:** ${message}

**FILES_CREATED:${projectFiles.length}**
**PROGRESS:50**
**STATUS:${message}**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}`;

          // Update the last assistant message with progress
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1]?.role === 'assistant') {
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: deploymentProgress
              };
            }
            return newMessages;
          });
        }
      );

      if (result.success && result.url) {
        // Save deployment to database (non-blocking)
        try {
          await databaseService.saveDeployment(
            appId,
            user.id,
            result.deploymentId!,
            'vercel',
            'READY',
            result.url
          );
        } catch (dbError) {
          console.error('⚠️ Failed to save deployment history (non-fatal):', dbError);
        }

        setDeploymentUrl(result.url);

        // Final deployment success message
        const deploymentSuccess = `🚀 **Deployment Successful!**

🌐 **Your website is now LIVE:** ${result.url}

**🎯 Deployment Complete:**
• **${projectFiles.length} Files Deployed** - All project files uploaded successfully
• **Production Build** - Optimized and minified for best performance
• **SSL Certificate** - Secure HTTPS connection configured
• **Global CDN** - Fast loading worldwide
• **Custom Domain** - Professional URL ready to share

**🎉 Congratulations!** Your website is now live on the internet and ready for visitors!

**FILES_CREATED:${projectFiles.length}**
**PROGRESS:100**
**STATUS:🌐 Live and accessible worldwide!**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}**

**Share your success:** Copy the URL above and share it with anyone - your professional website is now accessible to the world! 🌍`;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: deploymentSuccess
          };
          return newMessages;
        });

      } else {
        // Deployment failed
        const errorMessage = result.error || 'Unknown error occurred during deployment';
        window.alert(`❌ Deployment Failed\n\n${errorMessage}`);

        const deploymentFailed = `❌ **Deployment failed**

**Error:** ${errorMessage}

**What you can do:**
• Try deploying again (temporary issues are common)
• Download the project files and deploy manually
• Check your Vercel account settings
• Contact support if the issue persists

**FILES_CREATED:${projectFiles.length}**
**PROGRESS:0**
**STATUS:Deployment failed**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}

Your project files are still available for download and manual deployment.`;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: deploymentFailed
          };
          return newMessages;
        });
      }

    } catch (error) {
      console.error('❌ Deployment error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      window.alert(`❌ Deployment Error\n\n${errorMessage}`);

      const deploymentError = `❌ **Deployment failed**

**Error:** ${errorMessage}

**Possible Solutions:**
• Check your Vercel token configuration
• Verify your Vercel account has sufficient resources
• Try again in a few minutes
• Download the project for manual deployment

**FILES_CREATED:${projectFiles.length}**
**PROGRESS:0**
**STATUS:Deployment error**
**FILE_LIST:${projectFiles.map(f => f.path).join('|')}

Your project files are ready for download if you'd like to deploy manually.`;

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: deploymentError
        };
        return newMessages;
      });
    } finally {
      setIsDeploying(false);
    }
  };

  // Capture screenshot of preview
  const handleCaptureScreenshot = async () => {
    setIsCapturingScreenshot(true);
    try {
      // Simple implementation: copy current URL to clipboard as a fallback
      // In a real implementation, you'd use html2canvas or similar
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${appName}-${previewMode}-${timestamp}.png`;

      // For now, just show a success message
      alert(`📸 Screenshot feature coming soon!\\n\\nFilename: ${filename}\\n\\nTip: Use your browser's built-in screenshot tool (Ctrl+Shift+S on Windows/Linux, Cmd+Shift+4 on Mac) for now.`);
    } catch (error) {
      console.error('Screenshot error:', error);
      alert('Failed to capture screenshot');
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  return (
    <TooltipProvider>
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

              {/* History Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!showHistoryDropdown) loadHistory();
                    setShowHistoryDropdown(!showHistoryDropdown);
                  }}
                  className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 transition-colors"
                  title="Version History"
                >
                  <Clock className="w-4 h-4 text-gray-600" />
                </button>

                {/* History Dropdown */}
                {showHistoryDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowHistoryDropdown(false)} />
                    <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-100 mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Version History</h3>
                      </div>
                      {websiteHistory.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No history available</div>
                      ) : (
                        websiteHistory.map((version, i) => (
                          <button
                            key={version.id}
                            onClick={() => loadHistoryVersion(version)}
                            className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                          >
                            <div className="mt-1 flex-shrink-0">
                              <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {version.prompt.substring(0, 50) || 'Unknown Version'}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(version.created_at).toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

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
                  className={`relative h-8 px-3 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === tab
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
            <FeedbackModule />
            {/* Download Button (Promoted) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDownloadWebsite}
                  disabled={!projectFiles.length}
                  className={`hidden sm:inline-flex items-center gap-2 h-8 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${!projectFiles.length
                    ? 'text-gray-300 bg-transparent cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">Download</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Project ZIP</p>
              </TooltipContent>
            </Tooltip>

            <button
              onClick={() => setShowLogsPanel(!showLogsPanel)}
              className={`inline-flex items-center gap-2 h-8 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${showLogsPanel
                ? 'text-blue-600 bg-blue-50 border border-blue-200'
                : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Play className="w-4 h-4" />
              Show logs
            </button>

            {/* Git Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowGitModal(true)}
                  disabled={!projectFiles.length}
                  className={`hidden sm:inline-flex items-center gap-2 h-8 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${!projectFiles.length
                    ? 'text-gray-300 bg-transparent cursor-not-allowed border border-transparent'
                    : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <GitBranch className="w-4 h-4" />
                  Git Sync
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sync with GitHub/GitLab</p>
              </TooltipContent>
            </Tooltip>
            {/* Deploy Button Removed - Merged into Publish */}

            {/* Publish Button */}
            <button
              onClick={() => setShowPublishModal(true)}
              className="inline-flex items-center gap-2 h-8 px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-black rounded-lg shadow-sm transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22V13M12 13L15.5 16.5M12 13L8.5 16.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 17.6073C21.4937 17.0221 23 15.6889 23 13C23 9 19.6667 8 18 8C18 6 18 2 12 2C6 2 6 6 6 8C4.33333 8 1 9 1 13C1 15.6889 2.50628 17.0221 4 17.6073" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Publish
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Hidden Notification */}
          {sidebarCollapsed && (
            <div className="absolute top-4 left-4 z-20 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Chat panel is hidden. Click the toggle button above to show it.
              </div>
            </div>
          )}

          {/* Left Sidebar - Chat (Always visible when not collapsed) */}
          {!sidebarCollapsed && (
            <div
              className="flex flex-col bg-white border-r border-gray-200 relative z-10 shadow-lg"
              style={{ width: `${sidebarWidth}px`, minWidth: '320px', maxWidth: '50%' }}
            >
              {/* Resize Handle - Drag to resize sidebar */}
              <div
                onMouseDown={handleMouseDown}
                className={`absolute top-0 right-0 w-1 h-full cursor-col-resize z-20 transition-colors ${isResizing ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-400'
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

              {/* Integrated Lovable Chat Module (Messages Only) */}
              <div className="flex-1 overflow-hidden relative">
                <LovableChatModule
                  initialMessages={messages.map((m, i) => parseToLovable(m, i))}
                  onSendMessage={sendMessage}
                  isGenerating={isGenerating}
                  hideInput={true}
                />
              </div>

              {/* Input Area */}
              <div className="px-4 pb-4 pt-3 relative">
                {/* Feature 6: Prompt Templates / Suggestions */}
                {!hasActiveConversation && !isGenerating && messages.length <= 1 && (
                  <PromptSuggestions onSelect={(prompt) => sendMessage(prompt)} />
                )}

                <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                  {/* Attached Files Display */}
                  {attachedFiles.length > 0 && (
                    <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-xs text-blue-700 font-medium truncate max-w-[150px]">{file.name}</span>
                            <button
                              onClick={() => removeAttachedFile(index)}
                              className="text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-full p-1 transition-colors"
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
                      className={`flex items-center justify-center size-10 rounded-xl border transition-all duration-200 ${attachedFiles.length >= 3
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                        : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      title={attachedFiles.length >= 3 ? 'Maximum 3 images (remove some first)' : `Attach images (${attachedFiles.length}/3)`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>


                    {/* Discuss */}
                    <button
                      onClick={() => setIsDiscussMode(!isDiscussMode)}
                      className={`inline-flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${isDiscussMode
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-150 text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                    >
                      <MessageCircle className={`w-4 h-4 ${isDiscussMode ? 'text-blue-600' : 'text-gray-600'}`} />
                      <span>Discuss</span>
                    </button>
                    <div className="flex-1"></div>
                    {/* Send/Stop Button - Conditional based on generation state */}
                    {isGenerating ? (
                      <button
                        onClick={() => {
                          if (abortControllerRef.current) {
                            abortControllerRef.current.abort();

                            // Force update current message to complete so cursor vanishes
                            const permanent = [...permanentMessagesRef.current];
                            if (permanent.length > 0) {
                              const last = permanent[permanent.length - 1];
                              if (last.role === 'assistant' && last.content.includes('CHAIN_OF_THOUGHT')) {
                                try {
                                  const match = last.content.match(/CHAIN_OF_THOUGHT_LOVABLE:(.+)/s);
                                  if (match && match[1]) {
                                    const data = JSON.parse(match[1]);
                                    data.isComplete = true; // FORCE COMPLETE
                                    last.content = `CHAIN_OF_THOUGHT_LOVABLE:${JSON.stringify(data)}`;
                                    // Update state immediately to reflect stop
                                    setMessages(permanent.map((m, i) => parseToLovable(m, i)));
                                  }
                                } catch (e) {
                                  console.error('Failed to force stop message', e);
                                }
                              }
                            }

                            setIsGenerating(false);
                            setGenerationStatus('idle');
                            addMessageToPermanentStore({
                              role: 'assistant',
                              content: '⏹️ Generation stopped by user.'
                            });
                          }
                        }}
                        className="flex items-center justify-center size-10 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
                        title="Stop generation"
                      >
                        <X className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button
                        onClick={() => sendMessage()}
                        disabled={!currentMessage.trim() || creditsRemaining === 0}
                        className={`flex items-center justify-center size-10 rounded-full transition-all ${creditsRemaining === 0
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
          )
          }

          {/* Right Panel - Preview/Content */}
          <div className="flex-1 flex flex-col bg-[#fafafa]">

            {/* Sidebar Restore Toolbar (For non-Build tabs) */}
            {activeTab !== 'Build' && sidebarCollapsed && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#fafafa] border-b border-gray-200">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="flex items-center justify-center size-8 rounded-xl hover:bg-blue-100 bg-blue-50 border border-blue-200"
                  title="Show Chat Panel"
                >
                  <PanelLeftClose className="w-4 h-4 text-blue-600 rotate-180" />
                </button>
                <span className="text-sm font-medium text-gray-500">{activeTab} View</span>
              </div>
            )}

            {/* Preview Toolbar (Only for Build tab) */}
            {activeTab === 'Build' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#fafafa] border-b border-gray-200">
                {/* Left Controls */}
                <div className="flex items-center gap-1">
                  {sidebarCollapsed && (
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      className="flex items-center justify-center size-8 rounded-xl hover:bg-blue-100 bg-blue-50 border border-blue-200"
                      title="Show Chat Panel"
                    >
                      <PanelLeftClose className="w-4 h-4 text-blue-600 rotate-180" />
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

                  <button
                    onClick={() => setIsInspectorActive(!isInspectorActive)}
                    className={`flex items-center justify-center size-8 rounded-xl transition-all ${isInspectorActive ? 'bg-blue-100 ring-2 ring-blue-500 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    title={isInspectorActive ? "Exit Select Mode" : "Select element to edit"}
                  >
                    <MousePointer2 className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 transition-colors ${previewMode === 'desktop' ? 'bg-blue-50 border border-blue-200' : ''}`}
                    title="Desktop view"
                  >
                    <Monitor className={`w-4 h-4 ${previewMode === 'desktop' ? 'text-blue-600' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 transition-colors ${previewMode === 'tablet' ? 'bg-blue-50 border border-blue-200' : ''}`}
                    title="Tablet view (768px)"
                  >
                    <Tablet className={`w-4 h-4 ${previewMode === 'tablet' ? 'text-blue-600' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 transition-colors ${previewMode === 'mobile' ? 'bg-blue-50 border border-blue-200' : ''}`}
                    title="Mobile view (375px)"
                  >
                    <Smartphone className={`w-4 h-4 ${previewMode === 'mobile' ? 'text-blue-600' : 'text-gray-600'}`} />
                  </button>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-200 mx-1"></div>

                  {/* Screenshot Button */}
                  <button
                    onClick={handleCaptureScreenshot}
                    disabled={isCapturingScreenshot}
                    className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Capture screenshot"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>

                  <button className="flex items-center justify-center size-8 rounded-xl hover:bg-gray-100" title="Fullscreen">
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'Build' && (
              <div className="flex-1 flex flex-col relative">
                {/* Preview Area */}
                <div className={`preview-area flex-1 relative ${showLogsPanel ? 'pb-0' : ''}`}>
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
                    <div className={`w-full h-full flex items-center justify-center ${previewMode !== 'desktop' ? 'bg-gray-100' : ''}`}>
                      <div className={previewMode !== 'desktop' ? 'relative' : 'w-full h-full'}>
                        {/* Mobile Device Frame */}
                        {previewMode === 'mobile' && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="w-[375px] h-full mx-auto border-[14px] border-gray-800 rounded-[36px] shadow-2xl">
                              {/* Notch */}
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-800 rounded-b-3xl"></div>
                            </div>
                          </div>
                        )}

                        {/* Tablet Device Frame */}
                        {previewMode === 'tablet' && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="w-[768px] h-full mx-auto border-[16px] border-gray-700 rounded-[24px] shadow-2xl">
                              {/* Camera */}
                              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full"></div>
                            </div>
                          </div>
                        )}

                        {/* Live React Preview */}
                        {(() => {
                          console.log('🔍 Preview condition check:', {
                            generatedWebsite,
                            isStackBlitzMode: generatedWebsite === 'REACT_PROJECT_STACKBLITZ_PREVIEW',
                            projectFilesCount: projectFiles.length,
                            shouldShowPreview: generatedWebsite === 'REACT_PROJECT_STACKBLITZ_PREVIEW' && projectFiles.length > 0
                          });
                          return generatedWebsite === 'REACT_PROJECT_STACKBLITZ_PREVIEW' && projectFiles.length > 0;
                        })() ? (
                          // WebContainer Preview for React projects
                          <div className={`${previewMode === 'mobile'
                            ? 'w-[375px] h-[667px] mx-auto rounded-[22px] shadow-xl overflow-hidden'
                            : previewMode === 'tablet'
                              ? 'w-[768px] h-[1024px] mx-auto rounded-[16px] shadow-xl overflow-hidden'
                              : 'w-full h-full'
                            }`}>
                            <BulletproofPreview
                              projectId={appId || 'default'}
                              projectName={appName}
                              generatedFiles={projectFiles.map(f => ({ path: f.path, content: f.content }))}
                              inspectorMode={isInspectorActive}
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
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to build your website?</h3>
                        <p className="text-sm text-gray-500 mb-1">Describe your project in the chat to get started.</p>
                        <p className="text-sm text-gray-500 mb-8">I'll create a unique, professional website tailored to your needs!</p>
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
              <div className="flex-1 overflow-hidden h-full">
                {projectFiles.length > 0 ? (
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  }>
                    <CodeEditor
                      initialFiles={projectFiles}
                      selectedFile={selectedFilePath || undefined}
                      onFileChange={(path, newContent) => {
                        // Update local state to persist edits
                        setProjectFiles(prev => prev.map(f =>
                          f.path === path ? { ...f, content: newContent } : f
                        ));
                      }}
                      className="h-full"
                    />
                  </Suspense>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 h-full">
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
            )}

            {activeTab === 'Terminal' && (
              <div className="flex-1 flex flex-col p-4">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Terminal</h2>
                    <p className="text-sm text-gray-600">
                      Run commands directly in your project sandbox.
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => terminal.writeData('npm install\r')}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <span className="text-red-500">📥</span> npm install
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Install dependencies</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => terminal.writeData('npm run dev\r')}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <span className="text-green-500">▶️</span> npm run dev
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start development server</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => terminal.writeData('npm run build\r')}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <span className="text-blue-500">📦</span> npm run build
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Build for production</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => terminal.writeData('ls -la\r')}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <span className="text-gray-500">📂</span> ls -la
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>List all files (including hidden)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
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
        </div >

        {/* Deployment Modal (Loading & Success) */}
        {/* Deployment Modal (Real Vercel Integration) */}
        <DeploymentModal
          isOpen={showDeployModal}
          onClose={() => setShowDeployModal(false)}
          projectFiles={projectFiles}
          projectName={appName}
        />

        {/* Git Sync Modal */}
        {showGitModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowGitModal(false)}>
            <div
              className="bg-white rounded-xl w-[500px] shadow-xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-gray-700" />
                  Git Sync
                </h2>
                <button
                  onClick={() => setShowGitModal(false)}
                  className="flex items-center justify-center size-7 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <button className="flex-1 py-3 px-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-700 font-medium flex items-center justify-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    GitHub
                  </button>
                  <button className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium flex items-center justify-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .41.26l2.47 7.58h8.6l2.47-7.58A.43.43 0 0 1 19.18 2a.42.42 0 0 1 .1.11.42.42 0 0 1 .01.12l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94zM12 4.81L9.68 11h4.64L12 4.81zM4.61 12.33l-1.4 4.3 8.79 6.38-7.39-10.68zM19.39 12.33l-7.39 10.68 8.79-6.38-1.4-4.3z" /></svg>
                    GitLab
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Create Repository</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Repository name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={appName.toLowerCase().replace(/\s+/g, '-')}
                      />
                      <button
                        onClick={() => {
                          const commands = `
# Initializing Git...
git init
# Adding files...
git add .
# Committing...
git commit -m 'Initial commit from AppBuilder'
`;
                          terminal.writeData(commands.replace(/\n/g, '\r\n'));
                          alert("✅ Git repository initialized locally! Check the Terminal tab to see logs.");
                          setShowGitModal(false);
                          setActiveTab('Terminal');
                        }}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Initialize
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Push to Remote</h3>
                    <p className="text-xs text-gray-500 mb-3">Connect your account to push changes to GitHub.</p>
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm font-medium">Connected as {user.email}</span>
                        </div>
                        <button
                          onClick={() => {
                            terminal.writeData(`
# Pushing to remote...
git remote add origin https://github.com/${user.user_metadata?.user_name || 'user'}/${appName.toLowerCase().replace(/\s+/g, '-')}.git
git branch -M main
git push -u origin main
`.replace(/\n/g, '\r\n'));
                            alert("Since this is a web container, we can't truly push to external GitHub yet without a proxy server, but the commands were executed!");
                          }}
                          className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black flex items-center justify-center gap-2 transition-colors"
                        >
                          <GitBranch className="w-4 h-4" />
                          Push to GitHub
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => signInWithGitHub(window.location.href)}
                        className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        Connect GitHub Account
                      </button>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Git Config</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Git Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="email" placeholder="Git Email" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-between items-center text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  Local repo not found
                </span>
                <a href="#" className="hover:text-blue-600">Learn more about Git</a>
              </div>
            </div>
          </div>
        )}


        {
          showPublishModal && (
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
                      <select
                        className="appearance-none inline-flex items-center gap-2 px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="Published"
                      >
                        <option value="Published">Published</option>
                        <option value="Unpublished">Unpublished</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Visibility Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Visibility</span>
                    <div className="relative">
                      <select
                        className="appearance-none inline-flex items-center gap-2 px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="Public"
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => {
                      setShowPublishModal(false);
                      handleDeploy();
                    }}
                    disabled={isDeploying}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                    {isDeploying ? 'Deploying...' : 'Publish App'}
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Error Modal */}
        {
          showErrorModal && lastError && (
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
          )
        }

        {/* Onboarding Modal (Self-managed) */}
        <OnboardingModal />


      </div >
    </TooltipProvider>
  );
}
