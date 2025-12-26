// Phase 6: Style Variation Engine
// Ensures every generated website looks unique and different

import { IndustryProfile, ColorPalette, DesignPersonality } from './industryIntelligence';

export interface StyleVariation {
  layoutVariant: LayoutVariant;
  componentStyles: ComponentStyleSet;
  spacingScale: SpacingScale;
  animationLevel: AnimationLevel;
  imageStyle: ImageStyle;
  interactionPatterns: InteractionPattern[];
}

export interface LayoutVariant {
  heroStyle: 'centered' | 'split-left' | 'split-right' | 'full-background' | 'minimal';
  featureLayout: '2-column' | '3-column' | '4-column' | 'staggered' | 'alternating';
  navigationStyle: 'horizontal' | 'centered' | 'logo-left' | 'minimal';
  footerStyle: 'multi-column' | 'centered' | 'minimal' | 'newsletter';
}

export interface ComponentStyleSet {
  buttonStyle: 'solid' | 'outline' | 'ghost' | 'gradient' | 'rounded' | 'sharp';
  cardStyle: 'elevated' | 'flat' | 'bordered' | 'minimal' | 'image-overlay';
  inputStyle: 'outlined' | 'filled' | 'underlined' | 'floating';
  iconStyle: 'outlined' | 'filled' | 'duotone';
}

export interface SpacingScale {
  name: string;
  multiplier: number;
  personality: string;
}

export interface AnimationLevel {
  level: 'minimal' | 'moderate' | 'rich';
  speed: 'slow' | 'normal' | 'fast';
  easing: 'ease' | 'ease-in-out' | 'spring' | 'bounce';
}

export interface ImageStyle {
  treatment: 'natural' | 'rounded' | 'circular' | 'elevated' | 'bordered';
  aspectRatio: 'square' | 'landscape' | 'portrait' | 'wide';
  hoverEffect: 'none' | 'scale' | 'zoom' | 'overlay' | 'blur';
}

export interface InteractionPattern {
  type: 'hover' | 'click' | 'scroll' | 'focus';
  effect: string;
  duration: number;
}

export class StyleVariationEngine {
  
  private static layoutVariants: LayoutVariant[] = [
    {
      heroStyle: 'centered',
      featureLayout: '3-column',
      navigationStyle: 'horizontal',
      footerStyle: 'multi-column'
    },
    {
      heroStyle: 'split-left',
      featureLayout: '2-column',
      navigationStyle: 'logo-left',
      footerStyle: 'centered'
    },
    {
      heroStyle: 'split-right',
      featureLayout: 'staggered',
      navigationStyle: 'centered',
      footerStyle: 'minimal'
    },
    {
      heroStyle: 'full-background',
      featureLayout: '4-column',
      navigationStyle: 'minimal',
      footerStyle: 'newsletter'
    },
    {
      heroStyle: 'minimal',
      featureLayout: 'alternating',
      navigationStyle: 'horizontal',
      footerStyle: 'multi-column'
    }
  ];

  private static componentStyleSets: ComponentStyleSet[] = [
    {
      buttonStyle: 'solid',
      cardStyle: 'elevated',
      inputStyle: 'outlined',
      iconStyle: 'outlined'
    },
    {
      buttonStyle: 'outline',
      cardStyle: 'flat',
      inputStyle: 'filled',
      iconStyle: 'filled'
    },
    {
      buttonStyle: 'gradient',
      cardStyle: 'bordered',
      inputStyle: 'floating',
      iconStyle: 'duotone'
    },
    {
      buttonStyle: 'rounded',
      cardStyle: 'minimal',
      inputStyle: 'underlined',
      iconStyle: 'outlined'
    },
    {
      buttonStyle: 'ghost',
      cardStyle: 'image-overlay',
      inputStyle: 'outlined',
      iconStyle: 'filled'
    }
  ];

  private static spacingScales: SpacingScale[] = [
    { name: 'compact', multiplier: 0.75, personality: 'energetic' },
    { name: 'normal', multiplier: 1.0, personality: 'balanced' },
    { name: 'spacious', multiplier: 1.5, personality: 'luxury' },
    { name: 'minimal', multiplier: 2.0, personality: 'zen' }
  ];

  private static animationLevels: AnimationLevel[] = [
    { level: 'minimal', speed: 'normal', easing: 'ease' },
    { level: 'moderate', speed: 'normal', easing: 'ease-in-out' },
    { level: 'rich', speed: 'fast', easing: 'spring' }
  ];

  private static imageStyles: ImageStyle[] = [
    { treatment: 'natural', aspectRatio: 'landscape', hoverEffect: 'none' },
    { treatment: 'rounded', aspectRatio: 'square', hoverEffect: 'scale' },
    { treatment: 'elevated', aspectRatio: 'landscape', hoverEffect: 'zoom' },
    { treatment: 'bordered', aspectRatio: 'portrait', hoverEffect: 'overlay' },
    { treatment: 'circular', aspectRatio: 'square', hoverEffect: 'blur' }
  ];

  /**
   * Generate unique style variation based on industry and personality
   */
  static generateStyleVariation(
    industry: IndustryProfile, 
    personality: DesignPersonality,
    seed?: string
  ): StyleVariation {
    console.log('🎨 Generating style variation for:', industry.industry, 'with personality:', personality.mood);
    
    // Use seed for consistent randomization (same input = same output)
    const randomSeed = seed ? this.hashCode(seed) : Math.random();
    
    // Select layout variant based on personality
    let layoutVariant: LayoutVariant;
    if (personality.mood === 'luxury') {
      // Luxury prefers spacious, minimal layouts
      layoutVariant = this.layoutVariants.find(v => v.heroStyle === 'minimal') || this.layoutVariants[0];
    } else if (personality.mood === 'creative') {
      // Creative prefers asymmetric, dynamic layouts
      layoutVariant = this.layoutVariants.find(v => v.featureLayout === 'staggered') || this.layoutVariants[2];
    } else if (personality.energy === 'energetic') {
      // Energetic prefers grid-heavy layouts
      layoutVariant = this.layoutVariants.find(v => v.featureLayout === '4-column') || this.layoutVariants[3];
    } else {
      // Use seeded random selection for consistency
      const index = Math.floor(randomSeed * this.layoutVariants.length);
      layoutVariant = this.layoutVariants[index];
    }

    // Select component styles based on personality
    let componentStyles: ComponentStyleSet;
    if (personality.mood === 'luxury') {
      componentStyles = this.componentStyleSets.find(s => s.buttonStyle === 'outline') || this.componentStyleSets[1];
    } else if (personality.mood === 'playful') {
      componentStyles = this.componentStyleSets.find(s => s.buttonStyle === 'rounded') || this.componentStyleSets[3];
    } else if (personality.mood === 'bold') {
      componentStyles = this.componentStyleSets.find(s => s.buttonStyle === 'gradient') || this.componentStyleSets[2];
    } else {
      const index = Math.floor(randomSeed * this.componentStyleSets.length);
      componentStyles = this.componentStyleSets[index];
    }

    // Select spacing based on personality
    let spacingScale: SpacingScale;
    if (personality.mood === 'luxury') {
      spacingScale = this.spacingScales.find(s => s.name === 'spacious') || this.spacingScales[2];
    } else if (personality.energy === 'energetic') {
      spacingScale = this.spacingScales.find(s => s.name === 'compact') || this.spacingScales[0];
    } else if (personality.mood === 'minimal') {
      spacingScale = this.spacingScales.find(s => s.name === 'minimal') || this.spacingScales[3];
    } else {
      spacingScale = this.spacingScales[1]; // Normal
    }

    // Select animation level
    let animationLevel: AnimationLevel;
    if (personality.mood === 'luxury' || personality.energy === 'calm') {
      animationLevel = this.animationLevels[0]; // Minimal
    } else if (personality.mood === 'creative' || personality.energy === 'energetic') {
      animationLevel = this.animationLevels[2]; // Rich
    } else {
      animationLevel = this.animationLevels[1]; // Moderate
    }

    // Select image style
    let imageStyle: ImageStyle;
    if (personality.mood === 'luxury') {
      imageStyle = this.imageStyles.find(s => s.treatment === 'elevated') || this.imageStyles[2];
    } else if (personality.mood === 'playful') {
      imageStyle = this.imageStyles.find(s => s.treatment === 'rounded') || this.imageStyles[1];
    } else if (personality.mood === 'minimal') {
      imageStyle = this.imageStyles[0]; // Natural
    } else {
      const index = Math.floor(randomSeed * this.imageStyles.length);
      imageStyle = this.imageStyles[index];
    }

    // Generate interaction patterns
    const interactionPatterns = this.generateInteractionPatterns(personality, animationLevel);

    const variation: StyleVariation = {
      layoutVariant,
      componentStyles,
      spacingScale,
      animationLevel,
      imageStyle,
      interactionPatterns
    };

    console.log('✅ Style variation generated:', {
      layout: layoutVariant.heroStyle,
      components: componentStyles.buttonStyle,
      spacing: spacingScale.name,
      animation: animationLevel.level
    });

    return variation;
  }

  /**
   * Generate 8px Grid System - PHASE 1: Design Physics Foundation
   */
  static generate8pxGridSystem(): string {
    return `
  /* 8-PIXEL GRID SYSTEM - Professional Design Physics */
  :root {
    /* Base unit: 8px - ALL measurements must be multiples of 8 */
    --base-unit: 8px;
    
    /* Spacing Scale (8px multiples) */
    --spacing-xs: 8px;     /* 1 × 8 - Tiny gaps */
    --spacing-sm: 16px;    /* 2 × 8 - Small gaps */
    --spacing-md: 24px;    /* 3 × 8 - Medium gaps */
    --spacing-lg: 32px;    /* 4 × 8 - Large gaps */
    --spacing-xl: 48px;    /* 6 × 8 - Extra large */
    --spacing-2xl: 64px;   /* 8 × 8 - Section gaps */
    --spacing-3xl: 96px;   /* 12 × 8 - Major sections */
    
    /* Component Heights (8px multiples) */
    --height-btn-sm: 32px;  /* 4 × 8 */
    --height-btn-md: 40px;  /* 5 × 8 */
    --height-btn-lg: 48px;  /* 6 × 8 */
    --height-input: 40px;   /* 5 × 8 */
    --height-header: 72px;  /* 9 × 8 */
    
    /* Border Radius (8px multiples) */
    --radius-sm: 8px;   /* 1 × 8 */
    --radius-md: 16px;  /* 2 × 8 */
    --radius-lg: 24px;  /* 3 × 8 */
    
    /* Container Max Widths */
    --container-sm: 640px;
    --container-md: 768px;
    --container-lg: 1024px;
    --container-xl: 1280px;
    --container-2xl: 1536px;
  }`;
  }

  /**
   * Generate Vertical Rhythm System - PHASE 2: Typography Physics
   */
  static generateVerticalRhythm(): string {
    return `
  /* VERTICAL RHYTHM - Typography baseline grid */
  :root {
    /* Base typography */
    --font-size-base: 16px;
    --line-height-base: 24px; /* 16 × 1.5, rounded to 8px multiple */
    --baseline-grid: 8px;
    
    /* Type Scale (maintaining vertical rhythm) */
    --font-size-xs: 12px;   /* line-height: 16px (2 × 8) */
    --font-size-sm: 14px;   /* line-height: 20px (2.5 × 8, acceptable) */
    --font-size-base: 16px; /* line-height: 24px (3 × 8) */
    --font-size-lg: 18px;   /* line-height: 24px (3 × 8) */
    --font-size-xl: 20px;   /* line-height: 28px (3.5 × 8, acceptable) */
    --font-size-2xl: 24px;  /* line-height: 32px (4 × 8) */
    --font-size-3xl: 30px;  /* line-height: 40px (5 × 8) */
    --font-size-4xl: 36px;  /* line-height: 48px (6 × 8) */
    --font-size-5xl: 48px;  /* line-height: 56px (7 × 8) */
    --font-size-6xl: 64px;  /* line-height: 72px (9 × 8) */
    
    /* Heading margins (maintaining rhythm) */
    --margin-h1: 48px; /* 6 × 8 */
    --margin-h2: 32px; /* 4 × 8 */
    --margin-h3: 24px; /* 3 × 8 */
    --margin-h4: 16px; /* 2 × 8 */
    --margin-p: 16px;  /* 2 × 8 */
  }`;
  }

  /**
   * Generate Professional Animation System - PHASE 13: Animation Physics
   */
  static generateAnimationSystem(): string {
    return `
  /* ANIMATION TIMING & EASING - Professional Standards */
  :root {
    /* Easing Functions by Context */
    --ease-in: cubic-bezier(0.4, 0, 1, 1);           /* Entrances */
    --ease-out: cubic-bezier(0, 0, 0.2, 1);          /* Exits */
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* Both */
    --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);      /* Quick, snappy */
    --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1); /* Very gentle */
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Playful */
    --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);   /* Spring-like */
    
    /* Duration Standards */
    --duration-instant: 100ms;    /* Button hover */
    --duration-fast: 150ms;       /* Checkbox, switch */
    --duration-quick: 200ms;      /* Tooltip */
    --duration-normal: 300ms;     /* Modal open, tab switch */
    --duration-moderate: 400ms;   /* Dropdown, accordion */
    --duration-slow: 500ms;       /* Page fade */
    --duration-slower: 600ms;     /* Full-page transition */
    --duration-decorative: 800ms; /* Hero animation */
    --duration-dramatic: 1200ms;  /* Reveal effects */
  }`;
  }

  /**
   * Generate CSS variables for the style variation
   */
  static generateCSSVariables(
    colors: ColorPalette, 
    variation: StyleVariation,
    typography: any
  ): string {
    const { animationLevel } = variation;
    
    return `
${this.generate8pxGridSystem()}

${this.generateVerticalRhythm()}

${this.generateAnimationSystem()}

:root {
  /* Colors */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-text: ${colors.text};
  
  /* Typography */
  --font-heading: ${typography.headingFont};
  --font-body: ${typography.bodyFont};
  --type-scale: ${typography.scale};
  
  /* Animation (using professional system) */
  --animation-speed: ${animationLevel.speed === 'fast' ? 'var(--duration-fast)' : 
                       animationLevel.speed === 'slow' ? 'var(--duration-slow)' : 
                       'var(--duration-normal)'};
  --animation-easing: ${animationLevel.easing === 'spring' ? 'var(--ease-bounce)' : 
                       animationLevel.easing === 'bounce' ? 'var(--ease-elastic)' : 
                       'var(--ease-in-out)'};
  
  /* Component Styles */
  --button-style: ${variation.componentStyles.buttonStyle};
  --card-style: ${variation.componentStyles.cardStyle};
  --input-style: ${variation.componentStyles.inputStyle};
  
  /* Border Radius */
  --radius-sm: ${variation.componentStyles.buttonStyle === 'rounded' ? '12px' : '4px'};
  --radius-md: ${variation.componentStyles.buttonStyle === 'rounded' ? '16px' : '8px'};
  --radius-lg: ${variation.componentStyles.buttonStyle === 'rounded' ? '24px' : '12px'};
}`;
  }

  /**
   * Generate component-specific styles
   */
  static generateComponentStyles(variation: StyleVariation): Record<string, string> {
    const { componentStyles, animationLevel, imageStyle } = variation;
    
    return {
      button: this.generateButtonStyles(componentStyles.buttonStyle, animationLevel),
      card: this.generateCardStyles(componentStyles.cardStyle, imageStyle),
      input: this.generateInputStyles(componentStyles.inputStyle),
      image: this.generateImageStyles(imageStyle, animationLevel)
    };
  }

  private static generateButtonStyles(style: string, animation: AnimationLevel): string {
    const baseStyles = `
      transition: all var(--animation-speed) var(--animation-easing);
      font-weight: 600;
      cursor: pointer;
      border: none;
      outline: none;
    `;

    switch (style) {
      case 'solid':
        return baseStyles + `
          background: var(--color-primary);
          color: white;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        `;
      case 'outline':
        return baseStyles + `
          background: transparent;
          color: var(--color-primary);
          border: 2px solid var(--color-primary);
          padding: 10px 22px;
          border-radius: var(--radius-md);
          &:hover { background: var(--color-primary); color: white; }
        `;
      case 'gradient':
        return baseStyles + `
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: white;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          &:hover { transform: scale(1.05); }
        `;
      case 'rounded':
        return baseStyles + `
          background: var(--color-primary);
          color: white;
          padding: 12px 32px;
          border-radius: 50px;
          &:hover { transform: translateY(-1px); }
        `;
      case 'ghost':
        return baseStyles + `
          background: transparent;
          color: var(--color-primary);
          padding: 12px 24px;
          border-radius: var(--radius-md);
          &:hover { background: rgba(var(--color-primary), 0.1); }
        `;
      default:
        return baseStyles;
    }
  }

  private static generateCardStyles(style: string, imageStyle: ImageStyle): string {
    const baseStyles = `
      background: white;
      transition: all var(--animation-speed) var(--animation-easing);
      overflow: hidden;
    `;

    switch (style) {
      case 'elevated':
        return baseStyles + `
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          &:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        `;
      case 'flat':
        return baseStyles + `
          border-radius: var(--radius-md);
          &:hover { background: var(--color-background); }
        `;
      case 'bordered':
        return baseStyles + `
          border: 1px solid #e5e7eb;
          border-radius: var(--radius-md);
          &:hover { border-color: var(--color-primary); }
        `;
      case 'minimal':
        return baseStyles + `
          background: transparent;
          &:hover { background: rgba(var(--color-primary), 0.05); }
        `;
      default:
        return baseStyles;
    }
  }

  private static generateInputStyles(style: string): string {
    const baseStyles = `
      transition: all var(--animation-speed) var(--animation-easing);
      font-family: var(--font-body);
      font-size: 16px;
    `;

    switch (style) {
      case 'outlined':
        return baseStyles + `
          border: 2px solid #e5e7eb;
          border-radius: var(--radius-md);
          padding: 12px 16px;
          background: white;
          &:focus { border-color: var(--color-primary); outline: none; }
        `;
      case 'filled':
        return baseStyles + `
          border: none;
          border-radius: var(--radius-md);
          padding: 16px;
          background: var(--color-background);
          &:focus { background: white; outline: 2px solid var(--color-primary); }
        `;
      case 'underlined':
        return baseStyles + `
          border: none;
          border-bottom: 2px solid #e5e7eb;
          border-radius: 0;
          padding: 12px 0;
          background: transparent;
          &:focus { border-bottom-color: var(--color-primary); outline: none; }
        `;
      default:
        return baseStyles;
    }
  }

  private static generateImageStyles(imageStyle: ImageStyle, animation: AnimationLevel): string {
    const baseStyles = `
      transition: all var(--animation-speed) var(--animation-easing);
      object-fit: cover;
    `;

    let treatmentStyles = '';
    switch (imageStyle.treatment) {
      case 'rounded':
        treatmentStyles = 'border-radius: var(--radius-lg);';
        break;
      case 'circular':
        treatmentStyles = 'border-radius: 50%;';
        break;
      case 'elevated':
        treatmentStyles = 'border-radius: var(--radius-md); box-shadow: 0 8px 25px rgba(0,0,0,0.15);';
        break;
      case 'bordered':
        treatmentStyles = 'border: 3px solid white; border-radius: var(--radius-md);';
        break;
    }

    let hoverStyles = '';
    switch (imageStyle.hoverEffect) {
      case 'scale':
        hoverStyles = '&:hover { transform: scale(1.05); }';
        break;
      case 'zoom':
        hoverStyles = '&:hover { transform: scale(1.1); }';
        break;
      case 'overlay':
        hoverStyles = '&:hover::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.3); }';
        break;
    }

    return baseStyles + treatmentStyles + hoverStyles;
  }

  private static generateInteractionPatterns(
    personality: DesignPersonality, 
    animation: AnimationLevel
  ): InteractionPattern[] {
    const patterns: InteractionPattern[] = [];

    if (animation.level !== 'minimal') {
      patterns.push({
        type: 'hover',
        effect: 'transform: translateY(-2px)',
        duration: animation.speed === 'fast' ? 200 : 300
      });
    }

    if (personality.mood === 'creative' || personality.energy === 'energetic') {
      patterns.push({
        type: 'scroll',
        effect: 'opacity: 0; transform: translateY(30px)',
        duration: 600
      });
    }

    return patterns;
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) / 2147483647; // Normalize to 0-1
  }
}