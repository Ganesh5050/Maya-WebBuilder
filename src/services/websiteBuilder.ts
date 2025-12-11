// Website Builder Service
// Main orchestrator that combines all services to generate smart websites
// Similar to Bolt.diy's main generation engine

import { analyzePrompt, PromptAnalysis } from './promptAnalyzer';
import { generateContent, GeneratedContent, ContentGenerationOptions } from './contentGenerator';
import { renderTemplate, TemplateRenderOptions } from './templateEngine';
import { selectTemplate } from '../config/templates';

export interface WebsiteGenerationOptions {
  contentOptions?: ContentGenerationOptions;
  templateOptions?: TemplateRenderOptions;
  forceTemplate?: string; // Override template selection
}

export interface GenerationResult {
  html: string;
  analysis: PromptAnalysis;
  template: string;
  content: GeneratedContent;
  metadata: {
    generationTime: number;
    templateUsed: string;
    confidence: number;
    features: string[];
  };
}

export class WebsiteBuilder {
  
  /**
   * Generate a complete website based on user prompt
   * This is the main entry point - similar to Bolt.diy's generation function
   */
  public async generateWebsite(
    prompt: string, 
    options: WebsiteGenerationOptions = {}
  ): Promise<GenerationResult> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 Starting website generation for prompt:', prompt.substring(0, 100));
      
      // Step 1: Analyze the prompt to understand requirements
      console.log('📊 Analyzing prompt...');
      const analysis = analyzePrompt(prompt);
      console.log('✅ Prompt analysis complete:', analysis.type, analysis.confidence);
      
      // Step 2: Select appropriate template
      const templateId = options.forceTemplate || selectTemplate(analysis);
      console.log('📋 Selected template:', templateId);
      
      // Step 3: Generate AI content for the template
      console.log('🤖 Generating AI content...');
      const content = await generateContent(
        prompt, 
        templateId, 
        analysis, 
        options.contentOptions
      );
      console.log('✅ Content generation complete');
      
      // Step 4: Render the final HTML
      console.log('🎨 Rendering template...');
      const html = await renderTemplate(
        templateId, 
        content, 
        options.templateOptions
      );
      console.log('✅ Template rendering complete');
      
      const generationTime = Date.now() - startTime;
      
      const result: GenerationResult = {
        html,
        analysis,
        template: templateId,
        content,
        metadata: {
          generationTime,
          templateUsed: templateId,
          confidence: analysis.confidence,
          features: analysis.features
        }
      };
      
      console.log(`🎉 Website generated successfully in ${generationTime}ms`);
      return result;
      
    } catch (error) {
      console.error('❌ Website generation failed:', error);
      throw new Error(`Failed to generate website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Generate website with progress callbacks
   * Useful for showing progress in the UI
   */
  public async generateWebsiteWithProgress(
    prompt: string,
    onProgress: (step: string, progress: number) => void,
    options: WebsiteGenerationOptions = {}
  ): Promise<GenerationResult> {
    const startTime = Date.now();
    
    try {
      onProgress('Analyzing your requirements...', 10);
      
      // Step 1: Analyze prompt
      const analysis = analyzePrompt(prompt);
      onProgress('Understanding your needs...', 20);
      
      // Step 2: Select template
      const templateId = options.forceTemplate || selectTemplate(analysis);
      onProgress(`Selected ${templateId} template...`, 30);
      
      // Step 3: Generate content
      onProgress('Creating unique content...', 40);
      const content = await generateContent(
        prompt, 
        templateId, 
        analysis, 
        options.contentOptions
      );
      onProgress('Content generated...', 70);
      
      // Step 4: Render template
      onProgress('Building your website...', 80);
      const html = await renderTemplate(
        templateId, 
        content, 
        options.templateOptions
      );
      onProgress('Finalizing...', 90);
      
      const generationTime = Date.now() - startTime;
      
      const result: GenerationResult = {
        html,
        analysis,
        template: templateId,
        content,
        metadata: {
          generationTime,
          templateUsed: templateId,
          confidence: analysis.confidence,
          features: analysis.features
        }
      };
      
      onProgress('Complete!', 100);
      return result;
      
    } catch (error) {
      onProgress('Generation failed', 0);
      throw error;
    }
  }
  
  /**
   * Analyze a prompt without generating the website
   * Useful for preview/confirmation before generation
   */
  public analyzePromptOnly(prompt: string): {
    analysis: PromptAnalysis;
    suggestedTemplate: string;
    estimatedTime: number;
    features: string[];
  } {
    const analysis = analyzePrompt(prompt);
    const templateId = selectTemplate(analysis);
    
    // Estimate generation time based on complexity
    const estimatedTime = this.estimateGenerationTime(analysis);
    
    return {
      analysis,
      suggestedTemplate: templateId,
      estimatedTime,
      features: analysis.features
    };
  }
  
  /**
   * Generate multiple variations of a website
   * Useful for A/B testing or giving users options
   */
  public async generateVariations(
    prompt: string,
    variations: string[] = ['modern', 'minimal', 'bold'],
    options: WebsiteGenerationOptions = {}
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];
    
    for (const style of variations) {
      try {
        const variationOptions = {
          ...options,
          contentOptions: {
            ...options.contentOptions,
            style: style as any
          }
        };
        
        const result = await this.generateWebsite(prompt, variationOptions);
        results.push(result);
      } catch (error) {
        console.warn(`Failed to generate ${style} variation:`, error);
      }
    }
    
    return results;
  }
  
  /**
   * Update an existing website with new content
   * Useful for iterative improvements
   */
  public async updateWebsite(
    existingHTML: string,
    updatePrompt: string,
    options: WebsiteGenerationOptions = {}
  ): Promise<GenerationResult> {
    // Extract the original template and content
    const originalAnalysis = this.extractTemplateFromHTML(existingHTML);
    
    // Combine original analysis with new update requirements
    const combinedPrompt = `Original: ${originalAnalysis.prompt}. Update: ${updatePrompt}`;
    
    // Generate new website with combined context
    return this.generateWebsite(combinedPrompt, options);
  }
  
  /**
   * Estimate generation time based on analysis complexity
   */
  private estimateGenerationTime(analysis: PromptAnalysis): number {
    let baseTime = 2000; // 2 seconds base
    
    // Add time based on features
    baseTime += analysis.features.length * 500;
    
    // Add time based on confidence (lower confidence = more processing)
    if (analysis.confidence < 0.7) {
      baseTime += 1000;
    }
    
    // Add time for specific complex features
    if (analysis.features.includes('ecommerce')) {
      baseTime += 1500;
    }
    if (analysis.features.includes('gallery')) {
      baseTime += 1000;
    }
    
    return Math.min(baseTime, 10000); // Cap at 10 seconds
  }
  
  /**
   * Extract template information from existing HTML
   * This is a simplified implementation
   */
  private extractTemplateFromHTML(html: string): { prompt: string; template: string } {
    // Look for template indicators in the HTML
    if (html.includes('portfolio') || html.includes('gallery')) {
      return { prompt: 'portfolio website', template: 'portfolio' };
    }
    if (html.includes('restaurant') || html.includes('menu')) {
      return { prompt: 'restaurant website', template: 'restaurant' };
    }
    if (html.includes('shop') || html.includes('product')) {
      return { prompt: 'ecommerce website', template: 'ecommerce' };
    }
    if (html.includes('blog') || html.includes('article')) {
      return { prompt: 'blog website', template: 'blog' };
    }
    
    return { prompt: 'business website', template: 'business' };
  }
  
  /**
   * Get generation statistics for monitoring
   */
  public getStats(): {
    totalGenerated: number;
    averageTime: number;
    successRate: number;
    popularTemplates: Array<{ template: string; count: number }>;
  } {
    // In a real implementation, this would track actual statistics
    // For now, return mock data
    return {
      totalGenerated: 0,
      averageTime: 0,
      successRate: 0,
      popularTemplates: []
    };
  }
  
  /**
   * Validate prompt before generation
   */
  public validatePrompt(prompt: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check prompt length
    if (prompt.length < 10) {
      issues.push('Prompt is too short');
      suggestions.push('Add more details about what you want to build');
    }
    
    if (prompt.length > 1000) {
      issues.push('Prompt is very long');
      suggestions.push('Consider being more concise');
    }
    
    // Check for meaningful content
    const meaningfulWords = prompt.split(/\s+/).filter(word => word.length > 3);
    if (meaningfulWords.length < 3) {
      issues.push('Prompt lacks specific details');
      suggestions.push('Include specific features, industry, or preferences');
    }
    
    // Check for common keywords
    const hasWebsiteKeywords = /\b(website|site|page|web|online)\b/i.test(prompt);
    if (!hasWebsiteKeywords) {
      suggestions.push('Consider mentioning "website" for better results');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}

// Export singleton instance
export const websiteBuilder = new WebsiteBuilder();

// Export convenience functions
export async function generateSmartWebsite(
  prompt: string, 
  options?: WebsiteGenerationOptions
): Promise<string> {
  const result = await websiteBuilder.generateWebsite(prompt, options);
  return result.html;
}

export async function generateSmartWebsiteWithProgress(
  prompt: string,
  onProgress: (step: string, progress: number) => void,
  options?: WebsiteGenerationOptions
): Promise<string> {
  const result = await websiteBuilder.generateWebsiteWithProgress(prompt, onProgress, options);
  return result.html;
}

// Export for testing
export { WebsiteBuilder as WebsiteBuilderClass };
