// Template Engine Service
// Combines templates with AI-generated content to create final websites
// Similar to Bolt.diy's template scaffolding system

import { TemplateConfig, getTemplate } from '../config/templates';
import { GeneratedContent } from './contentGenerator';

export interface TemplateRenderOptions {
  includeAnalytics?: boolean;
  includeSEO?: boolean;
  minify?: boolean;
  customCSS?: string;
  customJS?: string;
}

export class TemplateEngine {
  
  /**
   * Render a template with generated content
   */
  public async renderTemplate(
    templateId: string,
    content: GeneratedContent,
    options: TemplateRenderOptions = {}
  ): Promise<string> {
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    // Load the template HTML
    const templateHTML = await this.loadTemplateHTML(templateId);
    
    // Replace variables with content
    let renderedHTML = this.replaceVariables(templateHTML, content);
    
    // Add SEO meta tags if requested
    if (options.includeSEO) {
      renderedHTML = this.addSEOMetadata(renderedHTML, content, template);
    }
    
    // Add analytics if requested
    if (options.includeAnalytics) {
      renderedHTML = this.addAnalytics(renderedHTML);
    }
    
    // Add custom CSS/JS if provided
    if (options.customCSS) {
      renderedHTML = this.addCustomCSS(renderedHTML, options.customCSS);
    }
    
    if (options.customJS) {
      renderedHTML = this.addCustomJS(renderedHTML, options.customJS);
    }
    
    // Minify if requested
    if (options.minify) {
      renderedHTML = this.minifyHTML(renderedHTML);
    }
    
    return renderedHTML;
  }
  
  /**
   * Load template HTML from file system
   */
  private async loadTemplateHTML(templateId: string): Promise<string> {
    // In a real implementation, this would load from the file system
    // For now, we'll return the template HTML inline
    
    const templates = {
      portfolio: this.getPortfolioTemplate(),
      business: this.getBusinessTemplate(),
      restaurant: this.getRestaurantTemplate(),
      ecommerce: this.getEcommerceTemplate(),
      blog: this.getBlogTemplate()
    };
    
    return templates[templateId as keyof typeof templates] || templates.business;
  }
  
  /**
   * Replace template variables with generated content
   */
  private replaceVariables(templateHTML: string, content: GeneratedContent): string {
    let rendered = templateHTML;
    
    // Replace each variable in the content
    for (const [key, value] of Object.entries(content)) {
      const placeholder = `{{${key}}}`;
      let replacement = '';
      
      if (Array.isArray(value)) {
        if (key.includes('ITEMS') || key.includes('PRODUCTS') || key.includes('ARTICLES')) {
          replacement = this.renderListItems(key, value);
        } else if (key.includes('SERVICES')) {
          replacement = this.renderServices(value);
        } else if (key.includes('TESTIMONIALS')) {
          replacement = this.renderTestimonials(value);
        } else if (key.includes('CATEGORIES')) {
          replacement = this.renderCategories(value);
        } else {
          replacement = value.join(', ');
        }
      } else {
        replacement = String(value);
      }
      
      rendered = rendered.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
    }
    
    return rendered;
  }
  
  /**
   * Render list items (gallery, products, articles)
   */
  private renderListItems(_type: string, items: any[]): string {
    if (!Array.isArray(items)) return '';
    
    return items.map((item, index) => `
      <div class="item-card" data-index="${index}">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" class="item-image">` : ''}
        <div class="item-content">
          <h3 class="item-title">${item.title || 'Untitled'}</h3>
          <p class="item-description">${item.description || 'No description available'}</p>
          ${item.category ? `<span class="item-category">${item.category}</span>` : ''}
        </div>
      </div>
    `).join('');
  }
  
  /**
   * Render services
   */
  private renderServices(services: any[]): string {
    if (!Array.isArray(services)) return '';
    
    return services.map((service, index) => `
      <div class="service-card" data-index="${index}">
        <h3 class="service-title">${service.name || 'Service Name'}</h3>
        <p class="service-description">${service.description || 'Service description'}</p>
        ${service.features && Array.isArray(service.features) ? `
          <ul class="service-features">
            ${service.features.map((feature: string) => `<li>${feature}</li>`).join('')}
          </ul>
        ` : ''}
        ${service.price ? `<p class="service-price">${service.price}</p>` : ''}
      </div>
    `).join('');
  }
  
  /**
   * Render testimonials
   */
  private renderTestimonials(testimonials: any[]): string {
    if (!Array.isArray(testimonials)) return '';
    
    return testimonials.map((testimonial, index) => `
      <div class="testimonial-card" data-index="${index}">
        <div class="testimonial-content">
          <p class="testimonial-text">"${testimonial.text || 'Great service!'}"</p>
          <div class="testimonial-author">
            <strong>${testimonial.name || 'Client'}</strong>
            ${testimonial.company ? `<span>, ${testimonial.company}</span>` : ''}
          </div>
          ${testimonial.rating ? this.renderRating(testimonial.rating) : ''}
        </div>
      </div>
    `).join('');
  }
  
  /**
   * Render star rating
   */
  private renderRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    if (hasHalfStar) {
      stars += '☆';
    }
    
    return `<div class="rating">${stars}</div>`;
  }
  
  /**
   * Render categories
   */
  private renderCategories(categories: string[]): string {
    if (!Array.isArray(categories)) return '';
    
    return `
      <div class="categories">
        ${categories.map(category => `
          <button class="category-btn" data-category="${category.toLowerCase()}">
            ${category}
          </button>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * Add SEO metadata to the HTML
   */
  private addSEOMetadata(html: string, content: GeneratedContent, _template: TemplateConfig): string {
    const title = content.COMPANY_NAME || content.BLOG_NAME || content.STORE_NAME || 'Website';
    const description = content.TAGLINE || content.BLOG_DESCRIPTION || content.STORE_TAGLINE || 'Professional website';
    
    const keywords = this.generateKeywords(content);
    
    const seoMetadata = `
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="${title}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    `;
    
    return html.replace('</title>', `</title>${seoMetadata}`);
  }
  
  /**
   * Generate keywords from content
   */
  private generateKeywords(content: GeneratedContent): string {
    const keywords = [
      'website',
      'business',
      'professional',
      ...Object.keys(content).filter(key => 
        !['COMPANY_NAME', 'TAGLINE'].includes(key) && 
        typeof content[key] === 'string'
      ).map(key => content[key] as string)
    ].join(', ');
    
    return keywords;
  }
  
  /**
   * Add analytics tracking
   */
  private addAnalytics(html: string): string {
    const analyticsScript = `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    `;
    
    return html.replace('</head>', `${analyticsScript}</head>`);
  }
  
  /**
   * Add custom CSS
   */
  private addCustomCSS(html: string, css: string): string {
    const styleTag = `<style>${css}</style>`;
    return html.replace('</head>', `${styleTag}</head>`);
  }
  
  /**
   * Add custom JavaScript
   */
  private addCustomJS(html: string, js: string): string {
    const scriptTag = `<script>${js}</script>`;
    return html.replace('</body>', `${scriptTag}</body>`);
  }
  
  /**
   * Basic HTML minification
   */
  private minifyHTML(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s+>/g, '>')
      .replace(/<\s+/g, '<')
      .trim();
  }
  
  // Template HTML definitions
  private getPortfolioTemplate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{COMPANY_NAME}} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .item-card { @apply bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105; }
        .item-image { @apply w-full h-48 object-cover; }
        .item-content { @apply p-6; }
        .item-title { @apply text-xl font-bold mb-2; }
        .item-description { @apply text-gray-600 mb-3; }
        .item-category { @apply inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold">{{COMPANY_NAME}}</h1>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="#about" class="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#portfolio" class="text-gray-600 hover:text-gray-900">Portfolio</a>
                    <a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{{COMPANY_NAME}}</h1>
            <p class="text-xl text-gray-600 mb-8">{{TAGLINE}}</p>
            <a href="#portfolio" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                View My Work
            </a>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
            </div>
            <div class="prose prose-lg mx-auto text-gray-600">
                {{ABOUT_TEXT}}
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Portfolio</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {{GALLERY_ITEMS}}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            </div>
            <div class="text-center">
                {{CONTACT_INFO}}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 {{COMPANY_NAME}}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }
  
  private getBusinessTemplate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{COMPANY_NAME}} - Business</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .service-card { @apply bg-white p-8 rounded-lg shadow-md; }
        .testimonial-card { @apply bg-blue-50 p-6 rounded-lg; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <h1 class="text-xl font-bold">{{COMPANY_NAME}}</h1>
                <div class="flex space-x-8">
                    <a href="#services" class="text-gray-600 hover:text-gray-900">Services</a>
                    <a href="#about" class="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#testimonials" class="text-gray-600 hover:text-gray-900">Testimonials</a>
                    <a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">{{COMPANY_NAME}}</h1>
            <p class="text-xl mb-8">{{COMPANY_TAGLINE}}</p>
            <a href="#contact" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
                Get Started
            </a>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {{SERVICES}}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
            </div>
            <div class="prose prose-lg mx-auto">
                {{ABOUT_COMPANY}}
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-16 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {{TESTIMONIALS}}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            </div>
            <div class="text-center">
                {{CONTACT_INFO}}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 {{COMPANY_NAME}}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }
  
  private getRestaurantTemplate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{RESTAURANT_NAME}} - Restaurant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .menu-item { @apply border-b border-gray-200 pb-4 mb-4; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <h1 class="text-xl font-bold">{{RESTAURANT_NAME}}</h1>
                <div class="flex space-x-8">
                    <a href="#menu" class="text-gray-600 hover:text-gray-900">Menu</a>
                    <a href="#about" class="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#reservations" class="text-gray-600 hover:text-gray-900">Reservations</a>
                    <a href="#location" class="text-gray-600 hover:text-gray-900">Location</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-orange-400 to-red-500 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">{{RESTAURANT_NAME}}</h1>
            <p class="text-xl mb-8">{{CUISINE_TYPE}} Cuisine</p>
            <a href="#reservations" class="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100">
                Make Reservation
            </a>
        </div>
    </section>

    <!-- Menu Section -->
    <section id="menu" class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Menu</h2>
            </div>
            <div class="space-y-6">
                {{MENU_ITEMS}}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
            </div>
            <div class="prose prose-lg mx-auto">
                {{ABOUT_RESTAURANT}}
            </div>
        </div>
    </section>

    <!-- Reservations Section -->
    <section id="reservations" class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Reservations</h2>
            <p class="text-lg text-gray-600 mb-8">Call us to make a reservation</p>
            <a href="tel:{{PHONE}}" class="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700">
                {{PHONE}}
            </a>
        </div>
    </section>

    <!-- Location Section -->
    <section id="location" class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Location & Hours</h2>
            </div>
            <div class="text-center">
                <p class="text-lg mb-4">{{ADDRESS}}</p>
                <p class="text-gray-600">{{HOURS}}</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 {{RESTAURANT_NAME}}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }
  
  private getEcommerceTemplate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{STORE_NAME}} - Online Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .product-card { @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow; }
        .category-btn { @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors; }
        .category-btn.active { @apply bg-blue-600 text-white; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <h1 class="text-xl font-bold">{{STORE_NAME}}</h1>
                <div class="flex space-x-8">
                    <a href="#products" class="text-gray-600 hover:text-gray-900">Products</a>
                    <a href="#categories" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Cart (0)
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">{{STORE_NAME}}</h1>
            <p class="text-xl mb-8">{{STORE_TAGLINE}}</p>
            <a href="#products" class="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100">
                Shop Now
            </a>
        </div>
    </section>

    <!-- Categories Section -->
    <section id="categories" class="py-8 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Shop by Category</h2>
            </div>
            {{CATEGORIES}}
        </div>
    </section>

    <!-- Products Section -->
    <section id="products" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {{PRODUCTS}}
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <h3 class="text-xl font-bold mb-2">Free Shipping</h3>
                    <p class="text-gray-600">On orders over $50</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-2">Secure Payment</h3>
                    <p class="text-gray-600">100% secure transactions</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-2">Easy Returns</h3>
                    <p class="text-gray-600">30-day return policy</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Customer Service</h2>
            </div>
            <div class="text-center">
                {{CONTACT_INFO}}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 {{STORE_NAME}}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }
  
  private getBlogTemplate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BLOG_NAME}} - Blog</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .article-card { @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow; }
        .category-btn { @apply px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <h1 class="text-xl font-bold">{{BLOG_NAME}}</h1>
                <div class="flex space-x-8">
                    <a href="#articles" class="text-gray-600 hover:text-gray-900">Articles</a>
                    <a href="#categories" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#about" class="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#newsletter" class="text-gray-600 hover:text-gray-900">Newsletter</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-green-500 to-teal-600 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">{{BLOG_NAME}}</h1>
            <p class="text-xl mb-8">{{BLOG_DESCRIPTION}}</p>
            <a href="#articles" class="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100">
                Read Latest Articles
            </a>
        </div>
    </section>

    <!-- Categories Section -->
    <section id="categories" class="py-8 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Explore Topics</h2>
            </div>
            {{CATEGORIES}}
        </div>
    </section>

    <!-- Articles Section -->
    <section id="articles" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {{ARTICLES}}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">About the Author</h2>
            </div>
            <div class="prose prose-lg mx-auto">
                {{ABOUT_AUTHOR}}
            </div>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section id="newsletter" class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
            <p class="text-lg text-gray-600 mb-8">{{NEWSLETTER_TEXT}}</p>
            <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <button type="submit" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Subscribe
                </button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 {{BLOG_NAME}}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }
}

// Export singleton instance
export const templateEngine = new TemplateEngine();

// Export convenience functions
export async function renderTemplate(
  templateId: string,
  content: GeneratedContent,
  options?: TemplateRenderOptions
): Promise<string> {
  return templateEngine.renderTemplate(templateId, content, options);
}

// Export for testing
export { TemplateEngine as TemplateEngineClass };
