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
    name: 'OpenRouter',
    apiKey: '', // Disabled due to daily rate limits
    model: 'google/gemini-2.0-flash-exp:free', // Free Gemini 2.0 Flash
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 4000,
    temperature: 0.7
  }
};

// Default provider - prioritize free and reliable ones
export const DEFAULT_PROVIDER = 'google'; // Gemini is free and reliable

/**
 * Get available AI provider with API key
 * Priority: google (gemini) > groq > openai > others
 */
export const getAvailableProvider = (): AIProvider | null => {
  // Priority order: avoid rate-limited providers first
  const priorityOrder = ['openai', 'groq', 'aiml', 'chute', 'google'];
  
  // Try priority providers first
  for (const key of priorityOrder) {
    const provider = AI_PROVIDERS[key];
    if (provider && provider.apiKey && provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE') {
      console.log(`✅ Using AI provider: ${provider.name}`);
      return provider;
    }
  }
  
  // Fallback to any available provider
  for (const [, provider] of Object.entries(AI_PROVIDERS)) {
    if (provider.apiKey && provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE') {
      console.log(`✅ Using AI provider: ${provider.name}`);
      return provider;
    }
  }
  
  console.error('❌ No AI provider available with valid API key');
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

// Rate limiting and retry logic
export const RATE_LIMITS = {
  openai: { requestsPerMinute: 60, tokensPerMinute: 90000 },
  anthropic: { requestsPerMinute: 50, tokensPerMinute: 40000 },
  google: { requestsPerMinute: 60, tokensPerMinute: 32000 },
  grok: { requestsPerMinute: 60, tokensPerMinute: 100000 },
  qubrid: { requestsPerMinute: 60, tokensPerMinute: 50000 },
  openrouter: { requestsPerMinute: 200, tokensPerMinute: 1000000 } // Free models, generous limits
};

export function shouldRetry(_provider: string, error: any): boolean {
  const retryableErrors = [
    'rate_limit_exceeded',
    'timeout',
    'connection_error',
    'temporary_error'
  ];
  
  const errorCode = error?.error?.code || error?.error?.type;
  return retryableErrors.includes(errorCode) || 
         (error?.status >= 500 && error?.status < 600);
}

export function getRetryDelay(attemptNumber: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s
  return Math.min(1000 * Math.pow(2, attemptNumber), 16000);
}
