// AI Provider Configuration
// Similar to Bolt.diy's multi-provider support

export interface AIProvider {
  name: string;
  apiKey: string;
  model: string;
  endpoint: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const AI_PROVIDERS: Record<string, AIProvider> = {
  openai: {
    name: 'OpenAI',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  google: {
    name: 'Google Gemini',
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
    model: 'gemini-2.5-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
    maxTokens: 8000,
    temperature: 0.7
  },
  chute: {
    name: 'Chute AI',
    apiKey: import.meta.env.VITE_CHUTE_API_KEY || '',
    model: 'chute-default',
    endpoint: 'https://api.chute.ai/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  aiml: {
    name: 'AIML API',
    apiKey: import.meta.env.VITE_AIML_API_KEY || '',
    model: 'aiml-default',
    endpoint: 'https://api.aimlapi.com/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  groq: {
    name: 'Groq',
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    model: 'llama-3.1-8b-instant',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  anthropic: {
    name: 'Anthropic',
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    model: 'claude-3-sonnet-20240229',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 4000,
    temperature: 0.7
  },
  grok: {
    name: 'Grok (xAI)',
    apiKey: import.meta.env.VITE_GROK_API_KEY || '',
    model: 'grok-4-latest',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  qubrid: {
    name: 'Qubrid AI',
    apiKey: import.meta.env.VITE_QUBRID_API_KEY || '',
    model: 'Qwen/Qwen3-VL-8B-Instruct',
    endpoint: 'https://platform.qubrid.com/api/v1/qubridai/multimodal/chat',
    maxTokens: 2048,
    temperature: 0.7
  },
  openrouter: {
    name: 'OpenRouter - Llama 3.3 70B',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter2: {
    name: 'OpenRouter - Mistral Small 3.1',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'mistralai/mistral-small-3.1-24b-instruct:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter3: {
    name: 'OpenRouter - Hermes 3 405B',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'nousresearch/hermes-3-llama-3.1-405b:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter4: {
    name: 'OpenRouter - Gemini 2.0 Flash',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'google/gemini-2.0-flash-exp:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter5: {
    name: 'OpenRouter - Gemma 3 27B',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'google/gemma-3-27b-it:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter6: {
    name: 'OpenRouter - Qwen3 235B',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'qwen/qwen3-235b-a22b:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter7: {
    name: 'OpenRouter - DeepSeek V3.1',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'nex-agi/deepseek-v3.1-nex-n1:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter8: {
    name: 'OpenRouter - Devstral 2512',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'mistralai/devstral-2512:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter9: {
    name: 'OpenRouter - Trinity Mini',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'arcee-ai/trinity-mini:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter10: {
    name: 'OpenRouter - Llama 3.2 3B',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter11: {
    name: 'OpenRouter - Mistral 7B',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'mistralai/mistral-7b-instruct:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  },
  openrouter12: {
    name: 'OpenRouter - Gemma 3 12B',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'google/gemma-3-12b-it:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  }
};

// Default provider - prioritize free OpenRouter models
export const DEFAULT_PROVIDER = 'openrouter'; // Start with first OpenRouter model

// Provider rotation for avoiding rate limits
let currentProviderIndex = 0;
const OPENROUTER_PROVIDERS = [
  'openrouter', 'openrouter2', 'openrouter3', 'openrouter4', 
  'openrouter5', 'openrouter6', 'openrouter7', 'openrouter8',
  'openrouter9', 'openrouter10', 'openrouter11', 'openrouter12'
];

/**
 * Get next OpenRouter provider in rotation
 */
export const getNextOpenRouterProvider = (): string => {
  const provider = OPENROUTER_PROVIDERS[currentProviderIndex];
  currentProviderIndex = (currentProviderIndex + 1) % OPENROUTER_PROVIDERS.length;
  return provider;
};

/**
 * Get available AI provider with API key
 * DEVELOPMENT MODE: Use providers with available quota
 */
export const getAvailableProvider = (): AIProvider | null => {
  // PRIORITY ORDER: Use working providers first
  // Google Gemini API key is BLOCKED (leaked)
  // OpenRouter models exhausted
  // Use: Groq, AIML, Chute which have quota
  
  const priorityOrder = [
    'groq',    // Groq - fast and free, PRIORITY
    'aiml',    // AIML API - has quota
    'chute',   // Chute AI - backup
    'openrouter8', 'openrouter9', 'openrouter10', 'openrouter11', 'openrouter12', // Try newer OpenRouter models
    'openrouter', 'openrouter2', 'openrouter3', 'openrouter4', 'openrouter5', 'openrouter6', 'openrouter7'
  ];
  
  for (const key of priorityOrder) {
    const provider = AI_PROVIDERS[key];
    if (provider && provider.apiKey && provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE') {
      console.log(`✅ Using AI provider: ${provider.name} (${provider.model || 'default'})`);
      return provider;
    }
  }
  
  // Last resort: try any available provider
  for (const [, provider] of Object.entries(AI_PROVIDERS)) {
    if (provider.apiKey && provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE') {
      console.log(`✅ Using any available AI provider: ${provider.name}`);
      return provider;
    }
  }
  
  console.error('❌ No AI provider available with valid API key');
  return null;
};

/**
 * Get specific provider by name (for manual selection)
 */
export const getProviderByName = (providerName: string): AIProvider | null => {
  const provider = AI_PROVIDERS[providerName];
  if (provider && provider.apiKey && provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE') {
    console.log(`✅ Using specific AI provider: ${provider.name} (${provider.model})`);
    return provider;
  }
  return null;
};

/**
 * Get next available provider when current one fails
 * This ensures we always have a backup when hitting rate limits
 */
export const getNextAvailableProvider = (failedProvider?: string): AIProvider | null => {
  // If an OpenRouter provider failed, try the next one in rotation
  if (failedProvider && failedProvider.startsWith('openrouter')) {
    console.log(`🔄 OpenRouter provider ${failedProvider} failed, trying next in rotation...`);
    
    // Try next few OpenRouter providers
    for (let i = 0; i < OPENROUTER_PROVIDERS.length; i++) {
      const nextProvider = getNextOpenRouterProvider();
      if (nextProvider !== failedProvider) {
        const provider = AI_PROVIDERS[nextProvider];
        if (provider && provider.apiKey && provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE') {
          console.log(`✅ Switched to OpenRouter provider: ${provider.name} (${provider.model})`);
          return provider;
        }
      }
    }
  }
  
  // Fallback to non-OpenRouter providers
  const fallbackOrder = ['groq', 'aiml', 'chute', 'google', 'openai'];
  
  for (const key of fallbackOrder) {
    if (key === failedProvider) continue; // Skip the failed provider
    
    const provider = AI_PROVIDERS[key];
    if (provider && provider.apiKey && provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE') {
      console.log(`✅ Using fallback AI provider: ${provider.name}`);
      return provider;
    }
  }
  
  console.error('❌ No alternative AI provider available');
  return null;
};

// Provider-specific request formatting
export function formatRequest(provider: string, prompt: string): any {
  switch (provider) {
    case 'openai':
    case 'groq':
    case 'aiml':
    case 'chute':
    case 'openrouter':
    case 'openrouter2':
    case 'openrouter3':
    case 'openrouter4':
    case 'openrouter5':
    case 'openrouter6':
    case 'openrouter7':
    case 'openrouter8':
    case 'openrouter9':
    case 'openrouter10':
    case 'openrouter11':
    case 'openrouter12':
      // OpenAI-compatible format
      return {
        model: AI_PROVIDERS[provider].model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer and content creator. Generate high-quality, unique content based on user requests.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: AI_PROVIDERS[provider].maxTokens,
        temperature: AI_PROVIDERS[provider].temperature
      };
    
    case 'anthropic':
      return {
        model: AI_PROVIDERS.anthropic.model,
        max_tokens: AI_PROVIDERS.anthropic.maxTokens,
        messages: [{ role: 'user', content: prompt }]
      };
    
    case 'google':
      return {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: AI_PROVIDERS.google.temperature,
          maxOutputTokens: AI_PROVIDERS.google.maxTokens
        }
      };
    
    case 'grok':
      return {
        model: AI_PROVIDERS.grok.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: AI_PROVIDERS.grok.maxTokens,
        temperature: AI_PROVIDERS.grok.temperature
      };
    
    case 'qubrid':
      return {
        model: AI_PROVIDERS.qubrid?.model || 'default',
        messages: [{ role: 'user', content: prompt }],
        temperature: AI_PROVIDERS.qubrid?.temperature || 0.7,
        max_tokens: AI_PROVIDERS.qubrid?.maxTokens || 4000,
        top_p: 0.9
      };
    
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Parse provider-specific responses
export function parseResponse(provider: string, response: any): AIResponse {
  switch (provider) {
    case 'openai':
    case 'groq':
    case 'aiml':
    case 'chute':
    case 'openrouter':
    case 'openrouter2':
    case 'openrouter3':
    case 'openrouter4':
    case 'openrouter5':
    case 'openrouter6':
    case 'openrouter7':
    case 'openrouter8':
    case 'openrouter9':
    case 'openrouter10':
    case 'openrouter11':
    case 'openrouter12':
      // OpenAI-compatible response format
      return {
        content: response.choices[0]?.message?.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined
      };
    
    case 'anthropic':
      return {
        content: response.content[0]?.text || '',
        usage: response.usage ? {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        } : undefined
      };
    
    case 'google':
      return {
        content: response.candidates[0]?.content?.parts[0]?.text || '',
        usage: response.usageMetadata ? {
          promptTokens: response.usageMetadata.promptTokenCount,
          completionTokens: response.usageMetadata.candidatesTokenCount,
          totalTokens: response.usageMetadata.totalTokenCount
        } : undefined
      };
    
    case 'grok':
      return {
        content: response.choices[0]?.message?.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined
      };
    
    case 'qubrid':
      return {
        content: response.choices?.[0]?.message?.content || response.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens || 0,
          completionTokens: response.usage.completion_tokens || 0,
          totalTokens: response.usage.total_tokens || 0
        } : undefined
      };
    
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Error handling for different providers
export function handleProviderError(provider: string, error: any): Error {
  const errorMessage = error?.error?.message || error?.message || 'Unknown error occurred';
  
  // Handle OpenRouter providers (all use same error handling)
  if (provider.startsWith('openrouter')) {
    if (error?.error?.code === 'invalid_api_key') {
      return new Error('Invalid OpenRouter API key. Please check your configuration.');
    }
    if (error?.error?.code === 'insufficient_quota' || error?.status === 429) {
      return new Error(`OpenRouter model ${AI_PROVIDERS[provider]?.model} daily limit reached. Trying next model...`);
    }
    if (error?.error?.code === 'model_not_found') {
      return new Error(`OpenRouter model ${AI_PROVIDERS[provider]?.model} not available. Trying next model...`);
    }
  }
  
  switch (provider) {
    case 'openai':
      if (error?.error?.code === 'insufficient_quota') {
        return new Error('OpenAI API quota exceeded. Please check your billing.');
      }
      if (error?.error?.code === 'invalid_api_key') {
        return new Error('Invalid OpenAI API key. Please check your configuration.');
      }
      break;
    
    case 'anthropic':
      if (error?.error?.type === 'authentication_error') {
        return new Error('Invalid Anthropic API key. Please check your configuration.');
      }
      break;
    
    case 'google':
      if (error?.error?.status === 'PERMISSION_DENIED') {
        return new Error('Invalid Google AI API key. Please check your configuration.');
      }
      break;
    
    case 'grok':
      if (error?.error?.code === 'invalid_api_key') {
        return new Error('Invalid Grok API key. Please check your configuration.');
      }
      if (error?.error?.code === 'insufficient_quota') {
        return new Error('Grok API quota exceeded. Please check your billing.');
      }
      break;
    
    case 'qubrid':
      if (error?.error?.code === 'invalid_api_key') {
        return new Error('Invalid Qubrid API key. Please check your configuration.');
      }
      if (error?.error?.code === 'insufficient_quota') {
        return new Error('Qubrid API quota exceeded. Please check your billing.');
      }
      break;
  }
  
  return new Error(`${AI_PROVIDERS[provider]?.name || 'AI'} API Error: ${errorMessage}`);
}

// DEVELOPMENT MODE: No rate limiting during development phase
export const RATE_LIMITS = {
  // All limits removed for development - user requested no limits during dev phase
  openai: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  anthropic: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  google: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  grok: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  qubrid: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  openrouter: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  groq: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  aiml: { requestsPerMinute: Infinity, tokensPerMinute: Infinity },
  chute: { requestsPerMinute: Infinity, tokensPerMinute: Infinity }
};

export function shouldRetry(_provider: string, error: any): boolean {
  // In development mode, only retry on server errors, not rate limits
  const retryableErrors = [
    'timeout',
    'connection_error',
    'temporary_error'
  ];
  
  const errorCode = error?.error?.code || error?.error?.type;
  return retryableErrors.includes(errorCode) || 
         (error?.status >= 500 && error?.status < 600);
}

export function getRetryDelay(attemptNumber: number): number {
  // Faster retry in development: 0.5s, 1s, 2s, 4s, 8s
  return Math.min(500 * Math.pow(2, attemptNumber), 8000);
}
