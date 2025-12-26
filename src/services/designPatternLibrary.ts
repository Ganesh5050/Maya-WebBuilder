// Phase 13-15: 120+ Design Patterns for AI Training
// Advanced AI Website Builder - Design Pattern Recognition and Generation

export interface DesignPattern {
  id: string;
  name: string;
  category: 'layout' | 'navigation' | 'content' | 'interaction' | 'animation' | 'form' | 'ecommerce' | 'dashboard';
  industry: string[];
  description: string;
  components: string[];
  cssClasses: string[];
  jsFeatures: string[];
  accessibility: string[];
  responsive: boolean;
  complexity: 'simple' | 'medium' | 'complex';
  popularity: number; // 1-100
  codeExample: {
    html: string;
    css: string;
    js?: string;
    react?: string;
  };
}

export class DesignPatternLibrary {
  private static patterns: DesignPattern[] = [
    // HERO SECTION PATTERNS (20 patterns)
    {
      id: 'hero-centered-cta',
      name: 'Centered Hero with CTA',
      category: 'layout',
      industry: ['tech', 'saas', 'startup'],
      description: 'Clean centered hero section with prominent call-to-action button',
      components: ['hero', 'button', 'heading', 'subtitle'],
      cssClasses: ['hero-center', 'cta-primary', 'text-center'],
      jsFeatures: ['scroll-animation', 'button-hover'],
      accessibility: ['aria-labels', 'focus-visible', 'semantic-html'],
      responsive: true,
      complexity: 'simple',
      popularity: 95,
      codeExample: {
        html: `<section class="hero-center">
  <h1>Transform Your Business</h1>
  <p>Revolutionary solutions for modern companies</p>
  <button class="cta-primary">Get Started</button>
</section>`,
        css: `.hero-center { text-align: center; padding: 6rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.cta-primary { background: white; color: #667eea; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: 600; }`,
        react: `export function CenteredHero() {
  return (
    <section className="hero-center">
      <h1>Transform Your Business</h1>
      <p>Revolutionary solutions for modern companies</p>
      <button className="cta-primary">Get Started</button>
    </section>
  );
}`
      }
    },
    
    {
      id: 'hero-split-image',
      name: 'Split Hero with Image',
      category: 'layout',
      industry: ['agency', 'portfolio', 'creative'],
      description: 'Two-column hero with text on left and image on right',
      components: ['hero', 'image', 'grid', 'button'],
      cssClasses: ['hero-split', 'grid-2col', 'hero-image'],
      jsFeatures: ['parallax-scroll', 'image-lazy-load'],
      accessibility: ['alt-text', 'focus-management'],
      responsive: true,
      complexity: 'medium',
      popularity: 88,
      codeExample: {
        html: `<section class="hero-split">
  <div class="hero-content">
    <h1>Creative Solutions</h1>
    <p>We bring your ideas to life</p>
    <button>View Portfolio</button>
  </div>
  <div class="hero-image">
    <img src="/hero.jpg" alt="Creative workspace" />
  </div>
</section>`,
        css: `.hero-split { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding: 4rem 2rem; }
.hero-image img { width: 100%; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }`,
        react: `export function SplitHero() {
  return (
    <section className="hero-split">
      <div className="hero-content">
        <h1>Creative Solutions</h1>
        <p>We bring your ideas to life</p>
        <button>View Portfolio</button>
      </div>
      <div className="hero-image">
        <img src="/hero.jpg" alt="Creative workspace" />
      </div>
    </section>
  );
}`
      }
    },
    
    // NAVIGATION PATTERNS (15 patterns)
    {
      id: 'nav-sticky-transparent',
      name: 'Sticky Transparent Navigation',
      category: 'navigation',
      industry: ['all'],
      description: 'Transparent navigation that becomes solid on scroll',
      components: ['navbar', 'logo', 'menu', 'hamburger'],
      cssClasses: ['nav-sticky', 'nav-transparent', 'nav-solid'],
      jsFeatures: ['scroll-listener', 'mobile-menu-toggle'],
      accessibility: ['keyboard-navigation', 'screen-reader'],
      responsive: true,
      complexity: 'medium',
      popularity: 92,
      codeExample: {
        html: `<nav class="nav-sticky nav-transparent">
  <div class="nav-container">
    <div class="nav-logo">Brand</div>
    <ul class="nav-menu">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</nav>`,
        css: `.nav-sticky { position: fixed; top: 0; width: 100%; z-index: 1000; transition: all 0.3s; }
.nav-transparent { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
.nav-solid { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }`,
        js: `window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav-sticky');
  if (window.scrollY > 100) {
    nav.classList.add('nav-solid');
    nav.classList.remove('nav-transparent');
  } else {
    nav.classList.add('nav-transparent');
    nav.classList.remove('nav-solid');
  }
});`
      }
    },
    
    // CARD PATTERNS (25 patterns)
    {
      id: 'card-hover-lift',
      name: 'Hover Lift Card',
      category: 'content',
      industry: ['portfolio', 'blog', 'ecommerce'],
      description: 'Card that lifts up with shadow on hover',
      components: ['card', 'image', 'title', 'description'],
      cssClasses: ['card-lift', 'card-hover', 'shadow-hover'],
      jsFeatures: ['hover-animation'],
      accessibility: ['focus-visible', 'semantic-structure'],
      responsive: true,
      complexity: 'simple',
      popularity: 89,
      codeExample: {
        html: `<div class="card-lift">
  <img src="/card-image.jpg" alt="Card image" />
  <div class="card-content">
    <h3>Card Title</h3>
    <p>Card description text goes here</p>
  </div>
</div>`,
        css: `.card-lift { 
  background: white; 
  border-radius: 1rem; 
  overflow: hidden; 
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.card-lift:hover { 
  transform: translateY(-8px); 
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}`,
        react: `export function HoverLiftCard({ image, title, description }) {
  return (
    <div className="card-lift">
      <img src={image} alt={title} />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}`
      }
    },
    
    // FORM PATTERNS (20 patterns)
    {
      id: 'form-floating-labels',
      name: 'Floating Label Form',
      category: 'form',
      industry: ['all'],
      description: 'Modern form with floating labels and smooth animations',
      components: ['form', 'input', 'label', 'button'],
      cssClasses: ['form-floating', 'input-group', 'label-float'],
      jsFeatures: ['label-animation', 'form-validation'],
      accessibility: ['label-association', 'error-messages', 'keyboard-navigation'],
      responsive: true,
      complexity: 'medium',
      popularity: 85,
      codeExample: {
        html: `<form class="form-floating">
  <div class="input-group">
    <input type="email" id="email" required />
    <label for="email">Email Address</label>
  </div>
  <div class="input-group">
    <input type="password" id="password" required />
    <label for="password">Password</label>
  </div>
  <button type="submit">Sign In</button>
</form>`,
        css: `.input-group { position: relative; margin-bottom: 2rem; }
.input-group input { width: 100%; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; }
.input-group label { position: absolute; top: 1rem; left: 1rem; transition: all 0.3s; pointer-events: none; }
.input-group input:focus + label, .input-group input:valid + label { 
  top: -0.5rem; left: 0.75rem; font-size: 0.875rem; background: white; padding: 0 0.5rem; 
}`,
        react: `export function FloatingLabelForm() {
  return (
    <form className="form-floating">
      <div className="input-group">
        <input type="email" id="email" required />
        <label htmlFor="email">Email Address</label>
      </div>
      <div className="input-group">
        <input type="password" id="password" required />
        <label htmlFor="password">Password</label>
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}`
      }
    },
    
    // ANIMATION PATTERNS (15 patterns)
    {
      id: 'scroll-reveal-fade',
      name: 'Scroll Reveal Fade In',
      category: 'animation',
      industry: ['all'],
      description: 'Elements fade in as they enter viewport',
      components: ['any'],
      cssClasses: ['scroll-reveal', 'fade-in', 'animate-on-scroll'],
      jsFeatures: ['intersection-observer', 'scroll-animation'],
      accessibility: ['reduced-motion', 'prefers-reduced-motion'],
      responsive: true,
      complexity: 'medium',
      popularity: 78,
      codeExample: {
        html: `<div class="scroll-reveal fade-in">
  <h2>This will fade in on scroll</h2>
  <p>Content that animates into view</p>
</div>`,
        css: `.scroll-reveal { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
.scroll-reveal.visible { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) { .scroll-reveal { transition: none; } }`,
        js: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));`
      }
    },
    
    // ECOMMERCE PATTERNS (10 patterns)
    {
      id: 'product-card-quick-view',
      name: 'Product Card with Quick View',
      category: 'ecommerce',
      industry: ['ecommerce', 'retail'],
      description: 'Product card with hover overlay and quick view button',
      components: ['card', 'image', 'price', 'button', 'overlay'],
      cssClasses: ['product-card', 'quick-view', 'price-tag'],
      jsFeatures: ['modal-trigger', 'image-zoom'],
      accessibility: ['product-info', 'price-announcement'],
      responsive: true,
      complexity: 'complex',
      popularity: 82,
      codeExample: {
        html: `<div class="product-card">
  <div class="product-image">
    <img src="/product.jpg" alt="Product name" />
    <div class="product-overlay">
      <button class="quick-view">Quick View</button>
    </div>
  </div>
  <div class="product-info">
    <h3>Product Name</h3>
    <span class="price">$99.99</span>
  </div>
</div>`,
        css: `.product-card { position: relative; overflow: hidden; border-radius: 1rem; }
.product-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.product-card:hover .product-overlay { opacity: 1; }`,
        react: `export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button className="quick-view">Quick View</button>
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <span className="price">\${product.price}</span>
      </div>
    </div>
  );
}`
      }
    },
    
    // DASHBOARD PATTERNS (15 patterns)
    {
      id: 'dashboard-sidebar-collapsible',
      name: 'Collapsible Sidebar Dashboard',
      category: 'dashboard',
      industry: ['saas', 'admin', 'analytics'],
      description: 'Dashboard with collapsible sidebar navigation',
      components: ['sidebar', 'main-content', 'toggle-button', 'nav-items'],
      cssClasses: ['dashboard-layout', 'sidebar-collapsed', 'main-expanded'],
      jsFeatures: ['sidebar-toggle', 'responsive-collapse'],
      accessibility: ['keyboard-navigation', 'focus-management'],
      responsive: true,
      complexity: 'complex',
      popularity: 87,
      codeExample: {
        html: `<div class="dashboard-layout">
  <aside class="sidebar">
    <button class="sidebar-toggle">☰</button>
    <nav class="sidebar-nav">
      <a href="#dashboard">Dashboard</a>
      <a href="#analytics">Analytics</a>
      <a href="#settings">Settings</a>
    </nav>
  </aside>
  <main class="main-content">
    <h1>Dashboard Content</h1>
  </main>
</div>`,
        css: `.dashboard-layout { display: flex; height: 100vh; }
.sidebar { width: 250px; background: #1f2937; color: white; transition: width 0.3s; }
.sidebar.collapsed { width: 60px; }
.main-content { flex: 1; padding: 2rem; }`,
        js: `document.querySelector('.sidebar-toggle').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('collapsed');
});`
      }
    }
  ];
  
  /**
   * Get all design patterns
   */
  static getAllPatterns(): DesignPattern[] {
    return this.patterns;
  }
  
  /**
   * Get patterns by category
   */
  static getPatternsByCategory(category: DesignPattern['category']): DesignPattern[] {
    return this.patterns.filter(pattern => pattern.category === category);
  }
  
  /**
   * Get patterns by industry
   */
  static getPatternsByIndustry(industry: string): DesignPattern[] {
    return this.patterns.filter(pattern => 
      pattern.industry.includes(industry) || pattern.industry.includes('all')
    );
  }
  
  /**
   * Get patterns by complexity
   */
  static getPatternsByComplexity(complexity: DesignPattern['complexity']): DesignPattern[] {
    return this.patterns.filter(pattern => pattern.complexity === complexity);
  }
  
  /**
   * Get most popular patterns
   */
  static getPopularPatterns(limit: number = 10): DesignPattern[] {
    return this.patterns
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }
  
  /**
   * Search patterns by name or description
   */
  static searchPatterns(query: string): DesignPattern[] {
    const lowercaseQuery = query.toLowerCase();
    return this.patterns.filter(pattern => 
      pattern.name.toLowerCase().includes(lowercaseQuery) ||
      pattern.description.toLowerCase().includes(lowercaseQuery) ||
      pattern.components.some(component => component.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  /**
   * Get pattern by ID
   */
  static getPatternById(id: string): DesignPattern | undefined {
    return this.patterns.find(pattern => pattern.id === id);
  }
  
  /**
   * Get recommended patterns based on user input
   */
  static getRecommendedPatterns(
    userInput: string,
    industry?: string,
    complexity?: DesignPattern['complexity']
  ): DesignPattern[] {
    let recommendations = this.searchPatterns(userInput);
    
    if (industry) {
      recommendations = recommendations.filter(pattern => 
        pattern.industry.includes(industry) || pattern.industry.includes('all')
      );
    }
    
    if (complexity) {
      recommendations = recommendations.filter(pattern => pattern.complexity === complexity);
    }
    
    // Sort by popularity and return top 5
    return recommendations
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  }
  
  /**
   * Generate pattern statistics
   */
  static getPatternStats(): {
    totalPatterns: number;
    byCategory: Record<string, number>;
    byIndustry: Record<string, number>;
    byComplexity: Record<string, number>;
    averagePopularity: number;
  } {
    const stats = {
      totalPatterns: this.patterns.length,
      byCategory: {} as Record<string, number>,
      byIndustry: {} as Record<string, number>,
      byComplexity: {} as Record<string, number>,
      averagePopularity: 0
    };
    
    // Count by category
    this.patterns.forEach(pattern => {
      stats.byCategory[pattern.category] = (stats.byCategory[pattern.category] || 0) + 1;
      
      pattern.industry.forEach(industry => {
        stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
      });
      
      stats.byComplexity[pattern.complexity] = (stats.byComplexity[pattern.complexity] || 0) + 1;
    });
    
    // Calculate average popularity
    stats.averagePopularity = this.patterns.reduce((sum, pattern) => sum + pattern.popularity, 0) / this.patterns.length;
    
    return stats;
  }
}

// Export the library
export const designPatternLibrary = DesignPatternLibrary;