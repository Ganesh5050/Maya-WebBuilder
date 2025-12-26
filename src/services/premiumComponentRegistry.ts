// Premium Component Registry - Maps industries to stunning animated components
// This solves the "generic component" problem by selecting the RIGHT components for each industry

export interface ComponentSelection {
  hero: {
    component: string;
    variant: string;
    props: Record<string, any>;
  };
  features: {
    component: string;
    variant: string;
    props: Record<string, any>;
  };
  testimonials: {
    component: string;
    variant: string;
    props: Record<string, any>;
  };
  cta: {
    component: string;
    variant: string;
    props: Record<string, any>;
  };
  products?: {
    component: string;
    variant: string;
    props: Record<string, any>;
  };
}

export class PremiumComponentRegistry {
  
  private static industryComponentMap: Record<string, ComponentSelection> = {
    'athletic-footwear': {
      hero: {
        component: 'SpotlightHero',
        variant: 'energetic',
        props: {
          colors: { primary: '#FF6B35', secondary: '#000000', accent: '#FFFFFF' },
          subtitle: 'Performance Footwear',
          primaryCTA: 'Shop Collection',
          secondaryCTA: 'View Size Guide'
        }
      },
      features: {
        component: 'EcommerceBentoGrid',
        variant: 'athletic',
        props: {
          colors: { primary: '#FF6B35', secondary: '#000000' }
        }
      },
      testimonials: {
        component: 'TestimonialMarquee',
        variant: 'athletic',
        props: {
          colors: { primary: '#FF6B35', secondary: '#000000' }
        }
      },
      cta: {
        component: 'EcommerceBorderBeamButton',
        variant: 'athletic',
        props: {
          colors: { from: '#FF6B35', to: '#000000' }
        }
      },
      products: {
        component: 'ProductCard3D',
        variant: 'athletic',
        props: {
          colors: { primary: '#FF6B35', secondary: '#000000' }
        }
      }
    },

    'luxury-footwear': {
      hero: {
        component: 'SpotlightHero',
        variant: 'elegant',
        props: {
          colors: { primary: '#1B4332', secondary: '#D4AF37', accent: '#FFFFFF' },
          subtitle: 'Luxury Craftsmanship',
          primaryCTA: 'Explore Collection',
          secondaryCTA: 'Book Appointment'
        }
      },
      features: {
        component: 'BentoGrid',
        variant: 'luxury',
        props: {
          colors: { primary: '#1B4332', secondary: '#D4AF37' }
        }
      },
      testimonials: {
        component: 'TestimonialMarquee',
        variant: 'luxury',
        props: {
          colors: { primary: '#1B4332', secondary: '#D4AF37' }
        }
      },
      cta: {
        component: 'LuxuryBorderBeamButton',
        variant: 'luxury',
        props: {
          colors: { from: '#D4AF37', to: '#1B4332' }
        }
      },
      products: {
        component: 'ProductCard3D',
        variant: 'luxury',
        props: {
          colors: { primary: '#1B4332', secondary: '#D4AF37' }
        }
      }
    },

    'restaurant-fine-dining': {
      hero: {
        component: 'SpotlightHero',
        variant: 'elegant',
        props: {
          colors: { primary: '#8B4513', secondary: '#DAA520', accent: '#F5F5DC' },
          subtitle: 'Culinary Excellence',
          primaryCTA: 'Reserve Table',
          secondaryCTA: 'View Menu'
        }
      },
      features: {
        component: 'BentoGrid',
        variant: 'restaurant',
        props: {
          colors: { primary: '#8B4513', secondary: '#DAA520' }
        }
      },
      testimonials: {
        component: 'TestimonialMarquee',
        variant: 'restaurant',
        props: {
          colors: { primary: '#8B4513', secondary: '#DAA520' }
        }
      },
      cta: {
        component: 'BorderBeamButton',
        variant: 'restaurant',
        props: {
          colors: { from: '#DAA520', to: '#8B4513' }
        }
      }
    },

    'tech-saas': {
      hero: {
        component: 'SpotlightHero',
        variant: 'modern',
        props: {
          colors: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#EC4899' },
          subtitle: 'Next-Gen Platform',
          primaryCTA: 'Start Free Trial',
          secondaryCTA: 'Watch Demo'
        }
      },
      features: {
        component: 'TechBentoGrid',
        variant: 'saas',
        props: {
          colors: { primary: '#6366F1', secondary: '#8B5CF6' }
        }
      },
      testimonials: {
        component: 'TestimonialMarquee',
        variant: 'tech',
        props: {
          colors: { primary: '#6366F1', secondary: '#8B5CF6' }
        }
      },
      cta: {
        component: 'TechBorderBeamButton',
        variant: 'saas',
        props: {
          colors: { from: '#6366F1', to: '#8B5CF6' }
        }
      }
    },

    'creative-agency': {
      hero: {
        component: 'SpotlightHero',
        variant: 'creative',
        props: {
          colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#45B7D1' },
          subtitle: 'Creative Excellence',
          primaryCTA: 'View Our Work',
          secondaryCTA: 'Start Project'
        }
      },
      features: {
        component: 'BentoGrid',
        variant: 'creative',
        props: {
          colors: { primary: '#FF6B6B', secondary: '#4ECDC4' }
        }
      },
      testimonials: {
        component: 'TestimonialMarquee',
        variant: 'creative',
        props: {
          colors: { primary: '#FF6B6B', secondary: '#4ECDC4' }
        }
      },
      cta: {
        component: 'BorderBeamButton',
        variant: 'creative',
        props: {
          colors: { from: '#FF6B6B', to: '#4ECDC4' }
        }
      }
    }
  };

  /**
   * Get premium components for an industry
   */
  static getComponentsForIndustry(industry: string): ComponentSelection {
    console.log('🎨 Selecting premium components for industry:', industry);
    
    const components = this.industryComponentMap[industry] || this.industryComponentMap['tech-saas'];
    
    console.log('✅ Selected components:', {
      hero: components.hero.component,
      features: components.features.component,
      testimonials: components.testimonials.component,
      cta: components.cta.component
    });
    
    return components;
  }

  /**
   * Generate component imports for the selected components
   */
  static generateComponentImports(components: ComponentSelection): string {
    const imports = new Set<string>();
    
    // Add imports based on selected components
    if (components.hero.component === 'SpotlightHero') {
      imports.add("import { SpotlightHero } from '@/components/aceternity/SpotlightHero';");
    }
    
    if (components.features.component.includes('BentoGrid')) {
      imports.add("import { BentoGrid, BentoGridItem, TechBentoGrid, EcommerceBentoGrid } from '@/components/aceternity/BentoGrid';");
    }
    
    if (components.testimonials.component === 'TestimonialMarquee') {
      imports.add("import { TestimonialMarquee } from '@/components/magic-ui/Marquee';");
    }
    
    if (components.cta.component.includes('BorderBeamButton')) {
      imports.add("import { BorderBeamButton, TechBorderBeamButton, EcommerceBorderBeamButton, LuxuryBorderBeamButton } from '@/components/magic-ui/BorderBeam';");
    }
    
    if (components.products?.component === 'ProductCard3D') {
      imports.add("import { ProductCard3D } from '@/components/aceternity/ThreeDCard';");
    }
    
    return Array.from(imports).join('\n');
  }

  /**
   * Generate sample data for components
   */
  static generateSampleData(industry: string): {
    features: Array<{ title: string; description: string; icon: string }>;
    testimonials: Array<{ name: string; role: string; company: string; content: string; rating: number }>;
    products?: Array<{ name: string; price: string; image: string; description: string }>;
  } {
    const industryData = {
      'athletic-footwear': {
        features: [
          { title: 'Performance Technology', description: 'Advanced cushioning and support for peak performance', icon: '⚡' },
          { title: 'Durable Construction', description: 'Built to withstand intense training and competition', icon: '🛡️' },
          { title: 'Breathable Design', description: 'Moisture-wicking materials keep feet cool and dry', icon: '💨' },
          { title: 'Perfect Fit', description: 'Precision sizing for optimal comfort and performance', icon: '📏' },
          { title: 'Style Variety', description: 'From training to lifestyle, find your perfect style', icon: '✨' },
          { title: 'Sustainable Materials', description: 'Eco-friendly construction without compromising performance', icon: '🌱' }
        ],
        testimonials: [
          { name: 'Marcus Johnson', role: 'Professional Runner', company: 'Elite Athletics', content: 'These shoes transformed my training. The comfort and performance are unmatched.', rating: 5 },
          { name: 'Sarah Chen', role: 'Fitness Coach', company: 'Peak Performance Gym', content: 'I recommend these to all my clients. Quality and durability are exceptional.', rating: 5 },
          { name: 'Mike Rodriguez', role: 'Marathon Runner', company: 'City Running Club', content: 'Perfect for long distances. My feet feel great even after 26 miles.', rating: 5 }
        ],
        products: [
          { name: 'Elite Runner Pro', price: '$149.99', image: '/api/placeholder/400/300', description: 'Professional running shoe with advanced cushioning technology' },
          { name: 'Training Max', price: '$129.99', image: '/api/placeholder/400/300', description: 'Versatile training shoe for all workout types' },
          { name: 'Street Style', price: '$99.99', image: '/api/placeholder/400/300', description: 'Casual lifestyle sneaker with athletic performance' }
        ]
      },
      
      'luxury-footwear': {
        features: [
          { title: 'Handcrafted Excellence', description: 'Each pair meticulously crafted by master artisans', icon: '👨‍🎨' },
          { title: 'Premium Materials', description: 'Finest Italian leather and exotic materials', icon: '💎' },
          { title: 'Bespoke Service', description: 'Custom fitting and personalization available', icon: '📐' },
          { title: 'Timeless Design', description: 'Classic styles that never go out of fashion', icon: '⏰' },
          { title: 'Heritage Quality', description: 'Generations of craftsmanship tradition', icon: '🏛️' },
          { title: 'Lifetime Care', description: 'Complimentary maintenance and restoration', icon: '🔧' }
        ],
        testimonials: [
          { name: 'James Wellington', role: 'CEO', company: 'Wellington & Associates', content: 'Exquisite craftsmanship. These shoes are a work of art.', rating: 5 },
          { name: 'Isabella Rossi', role: 'Fashion Director', company: 'Vogue Italia', content: 'The attention to detail is extraordinary. Pure luxury.', rating: 5 },
          { name: 'Charles Pemberton', role: 'Collector', company: 'Private', content: 'I own over 200 pairs of luxury shoes. These are the finest.', rating: 5 }
        ],
        products: [
          { name: 'Oxford Masterpiece', price: '$899.99', image: '/api/placeholder/400/300', description: 'Hand-stitched Oxford in premium Italian leather' },
          { name: 'Derby Elegance', price: '$799.99', image: '/api/placeholder/400/300', description: 'Classic Derby with modern comfort technology' },
          { name: 'Loafer Luxury', price: '$699.99', image: '/api/placeholder/400/300', description: 'Sophisticated loafer for the discerning gentleman' }
        ]
      },
      
      'tech-saas': {
        features: [
          { title: 'Cloud-Native Architecture', description: 'Scalable infrastructure that grows with your business', icon: '☁️' },
          { title: 'Advanced Analytics', description: 'Real-time insights and comprehensive reporting', icon: '📊' },
          { title: 'Enterprise Security', description: 'Bank-level encryption and compliance standards', icon: '🔒' },
          { title: 'API Integration', description: 'Seamless connectivity with your existing tools', icon: '🔗' },
          { title: '24/7 Support', description: 'Round-the-clock assistance from our expert team', icon: '🛠️' },
          { title: 'Auto-Scaling', description: 'Intelligent scaling based on your usage patterns', icon: '⚡' }
        ],
        testimonials: [
          { name: 'David Kim', role: 'CTO', company: 'TechStart Inc', content: 'This platform revolutionized our workflow. Incredible performance and reliability.', rating: 5 },
          { name: 'Lisa Thompson', role: 'Product Manager', company: 'InnovateCorp', content: 'The analytics features are game-changing. We make better decisions faster.', rating: 5 },
          { name: 'Alex Rodriguez', role: 'DevOps Lead', company: 'ScaleUp Solutions', content: 'Best SaaS platform we\'ve used. The API integration is seamless.', rating: 5 }
        ]
      }
    };
    
    return industryData[industry] || industryData['tech-saas'];
  }

  /**
   * Generate premium component JSX code
   */
  static generateComponentJSX(
    components: ComponentSelection, 
    sampleData: any,
    businessName: string,
    industry: string
  ): string {
    const heroProps = components.hero.props;
    const featuresProps = components.features.props;
    const testimonialsProps = components.testimonials.props;
    const ctaProps = components.cta.props;
    
    return `
// Premium Animated Components - Industry: ${industry}
function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Spotlight Hero */}
      <SpotlightHero
        title="${this.generateHeroTitle(businessName, industry)}"
        subtitle="${heroProps.subtitle}"
        description="${this.generateHeroDescription(businessName, industry)}"
        primaryCTA="${heroProps.primaryCTA}"
        secondaryCTA="${heroProps.secondaryCTA}"
        colors={${JSON.stringify(heroProps.colors)}}
      />
      
      {/* Animated Bento Grid Features */}
      <${components.features.component}
        features={${JSON.stringify(sampleData.features)}}
      />
      
      {/* Infinite Scrolling Testimonials */}
      <TestimonialMarquee
        testimonials={${JSON.stringify(sampleData.testimonials)}}
        colors={${JSON.stringify(testimonialsProps.colors)}}
      />
      
      ${sampleData.products ? `
      {/* 3D Product Cards */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-xl text-gray-600">Discover our premium collection</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            ${sampleData.products.map((product: any, i: number) => `
            <ProductCard3D
              product={${JSON.stringify(product)}}
              colors={${JSON.stringify(components.products?.props.colors)}}
            />`).join('')}
          </div>
        </div>
      </div>` : ''}
      
      {/* Animated CTA Section */}
      <div className="py-20 bg-gradient-to-br from-gray-900 to-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience ${businessName}?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who trust our quality.
          </p>
          <${components.cta.component}>
            Get Started Today
          </${components.cta.component}>
        </div>
      </div>
    </div>
  );
}`;
  }

  private static generateHeroTitle(businessName: string, industry: string): string {
    const titles = {
      'athletic-footwear': `Unleash Your Potential with ${businessName}`,
      'luxury-footwear': `Exquisite Craftsmanship by ${businessName}`,
      'restaurant-fine-dining': `Culinary Excellence at ${businessName}`,
      'tech-saas': `Transform Your Business with ${businessName}`,
      'creative-agency': `Creative Excellence by ${businessName}`
    };
    
    return titles[industry] || `Welcome to ${businessName}`;
  }

  private static generateHeroDescription(businessName: string, industry: string): string {
    const descriptions = {
      'athletic-footwear': `Experience the perfect fusion of performance, comfort, and style with ${businessName}'s premium athletic footwear collection.`,
      'luxury-footwear': `Discover handcrafted luxury shoes that combine traditional artisanship with modern elegance at ${businessName}.`,
      'restaurant-fine-dining': `Indulge in an unforgettable culinary journey with expertly crafted dishes and exceptional service at ${businessName}.`,
      'tech-saas': `Revolutionize your workflow with ${businessName}'s cutting-edge platform designed for modern businesses.`,
      'creative-agency': `Bring your vision to life with ${businessName}'s award-winning creative solutions and innovative design expertise.`
    };
    
    return descriptions[industry] || `Experience excellence with ${businessName}.`;
  }
}