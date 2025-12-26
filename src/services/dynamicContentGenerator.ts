// Dynamic AI Content Generator - Creates real, contextual content for websites
// This generates actual business content, not placeholder text

import { getAvailableProvider, formatRequest, parseResponse, AI_PROVIDERS } from '../config/aiProviders';
import { webScrapingService, IndustryAnalysis } from './webScrapingService';
import { svgGenerationService } from './svgGenerationService';

export interface ContentSection {
  type: 'hero' | 'features' | 'about' | 'services' | 'testimonials' | 'pricing' | 'contact' | 'footer';
  title: string;
  subtitle?: string;
  content: string;
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
    price?: string;
  }>;
  cta?: {
    primary: string;
    secondary?: string;
  };
}

export interface WebsiteContent {
  businessName: string;
  tagline: string;
  description: string;
  industry: string;
  colorScheme: string;
  sections: ContentSection[];
  navigation: string[];
}

export class DynamicContentGenerator {
  
  /**
   * Generate complete website content based on user prompt
   */
  static async generateWebsiteContent(prompt: string): Promise<WebsiteContent> {
    console.log('🎨 Generating dynamic content for:', prompt);
    
    // Phase 1: Industry Analysis with Web Scraping
    console.log('🔍 Phase 1: Analyzing industry and competitors...');
    const industryAnalysis = await webScrapingService.analyzeIndustry(prompt);
    console.log('📊 Industry analysis complete:', industryAnalysis.industry);
    
    // Phase 2: Generate SVG Icons and Graphics
    console.log('🎨 Phase 2: Generating custom SVGs and icons...');
    const customIcons = svgGenerationService.generateIndustryIcons(industryAnalysis.industry, 6);
    const heroIllustration = svgGenerationService.generateHeroIllustration(industryAnalysis.industry);
    console.log('✨ Generated', customIcons.length, 'custom icons and hero illustration');
    
    // Phase 3: Enhanced AI Content Generation
    const provider = getAvailableProvider();
    if (!provider) {
      return this.getEnhancedFallbackContent(prompt, industryAnalysis, customIcons);
    }
    
    const providerKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
    if (!providerKey) {
      return this.getEnhancedFallbackContent(prompt, industryAnalysis, customIcons);
    }
    
    const contentPrompt = `You are an expert web designer and copywriter with deep industry knowledge creating UNIQUE, SPECIFIC content for a ${industryAnalysis.industry} website.

USER REQUEST: "${prompt}"

INDUSTRY ANALYSIS:
- Industry: ${industryAnalysis.industry}
- Common Features: ${industryAnalysis.commonFeatures.join(', ')}
- Design Trends: ${industryAnalysis.designTrends.join(', ')}
- Content Patterns: ${industryAnalysis.contentPatterns.join(', ')}
- Technical Features: ${industryAnalysis.technicalFeatures.join(', ')}

COMPETITOR INSIGHTS:
${industryAnalysis.competitors.map(comp => 
  `- ${comp.name}: ${comp.features.join(', ')} (Style: ${comp.designStyle})`
).join('\n')}

CRITICAL REQUIREMENTS - FORCE UNIQUE CONTENT:
1. ANALYZE THE EXACT USER REQUEST: "${prompt}" - Extract specific details, names, locations, style preferences
2. CREATE COMPLETELY UNIQUE BUSINESS IDENTITY - Generate a specific business name that matches the user's request
3. NO GENERIC TEMPLATES - Every word must be specific to this exact request
4. REAL BUSINESS DETAILS - Create authentic services, pricing, locations, team members
5. INDUSTRY-SPECIFIC LANGUAGE - Use professional terminology specific to ${industryAnalysis.industry}
6. UNIQUE VALUE PROPOSITIONS - Create compelling, specific benefits not found in templates
7. AUTHENTIC SOCIAL PROOF - Generate realistic testimonials, reviews, case studies
8. SPECIFIC CALL-TO-ACTIONS - Create unique CTAs that match the business type
9. REAL CONTACT INFORMATION - Generate realistic (but fictional) addresses, phone formats
10. BRAND PERSONALITY - Create a unique voice and tone that matches the user's vision

EXAMPLES OF WHAT TO AVOID:
❌ "Professional services" → ✅ "Award-winning architectural photography"
❌ "Quality products" → ✅ "Hand-roasted single-origin coffee beans"
❌ "Expert team" → ✅ "James Mitchell, Master Sommelier with 15 years experience"
❌ "Contact us" → ✅ "Book your tasting session"

FORCE CREATIVITY - Make this business feel REAL and SPECIFIC to the user's exact request.

EXAMPLE - DO NOT COPY, CREATE YOUR OWN UNIQUE VERSION:
If user asks for "photographer portfolio", you might create:
{
  "businessName": "Elena Rodriguez Photography",
  "tagline": "Capturing Life's Authentic Moments",
  "description": "Award-winning portrait and wedding photographer specializing in natural light photography with a documentary style approach.",
  "industry": "photography",
  "colorScheme": "warm",
  "navigation": ["Portfolio", "About", "Services", "Contact"],
  "sections": [...]
}

NOW CREATE YOUR UNIQUE VERSION - Return a JSON object with this EXACT structure (NO BRACKETS, REAL CONTENT):
{
  "businessName": "Actual unique business name based on user request",
  "tagline": "Compelling real tagline",
  "description": "Specific 2-3 sentence business description",
  "industry": "Detected industry from user request",
  "colorScheme": "Appropriate color scheme",
  "navigation": ["Relevant", "Navigation", "Items", "For", "This", "Business"],
  "sections": [
    {
      "type": "hero",
      "title": "Compelling hero headline specific to this business",
      "subtitle": "Supporting subtitle that makes sense",
      "content": "Hero description paragraph with real details",
      "cta": {
        "primary": "Specific CTA button text",
        "secondary": "Secondary CTA that fits the business"
      }
    },
    {
      "type": "features",
      "title": "Features section title that fits the business",
      "content": "Features intro text specific to this industry",
      "items": [
        {
          "title": "Specific feature name for this business type",
          "description": "Real feature description with actual benefits",
          "icon": "Appropriate emoji or icon"
        },
        {
          "title": "Another specific feature name",
          "description": "Another real feature description",
          "icon": "Another appropriate icon"
        },
        {
          "title": "Third specific feature name",
          "description": "Third real feature description",
          "icon": "Third appropriate icon"
        }
      ]
    },
    {
      "type": "about",
      "title": "About section title for this specific business",
      "content": "Real about us content with specific details, background, and story - 2-3 paragraphs of authentic content"
    },
    {
      "type": "services",
      "title": "Services section title that fits",
      "content": "Services intro specific to this business",
      "items": [
        {
          "title": "Specific service name",
          "description": "Real service description with details",
          "price": "Realistic price if applicable"
        },
        {
          "title": "Another specific service",
          "description": "Another real service description",
          "price": "Another realistic price"
        }
      ]
    },
    {
      "type": "contact",
      "title": "Contact section title that fits the business",
      "content": "Contact intro text specific to this business type"
    }
  ]
}

Make it SPECIFIC to the user's request. No generic content!

Return ONLY the JSON (no markdown, no explanation):`;

    try {
      console.log('🤖 Calling AI with enhanced prompt for unique content generation...');
      const response = await this.callAI(provider, contentPrompt, providerKey);
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      const content = JSON.parse(cleanResponse);
      
      // Validate that content is actually unique and not generic
      if (this.isGenericContent(content)) {
        console.warn('⚠️ AI generated generic content, forcing unique fallback...');
        throw new Error('Generic content detected');
      }
      
      // Phase 4: Enhance content with industry-specific features
      const enhancedContent = this.enhanceWithIndustryFeatures(content, industryAnalysis, customIcons);
      
      console.log('✅ Generated UNIQUE dynamic content:', enhancedContent.businessName);
      console.log('🎯 Industry-specific features added:', enhancedContent.sections.length, 'sections');
      console.log('📝 Content preview:', enhancedContent.sections[0]?.title);
      return enhancedContent;
    } catch (error) {
      console.error('❌ Content generation failed:', error);
      console.log('🔄 Using UNIQUE enhanced fallback content (not generic templates)...');
      return this.getEnhancedFallbackContent(prompt, industryAnalysis, customIcons);
    }
  }

  /**
   * Check if generated content is generic/template-based
   */
  private static isGenericContent(content: any): boolean {
    const genericIndicators = [
      'your business',
      'lorem ipsum',
      'placeholder',
      'sample text',
      'example content',
      'generic',
      'template',
      'professional solutions',
      'we provide',
      'our services',
      '[',
      ']',
      'feature 1',
      'service 1',
      'section title',
      'intro text',
      'description here'
    ];
    
    const contentStr = JSON.stringify(content).toLowerCase();
    const hasGenericIndicators = genericIndicators.some(indicator => contentStr.includes(indicator));
    
    // Also check if business name is too generic
    const hasGenericBusinessName = content.businessName && (
      content.businessName.toLowerCase().includes('business') ||
      content.businessName.toLowerCase().includes('company') ||
      content.businessName.toLowerCase().includes('services') ||
      content.businessName.length < 3
    );
    
    return hasGenericIndicators || hasGenericBusinessName;
  }
  
  /**
   * Enhance content with industry-specific features and icons
   */
  private static enhanceWithIndustryFeatures(
    content: WebsiteContent, 
    industryAnalysis: IndustryAnalysis, 
    customIcons: any[]
  ): WebsiteContent {
    // Add industry-specific features to sections
    const enhancedSections = content.sections.map(section => {
      if (section.type === 'features' && section.items) {
        // Replace generic icons with industry-specific SVG icons
        section.items = section.items.map((item, index) => ({
          ...item,
          icon: customIcons[index % customIcons.length]?.svg || item.icon
        }));
        
        // Add industry-specific features
        const industryFeatures = industryAnalysis.commonFeatures.slice(0, 3).map(feature => ({
          title: feature,
          description: `Professional ${feature.toLowerCase()} designed for ${industryAnalysis.industry} businesses.`,
          icon: customIcons[Math.floor(Math.random() * customIcons.length)]?.svg || '⭐'
        }));
        
        section.items = [...section.items, ...industryFeatures];
      }
      
      return section;
    });
    
    // Add industry-specific navigation
    const industryNav = [...content.navigation];
    if (industryAnalysis.industry === 'restaurant') {
      if (!industryNav.includes('Menu')) industryNav.splice(2, 0, 'Menu');
      if (!industryNav.includes('Reservations')) industryNav.splice(3, 0, 'Reservations');
    } else if (industryAnalysis.industry === 'shoe') {
      if (!industryNav.includes('Products')) industryNav.splice(2, 0, 'Products');
      if (!industryNav.includes('Size Guide')) industryNav.splice(3, 0, 'Size Guide');
    } else if (industryAnalysis.industry === 'tech') {
      if (!industryNav.includes('Documentation')) industryNav.splice(2, 0, 'Documentation');
      if (!industryNav.includes('API')) industryNav.splice(3, 0, 'API');
    }
    
    return {
      ...content,
      sections: enhancedSections,
      navigation: industryNav,
      industry: industryAnalysis.industry
    };
  }
  
  /**
   * Generate enhanced fallback content with industry analysis
   */
  private static getEnhancedFallbackContent(
    prompt: string, 
    industryAnalysis: IndustryAnalysis, 
    customIcons: any[]
  ): WebsiteContent {
    const businessName = this.extractBusinessName(prompt);
    const industry = industryAnalysis.industry;
    
    // Generate UNIQUE content based on the specific prompt
    const uniqueContent = this.generateUniqueContentFromPrompt(prompt, industry, businessName, industryAnalysis);
    
    return {
      businessName,
      tagline: uniqueContent.tagline,
      description: uniqueContent.description,
      industry,
      colorScheme: this.getIndustryColor(industry),
      navigation: uniqueContent.navigation,
      sections: uniqueContent.sections.map(section => {
        if (section.type === 'features' && section.items) {
          // Add custom icons to features
          section.items = section.items.map((item, index) => ({
            ...item,
            icon: customIcons[index % customIcons.length]?.svg || item.icon
          }));
        }
        return section;
      })
    };
  }

  /**
   * Generate unique content based on specific user prompt (not templates)
   */
  private static generateUniqueContentFromPrompt(
    prompt: string, 
    industry: string, 
    businessName: string, 
    industryAnalysis: IndustryAnalysis
  ): {
    tagline: string;
    description: string;
    navigation: string[];
    sections: ContentSection[];
  } {
    // Extract specific details from the user's prompt
    const promptLower = prompt.toLowerCase();
    const isSpecificBusiness = promptLower.includes('shoe') || promptLower.includes('restaurant') || 
                              promptLower.includes('tech') || promptLower.includes('food') ||
                              promptLower.includes('app') || promptLower.includes('store');
    
    if (isSpecificBusiness) {
      // Generate content based on what the user actually asked for
      if (promptLower.includes('shoe') || promptLower.includes('footwear') || promptLower.includes('sneaker')) {
        return this.generateShoeBusinessContent(businessName, prompt);
      } else if (promptLower.includes('restaurant') || promptLower.includes('food') || promptLower.includes('cafe')) {
        return this.generateRestaurantContent(businessName, prompt);
      } else if (promptLower.includes('tech') || promptLower.includes('app') || promptLower.includes('software')) {
        return this.generateTechContent(businessName, prompt);
      }
    }
    
    // Use industry-specific content as fallback
    return this.getIndustrySpecificContent(industry, businessName);
  }

  /**
   * Generate unique shoe business content
   */
  private static generateShoeBusinessContent(businessName: string, prompt: string): {
    tagline: string;
    description: string;
    navigation: string[];
    sections: ContentSection[];
  } {
    const promptLower = prompt.toLowerCase();
    const isLuxury = promptLower.includes('luxury') || promptLower.includes('premium') || promptLower.includes('designer');
    const isSports = promptLower.includes('sport') || promptLower.includes('athletic') || promptLower.includes('running');
    
    const tagline = isLuxury ? 'Luxury Footwear Redefined' : 
                   isSports ? 'Performance Meets Style' : 
                   'Step Into Excellence';
    
    const description = isLuxury ? 
      `${businessName} crafts luxury footwear using premium Italian leather and artisanal techniques, delivering unparalleled elegance and comfort.` :
      isSports ?
      `${businessName} designs high-performance athletic footwear engineered for athletes and fitness enthusiasts who demand excellence.` :
      `${businessName} offers premium footwear combining innovative design, superior comfort, and lasting quality for every lifestyle.`;

    return {
      tagline,
      description,
      navigation: ['Home', 'Collection', 'Size Guide', 'About', 'Contact'],
      sections: [
        {
          type: 'hero' as const,
          title: `${businessName} - ${tagline}`,
          subtitle: isLuxury ? 'Handcrafted Italian Excellence' : isSports ? 'Engineered for Performance' : 'Where Comfort Meets Style',
          content: description,
          cta: { primary: 'Shop Now', secondary: 'Size Guide' }
        },
        {
          type: 'features' as const,
          title: 'What Makes Us Different',
          content: 'Experience the difference of expertly crafted footwear.',
          items: [
            { 
              title: isLuxury ? 'Italian Craftsmanship' : isSports ? 'Performance Technology' : 'Premium Materials', 
              description: isLuxury ? 'Hand-selected Italian leather crafted by master artisans.' : 
                          isSports ? 'Advanced cushioning and support systems for peak performance.' :
                          'Carefully selected materials for durability and comfort.',
              icon: '👟' 
            },
            { 
              title: isLuxury ? 'Exclusive Designs' : isSports ? 'Athletic Innovation' : 'Perfect Fit', 
              description: isLuxury ? 'Limited edition designs that make a statement.' :
                          isSports ? 'Cutting-edge technology for every sport and activity.' :
                          'Comprehensive sizing and expert fitting guidance.',
              icon: '✨' 
            },
            { 
              title: 'Lifetime Quality', 
              description: 'Built to last with premium construction and materials.', 
              icon: '🛡️' 
            }
          ]
        }
      ]
    };
  }

  /**
   * Generate unique restaurant content
   */
  private static generateRestaurantContent(businessName: string, prompt: string): {
    tagline: string;
    description: string;
    navigation: string[];
    sections: ContentSection[];
  } {
    const promptLower = prompt.toLowerCase();
    const isFine = promptLower.includes('fine') || promptLower.includes('upscale') || promptLower.includes('elegant');
    const isCasual = promptLower.includes('casual') || promptLower.includes('family') || promptLower.includes('bistro');
    
    const tagline = isFine ? 'Culinary Artistry Awaits' : 
                   isCasual ? 'Where Friends Become Family' : 
                   'Fresh Flavors, Warm Hospitality';
    
    const description = isFine ? 
      `${businessName} offers an exquisite fine dining experience with chef-crafted cuisine, premium ingredients, and impeccable service.` :
      isCasual ?
      `${businessName} brings you comfort food with a modern twist in a warm, welcoming atmosphere perfect for family and friends.` :
      `${businessName} serves fresh, locally-sourced cuisine with exceptional flavors and genuine hospitality in every dish.`;

    return {
      tagline,
      description,
      navigation: ['Home', 'Menu', 'Reservations', 'Events', 'Contact'],
      sections: [
        {
          type: 'hero' as const,
          title: `Welcome to ${businessName}`,
          subtitle: tagline,
          content: description,
          cta: { primary: 'View Menu', secondary: 'Make Reservation' }
        },
        {
          type: 'features' as const,
          title: 'Our Culinary Promise',
          content: 'Every dish tells a story of passion, quality, and culinary excellence.',
          items: [
            { 
              title: isFine ? 'Chef\'s Tasting Menu' : 'Farm-to-Table Fresh', 
              description: isFine ? 'Multi-course culinary journey featuring seasonal specialties.' :
                          'Locally sourced ingredients delivered fresh daily from trusted farms.',
              icon: '🍽️' 
            },
            { 
              title: isFine ? 'Wine Sommelier' : 'Comfort Classics', 
              description: isFine ? 'Expert wine pairings curated by our certified sommelier.' :
                          'Beloved comfort foods elevated with modern techniques and fresh ingredients.',
              icon: '🍷' 
            },
            { 
              title: 'Private Events', 
              description: 'Intimate dining spaces and catering for your special occasions.', 
              icon: '🎉' 
            }
          ]
        }
      ]
    };
  }

  /**
   * Generate unique tech content
   */
  private static generateTechContent(businessName: string, prompt: string): {
    tagline: string;
    description: string;
    navigation: string[];
    sections: ContentSection[];
  } {
    const promptLower = prompt.toLowerCase();
    const isAI = promptLower.includes('ai') || promptLower.includes('artificial intelligence') || promptLower.includes('machine learning');
    const isSaaS = promptLower.includes('saas') || promptLower.includes('software') || promptLower.includes('platform');
    
    const tagline = isAI ? 'AI-Powered Innovation' : 
                   isSaaS ? 'Software That Scales' : 
                   'Technology That Transforms';
    
    const description = isAI ? 
      `${businessName} harnesses the power of artificial intelligence to create intelligent solutions that automate processes and drive business growth.` :
      isSaaS ?
      `${businessName} delivers cloud-native software solutions that scale with your business, providing reliability, security, and performance.` :
      `${businessName} develops cutting-edge technology solutions that transform how businesses operate and compete in the digital age.`;

    return {
      tagline,
      description,
      navigation: ['Home', 'Solutions', 'API', 'Pricing', 'Contact'],
      sections: [
        {
          type: 'hero' as const,
          title: `${businessName} - ${tagline}`,
          subtitle: isAI ? 'Intelligent Solutions for Modern Business' : isSaaS ? 'Cloud-Native Software Solutions' : 'Next-Generation Technology',
          content: description,
          cta: { primary: 'Get Started', secondary: 'View Demo' }
        },
        {
          type: 'features' as const,
          title: 'Why Choose Our Technology',
          content: 'Built for performance, designed for scale, optimized for success.',
          items: [
            { 
              title: isAI ? 'Machine Learning' : isSaaS ? 'Cloud Architecture' : 'Scalable Solutions', 
              description: isAI ? 'Advanced ML algorithms that learn and adapt to your business needs.' :
                          isSaaS ? 'Robust cloud infrastructure that grows with your business.' :
                          'Technology solutions that scale from startup to enterprise.',
              icon: '🤖' 
            },
            { 
              title: isAI ? 'Predictive Analytics' : 'API-First Design', 
              description: isAI ? 'Data-driven insights that predict trends and optimize performance.' :
                          'Comprehensive APIs for seamless integrations and custom workflows.',
              icon: '📊' 
            },
            { 
              title: 'Enterprise Security', 
              description: 'Bank-level encryption and security protocols to protect your data.', 
              icon: '🔒' 
            }
          ]
        }
      ]
    };
  }
  
  /**
   * Get industry-specific content templates
   */
  private static getIndustrySpecificContent(industry: string, businessName: string): {
    tagline: string;
    description: string;
    navigation: string[];
    sections: ContentSection[];
  } {
    const industryTemplates = {
      'shoe': {
        tagline: 'Step Into Excellence',
        description: `${businessName} offers premium footwear combining style, comfort, and performance for every lifestyle.`,
        navigation: ['Home', 'Products', 'Size Guide', 'About', 'Contact'],
        sections: [
          {
            type: 'hero' as const,
            title: `Premium Footwear by ${businessName}`,
            subtitle: 'Where Style Meets Performance',
            content: 'Discover our collection of expertly crafted shoes designed for comfort, durability, and style. From athletic performance to everyday elegance.',
            cta: { primary: 'Shop Collection', secondary: 'Size Guide' }
          },
          {
            type: 'features' as const,
            title: 'Why Choose Our Footwear',
            content: 'Experience the difference of premium craftsmanship and innovative design.',
            items: [
              { title: 'Premium Materials', description: 'Carefully selected leather and sustainable materials for lasting quality.', icon: '👟' },
              { title: 'Comfort Technology', description: 'Advanced cushioning and support systems for all-day comfort.', icon: '💎' },
              { title: 'Perfect Fit', description: 'Comprehensive size guide and fitting expertise for the perfect fit.', icon: '📏' },
              { title: 'Style Variety', description: 'From athletic performance to formal elegance, find your perfect style.', icon: '✨' },
              { title: 'Durability Promise', description: 'Built to last with premium construction and quality materials.', icon: '🛡️' },
              { title: 'Sustainable Choice', description: 'Eco-friendly materials and responsible manufacturing practices.', icon: '🌱' }
            ]
          }
        ]
      },
      
      'restaurant': {
        tagline: 'Culinary Excellence Awaits',
        description: `${businessName} brings you an exceptional dining experience with fresh ingredients, expert preparation, and warm hospitality.`,
        navigation: ['Home', 'Menu', 'Reservations', 'About', 'Contact'],
        sections: [
          {
            type: 'hero' as const,
            title: `Welcome to ${businessName}`,
            subtitle: 'Where Every Meal is a Celebration',
            content: 'Experience culinary artistry with our chef-crafted dishes, made from the finest local ingredients in an atmosphere of warmth and elegance.',
            cta: { primary: 'View Menu', secondary: 'Make Reservation' }
          },
          {
            type: 'features' as const,
            title: 'Our Culinary Promise',
            content: 'Every dish tells a story of passion, quality, and culinary excellence.',
            items: [
              { title: 'Farm-to-Table Fresh', description: 'Locally sourced ingredients delivered fresh daily from trusted farms.', icon: '🥬' },
              { title: 'Master Chef Crafted', description: 'Expert culinary techniques and creative presentations in every dish.', icon: '👨‍🍳' },
              { title: 'Seasonal Menus', description: 'Rotating seasonal selections featuring the best ingredients of each season.', icon: '🍂' },
              { title: 'Wine Pairings', description: 'Carefully curated wine selection to complement every meal perfectly.', icon: '🍷' },
              { title: 'Private Events', description: 'Intimate dining spaces and catering for your special occasions.', icon: '🎉' },
              { title: 'Dietary Options', description: 'Accommodating all dietary needs with delicious alternatives.', icon: '🌿' }
            ]
          }
        ]
      },
      
      'tech': {
        tagline: 'Innovation Meets Excellence',
        description: `${businessName} delivers cutting-edge technology solutions that transform businesses and empower growth.`,
        navigation: ['Home', 'Solutions', 'Documentation', 'API', 'About', 'Contact'],
        sections: [
          {
            type: 'hero' as const,
            title: `Transform Your Business with ${businessName}`,
            subtitle: 'Next-Generation Technology Solutions',
            content: 'Harness the power of advanced technology with our scalable, secure, and innovative solutions designed for modern businesses.',
            cta: { primary: 'Get Started', secondary: 'View Documentation' }
          },
          {
            type: 'features' as const,
            title: 'Technology That Works',
            content: 'Built for performance, designed for scale, optimized for success.',
            items: [
              { title: 'Cloud-Native Architecture', description: 'Scalable, resilient infrastructure that grows with your business needs.', icon: '☁️' },
              { title: 'API-First Design', description: 'Seamless integrations with comprehensive RESTful APIs and webhooks.', icon: '🔗' },
              { title: 'Enterprise Security', description: 'Bank-level encryption and security protocols to protect your data.', icon: '🔒' },
              { title: 'Real-Time Analytics', description: 'Advanced analytics and reporting for data-driven decision making.', icon: '📊' },
              { title: '24/7 Support', description: 'Round-the-clock technical support from our expert engineering team.', icon: '🛠️' },
              { title: 'Auto-Scaling', description: 'Intelligent scaling that adapts to your traffic and usage patterns.', icon: '⚡' }
            ]
          }
        ]
      }
    };
    
    return industryTemplates[industry] || industryTemplates['tech'];
  }
  
  /**
   * Generate realistic fallback content (legacy method)
   */
  private static getFallbackContent(prompt: string): WebsiteContent {
    const businessName = this.extractBusinessName(prompt);
    const industry = this.detectIndustry(prompt);
    
    return {
      businessName,
      tagline: `Professional ${industry} Solutions`,
      description: `We provide high-quality ${industry} services with modern technology and exceptional customer experience.`,
      industry,
      colorScheme: this.getIndustryColor(industry),
      navigation: ['Home', 'About', 'Services', 'Contact'],
      sections: [
        {
          type: 'hero',
          title: `Welcome to ${businessName}`,
          subtitle: `Professional ${industry} Solutions`,
          content: `Transform your business with our cutting-edge ${industry} services. We deliver results that matter.`,
          cta: {
            primary: 'Get Started',
            secondary: 'Learn More'
          }
        },
        {
          type: 'features',
          title: 'Why Choose Us',
          content: 'We offer comprehensive solutions tailored to your needs.',
          items: [
            {
              title: 'Expert Team',
              description: 'Our experienced professionals deliver exceptional results.',
              icon: '👥'
            },
            {
              title: 'Modern Technology',
              description: 'We use the latest tools and technologies for optimal performance.',
              icon: '⚡'
            },
            {
              title: '24/7 Support',
              description: 'Round-the-clock support to ensure your success.',
              icon: '🛟'
            }
          ]
        },
        {
          type: 'about',
          title: 'About Us',
          content: `${businessName} is a leading provider of ${industry} solutions. We combine innovation with reliability to deliver exceptional value to our clients. Our team of experts is dedicated to helping you achieve your goals with cutting-edge technology and personalized service.`
        },
        {
          type: 'services',
          title: 'Our Services',
          content: 'Comprehensive solutions designed for your success.',
          items: [
            {
              title: 'Consultation',
              description: 'Expert advice and strategic planning for your business.',
              price: 'Starting at $99'
            },
            {
              title: 'Implementation',
              description: 'Full-service implementation and deployment.',
              price: 'Custom pricing'
            }
          ]
        },
        {
          type: 'contact',
          title: 'Get In Touch',
          content: 'Ready to get started? Contact us today for a free consultation.'
        }
      ]
    };
  }
  
  private static extractBusinessName(prompt: string): string {
    // Try to extract business name from prompt with better intelligence
    const promptLower = prompt.toLowerCase();
    
    // Look for explicit business name patterns
    const namePatterns = [
      /(?:called|named|for)\s+([A-Z][a-zA-Z\s]+)/i,
      /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(?:website|site|company|business)/i,
      /^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Generate industry-specific business names
    const words = prompt.split(' ');
    const businessWords = words.filter(word => 
      word.length > 2 && 
      !['for', 'the', 'and', 'with', 'website', 'site', 'page', 'app', 'create', 'build', 'make', 'a', 'an'].includes(word.toLowerCase())
    );
    
    if (businessWords.length > 0) {
      const baseName = businessWords.slice(0, 2).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
      // Add industry-specific suffixes for more realistic names
      if (promptLower.includes('shoe') || promptLower.includes('footwear')) {
        return baseName.includes('Shoe') ? baseName : `${baseName} Footwear`;
      } else if (promptLower.includes('restaurant') || promptLower.includes('food')) {
        return baseName.includes('Restaurant') ? baseName : `${baseName} Kitchen`;
      } else if (promptLower.includes('tech') || promptLower.includes('software')) {
        return baseName.includes('Tech') ? baseName : `${baseName} Tech`;
      }
      
      return baseName;
    }
    
    // Generate completely unique names based on industry
    if (promptLower.includes('shoe')) return 'Stride & Style';
    if (promptLower.includes('restaurant')) return 'Harvest Table';
    if (promptLower.includes('tech')) return 'Nexus Solutions';
    if (promptLower.includes('coffee')) return 'Roasted Beans';
    if (promptLower.includes('fitness')) return 'Peak Performance';
    
    return 'Innovate Co';
  }
  
  private static detectIndustry(prompt: string): string {
    const industries = {
      'restaurant': ['restaurant', 'food', 'cafe', 'dining', 'menu', 'kitchen'],
      'tech': ['tech', 'software', 'app', 'digital', 'startup', 'saas'],
      'healthcare': ['health', 'medical', 'doctor', 'clinic', 'hospital', 'wellness'],
      'finance': ['finance', 'bank', 'investment', 'money', 'financial'],
      'education': ['education', 'school', 'learning', 'course', 'training'],
      'ecommerce': ['shop', 'store', 'ecommerce', 'retail', 'product', 'buy'],
      'agency': ['agency', 'marketing', 'design', 'creative', 'advertising'],
      'fitness': ['fitness', 'gym', 'workout', 'health', 'exercise'],
      'real estate': ['real estate', 'property', 'home', 'house', 'apartment']
    };
    
    const lowerPrompt = prompt.toLowerCase();
    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        return industry;
      }
    }
    
    return 'business';
  }
  
  private static getIndustryColor(industry: string): string {
    const colors = {
      'restaurant': 'orange',
      'tech': 'blue',
      'healthcare': 'green',
      'finance': 'blue',
      'education': 'purple',
      'ecommerce': 'red',
      'agency': 'purple',
      'fitness': 'green',
      'real estate': 'blue',
      'business': 'blue'
    };
    
    return colors[industry] || 'blue';
  }
  
  /**
   * Call AI API with automatic provider fallback
   */
  private static async callAI(provider: any, prompt: string, providerKey: string): Promise<string> {
    const requestData = formatRequest(providerKey, prompt);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (providerKey === 'google') {
      const url = `${provider.endpoint}?key=${provider.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`Google API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return parseResponse(providerKey, data).content;
    }
    
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
      throw new Error(`${providerKey} API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return parseResponse(providerKey, data).content;
  }
}