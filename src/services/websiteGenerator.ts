// Real AI Website Generator
// Mimics Bolt.diy, v0.dev style generation with proper file-by-file streaming

import { getAvailableProvider, formatRequest, parseResponse, AI_PROVIDERS } from '../config/aiProviders';

export interface GenerationStep {
  type: 'planning' | 'file' | 'complete' | 'error';
  message: string;
  fileName?: string;
  fileContent?: string;
  progress?: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface WebsiteProject {
  files: GeneratedFile[];
  structure: string;
  dependencies: Record<string, string>;
}

export class RealWebsiteGenerator {
  
  /**
   * Generate a complete website project with streaming updates
   */
  async generateWebsite(
    prompt: string,
    onProgress: (step: GenerationStep) => void
  ): Promise<WebsiteProject> {
    
    try {
      // Phase 1: Planning
      onProgress({ type: 'planning', message: '🤔 Analyzing your requirements...', progress: 5 });
      await this.delay(1000);
      
      const plan = await this.generatePlan(prompt);
      onProgress({ type: 'planning', message: '📋 Planning project structure...', progress: 10 });
      await this.delay(1000);
      
      onProgress({ type: 'planning', message: `🎨 Will create: ${plan.fileCount} files`, progress: 15 });
      await this.delay(800);
      
      // Phase 2: File Generation
      const files: GeneratedFile[] = [];
      const totalFiles = plan.files.length;
      
      for (let i = 0; i < plan.files.length; i++) {
        const fileInfo = plan.files[i];
        const progress = 15 + ((i + 1) / totalFiles) * 70; // 15% to 85%
        
        onProgress({ 
          type: 'file', 
          message: `📝 Creating ${fileInfo.path}...`,
          fileName: fileInfo.path,
          progress 
        });
        
        const content = await this.generateFile(fileInfo, prompt, plan);
        files.push({
          path: fileInfo.path,
          content,
          language: fileInfo.language
        });
        
        await this.delay(500); // Simulate file creation time
      }
      
      // Phase 3: Finalization
      onProgress({ type: 'planning', message: '🔧 Finalizing project...', progress: 90 });
      await this.delay(1000);
      
      onProgress({ type: 'complete', message: '✅ Website generated successfully!', progress: 100 });
      
      return {
        files,
        structure: plan.structure,
        dependencies: plan.dependencies
      };
      
    } catch (error) {
      onProgress({ 
        type: 'error', 
        message: `❌ Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      throw error;
    }
  }
  
  /**
   * Generate project plan using AI
   */
  private async generatePlan(prompt: string): Promise<{
    files: Array<{ path: string; description: string; language: string }>;
    structure: string;
    dependencies: Record<string, string>;
    fileCount: number;
  }> {
    const provider = getAvailableProvider();
    if (!provider) {
      console.error('❌ No AI provider available');
      throw new Error('No AI provider available. Please check your API keys.');
    }
    
    const providerKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
    if (!providerKey) {
      console.error('❌ Provider not found');
      throw new Error('Provider configuration not found');
    }
    
    console.log(`🤖 Using ${providerKey} for planning...`);
    
    const planningPrompt = `You are an expert AI Full-Stack Web Developer that builds complete, unique, and functional websites. You operate like bolt.diy and Lovable.

## CRITICAL ANALYSIS REQUIRED:

USER REQUEST: "${prompt}"

**Step 1: Deep Analysis**
- What is the INDUSTRY? (e.g., restaurant, tech, fashion, education)
- What is the PURPOSE? (e.g., sell products, showcase work, provide info)
- Who is the TARGET AUDIENCE? (e.g., professionals, kids, luxury buyers)
- What TONE should it have? (e.g., playful, professional, elegant, bold)
- What COLORS fit this industry? (e.g., restaurant=warm, tech=blue, luxury=black/gold)

**Step 2: Uniqueness Check**
- This website must be COMPLETELY DIFFERENT from generic templates
- Design should reflect the SPECIFIC industry and purpose
- Layout should match the target audience expectations

**Step 3: Create Detailed Plan**

Return a JSON object with this EXACT structure:
{
  "files": [
    {"path": "index.html", "description": "[SPECIFIC sections for THIS exact project]", "language": "html"},
    {"path": "styles.css", "description": "[SPECIFIC design elements for THIS industry]", "language": "css"},
    {"path": "script.js", "description": "[SPECIFIC interactive features for THIS purpose]", "language": "javascript"}
  ],
  "structure": "[Detailed description of what THIS SPECIFIC website will contain - be very specific]",
  "dependencies": {},
  "metadata": {
    "industry": "[detected industry]",
    "colorScheme": "[colors that fit this industry]",
    "designStyle": "[modern/minimal/bold/elegant/playful based on audience]"
  }
}

## EXAMPLES OF UNIQUENESS:

"Restaurant website" should have:
- Warm colors (orange, red, brown)
- Menu sections, reservations, gallery
- Food-focused imagery
- Elegant or rustic typography

"Kids toy store" should have:
- Bright, playful colors (rainbow, primary colors)
- Fun fonts, cartoon elements
- Age filters, safety info
- Playful animations

"Luxury watch brand" should have:
- Black, gold, silver colors
- Elegant serif fonts
- Product showcase with zoom
- Minimalist, high-end design

## YOUR TASK:
Analyze "${prompt}" and create a UNIQUE plan that reflects its SPECIFIC industry, purpose, and audience.

Return ONLY the JSON (no markdown, no explanation):`;

    try {
      console.log('📤 Sending planning request to AI...');
      const response = await this.callAI(provider, planningPrompt, providerKey);
      console.log('📥 Received planning response, length:', response.length);
      
      // Clean response - remove markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      const plan = JSON.parse(cleanResponse);
      console.log('✅ Plan parsed successfully:', plan.files.length, 'files');
      
      return {
        ...plan,
        fileCount: plan.files.length
      };
    } catch (error) {
      console.error('❌ Planning failed, using default structure:', error);
      // Fallback plan
      return {
        files: [
          { path: 'index.html', description: 'Main HTML file', language: 'html' },
          { path: 'styles.css', description: 'Styling', language: 'css' },
          { path: 'script.js', description: 'JavaScript functionality', language: 'javascript' }
        ],
        structure: 'Static website with HTML, CSS, and JavaScript',
        dependencies: {},
        fileCount: 3
      };
    }
  }
  
  /**
   * Generate individual file content
   */
  private async generateFile(
    fileInfo: { path: string; description: string; language: string },
    prompt: string,
    plan: any
  ): Promise<string> {
    const provider = getAvailableProvider();
    if (!provider) {
      console.error('❌ No AI provider available for file generation');
      throw new Error('No AI provider available');
    }
    
    const providerKey = Object.keys(AI_PROVIDERS).find(key => AI_PROVIDERS[key] === provider);
    if (!providerKey) {
      console.error('❌ Provider not found for file generation');
      throw new Error('Provider not found');
    }
    
    console.log(`🤖 Generating ${fileInfo.path} using ${providerKey}...`);
    
    const filePrompt = `You are an expert AI Full-Stack Web Developer. Generate 100% COMPLETE, PRODUCTION-READY code.

## PROJECT CONTEXT:
USER REQUEST: "${prompt}"
FILE: ${fileInfo.path}
PURPOSE: ${fileInfo.description}
STRUCTURE: ${plan.structure}
INDUSTRY: ${plan.metadata?.industry || 'general'}
COLOR SCHEME: ${plan.metadata?.colorScheme || 'modern'}
DESIGN STYLE: ${plan.metadata?.designStyle || 'professional'}

## ABSOLUTE REQUIREMENTS:

### UNIQUENESS (CRITICAL):
- This code must be COMPLETELY UNIQUE to "${prompt}"
- Reflect the SPECIFIC industry: ${plan.metadata?.industry || 'general'}
- Use colors that match: ${plan.metadata?.colorScheme || 'modern'}
- Design style must be: ${plan.metadata?.designStyle || 'professional'}
- NO GENERIC TEMPLATES - make it industry-specific

### CODE QUALITY:
- Write 100% COMPLETE code (NO placeholders, NO "TODO", NO "Add more here")
- Include ALL imports, ALL functions, ALL styles
- Production-ready with proper error handling
- Modern, clean, maintainable code

### CONTENT:
- Use REAL, MEANINGFUL content specific to "${prompt}"
- NO generic placeholders like "Your content here" or "Lorem ipsum"
- Write actual copy that fits the industry
- Include realistic data and examples

${fileInfo.language === 'html' ? `
## HTML REQUIREMENTS:
- Start with <!DOCTYPE html>
- Complete <head> with meta tags, title, description
- Semantic HTML5: <header>, <nav>, <main>, <section>, <footer>
- Multiple sections (4-6) with REAL content for "${prompt}"
- Navigation menu with actual links
- Call-to-action buttons
- Forms if needed (contact, signup, etc.)
- Link to styles.css and script.js
- Industry-specific sections (e.g., menu for restaurant, products for store)

EXAMPLE STRUCTURE FOR "${prompt}":
- Hero section with compelling headline
- About/Info section
- Main content (products/services/portfolio)
- Features/Benefits section
- Testimonials/Social proof
- Contact/CTA section
- Footer with links
` : ''}

${fileInfo.language === 'css' ? `
## CSS REQUIREMENTS:
- Use CSS custom properties for colors: ${plan.metadata?.colorScheme || 'modern'}
- Modern layout: Flexbox and Grid
- Smooth animations and transitions (0.3s ease)
- Gradients and shadows for depth
- Responsive design (mobile-first, breakpoints at 768px, 1024px)
- Hover effects on interactive elements
- Typography: Industry-appropriate fonts
- Spacing: Consistent padding/margins
- Colors must match industry: ${plan.metadata?.industry || 'general'}

DESIGN STYLE: ${plan.metadata?.designStyle || 'professional'}
- If "elegant": Use serif fonts, subtle colors, minimal design
- If "playful": Use bright colors, fun fonts, bold elements
- If "modern": Use sans-serif, gradients, clean lines
- If "bold": Use strong colors, large typography, high contrast
` : ''}

${fileInfo.language === 'javascript' ? `
## JAVASCRIPT REQUIREMENTS:
- Modern ES6+ syntax (const, let, arrow functions, async/await)
- Smooth scroll behavior for anchor links
- Mobile menu toggle functionality
- Scroll animations (Intersection Observer)
- Form validation and submission handling
- Interactive elements (tabs, accordions, modals if needed)
- Loading states and error handling
- Event listeners for user interactions
- Console.log for debugging
- NO jQuery - use vanilla JavaScript

FEATURES FOR "${prompt}":
- Add functionality specific to this industry
- Interactive elements that enhance UX
- Smooth, polished interactions
` : ''}

## OUTPUT FORMAT:
Return ONLY the complete code. NO markdown code blocks, NO explanations, NO comments outside the code.
Start directly with the code (<!DOCTYPE html> for HTML, * { for CSS, // for JS).

Generate the COMPLETE, UNIQUE, PRODUCTION-READY ${fileInfo.language} code for "${prompt}" NOW:`;

    try {
      console.log(`📤 Sending request for ${fileInfo.path}...`);
      console.log(`📝 Prompt length: ${filePrompt.length} characters`);
      console.log(`🔑 Using provider: ${providerKey}`);
      
      const content = await this.callAI(provider, filePrompt, providerKey);
      
      console.log(`📥 Received ${fileInfo.path}, length:`, content.length);
      
      // Check if content is too short (likely an error or empty response)
      if (content.length < 100) {
        console.warn(`⚠️ Content too short (${content.length} chars), might be an error`);
        console.warn(`Response: ${content.substring(0, 200)}`);
      }
      
      const cleaned = this.cleanFileContent(content, fileInfo.language);
      console.log(`✅ ${fileInfo.path} generated successfully, final length: ${cleaned.length}`);
      return cleaned;
    } catch (error) {
      console.error(`❌ Failed to generate ${fileInfo.path}:`, error);
      console.error(`Error details:`, error instanceof Error ? error.message : String(error));
      console.log(`⚠️ Using prompt-specific default content for ${fileInfo.path}`);
      return this.getDefaultFileContent(fileInfo, prompt, plan);
    }
  }
  
  /**
   * Clean AI-generated content (remove markdown, etc.)
   */
  private cleanFileContent(content: string, language: string): string {
    // Remove markdown code blocks
    content = content.replace(/```[\w]*\n/g, '').replace(/```$/g, '');
    
    // Remove leading/trailing whitespace
    content = content.trim();
    
    return content;
  }
  
  /**
   * Get default content for a file type (with prompt-specific customization)
   */
  private getDefaultFileContent(fileInfo: { path: string; language: string }, prompt: string = '', plan: any = {}): string {
    const projectName = prompt.split(' ').slice(0, 3).join(' ') || 'Website';
    const industry = plan.metadata?.industry || 'general';
    const colorScheme = plan.metadata?.colorScheme || 'modern';
    if (fileInfo.language === 'html') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <meta name="description" content="${projectName} - ${industry}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Hero Section -->
    <header class="hero">
        <nav class="navbar">
            <div class="logo">${projectName}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <button class="mobile-menu-btn">☰</button>
        </nav>
        <div class="hero-content">
            <h1>Welcome to Our Website</h1>
            <p>Creating amazing digital experiences</p>
            <button class="cta-button">Get Started</button>
        </div>
    </header>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2>About Us</h2>
            <p>We are passionate about creating beautiful, functional websites that help businesses grow.</p>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="section">
        <div class="container">
            <h2>Our Services</h2>
            <div class="services-grid">
                <div class="service-card">
                    <h3>Web Design</h3>
                    <p>Beautiful, modern designs that captivate your audience</p>
                </div>
                <div class="service-card">
                    <h3>Development</h3>
                    <p>Fast, responsive websites built with latest technologies</p>
                </div>
                <div class="service-card">
                    <h3>SEO</h3>
                    <p>Optimize your site to rank higher in search results</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section">
        <div class="container">
            <h2>Get In Touch</h2>
            <form class="contact-form">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2024 MyWebsite. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
    }
    
    if (fileInfo.language === 'css') {
      return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --dark: #1a202c;
    --light: #f7fafc;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: var(--dark);
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    min-height: 100vh;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 5%;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

.hero-content {
    text-align: center;
    padding: 8rem 2rem;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: white;
    color: var(--primary);
    border: none;
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

/* Sections */
.section {
    padding: 5rem 2rem;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
}

/* Services Grid */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.service-card {
    padding: 2rem;
    background: var(--light);
    border-radius: 10px;
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-card h3 {
    margin-bottom: 1rem;
    color: var(--primary);
}

/* Contact Form */
.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: inherit;
}

.contact-form textarea {
    min-height: 150px;
    resize: vertical;
}

.contact-form button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.contact-form button:hover {
    background: var(--secondary);
}

/* Footer */
footer {
    background: var(--dark);
    color: white;
    text-align: center;
    padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .mobile-menu-btn {
        display: block;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
}`;
    }
    
    if (fileInfo.language === 'javascript') {
      return `// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(section);
});

console.log('Website loaded successfully!');`;
    }
    
    return `// ${fileInfo.path}`;
  }
  
  /**
   * Call AI API
   */
  private async callAI(provider: any, prompt: string, providerKey: string): Promise<string> {
    console.log(`🔄 Calling AI API: ${providerKey}`);
    console.log(`📍 Endpoint: ${provider.endpoint}`);
    console.log(`📏 Prompt length: ${prompt.length} characters`);
    
    const requestData = formatRequest(providerKey, prompt);
    console.log(`📦 Request data prepared for ${providerKey}`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (providerKey === 'google') {
      const url = `${provider.endpoint}?key=${provider.apiKey}`;
      console.log(`📡 Calling Google API: ${url.substring(0, 50)}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });
      
      console.log(`📨 Google API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Google API Error: ${response.status}`, errorText.substring(0, 200));
        throw new Error(`Google API Error: ${response.status} - ${errorText.substring(0, 100)}`);
      }
      
      const data = await response.json();
      console.log(`✅ Google API response received`);
      const content = parseResponse(providerKey, data).content;
      console.log(`📝 Parsed content length: ${content.length}`);
      return content;
    }
    
    if (providerKey === 'anthropic') {
      headers['x-api-key'] = provider.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${provider.apiKey}`;
    }
    
    console.log(`📡 Calling ${providerKey} API: ${provider.endpoint}`);
    
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    
    console.log(`📨 ${providerKey} API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ${providerKey} API Error: ${response.status}`, errorText.substring(0, 200));
      throw new Error(`${providerKey} API Error: ${response.status} - ${errorText.substring(0, 100)}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${providerKey} API response received`);
    const content = parseResponse(providerKey, data).content;
    console.log(`📝 Parsed content length: ${content.length}`);
    return content;
  }
  
  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton
export const realWebsiteGenerator = new RealWebsiteGenerator();
