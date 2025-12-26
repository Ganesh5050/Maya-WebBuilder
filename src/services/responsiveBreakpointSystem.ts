// PHASE 14: Professional Responsive Breakpoint System
// Mobile-first responsive design with standard breakpoints

export interface Breakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  containerMaxWidth: number;
  padding: number;
  columns: number;
  description: string;
}

export interface ResponsiveConfig {
  breakpoints: Breakpoint[];
  containerSizes: Record<string, number>;
  spacingScale: Record<string, Record<string, number>>;
  typographyScale: Record<string, Record<string, number>>;
}

export class ResponsiveBreakpointSystem {
  
  private static readonly BREAKPOINTS: Breakpoint[] = [
    {
      name: 'xs',
      minWidth: 320,
      maxWidth: 639,
      containerMaxWidth: 320,
      padding: 16, // 2 × 8
      columns: 1,
      description: 'Small phones'
    },
    {
      name: 'sm',
      minWidth: 640,
      maxWidth: 767,
      containerMaxWidth: 640,
      padding: 24, // 3 × 8
      columns: 2,
      description: 'Large phones'
    },
    {
      name: 'md',
      minWidth: 768,
      maxWidth: 1023,
      containerMaxWidth: 768,
      padding: 32, // 4 × 8
      columns: 3,
      description: 'Tablets'
    },
    {
      name: 'lg',
      minWidth: 1024,
      maxWidth: 1279,
      containerMaxWidth: 960, // 120 × 8
      padding: 32, // 4 × 8
      columns: 4,
      description: 'Laptops'
    },
    {
      name: 'xl',
      minWidth: 1280,
      maxWidth: 1535,
      containerMaxWidth: 1140,
      padding: 40, // 5 × 8
      columns: 5,
      description: 'Desktops'
    },
    {
      name: '2xl',
      minWidth: 1536,
      containerMaxWidth: 1280, // 160 × 8
      padding: 48, // 6 × 8
      columns: 6,
      description: 'Large desktops'
    }
  ];

  /**
   * Generate responsive CSS with mobile-first approach
   */
  static generateResponsiveCSS(): string {
    return `
/* PHASE 14: Professional Responsive Breakpoint System */

/* Container System - Mobile First */
.container {
  width: 100%;
  margin: 0 auto;
  padding-left: var(--spacing-sm); /* 16px mobile */
  padding-right: var(--spacing-sm);
}

/* Breakpoint-specific container sizes */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding-left: var(--spacing-md); /* 24px */
    padding-right: var(--spacing-md);
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding-left: var(--spacing-lg); /* 32px */
    padding-right: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px; /* 120 × 8 */
    padding-left: var(--spacing-lg); /* 32px */
    padding-right: var(--spacing-lg);
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1140px;
    padding-left: var(--spacing-xl); /* 40px */
    padding-right: var(--spacing-xl);
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1280px; /* 160 × 8 */
    padding-left: var(--spacing-2xl); /* 48px */
    padding-right: var(--spacing-2xl);
  }
}

/* Grid System - Mobile First */
.grid {
  display: grid;
  gap: var(--spacing-md); /* 24px */
}

/* Mobile: 1 column */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }

/* Small phones and up: 2 columns */
@media (min-width: 640px) {
  .grid-cols-sm-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Tablets and up: 3 columns */
@media (min-width: 768px) {
  .grid-cols-md-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-md-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Laptops and up: 4 columns */
@media (min-width: 1024px) {
  .grid-cols-lg-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .grid-cols-lg-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-lg-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Desktops and up: 5-6 columns */
@media (min-width: 1280px) {
  .grid-cols-xl-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .grid-cols-xl-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
}

/* Responsive Typography - Mobile First */
.responsive-text {
  font-size: var(--font-size-base); /* 16px mobile */
  line-height: var(--line-height-base);
}

@media (min-width: 768px) {
  .responsive-text {
    font-size: var(--font-size-lg); /* 18px tablet */
  }
}

@media (min-width: 1024px) {
  .responsive-text {
    font-size: var(--font-size-xl); /* 20px desktop */
  }
}

/* Responsive Headings */
.responsive-h1 {
  font-size: var(--font-size-4xl); /* 36px mobile */
  line-height: var(--line-height-base);
}

@media (min-width: 768px) {
  .responsive-h1 {
    font-size: var(--font-size-5xl); /* 48px tablet */
  }
}

@media (min-width: 1024px) {
  .responsive-h1 {
    font-size: var(--font-size-6xl); /* 64px desktop */
  }
}

/* Responsive Spacing */
.responsive-padding {
  padding: var(--spacing-md); /* 24px mobile */
}

@media (min-width: 768px) {
  .responsive-padding {
    padding: var(--spacing-lg); /* 32px tablet */
  }
}

@media (min-width: 1024px) {
  .responsive-padding {
    padding: var(--spacing-xl); /* 48px desktop */
  }
}

/* Touch Target Sizes - Mobile */
@media (max-width: 767px) {
  .touch-target {
    min-height: 44px; /* Apple iOS guideline */
    min-width: 44px;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  /* Links in text need extra padding */
  a {
    padding: 4px;
    margin: -4px;
  }
}

/* Hide/Show elements by breakpoint */
.hidden-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hidden-mobile {
    display: block;
  }
  
  .hidden-desktop {
    display: none;
  }
}

/* Responsive Images */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Mobile: Square aspect ratio */
.responsive-image {
  aspect-ratio: 1 / 1;
}

/* Tablet and up: Landscape aspect ratio */
@media (min-width: 768px) {
  .responsive-image {
    aspect-ratio: 16 / 9;
  }
}

/* Responsive Flexbox */
.responsive-flex {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .responsive-flex {
    flex-direction: row;
    align-items: center;
  }
}`;
  }

  /**
   * Generate Tailwind-style responsive utilities
   */
  static generateTailwindBreakpoints(): Record<string, string> {
    const breakpoints: Record<string, string> = {};
    
    this.BREAKPOINTS.forEach(bp => {
      if (bp.name !== 'xs') { // xs is default (mobile-first)
        breakpoints[bp.name] = `${bp.minWidth}px`;
      }
    });
    
    return breakpoints;
  }

  /**
   * Generate responsive component styles
   */
  static generateResponsiveComponentCSS(): string {
    return `
/* PHASE 14: Responsive Component Styles */

/* Header - Responsive */
.header {
  height: 56px; /* 7 × 8 - Mobile */
}

@media (min-width: 768px) {
  .header {
    height: var(--height-header); /* 72px - Desktop */
  }
}

/* Hero Section - Responsive */
.hero {
  min-height: 320px; /* 40 × 8 - Mobile */
  padding: var(--spacing-2xl) var(--spacing-sm);
}

@media (min-width: 768px) {
  .hero {
    min-height: 480px; /* 60 × 8 - Tablet */
    padding: var(--spacing-3xl) var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .hero {
    min-height: 600px; /* 75 × 8 - Desktop */
    padding: var(--spacing-3xl) var(--spacing-xl);
  }
}

/* Cards - Responsive */
.card {
  padding: var(--spacing-sm); /* 16px mobile */
  margin-bottom: var(--spacing-sm);
}

@media (min-width: 768px) {
  .card {
    padding: var(--spacing-md); /* 24px tablet */
    margin-bottom: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .card {
    padding: var(--spacing-lg); /* 32px desktop */
    margin-bottom: var(--spacing-lg);
  }
}

/* Buttons - Responsive */
.button {
  height: var(--height-btn-sm); /* 32px mobile */
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .button {
    height: var(--height-btn-md); /* 40px tablet+ */
    padding: 0 var(--spacing-md);
    font-size: var(--font-size-base);
  }
}

/* Forms - Responsive */
.form-input {
  height: var(--height-btn-sm); /* 32px mobile */
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .form-input {
    height: var(--height-input); /* 40px tablet+ */
    padding: 0 var(--spacing-md);
    font-size: var(--font-size-base);
  }
}

/* Navigation - Responsive */
.nav-item {
  padding: var(--spacing-xs) 0;
  font-size: var(--font-size-base);
}

@media (min-width: 768px) {
  .nav-item {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-base);
  }
}`;
  }

  /**
   * Get breakpoint information
   */
  static getBreakpoints(): Breakpoint[] {
    return [...this.BREAKPOINTS];
  }

  /**
   * Get breakpoint by name
   */
  static getBreakpoint(name: string): Breakpoint | undefined {
    return this.BREAKPOINTS.find(bp => bp.name === name);
  }

  /**
   * Generate media query string
   */
  static generateMediaQuery(breakpoint: string, type: 'min' | 'max' = 'min'): string {
    const bp = this.getBreakpoint(breakpoint);
    if (!bp) return '';
    
    const width = type === 'min' ? bp.minWidth : (bp.maxWidth || bp.minWidth);
    return `@media (${type}-width: ${width}px)`;
  }

  /**
   * Generate complete responsive configuration
   */
  static generateResponsiveConfig(): ResponsiveConfig {
    const containerSizes: Record<string, number> = {};
    const spacingScale: Record<string, Record<string, number>> = {};
    const typographyScale: Record<string, Record<string, number>> = {};
    
    this.BREAKPOINTS.forEach(bp => {
      containerSizes[bp.name] = bp.containerMaxWidth;
      
      spacingScale[bp.name] = {
        padding: bp.padding,
        margin: bp.padding,
        gap: bp.padding * 0.75
      };
      
      // Typography scales with breakpoint
      const baseSize = bp.name === 'xs' ? 14 : bp.name === 'sm' ? 16 : 18;
      typographyScale[bp.name] = {
        base: baseSize,
        lg: baseSize * 1.125,
        xl: baseSize * 1.25,
        '2xl': baseSize * 1.5,
        '3xl': baseSize * 1.875,
        '4xl': baseSize * 2.25,
        '5xl': baseSize * 3,
        '6xl': baseSize * 4
      };
    });
    
    return {
      breakpoints: this.BREAKPOINTS,
      containerSizes,
      spacingScale,
      typographyScale
    };
  }
}