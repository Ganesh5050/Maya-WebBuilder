// PHASE 11: Professional Font Library Integration
// Google Fonts pairing system for different industries and personalities

export interface FontPairing {
  heading: string;
  body: string;
  weights: number[];
  category: string;
  personality: string[];
  googleFontsUrl?: string;
}

export class ProfessionalFontSystem {
  
  private static readonly FONT_PAIRINGS: Record<string, FontPairing[]> = {
    modern: [
      { 
        heading: 'Inter', 
        body: 'Inter', 
        weights: [400, 500, 600, 700],
        category: 'modern',
        personality: ['clean', 'minimal', 'tech']
      },
      { 
        heading: 'Poppins', 
        body: 'Inter', 
        weights: [400, 500, 600, 700, 800],
        category: 'modern',
        personality: ['friendly', 'approachable', 'startup']
      },
      { 
        heading: 'Plus Jakarta Sans', 
        body: 'Plus Jakarta Sans', 
        weights: [400, 500, 600, 700],
        category: 'modern',
        personality: ['contemporary', 'sophisticated']
      }
    ],
    
    elegant: [
      { 
        heading: 'Playfair Display', 
        body: 'Source Sans Pro', 
        weights: [400, 600, 700, 900],
        category: 'elegant',
        personality: ['luxury', 'sophisticated', 'editorial']
      },
      { 
        heading: 'Cormorant Garamond', 
        body: 'Lato', 
        weights: [400, 600, 700],
        category: 'elegant',
        personality: ['classic', 'refined', 'literary']
      },
      { 
        heading: 'Crimson Text', 
        body: 'Work Sans', 
        weights: [400, 600, 700],
        category: 'elegant',
        personality: ['traditional', 'academic', 'trustworthy']
      }
    ],
    
    professional: [
      { 
        heading: 'Montserrat', 
        body: 'Open Sans', 
        weights: [400, 500, 600, 700, 800],
        category: 'professional',
        personality: ['corporate', 'reliable', 'established']
      },
      { 
        heading: 'Roboto', 
        body: 'Roboto', 
        weights: [400, 500, 700, 900],
        category: 'professional',
        personality: ['neutral', 'versatile', 'google']
      },
      { 
        heading: 'Lato', 
        body: 'Lato', 
        weights: [400, 700, 900],
        category: 'professional',
        personality: ['humanist', 'warm', 'accessible']
      }
    ],
    
    creative: [
      { 
        heading: 'Space Grotesk', 
        body: 'Inter', 
        weights: [400, 500, 600, 700],
        category: 'creative',
        personality: ['modern', 'geometric', 'tech']
      },
      { 
        heading: 'Cabinet Grotesk', 
        body: 'DM Sans', 
        weights: [400, 500, 600, 700],
        category: 'creative',
        personality: ['unique', 'artistic', 'boutique']
      },
      { 
        heading: 'Sora', 
        body: 'Manrope', 
        weights: [400, 500, 600, 700, 800],
        category: 'creative',
        personality: ['contemporary', 'digital', 'innovative']
      }
    ],
    
    tech: [
      { 
        heading: 'IBM Plex Sans', 
        body: 'IBM Plex Sans', 
        weights: [400, 500, 600, 700],
        category: 'tech',
        personality: ['technical', 'precise', 'IBM']
      },
      { 
        heading: 'JetBrains Mono', 
        body: 'Inter', 
        weights: [400, 500, 600, 700],
        category: 'tech',
        personality: ['developer', 'coding', 'monospace']
      },
      { 
        heading: 'Fira Code', 
        body: 'Fira Sans', 
        weights: [400, 500, 600, 700],
        category: 'tech',
        personality: ['programming', 'mozilla', 'open-source']
      }
    ]
  };

  /**
   * Select optimal font pairing based on industry and personality
   */
  static selectFontPairing(industry: string, personality: string[]): FontPairing {
    console.log('🔤 Selecting font pairing for:', { industry, personality });
    
    // Ensure we have valid inputs
    const safeIndustry = industry || 'tech';
    const safePersonality = Array.isArray(personality) 
      ? personality.filter(p => p && typeof p === 'string') 
      : [];
    
    // Determine font category based on industry and personality
    let category = 'modern'; // default
    
    if (safePersonality.includes('luxury') || safePersonality.includes('elegant')) {
      category = 'elegant';
    } else if (safeIndustry === 'tech' || safeIndustry === 'saas' || safeIndustry === 'software') {
      category = 'tech';
    } else if (safePersonality.includes('creative') || safeIndustry === 'agency' || safeIndustry === 'design') {
      category = 'creative';
    } else if (safePersonality.includes('professional') || safeIndustry === 'corporate' || safeIndustry === 'finance') {
      category = 'professional';
    }
    
    const availablePairings = this.FONT_PAIRINGS[category] || this.FONT_PAIRINGS.modern;
    
    // Select pairing based on personality match
    let selectedPairing = availablePairings[0]; // default
    
    for (const pairing of availablePairings) {
      const personalityMatch = safePersonality.some(p => 
        pairing.personality.some(fp => fp.toLowerCase().includes(p.toLowerCase()))
      );
      
      if (personalityMatch) {
        selectedPairing = pairing;
        break;
      }
    }
    
    // Generate Google Fonts URL
    selectedPairing.googleFontsUrl = this.generateGoogleFontsUrl(selectedPairing);
    
    console.log('✅ Selected font pairing:', {
      heading: selectedPairing.heading,
      body: selectedPairing.body,
      category: selectedPairing.category
    });
    
    return selectedPairing;
  }

  /**
   * Generate Google Fonts URL for dynamic loading
   */
  static generateGoogleFontsUrl(pairing: FontPairing): string {
    const fontFamilies = [];
    
    // Add heading font
    fontFamilies.push(`${pairing.heading.replace(' ', '+')}:${pairing.weights.join(',')}`);
    
    // Add body font if different
    if (pairing.heading !== pairing.body) {
      fontFamilies.push(`${pairing.body.replace(' ', '+')}:${pairing.weights.join(',')}`);
    }
    
    const url = `https://fonts.googleapis.com/css2?${
      fontFamilies.map(f => `family=${f}`).join('&')
    }&display=swap`;
    
    console.log('🔗 Generated Google Fonts URL:', url);
    return url;
  }

  /**
   * Generate CSS font variables
   */
  static generateFontCSS(pairing: FontPairing): string {
    return `
/* PHASE 11: Professional Typography System */
:root {
  /* Font Families */
  --font-heading: '${pairing.heading}', sans-serif;
  --font-body: '${pairing.body}', sans-serif;
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  /* Letter Spacing */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
}

/* Typography Classes */
.font-heading {
  font-family: var(--font-heading);
}

.font-body {
  font-family: var(--font-body);
}

/* Heading Styles with Vertical Rhythm */
h1, .h1 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-base);
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: var(--margin-h1);
}

h2, .h2 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-base);
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: var(--margin-h2);
}

h3, .h3 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-base);
  margin-bottom: var(--margin-h3);
}

h4, .h4 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-base);
  margin-bottom: var(--margin-h4);
}

h5, .h5 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-base);
  margin-bottom: var(--margin-h4);
}

h6, .h6 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-base);
  margin-bottom: var(--margin-h4);
}

/* Body Text */
p, .body {
  font-family: var(--font-body);
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  margin-bottom: var(--margin-p);
}

/* Small Text */
.text-sm {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
}

.text-xs {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-base);
}

/* Large Text */
.text-lg {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-base);
}

.text-xl {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-base);
}`;
  }

  /**
   * Generate HTML link tags for Google Fonts
   */
  static generateFontLinks(pairing: FontPairing): string {
    return `
<!-- PHASE 11: Google Fonts Integration -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${pairing.googleFontsUrl}" rel="stylesheet" />`;
  }

  /**
   * Get all available font categories
   */
  static getAvailableCategories(): string[] {
    return Object.keys(this.FONT_PAIRINGS);
  }

  /**
   * Get font pairings by category
   */
  static getFontPairingsByCategory(category: string): FontPairing[] {
    return this.FONT_PAIRINGS[category] || [];
  }

  /**
   * Calculate font loading performance score
   */
  static calculateFontPerformanceScore(pairing: FontPairing): number {
    let score = 100;
    
    // Deduct points for multiple font families
    if (pairing.heading !== pairing.body) {
      score -= 10;
    }
    
    // Deduct points for too many weights
    if (pairing.weights.length > 4) {
      score -= (pairing.weights.length - 4) * 5;
    }
    
    // Bonus for system fonts or popular fonts
    const popularFonts = ['Inter', 'Roboto', 'Open Sans', 'Lato'];
    if (popularFonts.includes(pairing.heading) || popularFonts.includes(pairing.body)) {
      score += 5;
    }
    
    return Math.max(score, 60); // Minimum score of 60
  }
}