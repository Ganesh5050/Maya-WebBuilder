// Content Generator Service
// Uses AI APIs to generate unique content for website templates
// Similar to Bolt.diy's AI-powered content generation

import { getAvailableProvider, getNextAvailableProvider, formatRequest, parseResponse, handleProviderError, shouldRetry, getRetryDelay, AIProvider } from '../config/aiProviders';
import { PromptAnalysis } from './promptAnalyzer';
import { getTemplate } from '../config/templates';

export interface GeneratedContent {
  [key: string]: string | string[] | any;
}

export interface ContentGenerationOptions {
  tone?: 'professional' | 'casual' | 'creative' | 'formal';
  length?: 'concise' | 'detailed' | 'comprehensive';
  includeSEO?: boolean;
  language?: string;
}

export class ContentGenerator {
  
  /**
   * Generate content for a website based on prompt analysis and template
   */
  public async generateContent(
    prompt: string, 
    templateId: string, 
    analysis: PromptAnalysis,
    options: ContentGenerationOptions = {}
  ): Promise<GeneratedContent> {
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    const content: GeneratedContent = {};
    
    // Generate content for each template variable
    for (const variable of template.variables) {
      try {
        content[variable.key] = await this.generateVariableContent(
          variable, 
          prompt, 
          analysis, 
          options
        );
      } catch (error) {
        console.warn(`Failed to generate content for ${variable.key}:`, error);
        // Use default content as fallback
        content[variable.key] = variable.defaultValue || this.getDefaultContent(variable.key, analysis);
      }
    }
    
    return content;
  }
  
  /**
   * Generate content for a specific template variable
   */
  private async generateVariableContent(
    variable: any,
    prompt: string,
    analysis: PromptAnalysis,
    options: ContentGenerationOptions
  ): Promise<string | string[]> {
    let provider = getAvailableProvider();
    
    // If no provider is available, use default content
    if (!provider) {
      console.error('❌ No AI provider available, using default content for', variable.key);
      return variable.defaultValue || this.getDefaultContent(variable.key, analysis);
    }
    
    const generationPrompt = this.buildVariablePrompt(variable, prompt, analysis, options);
    let lastError: Error | null = null;
    let currentProviderKey: string | null = null;
    
    // Try multiple providers if one fails (especially for rate limits)
    for (let providerAttempt = 0; providerAttempt < 3; providerAttempt++) {
      // Find provider key to get configuration
      currentProviderKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
      if (!currentProviderKey) {
        console.error('❌ Provider configuration not found');
        // Try next provider
        provider = getNextAvailableProvider(currentProviderKey || undefined);
        if (!provider) break;
        continue;
      }
      
      console.log(`🤖 Generating ${variable.key} using ${currentProviderKey} (attempt ${providerAttempt + 1})...`);
      
      // Retry logic with exponential backoff for current provider
      for (let attempt = 0; attempt <= 1; attempt++) {
        try {
          console.log(`🔄 Provider ${currentProviderKey}, attempt ${attempt + 1} for ${variable.key}`);
          const response = await this.callAI(provider, generationPrompt, currentProviderKey);
          
          if (!response || response.trim() === '') {
            throw new Error('Empty response from AI');
          }
          
          console.log(`✅ Generated ${variable.key}: ${response.substring(0, 50)}...`);
          return this.parseVariableContent(variable, response, analysis);
        } catch (error) {
          lastError = error as Error;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ ${currentProviderKey} attempt ${attempt + 1} failed for ${variable.key}:`, errorMsg);
          
          // Check if it's a rate limit error
          if (errorMsg.includes('429') || errorMsg.includes('rate limit') || errorMsg.includes('quota')) {
            console.log(`🚫 Rate limit hit for ${currentProviderKey}, switching providers...`);
            break; // Break inner loop to try next provider
          }
          
          if (attempt < 1) {
            const delay = getRetryDelay(attempt);
            console.log(`⏳ Retrying ${currentProviderKey} in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
      }
      
      // If we get here, current provider failed - try next one
      console.log(`🔄 Switching from ${currentProviderKey} to next available provider...`);
      provider = getNextAvailableProvider(currentProviderKey);
      if (!provider) {
        console.error('❌ No more providers available');
        break;
      }
    }
    
    // All providers failed, use default content
    console.warn(`⚠️ All providers failed for ${variable.key}, using default content`);
    console.warn(`Last error:`, lastError?.message);
    return variable.defaultValue || this.getDefaultContent(variable.key, analysis);
  }
  
  /**
   * Build a prompt for generating content for a specific variable
   */
  private buildVariablePrompt(
    variable: any,
    prompt: string,
    analysis: PromptAnalysis,
    options: ContentGenerationOptions
  ): string {
    const basePrompt = this.getBasePrompt(analysis.type, analysis.industry);
    const tone = options.tone || this.getDefaultTone(analysis.type);
    const length = options.length || 'detailed';
    
    switch (variable.key) {
      case 'COMPANY_NAME':
      case 'BLOG_NAME':
      case 'STORE_NAME':
      case 'RESTAURANT_NAME':
        return `${basePrompt}

You are a creative branding expert. Generate a compelling ${analysis.type} name based on this request: "${prompt}"

Context:
- Industry: ${analysis.industry}
- Style: ${analysis.style}
- Tone: ${tone}
- User's vision: ${prompt}

Requirements:
- Create ONE unique, memorable name (not a list)
- Make it specific to the user's request, not generic
- Ensure it's brandable and easy to remember
- Reflect the ${analysis.style} style
- Avoid clichés and overused terms

Return ONLY the name, nothing else. No quotes, no explanation.`;
      
      case 'TAGLINE':
      case 'COMPANY_TAGLINE':
      case 'BLOG_DESCRIPTION':
      case 'STORE_TAGLINE':
        return `${basePrompt}

You are a copywriting expert specializing in taglines. Create a powerful tagline for a ${analysis.type} website.

User's Request: "${prompt}"

Context:
- Industry: ${analysis.industry}
- Style: ${analysis.style}
- Tone: ${tone}
- Length: ${length === 'concise' ? '5-8 words' : length === 'detailed' ? '10-15 words' : '8-12 words'}

Requirements:
- Capture the UNIQUE value proposition from the user's request
- Make it memorable and emotionally resonant
- Use active, powerful language
- Avoid generic phrases like "Your trusted partner" or "Quality you can trust"
- Reflect the ${analysis.style} aesthetic
- Be specific to what makes THIS ${analysis.type} special

Return ONLY the tagline, no quotes, no explanation.`;
      
      case 'ABOUT_TEXT':
      case 'ABOUT_COMPANY':
      case 'ABOUT_RESTAURANT':
      case 'ABOUT_AUTHOR':
        return `${basePrompt}

You are a professional content writer. Create an engaging "About" section for a ${analysis.type} website.

User's Vision: "${prompt}"

Context:
- Industry: ${analysis.industry}
- Style: ${analysis.style}
- Tone: ${tone}
- Length: ${length === 'concise' ? '2-3 paragraphs' : length === 'detailed' ? '4-5 paragraphs' : '3-4 paragraphs'}

Structure:
1. Opening Hook: Start with a compelling statement that captures attention
2. Origin Story: Brief background or founding story (make it specific and believable)
3. Unique Value: What makes this ${analysis.type} different and special
4. Mission/Vision: Forward-looking statement about impact and goals
5. Call to Action: Invite engagement or next steps

Requirements:
- Write in ${tone} tone
- Use specific details from the user's request
- Avoid generic corporate speak
- Make it feel authentic and personal
- Include concrete examples or achievements
- Use storytelling techniques

Format: Return clean HTML with <p> tags for paragraphs. No <html>, <body>, or <div> wrappers.
Return ONLY the HTML content.`;
      
      case 'GALLERY_ITEMS':
      case 'PRODUCTS':
      case 'MENU_ITEMS':
      case 'ARTICLES':
        return `${basePrompt}

Generate ${variable.key.toLowerCase()} for a ${analysis.type} website based on: "${prompt}"

Requirements:
- Industry: ${analysis.industry}
- Style: ${analysis.style}
- Tone: ${tone}

Generate 5-7 diverse items as a JSON array with this structure:
[
  {
    "title": "Item Title",
    "description": "Brief description (2-3 sentences)",
    "category": "Category name",
    "image": "placeholder-image-url"
  }
]

Make items relevant to ${analysis.industry} and ${analysis.type}.
Return only valid JSON, no other text.`;
      
      case 'SERVICES':
        return `${basePrompt}

You are a business consultant. Generate services for a ${analysis.type} website.

User's Request: "${prompt}"

Context:
- Industry: ${analysis.industry}
- Style: ${analysis.style}
- Tone: ${tone}

Requirements:
- Create 4-6 SPECIFIC services relevant to the user's request
- Each service should be unique and valuable
- Descriptions should highlight benefits, not just features
- Include concrete deliverables or outcomes
- Make pricing realistic for ${analysis.industry}
- Avoid generic service names

JSON Structure:
[
  {
    "name": "Specific Service Name (not generic)",
    "description": "Benefit-focused description (3-4 sentences) explaining value and outcomes",
    "features": ["Concrete deliverable 1", "Concrete deliverable 2", "Concrete deliverable 3"],
    "price": "Starting at $XXX" or "Custom pricing"
  }
]

Return ONLY valid JSON, no markdown, no explanation.`;
      
      case 'CONTACT_INFO':
        return `${basePrompt}

Generate contact information HTML for a ${analysis.type} website.

Requirements:
- Professional format
- Include email, phone, and address placeholders
- Add social media links
- Use semantic HTML

Return only the HTML content without <html> or <body> tags.`;
      
      case 'TESTIMONIALS':
        return `${basePrompt}

Generate 3-4 testimonials for a ${analysis.type} website.

Requirements:
- Industry: ${analysis.industry}
- Tone: ${tone}

Return as JSON array:
[
  {
    "name": "Client Name",
    "company": "Company Name",
    "text": "Testimonial text (2-3 sentences)",
    "rating": 5
  }
]

Make testimonials realistic and relevant to ${analysis.industry}.
Return only valid JSON, no other text.`;
      
      case 'CATEGORIES':
        return `${basePrompt}

Generate relevant categories for a ${analysis.type} website in ${analysis.industry}.

Requirements:
- 5-8 categories
- Industry-specific
- User-friendly names

Return as JSON array of strings: ["Category 1", "Category 2", ...]
Return only valid JSON, no other text.`;
      
      default:
        return `${basePrompt}

Generate content for "${variable.key}" for a ${analysis.type} website based on: "${prompt}"

Requirements:
- Industry: ${analysis.industry}
- Style: ${analysis.style}
- Tone: ${tone}
- Length: ${length}

Generate appropriate content that fits the ${analysis.type} context.
Return clean, ready-to-use content without additional formatting.`;
    }
  }
  
  /**
   * Get the base prompt context for content generation
   */
  private getBasePrompt(type: string, industry: string): string {
    return `You are an expert web content creator and copywriter specializing in ${type} websites for the ${industry} industry.

Your mission: Create UNIQUE, compelling content that stands out from generic templates.

Core Principles:
- Be SPECIFIC: Use concrete details, not vague generalities
- Be AUTHENTIC: Write like a real person, not a corporate robot
- Be VALUABLE: Focus on benefits and outcomes, not just features
- Be MEMORABLE: Use vivid language and storytelling
- Be CONVERSION-FOCUSED: Guide users toward action

Avoid at all costs:
- Generic phrases like "industry-leading", "trusted partner", "quality service"
- Corporate jargon and buzzwords
- Vague promises without specifics
- Template-like content that could apply to any business
- Overused clichés

All content must be:
- Original and tailored to the specific user request
- SEO-friendly with natural keyword integration
- Appropriate for ${industry} industry standards
- Optimized for ${type} website best practices`;
  }
  
  /**
   * Get default tone based on website type
   */
  private getDefaultTone(type: string): string {
    const toneMap = {
      portfolio: 'creative',
      business: 'professional',
      restaurant: 'welcoming',
      ecommerce: 'persuasive',
      blog: 'engaging'
    };
    
    return toneMap[type as keyof typeof toneMap] || 'professional';
  }
  
  /**
   * Parse AI response based on variable type
   */
  private parseVariableContent(variable: any, response: string, _analysis: PromptAnalysis): string | string[] {
    const content = response.trim();
    
    switch (variable.type) {
      case 'list':
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(content);
          return Array.isArray(parsed) ? parsed : [content];
        } catch {
          // Fallback: split by lines or commas
          return content.split(/\n|,/).map(item => item.trim()).filter(item => item);
        }
      
      case 'html':
        // Ensure content is valid HTML
        return content.replace(/<html[^>]*>|<\/html>|<body[^>]*>|<\/body>/gi, '').trim();
      
      case 'text':
      default:
        return content;
    }
  }
  
  /**
   * Call AI API with retry logic
   */
  private async callAI(provider: AIProvider, prompt: string, providerKey: string): Promise<string> {
    const requestData = formatRequest(providerKey, prompt);
    
    // Build headers based on provider
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (providerKey === 'google') {
      // Google uses API key in URL parameter
      const url = `${provider.endpoint}?key=${provider.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const responseData = await response.json();
      const parsedResponse = parseResponse(providerKey, responseData);
      return parsedResponse.content;
    }
    
    // For other providers, use Authorization header
    if (providerKey === 'anthropic') {
      headers['x-api-key'] = provider.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${provider.apiKey}`;
    }
    
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`AI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const responseData = await response.json();
    const parsedResponse = parseResponse(providerKey, responseData);
    
    return parsedResponse.content;
  }
  
  /**
   * Get default content when AI generation fails
   */
  private getDefaultContent(variableKey: string, analysis: PromptAnalysis): string | string[] {
    // Generate more dynamic defaults based on analysis
    const industryName = analysis.industry.charAt(0).toUpperCase() + analysis.industry.slice(1);
    const typeName = analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1);
    
    const defaults: Record<string, string | string[]> = {
      COMPANY_NAME: `${industryName} ${typeName}`,
      BLOG_NAME: `${industryName} Insights`,
      STORE_NAME: `${industryName} Store`,
      RESTAURANT_NAME: `The ${industryName} Kitchen`,
      
      TAGLINE: `Your trusted ${analysis.industry} partner`,
      COMPANY_TAGLINE: `Excellence in ${analysis.industry}`,
      BLOG_DESCRIPTION: `Insights and stories about ${analysis.industry}`,
      STORE_TAGLINE: `Quality ${analysis.industry} products`,
      
      ABOUT_TEXT: `<p>Welcome to our ${analysis.type}. We specialize in ${analysis.industry} and are dedicated to providing exceptional service.</p><p>Our team brings years of experience and expertise to every project, ensuring quality results that exceed expectations.</p>`,
      ABOUT_COMPANY: `<p>We are a leading ${analysis.industry} company committed to innovation and excellence.</p><p>Founded with a vision to transform the industry, we continue to push boundaries and deliver outstanding results.</p>`,
      ABOUT_RESTAURANT: `<p>Experience authentic ${analysis.industry} cuisine in a warm, welcoming atmosphere.</p><p>Our chefs use only the finest ingredients to create memorable dining experiences.</p>`,
      ABOUT_AUTHOR: `<p>Passionate about ${analysis.industry} and sharing knowledge through writing.</p><p>Join me on this journey of discovery and learning.</p>`,
      
      CONTACT_INFO: `<p>Email: hello@example.com<br>Phone: (555) 123-4567<br>Address: 123 Business St, City, State 12345</p>`,
      ADDRESS: '123 Business Street, City, State 12345',
      
      SERVICES: JSON.stringify([
        { name: `${industryName} Consultation`, description: `Expert consultation services tailored to your ${analysis.industry} needs`, features: ["In-depth Analysis", "Strategic Planning", "Implementation Support"] },
        { name: `${industryName} Solutions`, description: `Comprehensive solutions for your ${analysis.industry} challenges`, features: ["Custom Development", "Ongoing Support", "Performance Optimization"] },
        { name: `${industryName} Training`, description: `Professional training and development programs`, features: ["Hands-on Learning", "Expert Instructors", "Certification"] }
      ]),
      
      TESTIMONIALS: JSON.stringify([
        { name: "John Smith", role: "CEO", company: "Tech Corp", text: `Outstanding ${analysis.industry} service. Highly recommended!`, rating: 5 },
        { name: "Sarah Johnson", role: "Manager", company: "Business Inc", text: `Professional, reliable, and excellent results.`, rating: 5 }
      ])
    };
    
    return defaults[variableKey] || `Professional ${analysis.industry} content`;
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();

// Export convenience functions
export async function generateContent(
  prompt: string, 
  templateId: string, 
  analysis: PromptAnalysis, 
  options?: ContentGenerationOptions
): Promise<GeneratedContent> {
  return contentGenerator.generateContent(prompt, templateId, analysis, options);
}

// Export for testing
export { ContentGenerator as ContentGeneratorClass };

// Import AI_PROVIDERS for the callAI method
import { AI_PROVIDERS } from '../config/aiProviders';
