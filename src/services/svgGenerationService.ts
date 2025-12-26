// SVG Generation Service for Dynamic Icons and Graphics
// Generates industry-specific SVGs, icons, and graphics

export interface SVGIcon {
  name: string;
  category: string;
  svg: string;
  viewBox: string;
  description: string;
}

export interface CustomSVG {
  type: 'icon' | 'logo' | 'illustration' | 'pattern';
  svg: string;
  colors: string[];
  size: { width: number; height: number };
}

export class SVGGenerationService {
  
  /**
   * Generate industry-specific icons
   */
  static generateIndustryIcons(industry: string, count: number = 6): SVGIcon[] {
    console.log('🎨 Generating SVG icons for industry:', industry);
    
    const iconSets: Record<string, SVGIcon[]> = {
      'shoe': [
        {
          name: 'running-shoe',
          category: 'footwear',
          viewBox: '0 0 24 24',
          description: 'Athletic running shoe icon',
          svg: `<path d="M2 18h20l-2-6H8l-2-3H4l-2 9z" fill="currentColor"/>
                <path d="M6 15h12l1 3H5l1-3z" fill="currentColor" opacity="0.7"/>
                <circle cx="7" cy="19" r="1" fill="currentColor"/>
                <circle cx="17" cy="19" r="1" fill="currentColor"/>`
        },
        {
          name: 'size-chart',
          category: 'measurement',
          viewBox: '0 0 24 24',
          description: 'Shoe size measurement icon',
          svg: `<rect x="3" y="8" width="18" height="8" rx="2" fill="currentColor" opacity="0.3"/>
                <path d="M3 10h18v4H3v-4z" fill="currentColor"/>
                <text x="12" y="13" text-anchor="middle" font-size="6" fill="white">SIZE</text>`
        },
        {
          name: 'comfort',
          category: 'features',
          viewBox: '0 0 24 24',
          description: 'Comfort and cushioning icon',
          svg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.3"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="currentColor"/>
                <circle cx="12" cy="12" r="3" fill="white"/>`
        },
        {
          name: 'athletic',
          category: 'performance',
          viewBox: '0 0 24 24',
          description: 'Athletic performance icon',
          svg: `<path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="currentColor"/>
                <path d="M9.8 8.5L9 9.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3L12 9.1l1.6 1.6c.4.4 1 .4 1.4 0s.4-1 0-1.4l-.8-.8C15.3 7.8 16 6.5 16 5H8c0 1.5.7 2.8 1.8 3.5z" fill="currentColor"/>
                <path d="M7.6 14.8L9 16.2c.4.4 1 .4 1.4 0L12 14.6l1.6 1.6c.4.4 1 .4 1.4 0l1.4-1.4c.4-.4.4-1 0-1.4L15 12l1.4-1.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0L12 12.2l-3-3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L9 12l-1.4 1.4c-.4.4-.4 1 0 1.4z" fill="currentColor"/>`
        },
        {
          name: 'warranty',
          category: 'service',
          viewBox: '0 0 24 24',
          description: 'Warranty and guarantee icon',
          svg: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor" opacity="0.3"/>
                <path d="M12 3L5 6v5c0 4.5 3.1 8.7 7 9.8 3.9-1.1 7-5.3 7-9.8V6l-7-3z" fill="currentColor"/>
                <path d="M10 14l-3-3 1.4-1.4L10 11.2l5.6-5.6L17 7l-7 7z" fill="white"/>`
        },
        {
          name: 'style',
          category: 'fashion',
          viewBox: '0 0 24 24',
          description: 'Fashion and style icon',
          svg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.3"/>
                <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z" fill="currentColor"/>
                <path d="M8 12l2-2 2 2 2-2 2 2" stroke="white" stroke-width="2" fill="none"/>`
        }
      ],
      
      'restaurant': [
        {
          name: 'chef-hat',
          category: 'culinary',
          viewBox: '0 0 24 24',
          description: 'Chef hat icon',
          svg: `<path d="M12 2C8.69 2 6 4.69 6 8v2h12V8c0-3.31-2.69-6-6-6z" fill="currentColor"/>
                <rect x="7" y="10" width="10" height="8" rx="1" fill="currentColor" opacity="0.7"/>
                <path d="M8 18h8v2H8v-2z" fill="currentColor"/>`
        },
        {
          name: 'dining',
          category: 'service',
          viewBox: '0 0 24 24',
          description: 'Fine dining icon',
          svg: `<path d="M8.1 13.34l2.83-2.83L3.91 3.5c-.78-.78-2.05-.78-2.83 0s-.78 2.05 0 2.83l7.02 7.01z" fill="currentColor"/>
                <path d="M14.88 11.53c1.17.56 2.67.37 3.65-.61.49-.49.49-1.28 0-1.77s-1.28-.49-1.77 0c-.61.61-.56 1.56.12 2.38z" fill="currentColor"/>
                <path d="M17 4h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-3V4z" fill="currentColor" opacity="0.7"/>`
        },
        {
          name: 'menu',
          category: 'food',
          viewBox: '0 0 24 24',
          description: 'Restaurant menu icon',
          svg: `<rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" opacity="0.3"/>
                <rect x="6" y="5" width="12" height="14" rx="1" fill="currentColor"/>
                <line x1="8" y1="8" x2="16" y2="8" stroke="white" stroke-width="1"/>
                <line x1="8" y1="11" x2="14" y2="11" stroke="white" stroke-width="1"/>
                <line x1="8" y1="14" x2="12" y2="14" stroke="white" stroke-width="1"/>`
        },
        {
          name: 'reservation',
          category: 'booking',
          viewBox: '0 0 24 24',
          description: 'Table reservation icon',
          svg: `<rect x="4" y="10" width="16" height="8" rx="2" fill="currentColor" opacity="0.3"/>
                <circle cx="7" cy="14" r="1" fill="currentColor"/>
                <circle cx="12" cy="14" r="1" fill="currentColor"/>
                <circle cx="17" cy="14" r="1" fill="currentColor"/>
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/>`
        },
        {
          name: 'organic',
          category: 'quality',
          viewBox: '0 0 24 24',
          description: 'Organic ingredients icon',
          svg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.3"/>
                <path d="M17 8c-1.5-1.5-4-1.5-5.5 0L10 9.5 8.5 8C7 6.5 4.5 6.5 3 8s-1.5 4 0 5.5L12 22.5l9-9C22.5 12 22.5 9.5 21 8s-4-1.5-5.5 0z" fill="currentColor"/>
                <path d="M12 18l-6-6c-.5-.5-.5-1.5 0-2s1.5-.5 2 0l4 4 4-4c.5-.5 1.5-.5 2 0s.5 1.5 0 2l-6 6z" fill="white"/>`
        },
        {
          name: 'delivery',
          category: 'service',
          viewBox: '0 0 24 24',
          description: 'Food delivery icon',
          svg: `<path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7z" fill="currentColor"/>
                <circle cx="7" cy="17" r="2" fill="currentColor" opacity="0.7"/>
                <circle cx="17" cy="17" r="2" fill="currentColor" opacity="0.7"/>`
        }
      ],
      
      'tech': [
        {
          name: 'api',
          category: 'development',
          viewBox: '0 0 24 24',
          description: 'API integration icon',
          svg: `<rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" opacity="0.3"/>
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" fill="currentColor"/>
                <path d="M7 10l2 2-2 2" stroke="white" stroke-width="2" fill="none"/>
                <path d="M13 14h4" stroke="white" stroke-width="2"/>`
        },
        {
          name: 'cloud',
          category: 'infrastructure',
          viewBox: '0 0 24 24',
          description: 'Cloud services icon',
          svg: `<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="currentColor"/>
                <path d="M12 13l4-4h-3V6h-2v3H8l4 4z" fill="white"/>`
        },
        {
          name: 'security',
          category: 'protection',
          viewBox: '0 0 24 24',
          description: 'Security and encryption icon',
          svg: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor"/>
                <path d="M12 7c-1.1 0-2 .9-2 2v1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1V9c0-1.1-.9-2-2-2z" fill="white"/>
                <path d="M13 9v1h-2V9c0-.55.45-1 1-1s1 .45 1 1z" fill="currentColor"/>`
        },
        {
          name: 'analytics',
          category: 'data',
          viewBox: '0 0 24 24',
          description: 'Analytics and metrics icon',
          svg: `<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
                <path d="M5 9l3 3 4-4 5 5" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="5" cy="9" r="2" fill="currentColor"/>
                <circle cx="8" cy="12" r="2" fill="currentColor"/>
                <circle cx="12" cy="8" r="2" fill="currentColor"/>
                <circle cx="17" cy="13" r="2" fill="currentColor"/>`
        },
        {
          name: 'automation',
          category: 'efficiency',
          viewBox: '0 0 24 24',
          description: 'Process automation icon',
          svg: `<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>`
        },
        {
          name: 'integration',
          category: 'connectivity',
          viewBox: '0 0 24 24',
          description: 'System integration icon',
          svg: `<circle cx="6" cy="6" r="3" fill="currentColor"/>
                <circle cx="18" cy="6" r="3" fill="currentColor"/>
                <circle cx="6" cy="18" r="3" fill="currentColor"/>
                <circle cx="18" cy="18" r="3" fill="currentColor"/>
                <path d="M9 6h6M9 18h6M6 9v6M18 9v6" stroke="currentColor" stroke-width="2"/>`
        }
      ]
    };
    
    const icons = iconSets[industry] || iconSets['tech'];
    return icons.slice(0, count);
  }
  
  /**
   * Generate custom logo SVG
   */
  static generateLogo(companyName: string, industry: string, style: 'minimal' | 'bold' | 'elegant' = 'minimal'): CustomSVG {
    console.log('🎨 Generating logo for:', companyName, 'in', industry);
    
    const firstLetter = companyName.charAt(0).toUpperCase();
    const colors = this.getIndustryColors(industry);
    
    let logoSVG = '';
    
    switch (style) {
      case 'minimal':
        logoSVG = `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="${colors[0]}" opacity="0.1"/>
            <circle cx="50" cy="50" r="35" fill="${colors[0]}"/>
            <text x="50" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">${firstLetter}</text>
          </svg>
        `;
        break;
        
      case 'bold':
        logoSVG = `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" rx="15" fill="${colors[0]}"/>
            <rect x="15" y="15" width="70" height="70" rx="10" fill="${colors[1]}"/>
            <text x="50" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="${colors[0]}">${firstLetter}</text>
          </svg>
        `;
        break;
        
      case 'elegant':
        logoSVG = `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="elegantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#elegantGrad)"/>
            <text x="50" y="60" text-anchor="middle" font-family="serif" font-size="28" font-weight="300" fill="white">${firstLetter}</text>
          </svg>
        `;
        break;
    }
    
    return {
      type: 'logo',
      svg: logoSVG,
      colors: colors,
      size: { width: 100, height: 100 }
    };
  }
  
  /**
   * Generate decorative patterns
   */
  static generatePattern(type: 'geometric' | 'organic' | 'tech', colors: string[]): CustomSVG {
    let patternSVG = '';
    
    switch (type) {
      case 'geometric':
        patternSVG = `
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geomPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="${colors[0]}" opacity="0.1"/>
                <circle cx="20" cy="20" r="8" fill="${colors[1]}" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#geomPattern)"/>
          </svg>
        `;
        break;
        
      case 'organic':
        patternSVG = `
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,50 Q50,20 80,50 T140,50" stroke="${colors[0]}" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M30,100 Q60,70 90,100 T150,100" stroke="${colors[1]}" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M10,150 Q40,120 70,150 T130,150" stroke="${colors[0]}" stroke-width="2" fill="none" opacity="0.3"/>
          </svg>
        `;
        break;
        
      case 'tech':
        patternSVG = `
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="techPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="${colors[0]}" opacity="0.05"/>
                <rect x="8" y="8" width="4" height="4" fill="${colors[1]}" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#techPattern)"/>
            <path d="M0,0 L200,200 M200,0 L0,200" stroke="${colors[1]}" stroke-width="1" opacity="0.1"/>
          </svg>
        `;
        break;
    }
    
    return {
      type: 'pattern',
      svg: patternSVG,
      colors: colors,
      size: { width: 200, height: 200 }
    };
  }
  
  /**
   * Generate illustration for hero section
   */
  static generateHeroIllustration(industry: string): CustomSVG {
    const colors = this.getIndustryColors(industry);
    
    const illustrations: Record<string, string> = {
      'shoe': `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="250" rx="150" ry="20" fill="${colors[0]}" opacity="0.2"/>
          <path d="M100 200 Q150 150 250 160 Q320 170 350 200 Q340 220 300 230 Q200 240 150 230 Q120 220 100 200 Z" fill="url(#shoeGrad)"/>
          <path d="M120 200 Q160 180 240 185 Q300 190 320 200 Q310 210 280 215 Q220 220 180 215 Q140 210 120 200 Z" fill="white" opacity="0.3"/>
          <circle cx="140" cy="225" r="8" fill="${colors[2]}" opacity="0.8"/>
          <circle cx="280" cy="225" r="8" fill="${colors[2]}" opacity="0.8"/>
        </svg>
      `,
      
      'restaurant': `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="120" ry="15" fill="${colors[0]}" opacity="0.2"/>
          <circle cx="200" cy="180" r="80" fill="url(#plateGrad)"/>
          <circle cx="200" cy="180" r="60" fill="white" opacity="0.9"/>
          <circle cx="180" cy="160" r="15" fill="${colors[2]}"/>
          <circle cx="220" cy="160" r="12" fill="${colors[1]}"/>
          <circle cx="200" cy="190" r="10" fill="${colors[0]}"/>
          <path d="M160 120 Q170 100 180 120" stroke="${colors[0]}" stroke-width="3" fill="none"/>
          <path d="M200 120 Q210 100 220 120" stroke="${colors[1]}" stroke-width="3" fill="none"/>
          <path d="M240 120 Q250 100 260 120" stroke="${colors[2]}" stroke-width="3" fill="none"/>
        </svg>
      `,
      
      'tech': `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="100" y="100" width="200" height="120" rx="10" fill="url(#techGrad)"/>
          <rect x="110" y="110" width="180" height="80" rx="5" fill="white" opacity="0.9"/>
          <rect x="120" y="120" width="40" height="6" rx="3" fill="${colors[0]}" opacity="0.7"/>
          <rect x="120" y="135" width="60" height="6" rx="3" fill="${colors[1]}" opacity="0.7"/>
          <rect x="120" y="150" width="30" height="6" rx="3" fill="${colors[2]}" opacity="0.7"/>
          <circle cx="250" cy="140" r="20" fill="${colors[0]}" opacity="0.3"/>
          <circle cx="250" cy="140" r="12" fill="${colors[1]}"/>
          <path d="M245 135 L250 140 L255 135" stroke="white" stroke-width="2" fill="none"/>
        </svg>
      `
    };
    
    const svg = illustrations[industry] || illustrations['tech'];
    
    return {
      type: 'illustration',
      svg: svg,
      colors: colors,
      size: { width: 400, height: 300 }
    };
  }
  
  /**
   * Get industry-specific color palette
   */
  private static getIndustryColors(industry: string): string[] {
    const colorPalettes: Record<string, string[]> = {
      'shoe': ['#000000', '#FF6B35', '#FFFFFF'],
      'restaurant': ['#8D4004', '#FF8F00', '#FFF8E1'],
      'tech': ['#2563EB', '#8B5CF6', '#F3F4F6'],
      'general': ['#2563EB', '#6366F1', '#F3F4F6']
    };
    
    return colorPalettes[industry] || colorPalettes['general'];
  }
  
  /**
   * Convert SVG to data URL for embedding
   */
  static svgToDataUrl(svg: string): string {
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  }
  
  /**
   * Generate complete icon set for a website
   */
  static generateCompleteIconSet(industry: string): Record<string, SVGIcon> {
    const icons = this.generateIndustryIcons(industry, 12);
    const iconSet: Record<string, SVGIcon> = {};
    
    icons.forEach(icon => {
      iconSet[icon.name] = icon;
    });
    
    return iconSet;
  }
}

// Export the service
export const svgGenerationService = SVGGenerationService;