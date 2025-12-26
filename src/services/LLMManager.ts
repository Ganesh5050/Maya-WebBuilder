import { AI_PROVIDERS, getAvailableProvider, getProviderByName, AIProvider, formatRequest, parseResponse } from '../config/aiProviders';

export enum TaskType {
    CODE_GENERATION = 'code_generation',
    CREATIVE_WRITING = 'creative_writing',
    ANALYSIS = 'analysis',
    CHAT = 'chat',
    VISION = 'vision'
}

/**
 * Intelligent LLM Manager
 * Handles invisible model switching based on task requirements
 * as requested in Feature 12 (Backend Auto-Routing).
 */
export class LLMManager {
    private static instance: LLMManager;
    private constructor() { }

    static getInstance(): LLMManager {
        if (!LLMManager.instance) {
            LLMManager.instance = new LLMManager();
        }
        return LLMManager.instance;
    }

    /**
     * Intelligently selects the best available provider for the given task.
     * Prioritizes specialized models (e.g., Claude for coding) if keys are available.
     * Falls back to standard rotation if primary choice is missing/exhausted.
     */
    getBestProviderForTask(task: TaskType): AIProvider | null {
        console.log(`🤖 LLMManager: Selecting best model for task: ${task}`);

        let preferredProviderNames: string[] = [];

        switch (task) {
            case TaskType.CODE_GENERATION:
                // Coding: Anthropic (Claude 3.5 Sonnet) is SOTA, followed by GPT-4o
                preferredProviderNames = ['anthropic', 'openai', 'openrouter_claude', 'openrouter_gpt4', 'google', 'openrouter'];
                break;

            case TaskType.CREATIVE_WRITING:
                // Writing: GPT-4o often has better flow, Claude is also excellent
                preferredProviderNames = ['openai', 'anthropic', 'google', 'openrouter'];
                break;

            case TaskType.ANALYSIS:
                // Analysis: Large context is key. Claude 3.5 / Gemini 1.5 Pro
                preferredProviderNames = ['anthropic', 'openai', 'google', 'openrouter_gemini', 'openrouter'];
                break;

            case TaskType.VISION:
                // Vision: GPT-4o is standard, Gemini is also strong
                preferredProviderNames = ['openai', 'google', 'anthropic'];
                break;

            case TaskType.CHAT:
            default:
                // Chat: Optimized for speed (Groq) then quality
                preferredProviderNames = ['groq', 'openai', 'anthropic', 'google', 'openrouter'];
                break;
        }

        // 1. Try to find a working preferred provider
        for (const name of preferredProviderNames) {
            const provider = getProviderByName(name);
            if (provider) {
                console.log(`✨ LLMManager: specialized provider '${name}' found for ${task}.`);
                return provider;
            }
        }

        // 2. Fallback to general availability rotation
        console.log(`⚠️ LLMManager: No specialized provider found for ${task}. Falling back to general rotation.`);
        return getAvailableProvider();
    }

    /**
     * Generates a response using the best model for the task.
     * Handles retry logic and seamless fallback.
     */
    async generateResponse(
        prompt: string,
        task: TaskType,
        systemPrompt?: string,
        preferredProviderName?: string
    ): Promise<string> {
        let provider: AIProvider | null = null;

        // Manual override (Feature 11)
        if (preferredProviderName && preferredProviderName !== 'auto') {
            provider = getProviderByName(preferredProviderName);
            if (provider) console.log(`🎯 LLMManager: User manually selected '${preferredProviderName}'`);
        }

        // Auto-routing (Feature 12)
        if (!provider) {
            provider = this.getBestProviderForTask(task);
        }

        if (!provider) throw new Error('No AI provider available');

        // Find key string
        const providerKey = Object.keys(AI_PROVIDERS).find(k => AI_PROVIDERS[k] === provider) || 'openai';

        // Format Request
        // Note: formatRequest in aiProviders handles standard prompting.
        // If systemPrompt is provided, we might need to inject it manually if formatRequest doesn't support it fully
        // But formatRequest implementation (viewed earlier) hardcodes a system prompt.
        // We will verify if we can override it later. For now, we rely on the prompt or default system prompt.

        let requestData = formatRequest(providerKey, prompt);

        // Override System Prompt if possible & supported
        if (systemPrompt && (providerKey === 'openai' || providerKey === 'anthropic' || providerKey.startsWith('openrouter'))) {
            // OpenAI format: messages array
            if (requestData.messages && Array.isArray(requestData.messages)) {
                // Replace the default system prompt at index 0
                if (requestData.messages[0].role === 'system') {
                    requestData.messages[0].content = systemPrompt;
                }
            }
        }

        return this.executeRequest(provider, requestData, providerKey);
    }


    /**
     * FEATURE 46: Auto-generate assets (Images) using DALL-E 3
     * Returns null if DALL-E is not available (fallback to Unsplash/Pollinations)
     */
    async generateImage(prompt: string, size: string = "1024x1024"): Promise<string | null> {
        // Only OpenAI supports DALL-E generation in our setup
        const provider = getProviderByName('openai');

        if (!provider || !provider.apiKey || provider.apiKey === 'YOUR_API_KEY_HERE') {
            return null; // Fallback
        }

        console.log(`🎨 Generating Image with DALL-E 3: "${prompt}"`);

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${provider.apiKey}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: prompt,
                    n: 1,
                    size: size,
                    quality: "standard",
                    response_format: "url"
                })
            });

            if (!response.ok) {
                console.warn('❌ DALL-E generation failed, falling back...');
                return null;
            }

            const data = await response.json();
            if (data.data && data.data[0] && data.data[0].url) {
                return data.data[0].url;
            }
            return null;
        } catch (e) {
            console.error('❌ DALL-E Request Error:', e);
            return null;
        }
    }

    private async executeRequest(provider: AIProvider, requestData: any, providerKey: string): Promise<string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (providerKey === 'anthropic') {
            headers['x-api-key'] = provider.apiKey;
            headers['anthropic-version'] = '2023-06-01';
            headers['dangerously-allow-browser'] = 'true';
        } else if (providerKey === 'google') {
            // Google uses URL param
        } else {
            headers['Authorization'] = `Bearer ${provider.apiKey}`;
        }

        const url = providerKey === 'google'
            ? `${provider.endpoint}?key=${provider.apiKey}`
            : provider.endpoint;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ AI API Error (${providerKey}):`, response.status, errorText);
                throw new Error(`${providerKey} API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return parseResponse(providerKey, data).content;
        } catch (error) {
            console.error(`❌ AI Request Failed [${providerKey}]:`, error);
            throw error;
        }
    }
}

export const llmManager = LLMManager.getInstance();
