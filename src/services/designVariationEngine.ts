// Design Variation Engine - Creates UNIQUE designs, not templates
// This is the core system that prevents boring, repetitive websites

export interface ColorPalette {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  accent: Record<string, string>;
  neutral: Record<string, string>;
}

export interface FontPairing {
  heading: string;
  body: string;
  weights: number[];
  scale: string;
}

export interface HeroLayout {
  name: string;
  structure: string;
  imagePosition: string;
  textAlign: string;
  verticalAlign: string;
  uniqueElement: string;
}

export type ArtisticStyle = 'minimalist' | 'brutalist' | 'glassmorphism' | 'neumorphism' | 'retro-pop' | 'corporate-clean' | 'dark-mode-tech' | 'swiss-style';

export interface DesignBrief {
  artisticStyle: ArtisticStyle;
  colorPalette: ColorPalette;
  typography: FontPairing;
  spacing: {
    scale: string;
    headerHeight: string;
    heroHeight: string;
    sectionGap: string;
    containerWidth: string;
  };
  layouts: {
    hero: HeroLayout;
    features: { type: string; style: string };
    products: { type: string; columns: number };
    footer: { style: string };
  };
  animations: {
    style: string;
    duration: string;
    easing: string;
  };
  uniqueElements: string[];
}

export class DesignVariationEngine {

  /**
   * Generate UNIQUE color palette (not hardcoded templates!)
   * This creates fresh colors for every website
   */
  generateColorPalette(industry: string, mood: string): ColorPalette {
    console.log('🎨 Generating UNIQUE color palette for', industry, 'with', mood, 'mood');

    // Base hue ranges by industry (starting points, not fixed colors!)
    const industryHues: Record<string, number[]> = {
      'luxury': [210, 240, 30, 15, 280],      // Navy, blue, gold, burgundy, purple
      'tech': [200, 260, 180, 300, 220],      // Blue, purple, cyan, pink, indigo
      'food': [0, 30, 45, 120, 60],           // Red, orange, yellow, green, lime
      'fashion': [300, 330, 200, 180, 350],   // Magenta, pink, blue, teal, rose
      'health': [120, 180, 200, 220, 160],    // Green, teal, blue, navy, mint
      'business': [220, 200, 240, 30, 180],   // Navy, blue, purple, gold, cyan
      'creative': [280, 320, 60, 180, 0],     // Purple, pink, yellow, cyan, red
      'restaurant': [15, 30, 45, 120, 0],     // Burgundy, orange, yellow, green, red
      'photography': [240, 280, 200, 30, 0],  // Blue, purple, cyan, gold, red
      'ecommerce': [260, 300, 180, 220, 30]   // Purple, pink, cyan, indigo, gold
    };

    // Get random base hue from industry range
    const hues = industryHues[industry] || industryHues.business;
    const primaryHue = this.selectRandom(hues);

    // Apply mood modifiers for variation
    const saturationBase = mood === 'minimal' ? 25 :
      mood === 'vibrant' ? 75 :
        mood === 'elegant' ? 45 : 60;

    const lightnessBase = mood === 'dark' ? 25 :
      mood === 'light' ? 85 :
        mood === 'bold' ? 40 : 55;

    // Add randomization (±15%) to prevent identical colors
    const saturation = this.addVariation(saturationBase, 15);
    const lightness = this.addVariation(lightnessBase, 15);

    console.log('🎨 Generated palette:', { primaryHue, saturation, lightness });

    // Generate full palette with variations
    return {
      primary: {
        50: this.hslToHex(primaryHue, saturation * 0.3, 95),
        100: this.hslToHex(primaryHue, saturation * 0.4, 90),
        200: this.hslToHex(primaryHue, saturation * 0.5, 80),
        300: this.hslToHex(primaryHue, saturation * 0.6, 70),
        400: this.hslToHex(primaryHue, saturation * 0.7, 60),
        500: this.hslToHex(primaryHue, saturation, lightness), // Main color
        600: this.hslToHex(primaryHue, saturation, Math.max(lightness - 10, 10)),
        700: this.hslToHex(primaryHue, saturation, Math.max(lightness - 20, 10)),
        800: this.hslToHex(primaryHue, saturation, Math.max(lightness - 30, 10)),
        900: this.hslToHex(primaryHue, saturation, Math.max(lightness - 40, 10)),
      },
      secondary: this.generateComplementary(primaryHue, saturation, lightness),
      accent: this.generateTriadic(primaryHue, saturation, lightness),
      neutral: this.generateNeutrals()
    };
  }

  /**
   * Select UNIQUE font pairing (not hardcoded!)
   * Randomly selects from curated professional pairings
   */
  selectFontPairing(personality: string, industry: string): FontPairing {
    console.log('🔤 Selecting UNIQUE font pairing for', personality, industry);

    const pairings: Record<string, FontPairing[]> = {
      elegant: [
        { heading: 'Playfair Display', body: 'Source Sans Pro', weights: [400, 600, 700], scale: 'golden-ratio' },
        { heading: 'Cormorant Garamond', body: 'Lato', weights: [400, 600, 700], scale: 'golden-ratio' },
        { heading: 'Crimson Text', body: 'Work Sans', weights: [400, 600, 700], scale: 'golden-ratio' },
        { heading: 'Libre Baskerville', body: 'Open Sans', weights: [400, 600, 700], scale: 'golden-ratio' },
        { heading: 'Lora', body: 'Nunito Sans', weights: [400, 600, 700], scale: 'golden-ratio' },
      ],
      modern: [
        { heading: 'Inter', body: 'Inter', weights: [400, 500, 600, 700], scale: 'modular' },
        { heading: 'Poppins', body: 'Inter', weights: [400, 500, 600, 700], scale: 'modular' },
        { heading: 'Plus Jakarta Sans', body: 'DM Sans', weights: [400, 500, 600, 700], scale: 'modular' },
        { heading: 'Space Grotesk', body: 'Manrope', weights: [400, 500, 600, 700], scale: 'modular' },
        { heading: 'Outfit', body: 'Inter', weights: [400, 500, 600, 700], scale: 'modular' },
      ],
      bold: [
        { heading: 'Montserrat', body: 'Open Sans', weights: [400, 600, 700, 800], scale: 'major-third' },
        { heading: 'Oswald', body: 'Lato', weights: [400, 600, 700, 800], scale: 'major-third' },
        { heading: 'Raleway', body: 'Source Sans Pro', weights: [400, 600, 700, 800], scale: 'major-third' },
        { heading: 'Bebas Neue', body: 'Roboto', weights: [400, 600, 700, 800], scale: 'major-third' },
        { heading: 'Anton', body: 'PT Sans', weights: [400, 600, 700, 800], scale: 'major-third' },
      ],
      minimal: [
        { heading: 'Inter', body: 'Inter', weights: [300, 400, 500, 600], scale: 'minor-third' },
        { heading: 'Helvetica Neue', body: 'Helvetica Neue', weights: [300, 400, 500, 600], scale: 'minor-third' },
        { heading: 'SF Pro Display', body: 'SF Pro Text', weights: [300, 400, 500, 600], scale: 'minor-third' },
        { heading: 'Avenir', body: 'Avenir', weights: [300, 400, 500, 600], scale: 'minor-third' },
        { heading: 'Circular', body: 'Circular', weights: [300, 400, 500, 600], scale: 'minor-third' },
      ],
      creative: [
        { heading: 'Abril Fatface', body: 'Lato', weights: [400, 600, 700], scale: 'perfect-fourth' },
        { heading: 'Righteous', body: 'Open Sans', weights: [400, 600, 700], scale: 'perfect-fourth' },
        { heading: 'Fredoka One', body: 'Nunito', weights: [400, 600, 700], scale: 'perfect-fourth' },
        { heading: 'Comfortaa', body: 'Source Sans Pro', weights: [400, 600, 700], scale: 'perfect-fourth' },
        { heading: 'Quicksand', body: 'Work Sans', weights: [400, 600, 700], scale: 'perfect-fourth' },
      ]
    };

    // CRITICAL: Select RANDOMLY within category (this creates uniqueness!)
    const category = pairings[personality] || pairings.modern;
    const selected = this.selectRandom(category);

    console.log('🔤 Selected font pairing:', selected);
    return selected;
  }

  /**
   * Determine the Artistics Style/Direction
   */
  generateArtisticStyle(industry: string, mood: string): ArtisticStyle {
    // Weighted probabilities based on industry/mood
    const options: ArtisticStyle[] = ['minimalist', 'corporate-clean'];

    if (mood === 'bold' || industry === 'tech') options.push('dark-mode-tech', 'brutalist');
    if (mood === 'elegant' || industry === 'luxury') options.push('glassmorphism', 'swiss-style', 'minimalist');
    if (industry === 'creative' || industry === 'fashion') options.push('retro-pop', 'brutalist', 'glassmorphism');
    if (industry === 'business') options.push('corporate-clean', 'swiss-style');

    return this.selectRandom(options);
  }

  /**
   * Generate UNIQUE hero layout (not template!)
   * Creates fresh layouts for every website
   */
  generateHeroLayout(industry: string, personality: string): HeroLayout {
    console.log('📐 Generating UNIQUE hero layout for', industry, personality);

    const layouts = [
      {
        name: 'split-screen',
        structure: 'grid-cols-2',
        imagePosition: 'left',
        textAlign: 'left',
        verticalAlign: 'center',
        uniqueElement: 'diagonal-divider'
      },
      {
        name: 'centered-minimal',
        structure: 'flex-col',
        imagePosition: 'background',
        textAlign: 'center',
        verticalAlign: 'center',
        uniqueElement: 'floating-elements'
      },
      {
        name: 'asymmetric',
        structure: 'grid-cols-3',
        imagePosition: 'right-2-cols',
        textAlign: 'left',
        verticalAlign: 'top',
        uniqueElement: 'geometric-shapes'
      },
      {
        name: 'stacked-visual',
        structure: 'flex-col',
        imagePosition: 'top',
        textAlign: 'center',
        verticalAlign: 'start',
        uniqueElement: 'parallax-scroll'
      },
      {
        name: 'diagonal-split',
        structure: 'custom-diagonal',
        imagePosition: 'left-diagonal',
        textAlign: 'right',
        verticalAlign: 'center',
        uniqueElement: 'animated-border'
      },
      {
        name: 'fullscreen-video',
        structure: 'relative',
        imagePosition: 'background-video',
        textAlign: 'center',
        verticalAlign: 'center',
        uniqueElement: 'video-overlay'
      },
      {
        name: 'carousel-hero',
        structure: 'relative',
        imagePosition: 'carousel',
        textAlign: 'left',
        verticalAlign: 'bottom',
        uniqueElement: 'slide-indicators'
      },
      {
        name: 'bento-grid',
        structure: 'grid-bento',
        imagePosition: 'multiple',
        textAlign: 'overlay',
        verticalAlign: 'mixed',
        uniqueElement: 'grid-animation'
      },
      {
        name: 'typography-led',
        structure: 'text-dominant',
        imagePosition: 'none',
        textAlign: 'left-huge',
        verticalAlign: 'bottom',
        uniqueElement: 'kinetic-type'
      },
      {
        name: 'overlap-card',
        structure: 'overlap-container',
        imagePosition: 'right-overlap',
        textAlign: 'left-overlap',
        verticalAlign: 'center',
        uniqueElement: 'glass-card'
      }
    ];

    // RANDOMLY select (this creates uniqueness!)
    const selected = this.selectRandom(layouts);
    console.log('📐 Selected layout:', selected);
    return selected;
  }

  /**
   * Select signature element for uniqueness
   */
  selectSignatureElement(personality: string): string {
    const elements = {
      luxury: [
        'floating-geometric-shapes',
        'subtle-parallax-scroll',
        'gradient-text-hero',
        'animated-border-reveal',
        'glass-morphism-cards',
        'golden-ratio-grid',
        'elegant-hover-effects'
      ],
      modern: [
        'glitch-effect-titles',
        '3d-card-hover',
        'particle-background',
        'animated-gradient-bg',
        'cyber-grid-overlay',
        'neon-accents',
        'holographic-elements'
      ],
      minimal: [
        'breathing-animation',
        'line-drawing-svg',
        'fade-in-sections',
        'subtle-shadows',
        'clean-transitions',
        'micro-interactions',
        'zen-spacing'
      ],
      bold: [
        'explosive-animations',
        'dynamic-typography',
        'color-shifting-bg',
        'impact-transitions',
        'bold-geometric-shapes',
        'high-contrast-elements',
        'dramatic-shadows'
      ],
      creative: [
        'artistic-brush-strokes',
        'creative-clip-paths',
        'playful-animations',
        'color-splash-effects',
        'organic-shapes',
        'hand-drawn-elements',
        'whimsical-interactions'
      ]
    };

    const options = elements[personality] || elements.modern;
    return this.selectRandom(options);
  }

  /**
   * Generate complete design brief
   */
  generateDesignBrief(industry: string, personality: string, mood: string): DesignBrief {
    console.log('📋 Generating COMPLETE design brief for', { industry, personality, mood });

    const artisticStyle = this.generateArtisticStyle(industry, mood);
    const colorPalette = this.generateColorPalette(industry, mood);
    const typography = this.selectFontPairing(personality, industry);
    const heroLayout = this.generateHeroLayout(industry, personality);
    const signatureElement = this.selectSignatureElement(personality);

    // Derive feature style from artistic style
    let featureStyle = 'clean-card';
    if (artisticStyle === 'glassmorphism') featureStyle = 'glass';
    if (artisticStyle === 'brutalist') featureStyle = 'brutal-border';
    if (artisticStyle === 'neumorphism') featureStyle = 'soft-shadow';
    if (artisticStyle === 'minimalist') featureStyle = 'icon-only';

    const brief: DesignBrief = {
      artisticStyle,
      colorPalette,
      typography,
      spacing: {
        scale: personality === 'minimal' ? 'tight' : personality === 'bold' ? 'generous' : 'balanced',
        headerHeight: this.varySpacing(80, 0.2) + 'px',
        heroHeight: this.varySpacing(65, 0.1) + 'vh',
        sectionGap: this.varySpacing(96, 0.3) + 'px',
        containerWidth: artisticStyle === 'swiss-style' || artisticStyle === 'minimalist' ? 'max-w-4xl' : 'max-w-7xl'
      },
      layouts: {
        hero: heroLayout,
        features: {
          type: this.selectRandom(['grid-3', 'grid-4', 'bento', 'alternating', 'masonry', 'carousel', 'list-large']),
          style: featureStyle
        },
        products: {
          type: this.selectRandom(['grid', 'masonry', 'carousel', 'infinite-scroll']),
          columns: this.selectRandom([3, 4, 5])
        },
        footer: {
          style: this.selectRandom(['minimal', 'mega', 'centered', 'asymmetric'])
        }
      },
      animations: {
        style: personality === 'minimal' ? 'subtle' : personality === 'bold' ? 'dramatic' : 'smooth',
        duration: this.selectRandom(['600ms', '800ms', '1000ms']),
        easing: this.selectRandom(['ease-out', 'cubic-bezier(0.25, 0.1, 0.25, 1)', 'cubic-bezier(0.4, 0, 0.2, 1)'])
      },
      uniqueElements: [signatureElement, this.selectRandom(['custom-cursor', 'scroll-indicators', 'loading-animation'])]
    };

    console.log('📋 Generated design brief:', brief);
    return brief;
  }

  // Helper methods
  private selectRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private addVariation(base: number, percentage: number): number {
    const variation = base * (percentage / 100);
    return base + (Math.random() - 0.5) * 2 * variation;
  }

  private varySpacing(baseSpacing: number, variation: number = 0.2): number {
    // Add ±variation while staying on 8px grid
    const min = baseSpacing * (1 - variation);
    const max = baseSpacing * (1 + variation);
    const varied = min + Math.random() * (max - min);

    // Round to nearest 8px multiple
    return Math.round(varied / 8) * 8;
  }

  private hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  private generateComplementary(primaryHue: number, saturation: number, lightness: number) {
    const complementaryHue = (primaryHue + 180) % 360;
    return {
      50: this.hslToHex(complementaryHue, saturation * 0.3, 95),
      100: this.hslToHex(complementaryHue, saturation * 0.4, 90),
      200: this.hslToHex(complementaryHue, saturation * 0.5, 80),
      300: this.hslToHex(complementaryHue, saturation * 0.6, 70),
      400: this.hslToHex(complementaryHue, saturation * 0.7, 60),
      500: this.hslToHex(complementaryHue, saturation, lightness),
      600: this.hslToHex(complementaryHue, saturation, Math.max(lightness - 10, 10)),
      700: this.hslToHex(complementaryHue, saturation, Math.max(lightness - 20, 10)),
      800: this.hslToHex(complementaryHue, saturation, Math.max(lightness - 30, 10)),
      900: this.hslToHex(complementaryHue, saturation, Math.max(lightness - 40, 10)),
    };
  }

  private generateTriadic(primaryHue: number, saturation: number, lightness: number) {
    const triadicHue = (primaryHue + 120) % 360;
    return {
      50: this.hslToHex(triadicHue, saturation * 0.3, 95),
      100: this.hslToHex(triadicHue, saturation * 0.4, 90),
      200: this.hslToHex(triadicHue, saturation * 0.5, 80),
      300: this.hslToHex(triadicHue, saturation * 0.6, 70),
      400: this.hslToHex(triadicHue, saturation * 0.7, 60),
      500: this.hslToHex(triadicHue, saturation, lightness),
      600: this.hslToHex(triadicHue, saturation, Math.max(lightness - 10, 10)),
      700: this.hslToHex(triadicHue, saturation, Math.max(lightness - 20, 10)),
      800: this.hslToHex(triadicHue, saturation, Math.max(lightness - 30, 10)),
      900: this.hslToHex(triadicHue, saturation, Math.max(lightness - 40, 10)),
    };
  }

  private generateNeutrals() {
    const baseGray = Math.floor(Math.random() * 30) + 200; // 200-230 hue range for warm/cool grays
    return {
      50: this.hslToHex(baseGray, 5, 98),
      100: this.hslToHex(baseGray, 5, 96),
      200: this.hslToHex(baseGray, 5, 90),
      300: this.hslToHex(baseGray, 5, 83),
      400: this.hslToHex(baseGray, 5, 64),
      500: this.hslToHex(baseGray, 5, 45),
      600: this.hslToHex(baseGray, 5, 32),
      900: this.hslToHex(baseGray, 5, 9),
    };
  }
  /**
   * Generate multiple distinct options for a specific design category
   * Used for "Show me options" feature
   */
  generateVariationOptions(category: 'hero' | 'palette' | 'fonts', industry: string, count: number = 3): any[] {
    console.log(`🎨 Generating ${count} variation options for ${category}...`);
    const options = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < count; i++) {
      let option;
      let id;

      // Retry logic to ensure distinct options
      for (let attempt = 0; attempt < 5; attempt++) {
        if (category === 'hero') {
          const layout = this.generateHeroLayout(industry, this.selectRandom(['modern', 'bold', 'minimal', 'creative']));
          option = layout;
          id = layout.name;
        } else if (category === 'palette') {
          const moods = ['minimal', 'vibrant', 'elegant', 'bold', 'dark'];
          const mood = moods[i % moods.length]; // Rotate moods
          const palette = this.generateColorPalette(industry, mood);
          option = { ...palette, name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Theme` };
          id = mood;
        } else if (category === 'fonts') {
          const styles = ['modern', 'elegant', 'bold', 'minimal', 'creative'];
          const style = styles[i % styles.length];
          const fonts = this.selectFontPairing(style, industry);
          option = { ...fonts, style };
          id = fonts.heading;
        }

        if (!usedIds.has(id)) {
          usedIds.add(id);
          break;
        }
      }

      if (option) options.push(option);
    }

    return options;
  }
}

// Export singleton
export const designVariationEngine = new DesignVariationEngine();