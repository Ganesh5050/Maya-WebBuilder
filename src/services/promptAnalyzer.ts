// Prompt Analyzer Service
// Analyzes user prompts to extract intent, keywords, and requirements
// Similar to Bolt.diy's intelligent prompt analysis

export interface PromptAnalysis {
  type: 'portfolio' | 'business' | 'restaurant' | 'ecommerce' | 'blog';
  industry: string;
  features: string[];
  style: string;
  confidence: number;
  keywords: string[];
  entities: {
    company?: string;
    location?: string;
    services?: string[];
    products?: string[];
  };
}

export interface KeywordPattern {
  keywords: string[];
  type: PromptAnalysis['type'];
  weight: number;
  industry?: string;
}

// Keyword patterns for template detection
const KEYWORD_PATTERNS: KeywordPattern[] = [
  // Portfolio patterns
  {
    keywords: ['portfolio', 'gallery', 'showcase', 'work', 'projects', 'designs', 'artwork', 'photography'],
    type: 'portfolio',
    weight: 0.9
  },
  {
    keywords: ['photographer', 'designer', 'artist', 'developer', 'creative', 'freelancer'],
    type: 'portfolio',
    weight: 0.8,
    industry: 'creative'
  },
  
  // Business patterns
  {
    keywords: ['business', 'company', 'agency', 'consultant', 'consulting', 'firm', 'corporate'],
    type: 'business',
    weight: 0.9
  },
  {
    keywords: ['services', 'professional', 'b2b', 'enterprise', 'startup', 'tech company'],
    type: 'business',
    weight: 0.7
  },
  
  // Restaurant patterns
  {
    keywords: ['restaurant', 'cafe', 'food', 'dining', 'menu', 'cuisine', 'bar', 'bistro'],
    type: 'restaurant',
    weight: 0.9
  },
  {
    keywords: ['chef', 'kitchen', 'recipes', 'dishes', 'meal', 'breakfast', 'lunch', 'dinner'],
    type: 'restaurant',
    weight: 0.8
  },
  
  // E-commerce patterns
  {
    keywords: ['shop', 'store', 'ecommerce', 'sell', 'buy', 'products', 'marketplace', 'cart'],
    type: 'ecommerce',
    weight: 0.9
  },
  {
    keywords: ['online store', 'retail', 'shopping', 'checkout', 'payment', 'shipping'],
    type: 'ecommerce',
    weight: 0.8
  },
  
  // Blog patterns
  {
    keywords: ['blog', 'articles', 'content', 'posts', 'writing', 'publication', 'news'],
    type: 'blog',
    weight: 0.9
  },
  {
    keywords: ['writer', 'author', 'journalist', 'content creator', 'storytelling'],
    type: 'blog',
    weight: 0.8
  }
];

// Feature detection patterns
const FEATURE_PATTERNS = {
  gallery: ['gallery', 'portfolio', 'images', 'photos', 'pictures', 'showcase'],
  contact: ['contact', 'reach', 'email', 'phone', 'get in touch', 'connect'],
  about: ['about', 'story', 'mission', 'who we are', 'our team', 'biography'],
  services: ['services', 'offerings', 'solutions', 'what we do', 'expertise'],
  testimonials: ['testimonials', 'reviews', 'feedback', 'clients', 'customers'],
  menu: ['menu', 'food', 'dishes', 'cuisine', 'meals', 'drinks'],
  reservations: ['reservations', 'booking', 'reserve', 'table booking', 'appointments'],
  products: ['products', 'items', 'goods', 'merchandise', 'catalog'],
  cart: ['cart', 'shopping cart', 'checkout', 'buy now', 'purchase'],
  newsletter: ['newsletter', 'subscribe', 'email list', 'updates', 'subscription'],
  search: ['search', 'find', 'filter', 'browse', 'navigation']
};

// Style detection patterns
const STYLE_PATTERNS = {
  modern: ['modern', 'contemporary', 'sleek', 'minimalist', 'clean'],
  elegant: ['elegant', 'sophisticated', 'luxury', 'premium', 'high-end'],
  casual: ['casual', 'relaxed', 'friendly', 'informal', 'laid-back'],
  professional: ['professional', 'corporate', 'business', 'formal', 'serious'],
  creative: ['creative', 'artistic', 'bold', 'colorful', 'unique'],
  minimal: ['minimal', 'simple', 'clean', 'basic', 'understated'],
  dark: ['dark', 'black', 'moody', 'dramatic', 'bold'],
  colorful: ['colorful', 'vibrant', 'bright', 'rainbow', 'lively']
};

// Industry detection patterns
const INDUSTRY_PATTERNS = {
  photography: ['photography', 'photographer', 'photos', 'camera', 'shoot', 'lens'],
  design: ['design', 'designer', 'ui', 'ux', 'graphic', 'web design'],
  art: ['art', 'artist', 'artwork', 'creative', 'painting', 'sculpture'],
  development: ['development', 'developer', 'programming', 'coding', 'software', 'tech'],
  restaurant: ['restaurant', 'food', 'cuisine', 'chef', 'kitchen', 'dining'],
  retail: ['retail', 'shop', 'store', 'merchandise', 'fashion', 'clothing'],
  consulting: ['consulting', 'consultant', 'advisory', 'expertise', 'strategy'],
  real_estate: ['real estate', 'property', 'housing', 'rental', 'listing'],
  health: ['health', 'fitness', 'wellness', 'gym', 'medical', 'healthcare'],
  education: ['education', 'learning', 'courses', 'training', 'school', 'academy']
};

export class PromptAnalyzer {
  
  /**
   * Analyze a user prompt to extract website requirements
   */
  public analyzePrompt(prompt: string): PromptAnalysis {
    const normalizedPrompt = prompt.toLowerCase().trim();
    console.log('🔍 Analyzing prompt:', normalizedPrompt);
    
    // Extract keywords
    const keywords = this.extractKeywords(normalizedPrompt);
    console.log('📝 Extracted keywords:', keywords);
    
    // Detect website type
    const typeAnalysis = this.detectWebsiteType(keywords);
    console.log('🎯 Detected type:', typeAnalysis.type, 'with confidence:', typeAnalysis.confidence);
    
    // Detect industry
    const industry = this.detectIndustry(keywords);
    console.log('🏭 Detected industry:', industry);
    
    // Detect features
    const features = this.detectFeatures(keywords);
    console.log('⚡ Detected features:', features);
    
    // Detect style
    const style = this.detectStyle(keywords);
    console.log('🎨 Detected style:', style);
    
    // Extract entities
    const entities = this.extractEntities(normalizedPrompt);
    console.log('🏷️ Extracted entities:', entities);
    
    const analysis: PromptAnalysis = {
      type: typeAnalysis.type,
      confidence: typeAnalysis.confidence,
      industry,
      features,
      style,
      entities,
      keywords
    };
    
    console.log('✅ Final analysis:', analysis);
    return analysis;
  }
  
  /**
   * Extract important keywords from the prompt
   */
  private extractKeywords(prompt: string): string[] {
    // Remove common stop words
    const stopWords = new Set([
      'i', 'need', 'want', 'create', 'build', 'make', 'design', 'develop',
      'website', 'site', 'web', 'page', 'online', 'for', 'my', 'me', 'a',
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
      'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
    ]);
    
    const words = prompt
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Return unique keywords
    return [...new Set(words)];
  }
  
  /**
   * Detect the type of website based on keywords and patterns
   */
  private detectWebsiteType(keywords: string[]): { type: PromptAnalysis['type']; confidence: number } {
    let bestMatch = { type: 'business' as PromptAnalysis['type'], confidence: 0 };
    
    for (const pattern of KEYWORD_PATTERNS) {
      const matchCount = pattern.keywords.filter(keyword => 
        keywords.some(k => k.includes(keyword) || keyword.includes(k))
      ).length;
      
      if (matchCount > 0) {
        const confidence = (matchCount / pattern.keywords.length) * pattern.weight;
        if (confidence > bestMatch.confidence) {
          bestMatch = { type: pattern.type, confidence };
        }
      }
    }
    
    return bestMatch;
  }
  
  /**
   * Detect the industry based on keywords
   */
  private detectIndustry(keywords: string[]): string {
    for (const [industry, industryKeywords] of Object.entries(INDUSTRY_PATTERNS)) {
      const matchCount = industryKeywords.filter(keyword => 
        keywords.some(k => k.includes(keyword) || keyword.includes(k))
      ).length;
      
      if (matchCount >= 2) {
        return industry;
      }
    }
    
    return 'general';
  }
  
  /**
   * Detect required features based on keywords
   */
  private detectFeatures(keywords: string[]): string[] {
    const features: string[] = [];
    
    for (const [feature, featureKeywords] of Object.entries(FEATURE_PATTERNS)) {
      const hasFeature = featureKeywords.some(keyword => 
        keywords.some(k => k.includes(keyword) || keyword.includes(k))
      );
      
      if (hasFeature) {
        features.push(feature);
      }
    }
    
    // Always include contact as it's essential
    if (!features.includes('contact')) {
      features.push('contact');
    }
    
    return features;
  }
  
  /**
   * Detect style preference based on keywords
   */
  private detectStyle(keywords: string[]): string {
    for (const [style, styleKeywords] of Object.entries(STYLE_PATTERNS)) {
      const hasStyle = styleKeywords.some(keyword => 
        keywords.some(k => k.includes(keyword) || keyword.includes(k))
      );
      
      if (hasStyle) {
        return style;
      }
    }
    
    // Default style based on type
    return 'modern';
  }
  
  /**
   * Extract named entities from the prompt
   */
  private extractEntities(prompt: string): PromptAnalysis['entities'] {
    const entities: PromptAnalysis['entities'] = {};
    
    // Extract potential company names (capitalized words)
    const companyMatch = prompt.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
    if (companyMatch && !['I', 'My', 'A', 'The'].includes(companyMatch[1])) {
      entities.company = companyMatch[1];
    }
    
    // Extract location mentions
    const locationKeywords = ['new york', 'london', 'paris', 'tokyo', 'mumbai', 'delhi', 'bangalore'];
    for (const location of locationKeywords) {
      if (prompt.toLowerCase().includes(location)) {
        entities.location = location;
        break;
      }
    }
    
    // Extract service mentions
    const serviceKeywords = ['marketing', 'design', 'development', 'consulting', 'photography'];
    const foundServices = serviceKeywords.filter(service => 
      prompt.toLowerCase().includes(service)
    );
    if (foundServices.length > 0) {
      entities.services = foundServices;
    }
    
    // Extract product mentions
    const productKeywords = ['clothing', 'electronics', 'books', 'software', 'furniture'];
    const foundProducts = productKeywords.filter(product => 
      prompt.toLowerCase().includes(product)
    );
    if (foundProducts.length > 0) {
      entities.products = foundProducts;
    }
    
    return entities;
  }
  
  /**
   * Get analysis explanation for debugging
   */
  public getAnalysisExplanation(analysis: PromptAnalysis): string {
    return `
Website Type: ${analysis.type} (Confidence: ${(analysis.confidence * 100).toFixed(1)}%)
Industry: ${analysis.industry}
Style: ${analysis.style}
Features: ${analysis.features.join(', ')}
Keywords: ${analysis.keywords.join(', ')}
Entities: ${JSON.stringify(analysis.entities, null, 2)}
    `.trim();
  }
}

// Export singleton instance
export const promptAnalyzer = new PromptAnalyzer();

// Export convenience function
export function analyzePrompt(prompt: string): PromptAnalysis {
  return promptAnalyzer.analyzePrompt(prompt);
}

// Export for testing
export { PromptAnalyzer as PromptAnalyzerClass };
