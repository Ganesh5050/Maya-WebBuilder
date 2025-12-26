// Phase 1: Industry Intelligence System
// Solves the "pink template" problem by understanding context and generating unique designs

export interface IndustryProfile {
  industry: string;
  category: string;
  keywords: string[];
  colorPalettes: ColorPalette[];
  typography: TypographyProfile;
  layoutPatterns: string[];
  requiredFeatures: string[];
  contentPatterns: ContentPattern[];
  designPersonality: DesignPersonality;
}

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  mood: string;
}

export interface TypographyProfile {
  headingFont: string;
  bodyFont: string;
  scale: number;
  personality: string;
}

export interface ContentPattern {
  type: string;
  template: string;
  examples: string[];
}

export interface DesignPersonality {
  mood: 'professional' | 'creative' | 'playful' | 'luxury' | 'minimal' | 'bold';
  energy: 'calm' | 'moderate' | 'energetic';
  sophistication: 'simple' | 'moderate' | 'complex';
  trustLevel: 'casual' | 'professional' | 'enterprise';
}

export class IndustryIntelligence {
  
  private static industryProfiles: Record<string, IndustryProfile> = {
    'athletic-footwear': {
      industry: 'athletic-footwear',
      category: 'ecommerce',
      keywords: ['athletic', 'running', 'sports', 'performance', 'sneakers', 'training'],
      colorPalettes: [
        {
          name: 'Nike-Inspired',
          primary: '#FF6B35', // Orange-red
          secondary: '#000000', // Black
          accent: '#FFFFFF', // White
          background: '#F8F9FA',
          text: '#212529',
          mood: 'energetic'
        },
        {
          name: 'Adidas-Inspired',
          primary: '#000000', // Black
          secondary: '#1E88E5', // Blue
          accent: '#FFFFFF', // White
          background: '#F5F5F5',
          text: '#333333',
          mood: 'professional'
        },
        {
          name: 'Under Armour-Inspired',
          primary: '#1B1B1B', // Dark gray
          secondary: '#E61E2B', // Red
          accent: '#F0F0F0', // Light gray
          background: '#FFFFFF',
          text: '#1B1B1B',
          mood: 'bold'
        }
      ],
      typography: {
        headingFont: 'Inter, system-ui, sans-serif',
        bodyFont: 'Inter, system-ui, sans-serif',
        scale: 1.333, // Perfect fourth - dynamic and energetic
        personality: 'bold'
      },
      layoutPatterns: ['product-grid', 'hero-with-cta', 'feature-showcase', 'athlete-testimonials'],
      requiredFeatures: ['product-catalog', 'size-guide', 'cart', 'wishlist', 'reviews', 'size-selector'],
      contentPatterns: [
        {
          type: 'hero-headline',
          template: 'Unleash Your {PERFORMANCE_WORD} with {BRAND_NAME}',
          examples: ['Unleash Your Potential with Elite Athletics', 'Unleash Your Speed with Pro Runner']
        },
        {
          type: 'product-description',
          template: '{PERFORMANCE_BENEFIT} {PRODUCT_TYPE} designed for {TARGET_ACTIVITY}',
          examples: ['Lightweight running shoes designed for marathon performance', 'Breathable training sneakers designed for cross-training']
        }
      ],
      designPersonality: {
        mood: 'bold',
        energy: 'energetic',
        sophistication: 'moderate',
        trustLevel: 'professional'
      }
    },

    'luxury-footwear': {
      industry: 'luxury-footwear',
      category: 'ecommerce',
      keywords: ['luxury', 'premium', 'leather', 'handcrafted', 'designer', 'elegant'],
      colorPalettes: [
        {
          name: 'Gucci-Inspired',
          primary: '#1B4332', // Forest green
          secondary: '#D4AF37', // Gold
          accent: '#FFFFFF', // White
          background: '#FEFEFE',
          text: '#2D3748',
          mood: 'luxury'
        },
        {
          name: 'Louboutin-Inspired',
          primary: '#000000', // Black
          secondary: '#DC143C', // Crimson red
          accent: '#F7FAFC', // Off-white
          background: '#FFFFFF',
          text: '#1A202C',
          mood: 'dramatic'
        }
      ],
      typography: {
        headingFont: 'Playfair Display, serif',
        bodyFont: 'Inter, sans-serif',
        scale: 1.618, // Golden ratio - luxury and dramatic
        personality: 'elegant'
      },
      layoutPatterns: ['minimal-hero', 'large-product-images', 'story-sections', 'craftsmanship-details'],
      requiredFeatures: ['product-catalog', 'size-guide', 'cart', 'wishlist', 'appointment-booking', 'concierge-service'],
      contentPatterns: [
        {
          type: 'hero-headline',
          template: 'Exquisite {PRODUCT_TYPE} Crafted for the Discerning {TARGET_AUDIENCE}',
          examples: ['Exquisite Leather Shoes Crafted for the Discerning Gentleman', 'Exquisite Handbags Crafted for the Modern Woman']
        }
      ],
      designPersonality: {
        mood: 'luxury',
        energy: 'calm',
        sophistication: 'complex',
        trustLevel: 'enterprise'
      }
    },

    'restaurant-fine-dining': {
      industry: 'restaurant-fine-dining',
      category: 'hospitality',
      keywords: ['fine dining', 'gourmet', 'chef', 'cuisine', 'reservation', 'culinary'],
      colorPalettes: [
        {
          name: 'Elegant Warmth',
          primary: '#8B4513', // Saddle brown
          secondary: '#DAA520', // Goldenrod
          accent: '#F5F5DC', // Beige
          background: '#FFFEF7',
          text: '#2F1B14',
          mood: 'warm'
        },
        {
          name: 'Modern Sophistication',
          primary: '#2C3E50', // Dark blue-gray
          secondary: '#E67E22', // Orange
          accent: '#ECF0F1', // Light gray
          background: '#FFFFFF',
          text: '#34495E',
          mood: 'sophisticated'
        }
      ],
      typography: {
        headingFont: 'Cormorant Garamond, serif',
        bodyFont: 'Source Sans Pro, sans-serif',
        scale: 1.250, // Major third - balanced and elegant
        personality: 'elegant'
      },
      layoutPatterns: ['full-width-hero', 'menu-showcase', 'chef-story', 'reservation-form'],
      requiredFeatures: ['menu-display', 'reservation-system', 'location-map', 'hours', 'contact-form'],
      contentPatterns: [
        {
          type: 'hero-headline',
          template: 'An Unforgettable {CUISINE_TYPE} Experience Awaits',
          examples: ['An Unforgettable Italian Experience Awaits', 'An Unforgettable Farm-to-Table Experience Awaits']
        }
      ],
      designPersonality: {
        mood: 'luxury',
        energy: 'calm',
        sophistication: 'complex',
        trustLevel: 'professional'
      }
    },

    'tech-saas': {
      industry: 'tech-saas',
      category: 'technology',
      keywords: ['saas', 'software', 'platform', 'api', 'cloud', 'automation'],
      colorPalettes: [
        {
          name: 'Modern Tech',
          primary: '#6366F1', // Indigo
          secondary: '#8B5CF6', // Purple
          accent: '#EC4899', // Pink
          background: '#F8FAFC',
          text: '#1E293B',
          mood: 'modern'
        },
        {
          name: 'Enterprise Blue',
          primary: '#2563EB', // Blue
          secondary: '#059669', // Green
          accent: '#F59E0B', // Amber
          background: '#FFFFFF',
          text: '#111827',
          mood: 'professional'
        }
      ],
      typography: {
        headingFont: 'Inter, system-ui, sans-serif',
        bodyFont: 'Inter, system-ui, sans-serif',
        scale: 1.250, // Major third - clean and readable
        personality: 'modern'
      },
      layoutPatterns: ['centered-hero', 'feature-grid', 'pricing-table', 'testimonials'],
      requiredFeatures: ['pricing-plans', 'feature-comparison', 'demo-request', 'api-docs', 'dashboard-preview'],
      contentPatterns: [
        {
          type: 'hero-headline',
          template: 'Transform Your {BUSINESS_PROCESS} with {SOLUTION_TYPE}',
          examples: ['Transform Your Workflow with Intelligent Automation', 'Transform Your Data with Advanced Analytics']
        }
      ],
      designPersonality: {
        mood: 'professional',
        energy: 'moderate',
        sophistication: 'moderate',
        trustLevel: 'enterprise'
      }
    },

    'creative-agency': {
      industry: 'creative-agency',
      category: 'services',
      keywords: ['creative', 'design', 'branding', 'marketing', 'agency', 'portfolio'],
      colorPalettes: [
        {
          name: 'Creative Bold',
          primary: '#FF6B6B', // Coral red
          secondary: '#4ECDC4', // Turquoise
          accent: '#45B7D1', // Sky blue
          background: '#F8F9FA',
          text: '#2C3E50',
          mood: 'creative'
        },
        {
          name: 'Minimal Creative',
          primary: '#000000', // Black
          secondary: '#FF3366', // Hot pink
          accent: '#FFFF00', // Yellow
          background: '#FFFFFF',
          text: '#333333',
          mood: 'bold'
        }
      ],
      typography: {
        headingFont: 'Poppins, sans-serif',
        bodyFont: 'Inter, sans-serif',
        scale: 1.333, // Perfect fourth - dynamic
        personality: 'creative'
      },
      layoutPatterns: ['asymmetric-hero', 'portfolio-grid', 'process-timeline', 'team-showcase'],
      requiredFeatures: ['portfolio-gallery', 'case-studies', 'team-profiles', 'contact-form', 'service-pages'],
      contentPatterns: [
        {
          type: 'hero-headline',
          template: 'We Create {CREATIVE_OUTPUT} That {BUSINESS_IMPACT}',
          examples: ['We Create Brands That Captivate Audiences', 'We Create Experiences That Drive Results']
        }
      ],
      designPersonality: {
        mood: 'creative',
        energy: 'energetic',
        sophistication: 'moderate',
        trustLevel: 'professional'
      }
    }
  };

  /**
   * Phase 1.1: Industry Classification
   * Analyzes user prompt and detects industry with personality
   */
  static classifyIndustry(prompt: string): IndustryProfile {
    console.log('🔍 Classifying industry from prompt:', prompt);
    
    const lowerPrompt = prompt.toLowerCase();
    
    // Detect specific industry patterns
    for (const [industryKey, profile] of Object.entries(this.industryProfiles)) {
      const keywordMatches = profile.keywords.filter(keyword => 
        lowerPrompt.includes(keyword.toLowerCase())
      ).length;
      
      if (keywordMatches > 0) {
        console.log('✅ Detected industry:', profile.industry, 'with', keywordMatches, 'keyword matches');
        return profile;
      }
    }
    
    // Fallback: Detect broader categories
    if (lowerPrompt.includes('shoe') || lowerPrompt.includes('footwear')) {
      // Determine if athletic or luxury based on context
      if (lowerPrompt.includes('athletic') || lowerPrompt.includes('sport') || lowerPrompt.includes('running')) {
        return this.industryProfiles['athletic-footwear'];
      } else if (lowerPrompt.includes('luxury') || lowerPrompt.includes('premium') || lowerPrompt.includes('designer')) {
        return this.industryProfiles['luxury-footwear'];
      } else {
        return this.industryProfiles['athletic-footwear']; // Default to athletic
      }
    }
    
    if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('dining')) {
      return this.industryProfiles['restaurant-fine-dining'];
    }
    
    if (lowerPrompt.includes('saas') || lowerPrompt.includes('software') || lowerPrompt.includes('platform')) {
      return this.industryProfiles['tech-saas'];
    }
    
    if (lowerPrompt.includes('agency') || lowerPrompt.includes('creative') || lowerPrompt.includes('design')) {
      return this.industryProfiles['creative-agency'];
    }
    
    // Default fallback
    console.log('⚠️ No specific industry detected, using tech-saas default');
    return this.industryProfiles['tech-saas'];
  }

  /**
   * Phase 2.1: Intelligent Color Palette Generation
   * Generates unique colors based on industry and mood
   */
  static generateColorPalette(industryProfile: IndustryProfile, moodPreference?: string): ColorPalette {
    console.log('🎨 Generating color palette for:', industryProfile.industry);
    
    // Select palette based on mood preference or randomly
    let selectedPalette: ColorPalette;
    
    if (moodPreference) {
      const moodMatch = industryProfile.colorPalettes.find(p => 
        p.mood.toLowerCase().includes(moodPreference.toLowerCase())
      );
      selectedPalette = moodMatch || industryProfile.colorPalettes[0];
    } else {
      // Randomly select from available palettes to ensure variety
      const randomIndex = Math.floor(Math.random() * industryProfile.colorPalettes.length);
      selectedPalette = industryProfile.colorPalettes[randomIndex];
    }
    
    console.log('✅ Selected palette:', selectedPalette.name, 'with mood:', selectedPalette.mood);
    return selectedPalette;
  }

  /**
   * Phase 1.2: Brand Personality Detection
   * Analyzes prompt for personality traits
   */
  static detectBrandPersonality(prompt: string): DesignPersonality {
    const lowerPrompt = prompt.toLowerCase();
    
    // Detect mood keywords
    let mood: DesignPersonality['mood'] = 'professional';
    if (lowerPrompt.includes('luxury') || lowerPrompt.includes('premium') || lowerPrompt.includes('elegant')) {
      mood = 'luxury';
    } else if (lowerPrompt.includes('creative') || lowerPrompt.includes('artistic') || lowerPrompt.includes('design')) {
      mood = 'creative';
    } else if (lowerPrompt.includes('fun') || lowerPrompt.includes('playful') || lowerPrompt.includes('kids')) {
      mood = 'playful';
    } else if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) {
      mood = 'minimal';
    } else if (lowerPrompt.includes('bold') || lowerPrompt.includes('dynamic') || lowerPrompt.includes('energetic')) {
      mood = 'bold';
    }
    
    // Detect energy level
    let energy: DesignPersonality['energy'] = 'moderate';
    if (lowerPrompt.includes('calm') || lowerPrompt.includes('peaceful') || lowerPrompt.includes('zen')) {
      energy = 'calm';
    } else if (lowerPrompt.includes('energetic') || lowerPrompt.includes('dynamic') || lowerPrompt.includes('active')) {
      energy = 'energetic';
    }
    
    // Detect sophistication
    let sophistication: DesignPersonality['sophistication'] = 'moderate';
    if (lowerPrompt.includes('simple') || lowerPrompt.includes('basic') || lowerPrompt.includes('minimal')) {
      sophistication = 'simple';
    } else if (lowerPrompt.includes('complex') || lowerPrompt.includes('detailed') || lowerPrompt.includes('rich')) {
      sophistication = 'complex';
    }
    
    // Detect trust level
    let trustLevel: DesignPersonality['trustLevel'] = 'professional';
    if (lowerPrompt.includes('enterprise') || lowerPrompt.includes('corporate') || lowerPrompt.includes('business')) {
      trustLevel = 'enterprise';
    } else if (lowerPrompt.includes('casual') || lowerPrompt.includes('friendly') || lowerPrompt.includes('personal')) {
      trustLevel = 'casual';
    }
    
    return { mood, energy, sophistication, trustLevel };
  }

  /**
   * Generate complete design system based on industry intelligence
   */
  static generateDesignSystem(prompt: string): {
    industry: IndustryProfile;
    colors: ColorPalette;
    personality: DesignPersonality;
    typography: TypographyProfile;
  } {
    console.log('🎯 Generating complete design system for:', prompt);
    
    const industry = this.classifyIndustry(prompt);
    const personality = this.detectBrandPersonality(prompt);
    const colors = this.generateColorPalette(industry);
    
    // Adjust typography based on personality
    const typography = { ...industry.typography };
    if (personality.mood === 'luxury') {
      typography.headingFont = 'Playfair Display, serif';
      typography.scale = 1.618; // Golden ratio
    } else if (personality.mood === 'playful') {
      typography.headingFont = 'Poppins, sans-serif';
      typography.scale = 1.333; // Perfect fourth
    } else if (personality.mood === 'minimal') {
      typography.headingFont = 'Inter, system-ui, sans-serif';
      typography.scale = 1.125; // Minor second
    }
    
    console.log('✅ Design system generated:', {
      industry: industry.industry,
      colors: colors.name,
      mood: personality.mood,
      typography: typography.headingFont
    });
    
    return { industry, colors, personality, typography };
  }
}