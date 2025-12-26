/**
 * Media Generation Service - Unified Image & Video Generation
 * Supports multiple providers with automatic failover and priority-based selection
 */

// ===== PROVIDER CONFIGURATIONS =====
interface MediaProvider {
    name: string;
    type: 'ai_image' | 'stock_image' | 'video' | 'hosting' | 'editing';
    priority: number;
    envKeys: string[]; // Store key names for dynamic lookup
    endpoint: string;
    testEndpoint?: string;
}

// Safe environment variable accessor (Runtime Dynamic)
const getEnv = (key: string): string => {
    // 1. Runtime Override (Settings UI)
    if (typeof localStorage !== 'undefined') {
        const local = localStorage.getItem(key);
        if (local) return local;
    }
    // 2. Vite Env
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key] || '';
    }
    // 3. Node Env
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || '';
    }
    return '';
};

// Provider configurations with priority (lower = higher priority)
export const IMAGE_PROVIDERS: Record<string, MediaProvider> = {
    // AI Image Generation (Priority 1-3)
    stability: {
        name: 'Stability AI',
        type: 'ai_image',
        priority: 1,
        envKeys: ['VITE_STABILITY_API_KEY_1', 'VITE_STABILITY_API_KEY_2', 'VITE_STABILITY_API_KEY_3'],
        endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        testEndpoint: 'https://api.stability.ai/v1/engines/list'
    },
    replicate: {
        name: 'Replicate',
        type: 'ai_image',
        priority: 2,
        envKeys: ['VITE_REPLICATE_API_KEY_1', 'VITE_REPLICATE_API_KEY_2'],
        endpoint: 'https://api.replicate.com/v1/predictions',
        testEndpoint: 'https://api.replicate.com/v1/models'
    },
    fal: {
        name: 'Fal AI',
        type: 'ai_image',
        priority: 3,
        envKeys: ['VITE_FAL_API_KEY_1', 'VITE_FAL_API_KEY_2'],
        endpoint: 'https://fal.run/fal-ai/flux/schnell',
        testEndpoint: 'https://fal.run'
    },

    // Stock Image Providers (Priority 4-6)
    unsplash: {
        name: 'Unsplash',
        type: 'stock_image',
        priority: 4,
        envKeys: ['VITE_UNSPLASH_ACCESS_KEY'],
        endpoint: 'https://api.unsplash.com/search/photos',
        testEndpoint: 'https://api.unsplash.com/photos/random'
    },
    pixabay: {
        name: 'Pixabay',
        type: 'stock_image',
        priority: 5,
        envKeys: ['VITE_PIXABAY_API_KEY'],
        endpoint: 'https://pixabay.com/api/',
        testEndpoint: 'https://pixabay.com/api/'
    },
    freepik: {
        name: 'Freepik',
        type: 'stock_image',
        priority: 6,
        envKeys: ['VITE_FREEPIK_API_KEY'],
        endpoint: 'https://api.freepik.com/v1/resources',
        testEndpoint: 'https://api.freepik.com/v1/resources'
    },

    // Image Editing/Processing
    photoroom: {
        name: 'Photoroom',
        type: 'editing',
        priority: 7,
        envKeys: ['VITE_PHOTOROOM_WEBBUILDER_LIVE_KEY', 'VITE_PHOTOROOM_LIVE_KEY', 'VITE_PHOTOROOM_WEBBUILDER_SANDBOX_KEY', 'VITE_PHOTOROOM_SANDBOX_KEY'],
        endpoint: 'https://sdk.photoroom.com/v1/segment',
        testEndpoint: 'https://sdk.photoroom.com/v1'
    },

    // Image Hosting
    imgbb: {
        name: 'ImgBB',
        type: 'hosting',
        priority: 8,
        envKeys: ['VITE_IMGBB_API_KEY_1', 'VITE_IMGBB_API_KEY_2'],
        endpoint: 'https://api.imgbb.com/1/upload',
        testEndpoint: 'https://api.imgbb.com/1/upload'
    }
};

export const VIDEO_PROVIDERS: Record<string, MediaProvider> = {
    runway: {
        name: 'Runway',
        type: 'video',
        priority: 1,
        envKeys: ['VITE_RUNWAY_API_KEY_1', 'VITE_RUNWAY_API_KEY_2'],
        endpoint: 'https://api.runwayml.com/v1/generations',
        testEndpoint: 'https://api.runwayml.com/v1'
    },
    replicate_video: {
        name: 'Replicate (Video)',
        type: 'video',
        priority: 2,
        envKeys: ['VITE_REPLICATE_API_KEY_1', 'VITE_REPLICATE_API_KEY_2'],
        endpoint: 'https://api.replicate.com/v1/predictions',
        testEndpoint: 'https://api.replicate.com/v1/models'
    },
    pixabay_video: {
        name: 'Pixabay Videos',
        type: 'video',
        priority: 3,
        envKeys: ['VITE_PIXABAY_API_KEY'],
        endpoint: 'https://pixabay.com/api/videos/',
        testEndpoint: 'https://pixabay.com/api/videos/'
    }
};

// ===== KEY ROTATION TRACKING =====
const keyRotationState: Record<string, number> = {};

function getNextKey(provider: MediaProvider): string | null {
    // Dynamically fetch keys at runtime
    const keys = provider.envKeys.map(keyName => getEnv(keyName)).filter(k => k && k !== '');

    if (keys.length === 0) return null;

    const currentIndex = keyRotationState[provider.name] || 0;
    const key = keys[currentIndex % keys.length]; // usage safe modulo
    keyRotationState[provider.name] = (currentIndex + 1) % keys.length;

    return key;
}

function hasKeys(provider: MediaProvider): boolean {
    return provider.envKeys.some(k => {
        const val = getEnv(k);
        return val && val !== '';
    });
}

// ===== PROVIDER TESTING =====
export async function testProvider(provider: MediaProvider): Promise<{ valid: boolean; error?: string }> {
    // Dynamic fetch
    const keys = provider.envKeys.map(k => getEnv(k)).filter(k => k && k !== '');
    const key = keys[0];

    if (!key) return { valid: false, error: 'No API key configured' };

    try {
        const headers: Record<string, string> = {};
        let url = provider.testEndpoint || provider.endpoint;

        // Provider-specific auth
        switch (provider.name) {
            case 'Stability AI':
                headers['Authorization'] = `Bearer ${key}`;
                break;
            case 'Replicate':
            case 'Replicate (Video)':
                headers['Authorization'] = `Token ${key}`;
                break;
            case 'Fal AI':
                headers['Authorization'] = `Key ${key}`;
                break;
            case 'Unsplash':
                headers['Authorization'] = `Client-ID ${key}`;
                break;
            case 'Pixabay':
            case 'Pixabay Videos':
                url = `${url}?key=${key}&q=test&per_page=1`;
                break;
            case 'Freepik':
                headers['x-freepik-api-key'] = key;
                break;
            case 'Photoroom':
                headers['x-api-key'] = key;
                break;
            case 'Runway':
                headers['Authorization'] = `Bearer ${key}`;
                break;
            default:
                headers['Authorization'] = `Bearer ${key}`;
        }

        const response = await fetch(url, { method: 'GET', headers });

        if (response.ok || response.status === 401) {
            // 401 means key format is recognized but may be invalid
            return { valid: response.ok, error: response.ok ? undefined : 'Invalid key' };
        }

        return { valid: false, error: `HTTP ${response.status}` };
    } catch (e) {
        return { valid: false, error: String(e) };
    }
}

export async function testAllProviders(): Promise<Record<string, { valid: boolean; error?: string }>> {
    const results: Record<string, { valid: boolean; error?: string }> = {};

    for (const [name, provider] of Object.entries(IMAGE_PROVIDERS)) {
        console.log(`Testing ${provider.name}...`);
        results[name] = await testProvider(provider);
    }

    for (const [name, provider] of Object.entries(VIDEO_PROVIDERS)) {
        console.log(`Testing ${provider.name}...`);
        results[name] = await testProvider(provider);
    }

    return results;
}

// ===== IMAGE GENERATION =====
export interface ImageGenerationRequest {
    prompt: string;
    width?: number;
    height?: number;
    style?: 'photorealistic' | 'artistic' | 'anime' | 'digital-art';
    negativePrompt?: string;
}

export interface ImageGenerationResult {
    url: string;
    provider: string;
    cached?: boolean;
}

/**
 * Generate an AI image using the best available provider
 */
export async function generateAIImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const { prompt, width = 1024, height = 1024, style = 'photorealistic' } = request;

    // Sort providers by priority
    const sortedProviders = Object.entries(IMAGE_PROVIDERS)
        .filter(([_, p]) => p.type === 'ai_image' && hasKeys(p))
        .sort((a, b) => a[1].priority - b[1].priority);

    for (const [name, provider] of sortedProviders) {
        const key = getNextKey(provider);
        if (!key) continue;

        try {
            console.log(`🎨 Trying ${provider.name} for image generation...`);

            switch (name) {
                case 'stability':
                    return await generateWithStability(prompt, width, height, key);
                case 'replicate':
                    return await generateWithReplicate(prompt, width, height, key);
                case 'fal':
                    return await generateWithFal(prompt, width, height, key);
            }
        } catch (error) {
            console.warn(`❌ ${provider.name} failed:`, error);
            continue;
        }
    }

    // Fallback to Pollinations (free, no key needed)
    console.log('🔄 Falling back to Pollinations.ai (free)...');
    return {
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true`,
        provider: 'Pollinations (Free)'
    };
}

async function generateWithStability(prompt: string, width: number, height: number, key: string): Promise<ImageGenerationResult> {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            text_prompts: [{ text: prompt, weight: 1 }],
            cfg_scale: 7,
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
            samples: 1,
            steps: 30
        })
    });

    if (!response.ok) throw new Error(`Stability API error: ${response.status}`);

    const data = await response.json();
    const base64 = data.artifacts?.[0]?.base64;

    if (!base64) throw new Error('No image returned');

    return {
        url: `data:image/png;base64,${base64}`,
        provider: 'Stability AI'
    };
}

async function generateWithReplicate(prompt: string, width: number, height: number, key: string): Promise<ImageGenerationResult> {
    // Start prediction
    const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${key}`
        },
        body: JSON.stringify({
            version: 'black-forest-labs/flux-schnell',
            input: {
                prompt: prompt,
                width: width,
                height: height,
                num_outputs: 1
            }
        })
    });

    if (!startResponse.ok) throw new Error(`Replicate API error: ${startResponse.status}`);

    const prediction = await startResponse.json();

    // Poll for result
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
        await new Promise(r => setTimeout(r, 1000));
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
            headers: { 'Authorization': `Token ${key}` }
        });
        result = await pollResponse.json();
    }

    if (result.status !== 'succeeded') throw new Error('Replicate generation failed');

    return {
        url: result.output?.[0] || result.output,
        provider: 'Replicate'
    };
}

async function generateWithFal(prompt: string, width: number, height: number, key: string): Promise<ImageGenerationResult> {
    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${key}`
        },
        body: JSON.stringify({
            prompt: prompt,
            image_size: { width, height },
            num_images: 1
        })
    });

    if (!response.ok) throw new Error(`Fal API error: ${response.status}`);

    const data = await response.json();

    return {
        url: data.images?.[0]?.url,
        provider: 'Fal AI'
    };
}

// ===== STOCK IMAGE SEARCH =====
export async function searchStockImage(query: string, count: number = 1): Promise<ImageGenerationResult[]> {
    const sortedProviders = Object.entries(IMAGE_PROVIDERS)
        .filter(([_, p]) => p.type === 'stock_image' && hasKeys(p))
        .sort((a, b) => a[1].priority - b[1].priority);

    for (const [name, provider] of sortedProviders) {
        const key = getNextKey(provider);
        if (!key) continue;

        try {
            switch (name) {
                case 'unsplash':
                    return await searchUnsplash(query, count, key);
                case 'pixabay':
                    return await searchPixabay(query, count, key);
            }
        } catch (error) {
            console.warn(`❌ ${provider.name} search failed:`, error);
            continue;
        }
    }

    // Fallback
    return [{ url: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(query)}`, provider: 'Unsplash (Fallback)' }];
}

async function searchUnsplash(query: string, count: number, key: string): Promise<ImageGenerationResult[]> {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`, {
        headers: { 'Authorization': `Client-ID ${key}` }
    });

    if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`);

    const data = await response.json();
    return data.results.map((img: any) => ({
        url: img.urls?.regular || img.urls?.small,
        provider: 'Unsplash'
    }));
}

async function searchPixabay(query: string, count: number, key: string): Promise<ImageGenerationResult[]> {
    const response = await fetch(`https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&per_page=${count}&image_type=photo`);

    if (!response.ok) throw new Error(`Pixabay API error: ${response.status}`);

    const data = await response.json();
    return data.hits.map((img: any) => ({
        url: img.largeImageURL || img.webformatURL,
        provider: 'Pixabay'
    }));
}

// ===== VIDEO GENERATION =====
export async function generateVideo(prompt: string, duration: number = 4): Promise<{ url: string; provider: string }> {
    const sortedProviders = Object.entries(VIDEO_PROVIDERS)
        .filter(([_, p]) => hasKeys(p))
        .sort((a, b) => a[1].priority - b[1].priority);

    for (const [name, provider] of sortedProviders) {
        const key = getNextKey(provider);
        if (!key) continue;

        try {
            switch (name) {
                case 'runway':
                    return await generateWithRunway(prompt, duration, key);
                case 'pixabay_video':
                    return await searchPixabayVideo(prompt, key);
            }
        } catch (error) {
            console.warn(`❌ ${provider.name} video failed:`, error);
            continue;
        }
    }

    throw new Error('No video provider available');
}

async function generateWithRunway(prompt: string, duration: number, key: string): Promise<{ url: string; provider: string }> {
    // Runway API implementation (simplified)
    const response = await fetch('https://api.runwayml.com/v1/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: 'gen3a_turbo',
            prompt: prompt,
            duration: duration
        })
    });

    if (!response.ok) throw new Error(`Runway API error: ${response.status}`);

    const data = await response.json();
    return { url: data.output_url, provider: 'Runway' };
}

async function searchPixabayVideo(query: string, key: string): Promise<{ url: string; provider: string }> {
    const response = await fetch(`https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(query)}&per_page=1`);

    if (!response.ok) throw new Error(`Pixabay Video API error: ${response.status}`);

    const data = await response.json();
    const video = data.hits?.[0];

    if (!video) throw new Error('No video found');

    return {
        url: video.videos?.large?.url || video.videos?.medium?.url,
        provider: 'Pixabay Videos'
    };
}

// ===== IMAGE HOSTING =====
export async function uploadToImgBB(imageBase64: string): Promise<string> {
    const keys = [
        getEnv('VITE_IMGBB_API_KEY_1'),
        getEnv('VITE_IMGBB_API_KEY_2')
    ].filter(k => k);

    for (const key of keys) {
        try {
            const formData = new FormData();
            formData.append('key', key);
            formData.append('image', imageBase64);

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                return data.data?.url;
            }
        } catch (error) {
            continue;
        }
    }

    throw new Error('Image upload failed');
}

// ===== UNIFIED EXPORT =====
export const mediaService = {
    generateAIImage,
    searchStockImage,
    generateVideo,
    uploadToImgBB,
    testAllProviders,
    IMAGE_PROVIDERS,
    VIDEO_PROVIDERS
};

export default mediaService;
