// Template Configuration
// Defines available website templates and their characteristics

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  sections: TemplateSection[];
  styles: TemplateStyle;
  variables: TemplateVariable[];
}

export interface TemplateSection {
  id: string;
  name: string;
  required: boolean;
  description: string;
  defaultContent?: string;
}

export interface TemplateStyle {
  colorScheme: string[];
  typography: string;
  layout: string;
  responsiveness: string;
}

export interface TemplateVariable {
  key: string;
  type: 'text' | 'html' | 'image' | 'list' | 'boolean';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export const TEMPLATES: Record<string, TemplateConfig> = {
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio Website',
    description: 'Perfect for photographers, designers, artists, and developers to showcase their work',
    category: 'creative',
    features: ['gallery', 'about', 'contact', 'services'],
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        description: 'Main landing section with headline and call-to-action'
      },
      {
        id: 'about',
        name: 'About Section',
        required: true,
        description: 'Personal or company information'
      },
      {
        id: 'gallery',
        name: 'Gallery/Portfolio',
        required: true,
        description: 'Showcase of work or projects'
      },
      {
        id: 'services',
        name: 'Services Section',
        required: false,
        description: 'Services offered'
      },
      {
        id: 'contact',
        name: 'Contact Section',
        required: true,
        description: 'Contact information and form'
      }
    ],
    styles: {
      colorScheme: ['dark', 'minimal', 'bold', 'monochrome'],
      typography: 'modern',
      layout: 'grid-focused',
      responsiveness: 'mobile-first'
    },
    variables: [
      { key: 'COMPANY_NAME', type: 'text', description: 'Your name or company name', required: true },
      { key: 'TAGLINE', type: 'text', description: 'Professional tagline or headline', required: true },
      { key: 'ABOUT_TEXT', type: 'html', description: 'About section content', required: true },
      { key: 'GALLERY_ITEMS', type: 'list', description: 'Portfolio items or projects', required: true },
      { key: 'CONTACT_EMAIL', type: 'text', description: 'Contact email address', required: true },
      { key: 'CONTACT_PHONE', type: 'text', description: 'Contact phone number', required: false },
      { key: 'SOCIAL_LINKS', type: 'list', description: 'Social media links', required: false }
    ]
  },

  business: {
    id: 'business',
    name: 'Business Website',
    description: 'Professional website for companies, agencies, and consultants',
    category: 'business',
    features: ['services', 'testimonials', 'about', 'contact'],
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        description: 'Company introduction and value proposition'
      },
      {
        id: 'services',
        name: 'Services Section',
        required: true,
        description: 'List of services offered'
      },
      {
        id: 'about',
        name: 'About Company',
        required: true,
        description: 'Company story and mission'
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        required: false,
        description: 'Client testimonials and reviews'
      },
      {
        id: 'contact',
        name: 'Contact Information',
        required: true,
        description: 'Contact details and form'
      }
    ],
    styles: {
      colorScheme: ['professional', 'corporate', 'modern', 'clean'],
      typography: 'corporate',
      layout: 'section-based',
      responsiveness: 'mobile-first'
    },
    variables: [
      { key: 'COMPANY_NAME', type: 'text', description: 'Company name', required: true },
      { key: 'COMPANY_TAGLINE', type: 'text', description: 'Company tagline or slogan', required: true },
      { key: 'SERVICES', type: 'list', description: 'List of services offered', required: true },
      { key: 'ABOUT_COMPANY', type: 'html', description: 'Company about section', required: true },
      { key: 'TESTIMONIALS', type: 'list', description: 'Client testimonials', required: false },
      { key: 'CONTACT_INFO', type: 'html', description: 'Contact information', required: true },
      { key: 'ADDRESS', type: 'text', description: 'Business address', required: false }
    ]
  },

  restaurant: {
    id: 'restaurant',
    name: 'Restaurant Website',
    description: 'Ideal for restaurants, cafes, bars, and food services',
    category: 'food',
    features: ['menu', 'reservations', 'location', 'gallery'],
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        description: 'Restaurant introduction and ambiance'
      },
      {
        id: 'menu',
        name: 'Menu Section',
        required: true,
        description: 'Food and beverage menu'
      },
      {
        id: 'about',
        name: 'About Restaurant',
        required: true,
        description: 'Restaurant story and chef information'
      },
      {
        id: 'reservations',
        name: 'Reservations',
        required: false,
        description: 'Booking system or contact for reservations'
      },
      {
        id: 'location',
        name: 'Location & Hours',
        required: true,
        description: 'Address, map, and operating hours'
      }
    ],
    styles: {
      colorScheme: ['warm', 'elegant', 'casual', 'modern'],
      typography: 'elegant',
      layout: 'menu-focused',
      responsiveness: 'mobile-first'
    },
    variables: [
      { key: 'RESTAURANT_NAME', type: 'text', description: 'Restaurant name', required: true },
      { key: 'CUISINE_TYPE', type: 'text', description: 'Type of cuisine', required: true },
      { key: 'MENU_ITEMS', type: 'list', description: 'Menu categories and items', required: true },
      { key: 'ABOUT_RESTAURANT', type: 'html', description: 'Restaurant story', required: true },
      { key: 'HOURS', type: 'text', description: 'Operating hours', required: true },
      { key: 'ADDRESS', type: 'text', description: 'Restaurant address', required: true },
      { key: 'PHONE', type: 'text', description: 'Reservation phone', required: true }
    ]
  },

  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Online store for selling products and services',
    category: 'retail',
    features: ['products', 'shopping-cart', 'checkout', 'categories'],
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        description: 'Store introduction and featured products'
      },
      {
        id: 'products',
        name: 'Products Section',
        required: true,
        description: 'Product catalog and listings'
      },
      {
        id: 'categories',
        name: 'Categories',
        required: true,
        description: 'Product categories and navigation'
      },
      {
        id: 'features',
        name: 'Features',
        required: false,
        description: 'Store features and benefits'
      },
      {
        id: 'contact',
        name: 'Contact & Support',
        required: true,
        description: 'Customer service information'
      }
    ],
    styles: {
      colorScheme: ['vibrant', 'clean', 'modern', 'trustworthy'],
      typography: 'commerce',
      layout: 'product-grid',
      responsiveness: 'mobile-first'
    },
    variables: [
      { key: 'STORE_NAME', type: 'text', description: 'Online store name', required: true },
      { key: 'STORE_TAGLINE', type: 'text', description: 'Store slogan or value proposition', required: true },
      { key: 'PRODUCTS', type: 'list', description: 'Product listings', required: true },
      { key: 'CATEGORIES', type: 'list', description: 'Product categories', required: true },
      { key: 'SHIPPING_INFO', type: 'html', description: 'Shipping and return policies', required: false },
      { key: 'CONTACT_INFO', type: 'html', description: 'Customer service contact', required: true }
    ]
  },

  blog: {
    id: 'blog',
    name: 'Blog Website',
    description: 'Perfect for content creators, writers, and publishers',
    category: 'content',
    features: ['articles', 'categories', 'search', 'newsletter'],
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        description: 'Blog introduction and featured content'
      },
      {
        id: 'articles',
        name: 'Articles Section',
        required: true,
        description: 'Blog posts and articles'
      },
      {
        id: 'categories',
        name: 'Categories',
        required: true,
        description: 'Content categories and topics'
      },
      {
        id: 'about',
        name: 'About Author',
        required: true,
        description: 'Author biography and expertise'
      },
      {
        id: 'newsletter',
        name: 'Newsletter Signup',
        required: false,
        description: 'Email subscription form'
      }
    ],
    styles: {
      colorScheme: ['readable', 'clean', 'modern', 'minimal'],
      typography: 'readable',
      layout: 'content-focused',
      responsiveness: 'mobile-first'
    },
    variables: [
      { key: 'BLOG_NAME', type: 'text', description: 'Blog name or title', required: true },
      { key: 'BLOG_DESCRIPTION', type: 'text', description: 'Blog description or tagline', required: true },
      { key: 'ARTICLES', type: 'list', description: 'Blog posts or articles', required: true },
      { key: 'CATEGORIES', type: 'list', description: 'Content categories', required: true },
      { key: 'ABOUT_AUTHOR', type: 'html', description: 'Author biography', required: true },
      { key: 'NEWSLETTER_TEXT', type: 'text', description: 'Newsletter signup text', required: false }
    ]
  }
};

// Template selection logic based on analysis
export function selectTemplate(analysis: PromptAnalysis): string {
  const { type, industry, confidence } = analysis;
  
  // High confidence direct matches
  if (confidence > 0.8) {
    switch (type) {
      case 'portfolio': return 'portfolio';
      case 'business': return 'business';
      case 'restaurant': return 'restaurant';
      case 'ecommerce': return 'ecommerce';
      case 'blog': return 'blog';
    }
  }
  
  // Industry-based fallback
  switch (industry) {
    case 'photography':
    case 'design':
    case 'art':
    case 'development':
      return 'portfolio';
    
    case 'restaurant':
    case 'food':
    case 'cafe':
    case 'bar':
      return 'restaurant';
    
    case 'retail':
    case 'shop':
    case 'store':
      return 'ecommerce';
    
    case 'writing':
    case 'content':
    case 'journalism':
      return 'blog';
    
    default:
      return 'business'; // Default fallback
  }
}

// Feature-based template enhancement
export function getTemplateFeatures(templateId: string): string[] {
  const template = TEMPLATES[templateId];
  if (!template) return [];
  
  // Return all available features for the template
  return template.features;
}

// Template variable validation
export function validateTemplateVariables(templateId: string, variables: Record<string, any>): { 
  isValid: boolean; 
  missing: string[]; 
} {
  const template = TEMPLATES[templateId];
  if (!template) {
    return { isValid: false, missing: [] };
  }
  
  const required = template.variables
    .filter(v => v.required)
    .map(v => v.key);
  
  const missing = required.filter(key => !variables[key]);
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Export template list for UI selection (future feature)
export function getTemplateList(): TemplateConfig[] {
  return Object.values(TEMPLATES);
}

// Get template by ID
export function getTemplate(templateId: string): TemplateConfig | undefined {
  return TEMPLATES[templateId];
}

// Type for prompt analysis (will be defined in promptAnalyzer)
interface PromptAnalysis {
  type: string;
  industry: string;
  features: string[];
  style: string;
  confidence: number;
}
