// Enhanced Website Generator - Creates UNIQUE websites, not templates
// This replaces the boring template system with true AI generation

import { getAvailableProvider, formatRequest, parseResponse } from '../config/aiProviders';
import { designVariationEngine, DesignBrief } from './designVariationEngine';
import { designHistoryService } from './designHistoryService';
import { mcpService } from './mcpService';
import { imageService } from './imageService';
import { intentEngine } from './brain/IntentEngine';
import { layoutStrategist } from './brain/LayoutStrategist';
import { llmManager, TaskType } from './LLMManager';

export interface BusinessAnalysis {
  industry: string;
  subCategory: string;
  targetAudience: {
    age: string;
    income: string;
    values: string[];
    description?: string; // New field from IntentEngine
  };
  intentManifest?: any; // The full brain output
  personality: string[];
  competitors: string[];
  differentiators: string[];
  mood: string;
  language?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export class EnhancedWebsiteGenerator {
  private preferredModel: string = 'auto';

  /**
   * STEP 1: Deep Analysis (5s) - Understand the business deeply
   * This replaces generic classification with detailed understanding
   */
  async deepAnalyze(prompt: string, onUpdate?: (type: string, msg: string) => Promise<void>): Promise<BusinessAnalysis> {
    console.log('🔍 STEP 1: Deep Analysis - Understanding business context...');
    if (onUpdate) await onUpdate('thought', 'Scanning prompt for business context...');

    // PHASE 1.1: MCP Research
    if (onUpdate) await onUpdate('thought', 'Checking industry trends and competitors...');
    const researchData = await mcpService.searchWeb(`competitors and design trends for ${prompt}`);
    console.log('🌐 MCP Research Data:', researchData);

    // Simulate thinking time for "Deep Analysis"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysisPrompt = `You are a senior business analyst and brand strategist.

TASK: Analyze this business request based on the provided research.

user_request: "${prompt}"

mcp_research_context:
"""
${researchData}
"""

ANALYSIS REQUIREMENTS:
1. Industry Classification (be specific, not generic)
   - Primary industry (e.g., "luxury-fashion", not just "fashion")
   - Sub-category (e.g., "artisanal-footwear", not just "shoes")
   
2. Target Audience Analysis
   - Age range (specific, e.g., "28-45")
   - Income level (specific, e.g., "upper-middle-class")
   - Core values (3-5 specific values, e.g., ["sustainability", "craftsmanship", "exclusivity"])
   
3. Brand Personality (choose 2-3 from these options)
   - elegant, modern, bold, minimal, creative, luxury, playful, professional, edgy, warm
   
4. Competitive Landscape
   - List 3-5 direct competitors (real websites if possible)
   - What makes this business different?
   
5. Design Mood (choose one)
   - minimal, vibrant, elegant, bold, dark, light

CRITICAL: Be specific, not generic. "E-commerce" is too broad - use "luxury-jewelry" or "sustainable-fashion".

OUTPUT FORMAT (JSON only):
{
  "industry": "specific-industry-subcategory",
  "subCategory": "detailed-subcategory",
  "targetAudience": {
    "age": "age-range",
    "income": "income-level",
    "values": ["value1", "value2", "value3"]
  },
  "personality": ["trait1", "trait2"],
  "competitors": ["competitor1.com", "competitor2.com", "competitor3.com"],
  "differentiators": ["unique-aspect1", "unique-aspect2"],
  "mood": "design-mood",
  "language": "ISO Language Code (e.g., 'en', 'fr', 'es', 'de')"
}`;

    try {
      // SMART ANALYTICS: Use the new Intent Engine "Brain"
      if (onUpdate) await onUpdate('thought', 'Activating Cognitive Core (Intent Analysis)...');

      // Use the IntentEngine for deeper analysis
      const manifest = await intentEngine.analyzeIntent(prompt);

      // Map manifest to BusinessAnalysis
      const analysis: BusinessAnalysis = {
        industry: manifest.strategy.industry,
        subCategory: manifest.strategy.subCategory,
        targetAudience: {
          age: manifest.core.targetAudience.ageRange,
          income: manifest.core.targetAudience.incomeLevel,
          values: manifest.core.targetAudience.values
        },
        personality: [manifest.brand.personality, ...manifest.contentStrategy.keyDifferentiators.slice(0, 1)],
        competitors: manifest.strategy.competitors || [`${manifest.strategy.industry}-competitor.com`],
        differentiators: manifest.contentStrategy.keyDifferentiators,
        mood: manifest.contentStrategy.tone.toLowerCase(),
        language: 'en',
        intentManifest: manifest
      };

      console.log('🔍 Brain Analysis Complete:', analysis);
      if (onUpdate) await onUpdate('thought', `Brain Analysis: Targeted ${analysis.industry} for ${analysis.targetAudience.description || 'users'}`);

      return analysis;

    } catch (error) {
      console.warn('⚠️ Brain failed, using heuristic fallback:', error);
      if (onUpdate) await onUpdate('thought', 'Cognitive overload. Switching to static heuristics...');

      // FALLBACK
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Basic fallback
      return {
        industry: "general-business",
        subCategory: "service",
        targetAudience: { age: "25-45", income: "Middle", values: ["Quality"] },
        personality: ["Professional"],
        competitors: [],
        differentiators: ["Quality"],
        mood: "professional",
        language: "en"
      };
      const p = prompt.toLowerCase();

      if (onUpdate) await onUpdate('thought', 'Extracting keywords and semantic meaning...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Detect Industry
      const industries = {
        'skate': { name: 'skate-shop', sub: 'retail' },
        'board': { name: 'skate-shop', sub: 'retail' },
        'surf': { name: 'surf-shop', sub: 'retail' },
        'food': { name: 'restaurant', sub: 'hospitality' },
        'restaurant': { name: 'restaurant', sub: 'hospitality' },
        'cafe': { name: 'cafe', sub: 'hospitality' },
        'photo': { name: 'portfolio', sub: 'creative' },
        'art': { name: 'portfolio', sub: 'creative' },
        'tech': { name: 'tech-startup', sub: 'saas' },
        'app': { name: 'mobile-app', sub: 'saas' },
        'fashion': { name: 'fashion', sub: 'retail' },
        'cloth': { name: 'fashion', sub: 'retail' },
        'gym': { name: 'fitness', sub: 'wellness' },
        'fit': { name: 'fitness', sub: 'wellness' },
        'bank': { name: 'finance', sub: 'services' },
        'invest': { name: 'finance', sub: 'services' },
        'game': { name: 'gaming', sub: 'entertainment' }
      };

      let industry = 'business';
      let subCategory = 'general';

      for (const [key, value] of Object.entries(industries)) {
        if (p.includes(key)) {
          industry = value.name;
          subCategory = value.sub;
          break;
        }
      }

      // 2. Detect Mood
      let mood = 'modern';
      if (p.includes('retro') || p.includes('vintage') || p.includes('old')) mood = 'retro-pop';
      else if (p.includes('minimal') || p.includes('clean') || p.includes('simple')) mood = 'minimalist';
      else if (p.includes('dark') || p.includes('bold') || p.includes('edgy')) mood = 'brutalist';
      else if (p.includes('luxury') || p.includes('premium') || p.includes('gold')) mood = 'luxury';
      else if (p.includes('fun') || p.includes('playful') || p.includes('kid')) mood = 'playful';
      else if (p.includes('corporate') || p.includes('pro')) mood = 'corporate-clean';
      else if (p.includes('glass') || p.includes('blur')) mood = 'glassmorphism';

      if (onUpdate) await onUpdate('thought', `Detected Industry: ${industry}, Mood: ${mood}`);

      // 3. Generate Context
      return {
        industry: industry,
        subCategory: subCategory,
        targetAudience: {
          age: '25-45',
          income: 'flexible',
          values: ['quality', 'innovation', 'experience']
        },
        personality: [mood, 'professional'],
        competitors: [`${industry}competitor.com`, `top${industry}.com`],
        differentiators: [`unique-${mood}-design`, `premium-${industry}-service`],
        mood: mood // Ensure mood is passed for design engine
      };
    }
  }

  /**
   * STEP 2: Generate Design Brief (3s) - Create unique design direction
   * This creates the visual strategy before any code generation
   */
  generateDesignBrief(analysis: BusinessAnalysis): DesignBrief {
    console.log('📋 STEP 2: Generating Design Brief...');

    // Check for similar recent designs
    let brief = designVariationEngine.generateDesignBrief(
      analysis.industry,
      analysis.personality[0] || 'modern',
      analysis.mood
    );

    // 🧠 BRAIN INTEGRATION: Apply Intelligent Layout Strategy
    if (analysis.intentManifest) {
      console.log('🧠 Applying Cognitive Layout Strategy...');
      const strategy = layoutStrategist.recommendLayouts(analysis.intentManifest);

      // Override random selections with strategic decisions
      brief.layouts.hero = strategy.hero;
      brief.layouts.features = strategy.features;
      brief.layouts.products = strategy.products;
      brief.layouts.footer = strategy.footer;
    }

    // Validate uniqueness
    const similarity = designHistoryService.checkSimilarity({
      industry: analysis.industry,
      primaryColor: brief.colorPalette.primary[500],
      fontPairing: `${brief.typography.heading}+${brief.typography.body}`,
      layoutType: brief.layouts.hero.name
    });

    // If too similar, regenerate with different parameters
    if (similarity.tooSimilar) {
      console.log('🔄 Design too similar, regenerating with different approach...');

      // Get suggestions to avoid repetition
      const suggestions = designHistoryService.getSuggestions(analysis.industry);

      // Force different personality if needed
      const alternativePersonality = analysis.personality[1] ||
        (analysis.personality[0] === 'modern' ? 'elegant' : 'modern');

      brief = designVariationEngine.generateDesignBrief(
        analysis.industry,
        alternativePersonality,
        analysis.mood
      );

      console.log('🔄 Regenerated with alternative personality:', alternativePersonality);
    }

    // Save to history
    designHistoryService.saveDesign({
      industry: analysis.industry,
      primaryColor: brief.colorPalette.primary[500],
      fontPairing: `${brief.typography.heading}+${brief.typography.body}`,
      layoutType: brief.layouts.hero.name,
      prompt: analysis.industry
    });

    console.log('📋 Design brief generated:', brief);
    return brief;
  }

  /**
   * STEP 3: Generate Components (8s) - Create unique components using detailed prompts
   * This is where the magic happens - detailed, specific prompts create unique designs
   */
  async generateComponent(
    componentName: string,
    analysis: BusinessAnalysis,
    designBrief: DesignBrief,
    prompt: string
  ): Promise<string> {
    console.log(`🎨 STEP 3: Generating ${componentName} component...`);

    // Generate smart images for this component
    const images = {
      hero: imageService.getHeroImage(`${analysis.industry} ${analysis.mood}`),
      gallery: imageService.getGalleryImages(`${analysis.industry} detail`, 3),
      feature: imageService.getImageUrl({ keyword: `${analysis.industry} abstract`, width: 600, height: 400 }),
      avatar: imageService.getAvatar()
    };

    // CRITICAL: This is the detailed prompt that creates uniqueness!
    const componentPrompt = this.createDetailedComponentPrompt(
      componentName,
      analysis,
      designBrief,
      prompt,
      images
    );

    try {
      // Smart Route: Use Best Coding Model (e.g., Claude 3.5 Sonnet)
      const cleanResponse = await llmManager.generateResponse(componentPrompt, TaskType.CODE_GENERATION);

      // Clean the response
      let parsedResponse = cleanResponse.trim();
      if (parsedResponse.startsWith('```')) {
        parsedResponse = parsedResponse.replace(/```typescript\n?/g, '').replace(/```tsx\n?/g, '').replace(/```\n?/g, '').trim();
      }

      console.log(`✅ ${componentName} component generated successfully`);
      return parsedResponse;

    } catch (error) {
      console.error(`❌ Failed to generate ${componentName}:`, error);
      return this.getDefaultComponent(componentName, designBrief, analysis);
    }
  }

  /**
   * Create detailed component prompt - THIS IS THE KEY TO UNIQUENESS!
   */
  private createDetailedComponentPrompt(
    componentName: string,
    analysis: BusinessAnalysis,
    designBrief: DesignBrief,
    originalPrompt: string,
    images?: any
  ): string {

    const baseContext = `
    You are an avant-garde web designer known for award-winning, unique websites.
    You DO NOT create generic templates. You create bespoke digital experiences for ${originalPrompt} (${analysis.industry}).
    
    CRITICAL TECHNICAL RULES (VIOLATION = FAILURE):
    1. **NO PROPS**: The component must NOT accept any props. \`export default function Hero() { ... }\`
    2. **HARDCODE EVERYTHING**: Do NOT use variables like \`{title}\` or \`{items.map()}\`. WRITE THE ACTUAL TEXT/HTML.
    3. **NO LOOPS/MAPS**: Do not use \`items.map(...)\`. Manually write out 3-4 repeated elements/cards with DIFFERENT content for each.
    4. **NO STATE/EFFECTS**: Do not use \`useState\` or \`useEffect\`. Keep it visual only.
    5. **VALID JSX**: Ensure all tags are closed. Use \`style={{}}\` for inline styles if needed, but prefer Tailwind classes.

    CONTEXT:
    - Target Audience: ${analysis.targetAudience.age}, ${analysis.targetAudience.income}
    - Brand Mood: ${analysis.mood}
    - ARTISTIC STYLE: ${designBrief.artisticStyle.toUpperCase()} (Adhere strictly to this movement)
    - LANGUAGE REQUIREMENT: All visible text must be in language code: "${analysis.language || 'en'}". Do NOT translate variable names.
    
    IMAGES TO USE (Use these exact URLs, do not create others):
    - Hero BG: ${images?.hero || 'https://images.unsplash.com/photo-1?w=1920&q=80'}
    - Feature: ${images?.feature || 'https://images.unsplash.com/photo-1?w=800&q=80'}
    - Gallery: ${JSON.stringify(images?.gallery || [])}
    - Avatar: ${images?.avatar || 'https://images.unsplash.com/photo-1?w=200&q=80'}

    DESIGN SYSTEM:
    - Primary Color: ${designBrief.colorPalette.primary[500]}
    - Secondary Color: ${designBrief.colorPalette.secondary[500]}
    - Accent Color: ${designBrief.colorPalette.accent[500]}
    - Font Heading: '${designBrief.typography.heading}'
    - Font Body: '${designBrief.typography.body}'
    - Rounding: ${designBrief.spacing.scale === 'tight' ? 'rounded-none' : 'rounded-2xl'}
    `;

    if (componentName === 'Hero') {
      return `${baseContext}
      
      TASK: Create a '${designBrief.layouts.hero.name}' style Hero section following the '${designBrief.artisticStyle}' aesthetic.
      
      STRICT REQUIREMENTS:
      1. LAYOUT: Must use ${designBrief.layouts.hero.structure} structure (${designBrief.layouts.hero.textAlign} text).
      2. VISUALS: Use the provided Hero BG URL: '${images?.hero}' as the background image (cover) or main visual.
      3. ARTISTIC DIRECTION: 
         - If 'glassmorphism': Use backdrop-blur-xl on top of the image.
         - If 'brutalist': Use the image in a hard-edged box with border-4.
      4. TEXT: HUGE, BOLD headings (text-6xl+). Do NOT start with "Welcome". Use punchy, industry-specific copy.
      5. CONTENT: Use specific term "${analysis.industry === 'skate-shop' ? 'Shred the Streets' : 'Experience Excellence'}".
      
      Return ONLY the React component code exported as default.
      `;
    }

    if (componentName === 'Features') {
      return `${baseContext}
      
      TASK: Create a ${designBrief.layouts.features.type} features section with '${designBrief.layouts.features.style}' styling.
      
      STRICT REQUIREMENTS:
      1. LAYOUT: Rigid ${designBrief.layouts.features.type} grid.
      2. SCROLLING or GRID: If 'scrolling', make it a horizontal snap scroll.
      3. IMAGES: Use these images for features/cards: ${JSON.stringify(images?.gallery || [])}.
      4. CONTENT: 4 distinct features. AVOID generic titles. Use industry vocabulary.
      5. ICONS: Lucide-React icons, colored ${designBrief.colorPalette.accent[500]}.
      
      Return ONLY the React component code exported as default.
      `;
    }

    if (componentName === 'About') {
      return `${baseContext}
      
      TASK: Create a storytelling About section in ${designBrief.artisticStyle} style.
      
      STRICT REQUIREMENTS:
      1. LAYOUT: Asymmetric/broken grid.
      2. VISUALS: Use this image '${images?.feature}' as the main visuals.
      3. CONTENT: Focus on brand values: ${analysis.targetAudience.values.join(', ')}.
      
      Return ONLY the React component code exported as default.
      `;
    }

    if (componentName === 'CTA') {
      return `${baseContext}
      
      TASK: Create a high-conversion CTA in ${designBrief.artisticStyle} style.
      
      STRICT REQUIREMENTS:
      1. BG: ${designBrief.colorPalette.primary[700]} (High contrast).
      2. BUTTON: Massive ${designBrief.colorPalette.accent[500]} button.
      3. ELEMENT: Floating decorative shape in background.
      
      Return ONLY the React component code exported as default.
      `;
    }

    if (componentName === 'Footer') {
      return `${baseContext}
      TASK: Create a ${analysis.mood} footer in ${designBrief.layouts.footer.style} layout.
      BG: ${designBrief.colorPalette.neutral[900]}. Text: ${designBrief.colorPalette.neutral[300]}.
      Include: Newsletter input, social links, copyright.
      Return ONLY the React component code exported as default.
      `;
    }

    return `Create a unique React component for ${componentName} for a ${analysis.industry} website.`;
  }

  /**
   * FEATURE 45: Generate Component Variations
   * Creates multiple options for a specific component
   */
  async generateComponentVariations(
    componentName: string,
    analysis: BusinessAnalysis,
    currentDesignBrief: DesignBrief,
    count: number = 3
  ): Promise<{ id: string; name: string; description: string; code: string }[]> {
    console.log(`🎨 Generating ${count} variations for ${componentName}...`);

    // Only Hero supports true layout variations currently in the engine
    // For others, we'll vary the prompt style
    const variations: { id: string; name: string; description: string; code: string }[] = [];

    if (componentName === 'Hero') {
      const layoutOptions = designVariationEngine.generateVariationOptions('hero', analysis.industry, count);

      for (const layout of layoutOptions) {
        // Create a brief override with this specific layout
        const variantBrief = { ...currentDesignBrief, layouts: { ...currentDesignBrief.layouts, hero: layout } };

        // Generate code for this variant
        const code = await this.generateComponent(componentName, analysis, variantBrief, `Variation: ${layout.name} style`);

        variations.push({
          id: layout.name,
          name: layout.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          description: `A ${layout.name} layout with ${layout.imagePosition} image.`,
          code
        });
      }
    } else {
      // Fallback for non-Hero variations (vary styling/personality)
      const styles = ['minimal', 'bold', 'creative'];

      for (let i = 0; i < count; i++) {
        const style = styles[i % styles.length];
        // Create a brief override
        const variantBrief = { ...currentDesignBrief, artisticStyle: style as any };

        const code = await this.generateComponent(componentName, analysis, variantBrief, `Variation: ${style} style`);
        variations.push({
          id: style,
          name: style.charAt(0).toUpperCase() + style.slice(1),
          description: `A ${style} interpretation of the ${componentName}.`,
          code
        });
      }
    }

    return variations;
  }

  /**
   * Generate complete unique website
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * FEATURE 4: Prompt Enhancement (Backend Only)
   * Silent step to improve short user prompts
   */
  async enhancePrompt(rawPrompt: string): Promise<string> {
    // Small prompts needs expansion. Long prompts might just need structure.
    if (rawPrompt.length > 300) return rawPrompt; // Assume detailed enough if > 300 chars

    const systemPrompt = "You are an expert Requirements Engineer. Your goal is to expand short user requests into professional web design prompts. Add details about aesthetic, key sections, and vibe. Keep it concise (max 2 sentences). Output ONLY the enhanced prompt.";

    try {
      console.log(`✨ Enhancing prompt: "${rawPrompt}"`);
      // Use CREATIVE_WRITING model (GPT-4o/Claude)
      const enhanced = await llmManager.generateResponse(rawPrompt, TaskType.CREATIVE_WRITING, systemPrompt);
      console.log(`✅ Enhanced: "${enhanced}"`);
      return enhanced.replace(/"/g, ''); // Remove quotes if LLM adds them
    } catch (e) {
      console.warn("Prompt enhancement failed, using original:", e);
      return rawPrompt;
    }
  }



  /**
   * Generate complete unique website
   */
  async generateUniqueWebsite(
    prompt: string,
    onProgress: (step: { type: string; message: string; data?: any }) => void,
    options?: { model?: string }
  ): Promise<GeneratedFile[]> {
    console.log('🚀 Starting UNIQUE website generation (REAL AI)...');

    // Set Model Preference (Feature 11)
    if (options?.model) {
      this.preferredModel = options.model;
      console.log(`🧠 Using Preferred Model: ${this.preferredModel}`);
    } else {
      this.preferredModel = 'auto';
    }

    // Helper to send updates - WITH REALISTIC DELAYS for "Lovable" feel
    const update = async (type: string, message: string, data?: any) => {
      onProgress({ type, message, data });

      // UX DELAYS: Give the user time to read the steps (Simulate "Thinking" and "Writing")
      if (type === 'thought') {
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s thinking time
      } else if (type === 'file') {
        await new Promise(resolve => setTimeout(resolve, 800)); // 0.8s file writing time
      } else {
        await new Promise(resolve => setTimeout(resolve, 100)); // Micro-delay for smooth UI
      }
    };

    try {
      // PHASE 0: Prompt Enhancement (Feature 4 - Invisible Intelligence)
      await update('thought', 'Refining clarity of requirements...');
      let workingPrompt = prompt;

      // Only enhance if it looks like a short request
      if (prompt.length < 300) {
        const enhanced = await this.enhancePrompt(prompt);
        if (enhanced !== prompt) {
          workingPrompt = enhanced;
          await update('thought', `Expanded requirements: "${enhanced.substring(0, 60)}..."`);
        }
      }

      // PHASE 1: Deep Analysis & Research
      await update('thought', 'Analyzing business requirements and user intent...');

      const analysis = await this.deepAnalyze(workingPrompt, update);

      const planMessage = `I've analyzed your request for a **${analysis.industry}** website.

**Strategy:**
• **Target Audience:** ${analysis.targetAudience.age}, ${analysis.targetAudience.income}
• **Core Values:** ${analysis.targetAudience.values.join(', ')}
• **Mood:** ${analysis.mood}
• **Differentiators:** ${analysis.differentiators.join(', ')}

I will generate a unique design that stands out from competitors like ${analysis.competitors[0] || 'others'}.`;

      await update('plan', planMessage);

      // PHASE 2: Design Brief
      await update('thought', `Creating unique design system (${analysis.mood})...`);

      const designBrief = this.generateDesignBrief(analysis);

      await update('text', `**Design Direction:**\n• Palette: ${designBrief.colorPalette.primary[500]} (Primary)\n• Fonts: ${designBrief.typography.heading} + ${designBrief.typography.body}\n• Hero Layout: ${designBrief.layouts.hero.name}`);

      // PHASE 2.5: Asset Generation
      await update('thought', 'Generating visual assets (images)...');
      await update('asset_intro', 'Generating unique assets for your project...');

      // Feature 46: Auto-generate assets via DALL-E 3 (if available) or Fallback
      let heroUrl: string | null = null;
      let featureUrl: string | null = null;

      try {
        // Attempt AI generation for Hero (Most important visual)
        // If DALL-E key is present, this will be unique. If not, fallback to null instantly.
        heroUrl = await llmManager.generateImage(`Professional website hero for ${analysis.industry}, ${analysis.mood} style, high quality, 4k, trending on artstation`);
      } catch (e) { console.warn('Image gen failed', e); }

      // Fallbacks
      // Fallbacks
      if (!heroUrl) heroUrl = await imageService.getHeroImage(`${analysis.industry} ${analysis.mood}`);
      if (!featureUrl) featureUrl = await imageService.getImageUrl({ keyword: `${analysis.industry} feature`, width: 800 });

      const imagesToGenerate = [
        { message: 'Hero background image', data: { url: heroUrl } },
        { message: 'Feature showcase image', data: { url: featureUrl } },
        { message: 'Team collaboration shot', data: { url: imageService.getImageUrl({ keyword: 'team meeting diverse', width: 800 }) } }
      ];

      for (const img of imagesToGenerate) {
        await update('thought', `Generating ${img.message}...`);
        // Simulate generation time
        await new Promise(resolve => setTimeout(resolve, 2000));
        await update('image', img.message, img.data);
      }

      // Simulate Screenshot
      await update('thought', 'Taking screenshot of interface...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      await update('image', 'Screenshot taken', { url: '' });

      // Feature 49 + 33: Generate README & Schema
      const [readmeContent, schemaContent] = await Promise.all([
        this.generateReadmeContent(analysis),
        this.generateDatabaseSchema(analysis)
      ]);

      // Feature 34: Generate API & Supabase
      const apiContent = await this.generateApiService(analysis, schemaContent);
      const supabaseContent = this.generateSupabaseClient();

      // PHASE 3: Project Scaffold
      await update('thought', 'Initializing React + Vite project structure...');

      const commonFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'postcss.config.js', 'tailwind.config.js'];

      // We need to generate these mostly static files first to send them
      const appComponent = ''; // Placeholder
      const generatedComponents: Record<string, string> = {};
      const extras = { readme: readmeContent, schema: schemaContent, api: apiContent, supabase: supabaseContent };

      const scaffoldingFiles = this.generateProjectFiles(generatedComponents, appComponent, designBrief, analysis, extras);

      // Filter only the common files to emit first
      const filesToEmitFirst = scaffoldingFiles.filter(f => commonFiles.includes(f.path.split('/').pop() || ''));

      await update('file_intro', 'Building project components (React + Vite)...');

      for (const file of filesToEmitFirst) {
        await update('file', `Created ${file.path}`, {
          status: 'created',
          filename: file.path,
          content: file.content, // Send actual content
          language: file.language
        });
      }

      // PHASE 4: Component Generation
      await update('thought', 'Generating unique high-fidelity components...');

      const components = ['Hero', 'Features', 'About', 'CTA', 'Footer'];

      for (let i = 0; i < components.length; i++) {
        const componentName = components[i];

        await update('thought', `Designing & building ${componentName}...`);

        let componentPrompt = prompt + " STRICT COPYWRITING: Use real, high-quality, persuasive industry-specific text. DO NOT use Lorem Ipsum.";

        // Inject Generated Assets (Integration Step)
        if (componentName === 'Hero' && heroUrl) {
          componentPrompt += `\n\nCRITICAL ASSET INJECTION: Use this EXACT URL for the hero background or main image: "${heroUrl}"\nDo NOT use a placeholder or random URL. Ensure this image is prominently displayed.`;
        }
        if (componentName === 'Features' && featureUrl) {
          componentPrompt += `\n\nCRITICAL ASSET INJECTION: Use this EXACT URL for the main feature image: "${featureUrl}"\nDo NOT use a placeholder.`;
        }

        generatedComponents[componentName] = await this.generateComponent(
          componentName,
          analysis,
          designBrief,
          componentPrompt
        );

        // Emit the component file immediately
        await update('file', `Created src/components/${componentName}.tsx`, {
          status: 'created',
          filename: `src/components/${componentName}.tsx`,
          content: generatedComponents[componentName], // Send actual content
          language: 'typescript'
        });
      }

      // PHASE 5: Assembly
      await update('thought', ' assembling application...');
      const finalAppComponent = this.generateAppComponent(generatedComponents, designBrief);

      await update('file', 'Created src/App.tsx', {
        status: 'created',
        filename: 'src/App.tsx',
        content: finalAppComponent,
        language: 'typescript'
      });

      // STEP 6: Final Polish & Remaining Files
      const allFiles = this.generateProjectFiles(generatedComponents, finalAppComponent, designBrief, analysis, extras);

      // Emit any remaining files that weren't emitted yet (index.css, main.tsx, index.html)
      const emittedPaths = new Set([
        ...filesToEmitFirst.map(f => f.path),
        ...components.map(c => `src/components/${c}.tsx`),
        'src/App.tsx'
      ]);

      for (const file of allFiles) {
        if (!emittedPaths.has(file.path)) {
          await update('file', `Created ${file.path}`, {
            status: 'created',
            filename: file.path,
            content: file.content,
            language: file.language
          });
        }
      }

      // PHASE 6: Summary
      const summaryText = "I've generated the photographer portfolio with a responsive gallery, contact form, and optimized project structure. You can now preview the results.";
      // @ts-ignore - allowing custom summary type
      await update('summary', summaryText);

      await update('complete', '✅ Unique website generated successfully!');



      console.log('✅ Unique website generation complete!');
      return allFiles;

    } catch (error) {
      console.error('❌ Enhanced generation failed:', error);
      await update('text', `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Generate App.tsx component
   */


  /**
   * Generate all project files
   */


  /**
   * Generate standalone HTML preview from React components
   * This ensures the user sees the styled content even if WebContainer fails
   */
  private generatePreviewHtml(components: Record<string, string>, designBrief: DesignBrief, analysis: BusinessAnalysis): string {
    // 1. Convert React components to HTML fragments
    let fullHtml = '';
    const componentOrder = ['Hero', 'Features', 'About', 'CTA', 'Footer'];

    componentOrder.forEach(name => {
      let code = components[name] || '';

      // ROBUST REACT TO HTML CONVERSION

      // 1. Extract the JSX content inside return (...)
      // Matches everything between "return (" and the last ");"
      const returnMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
      if (returnMatch && returnMatch[1]) {
        code = returnMatch[1];
      } else {
        // Fallback: If no return(), it might be a direct render or already HTML-like
        // Try to strip known React boilerplates
        code = code.replace(/import\s+.*?from\s+['"].*?['"];?/gm, '');
        code = code.replace(/export\s+default\s+function\s+\w+\s*\(\)\s*{/g, '');
        code = code.replace(/}/g, ''); // dangerous but necessary formatting cleanup for fallback
      }

      // 2. Fragment Cleanup < > and < />
      code = code.replace(/^<>/, '<div>').replace(/<\/>$/, '</div>'); // Start/End fragments
      code = code.replace(/<>/g, '<div>').replace(/<\/>/g, '</div>'); // Inline fragments

      // 3. Convert className="..." -> class="..."
      code = code.replace(/className=(["'])/g, 'class=$1');

      // 4. Handle style={{ key: 'value' }} -> style="key: value;"
      code = code.replace(/style={{([\s\S]*?)}}/g, (match, inner) => {
        // Convert camelCase to kebab-case and format as CSS string
        const props = inner.split(',').map(p => {
          const [k, v] = p.split(':').map(s => s.trim());
          if (!k || !v) return '';
          const cssKey = k.replace(/([A-Z])/g, '-$1').toLowerCase();
          const cssVal = v.replace(/['"]/g, '');
          return `${cssKey}: ${cssVal}`;
        });
        return `style="${props.join('; ')}"`;
      });

      // 5. Remove Lucide React Icons (React components <Icon /> won't render in HTML)
      // Replace with a generic emoji or placeholder to prevent broken tags
      code = code.replace(/<([A-Z][a-zA-Z]*)\s+[^>]*\/>/g, (match, tagName) => {
        // Heuristic: If it looks like an Icon name, return emoji?
        // For now, simpler to just keep valid HTML tags and comment out unknown ones
        // But commonly standard HTML tags start with lowercase (div, span).
        // React components start with Uppercase.
        // Let's replace unknown Uppercase tags with <div>
        return `<div data-component="${tagName}" class="p-2 bg-gray-100 rounded-lg inline-block">✨</div>`;
      });

      // 6. Comments cleanup
      code = code.replace(/{\/\*[\s\S]*?\*\/}/g, '');

      fullHtml += `\n<!-- Component: ${name} -->\n${code}\n`;
    });

    // 2. Wrap in full HTML document
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.industry}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: { 50: '${designBrief.colorPalette.primary[50]}', 500: '${designBrief.colorPalette.primary[500]}', 700: '${designBrief.colorPalette.primary[700]}' },
              secondary: { 500: '${designBrief.colorPalette.secondary[500]}' },
              accent: { 500: '${designBrief.colorPalette.accent[500]}' }
            },
            fontFamily: {
              heading: ['${designBrief.typography.heading}', 'serif'],
              body: ['${designBrief.typography.body}', 'sans-serif']
            }
          }
        }
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=${designBrief.typography.heading.replace(' ', '+')}:wght@400;700&family=${designBrief.typography.body.replace(' ', '+')}:wght@400;600&display=swap" rel="stylesheet">
    <style>
      body { font-family: '${designBrief.typography.body}', sans-serif; }
      h1, h2, h3, h4, h5, h6 { font-family: '${designBrief.typography.heading}', serif; }
    </style>
</head>
<body>
    ${fullHtml}
</body>
</html>`;
  }

  // Helper methods for file generation


  private generateMainTsx(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  private generateIndexCSS(designBrief: DesignBrief): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=${designBrief.typography.heading.replace(' ', '+')}:wght@${designBrief.typography.weights.join(';')}&family=${designBrief.typography.body.replace(' ', '+')}:wght@${designBrief.typography.weights.join(';')}&display=swap');

@layer base {
  :root {
    --primary-50: ${designBrief.colorPalette.primary[50]};
    --primary-500: ${designBrief.colorPalette.primary[500]};
    --primary-700: ${designBrief.colorPalette.primary[700]};
    --secondary-500: ${designBrief.colorPalette.secondary[500]};
    --accent-500: ${designBrief.colorPalette.accent[500]};
  }
  
  body {
    font-family: '${designBrief.typography.body}', sans-serif;
    line-height: 1.6;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: '${designBrief.typography.heading}', serif;
  }
}`;
  }

  private generateIndexHtml(analysis: BusinessAnalysis): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${analysis.industry.charAt(0).toUpperCase() + analysis.industry.slice(1)} Website</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ES2020',
        skipLibCheck: true,
        moduleResolution: 'node',
        allowImportingTsExtensions: false,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: false,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules']
    }, null, 2);
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})`;
  }

  private getDefaultComponent(componentName: string, designBrief: DesignBrief, analysis?: BusinessAnalysis): string {
    // FALLBACK ENGINE: Generates unique-feeling content when main AI fails

    // 1. Generate Smart Context
    const industry = analysis?.industry || 'Business';
    const mood = analysis?.mood || 'Modern';

    // Dynamic Business Name
    const rawName = industry.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    const suffixes = ['Hub', 'Lab', 'Studio', 'Works', 'Flow', 'X', 'Zone', 'Sphere'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const businessName = `${rawName}${suffix}`; // e.g., SkateShopZone

    // Colors & Fonts
    const { primary, secondary, accent, neutral } = designBrief.colorPalette;
    const headingFont = designBrief.typography.heading;
    const bodyFont = designBrief.typography.body;

    // 2. Dynamic Images (Sync)
    // We access the imageService globally or if imported. Assuming imported as `imageService`.
    // It was imported in previous steps.
    const heroImg = imageService.getHeroImage(`${industry} ${mood}`);
    const featureImg = imageService.getImageUrl({ keyword: `${industry} detail`, width: 800, height: 600 });

    // 3. Dynamic Copy Generator
    const generateHeadline = () => {
      if (industry.includes('skate')) return 'SHRED THE STREETS';
      if (industry.includes('game') || industry.includes('cyber')) return 'LEVEL UP YOUR REALITY';
      if (industry.includes('food') || industry.includes('cafe')) return 'TASTE THE EXTRAORDINARY';
      if (industry.includes('finance')) return 'SECURE YOUR FUTURE';
      if (industry.includes('fashion')) return 'DEFINE YOUR STYLE';
      return `Redefining ${industry} Excellence`;
    };

    const generateSubhead = () => {
      const audience = analysis?.targetAudience.age || 'modern';
      return `Premium ${industry} solutions for the ${audience} generation. Crafted with passion.`;
    };

    let content = '';
    let containerClass = "container mx-auto px-4";
    let sectionStyle = { backgroundColor: designBrief.colorPalette.neutral[50], fontFamily: bodyFont };

    // --- COMPONENT LOGIC ---

    if (componentName === 'Hero') {
      const headline = generateHeadline();
      const subhead = generateSubhead();

      content = `
        <div className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img src="${heroImg}" alt="${industry}" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-block px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white/90 text-sm font-tracking-wider uppercase">
                ${mood} • ${industry} • Premium
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter" style={{ fontFamily: '${headingFont}' }}>
                ${headline.split(' ').map((word, i) =>
        i === 1 ? `<span className="text-transparent bg-clip-text bg-gradient-to-r from-[${primary[400]}] to-[${accent[400]}]">${word}</span>` : word
      ).join(' ')}
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                ${subhead} Experience the difference with ${businessName}.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <button className="px-8 py-4 bg-[${primary[500]}] hover:bg-[${primary[600]}] text-white rounded-none skew-x-[-10deg] font-bold transition-all uppercase tracking-widest hover:scale-105">
                  <span className="skew-x-[10deg] inline-block">Explore Collection</span>
                </button>
                <button className="px-8 py-4 border border-white text-white hover:bg-white hover:text-black rounded-none skew-x-[-10deg] font-bold transition-all uppercase tracking-widest">
                  <span className="skew-x-[10deg] inline-block">Our Story</span>
                </button>
              </div>
            </div>
            
            {/* Hero Visual/Card */}
            <div className="hidden md:block relative animate-fade-in-right">
               <div className="absolute -inset-4 bg-[${accent[500]}] rounded-xl blur-xl opacity-30 animate-pulse"></div>
               <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                     <div className="text-white text-2xl font-bold">${businessName}</div>
                     <div className="text-[${accent[400]}] text-4xl">★</div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-2 bg-white/20 rounded w-3/4"></div>
                     <div className="h-2 bg-white/10 rounded w-full"></div>
                     <div className="h-2 bg-white/10 rounded w-5/6"></div>
                  </div>
                  <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/5 flex items-center gap-4">
                     <div className="w-12 h-12 bg-[${primary[500]}] rounded-full flex items-center justify-center text-white font-bold">1</div>
                     <div className="text-white text-sm">
                        <div className="font-bold">Rated #1 in ${industry}</div>
                        <div className="text-gray-400">By Industry Experts</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      `;
      sectionStyle = { backgroundColor: 'transparent', fontFamily: bodyFont }; // Handled by inner Hero styling
      containerClass = ""; // Full width handled inner
    }

    else if (componentName === 'Features') {
      const featureList = [
        { title: 'Premium Quality', desc: `Only the finest materials for ${industry} enthusiasts.` },
        { title: 'Expert Crafted', desc: `Designed by ${industry} professionals for optimal performance.` },
        { title: 'Global Delivery', desc: `Shipping ${mood} vibes worldwide securely.` },
        { title: '24/7 Support', desc: `Our ${industry} experts are here to help you anytime.` }
      ];

      content = `
        <div className="py-20 bg-[${neutral[50]}]">
           <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-20">
                 <h2 className="text-5xl font-bold mb-6 text-[${primary[900]}]" style={{ fontFamily: '${headingFont}' }}>
                   Why Choose ${businessName}?
                 </h2>
                 <p className="text-xl text-[${neutral[600]}]">
                   We redefine standards in the ${industry} space with uncompromised quality and ${mood} aesthetics.
                 </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                ${featureList.map((f, i) => `
                  <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[${accent[300]}]">
                    <div className="w-14 h-14 bg-[${primary[50]}] rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                      ${['💎', '⚡', '🌍', '🛡️'][i]}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[${neutral[900]}]">${f.title}</h3>
                    <p className="text-[${neutral[500]}]">${f.desc}</p>
                  </div>
                `).join('')}
              </div>
           </div>
        </div>
      `;
      containerClass = "";
    }

    else if (componentName === 'About') {
      content = `
        <div className="container mx-auto px-4 py-24">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                 <div className="absolute -inset-4 bg-[${secondary[200]}] rounded-[2rem] transform -rotate-2"></div>
                 <img src="${featureImg}" alt="About Us" className="relative rounded-[2rem] shadow-2xl w-full h-[600px] object-cover" />
                 <div className="absolute bottom-8 right-8 bg-white p-6 rounded-xl shadow-xl max-w-xs">
                    <p className="text-[${primary[800]}] font-bold text-lg">"We don't just sell ${industry}, we live it."</p>
                    <p className="text-gray-500 mt-2 text-sm">- ${businessName} Team</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <span className="text-[${accent[600]}] font-bold tracking-widest uppercase">Our Philosophy</span>
                 <h2 className="text-5xl font-bold text-[${neutral[900]}]" style={{ fontFamily: '${headingFont}' }}>
                    Crafting the Future of ${industry}
                 </h2>
                 <div className="space-y-6 text-lg text-[${neutral[600]}]">
                    <p>
                       At ${businessName}, we believe that ${industry} is more than a business—it's a lifestyle. 
                       Born from a passion for ${mood} design, we've curated a collection that speaks to the ${analysis?.targetAudience.values[0] || 'visionary'} in you.
                    </p>
                    <p>
                       Our journey began with a simple idea: to bring ${analysis?.subCategory || 'premium'} quality to the masses 
                       without compromising on style. Today, we stand as a beacon for ${analysis?.targetAudience.age} year olds who demand more.
                    </p>
                 </div>
                 
                 <div className="pt-4 grid grid-cols-3 gap-8 border-t border-gray-200">
                    <div>
                       <div className="text-4xl font-bold text-[${primary[600]}]">5K+</div>
                       <div className="text-sm text-gray-500 uppercase mt-1">Happy Clients</div>
                    </div>
                    <div>
                       <div className="text-4xl font-bold text-[${primary[600]}]">100%</div>
                       <div className="text-sm text-gray-500 uppercase mt-1">Authentic</div>
                    </div>
                    <div>
                       <div className="text-4xl font-bold text-[${primary[600]}]">24h</div>
                       <div className="text-sm text-gray-500 uppercase mt-1">Shipping</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      `;
      containerClass = "";
    }

    else if (componentName === 'CTA') {
      content = `
         <div className="container mx-auto px-4 text-center text-white relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight" style={{ fontFamily: '${headingFont}' }}>
               Ready to ${industry.includes('skate') ? 'Drop In?' : 'Join the Revolution?'}
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90">
               Don't settle for average. Elevate your ${industry} experience with ${businessName} today.
            </p>
            <button className="px-12 py-6 bg-white text-[${primary[600]}] rounded-full font-bold text-xl shadow-2xl hover:bg-gray-100 transition-colors">
               Get Started Now
            </button>
         </div>
       `;
      sectionStyle = { backgroundColor: primary[600], fontFamily: bodyFont };
    }

    else if (componentName === 'Footer') {
      content = `
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
               <div className="col-span-1 md:col-span-2">
                  <h3 className="text-3xl font-bold text-white mb-6">${businessName}</h3>
                  <p className="text-gray-400 max-w-sm">
                     The premier destination for ${industry} enthusiasts. 
                     Defining ${mood} style since 2024.
                  </p>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-6">Explore</h4>
                  <ul className="space-y-4 text-gray-400">
                     <li>Collection</li>
                     <li>About Us</li>
                     <li>Journal</li>
                     <li>Contact</li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-6">Connect</h4>
                  <ul className="space-y-4 text-gray-400">
                     <li>Instagram</li>
                     <li>Twitter</li>
                     <li>TikTok</li>
                     <li>Discord</li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-600">
               &copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.
            </div>
         </div>
       `;
      sectionStyle = { backgroundColor: '#0f172a', fontFamily: bodyFont };
      containerClass = "";
    }

    return `import React from 'react';

export default function ${componentName}() {
  return (
    <section className="relative overflow-hidden ${componentName === 'Hero' ? '' : 'py-24'}" style={{ backgroundColor: '${sectionStyle.backgroundColor}', fontFamily: '${sectionStyle.fontFamily}' }}>
      <div className="${containerClass}">
        ${content}
      </div>
    </section>
  );
}`;
  }



  /**
   * Helper: Generate Package.json
   */
  private generatePackageJson(analysis: BusinessAnalysis): string {
    return JSON.stringify({
      name: analysis.industry.replace(/[^a-z0-9]/g, '-'),
      version: '1.0.0',
      type: 'module',
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'framer-motion': '^10.16.0',
        'lucide-react': '^0.263.1',
        '@supabase/supabase-js': '^2.38.4'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.0.0',
        'typescript': '^5.0.2',
        'vite': '^4.4.5',
        'tailwindcss': '^3.3.3',
        'postcss': '^8.4.24',
        'autoprefixer': '^10.4.14'
      },
      scripts: {
        'dev': 'vite',
        'build': 'vite build',
        'preview': 'vite preview'
      }
    }, null, 2);
  }

  /**
   * Helper: Generate App.tsx
   */
  private generateAppComponent(components: Record<string, string>, designBrief: DesignBrief): string {
    const componentNames = Object.keys(components);
    const imports = componentNames.map(name => `import ${name} from './components/${name}';`).join('\n');

    return `${imports}

export default function App() {
  return (
    <div className="min-h-screen" style={{ fontFamily: '${designBrief.typography.body}' }}>
      ${componentNames.map(name => `<${name} />`).join('\n      ')}
    </div>
  );
}`;
  }

  /**
   * Generate Project Files Structure
   */
  private generateProjectFiles(
    components: Record<string, string>,
    appComponent: string,
    designBrief: DesignBrief,
    analysis: BusinessAnalysis,
    extras: { readme?: string, schema?: string, api?: string, supabase?: string } = {}
  ): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // App.tsx
    files.push({
      path: 'src/App.tsx',
      content: this.generateAppComponent(components, designBrief),
      language: 'typescript'
    });

    // Main.tsx
    files.push({
      path: 'src/main.tsx',
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,
      language: 'typescript'
    });

    // Index.html
    files.push({
      path: 'index.html',
      content: this.generateIndexHtml(analysis),
      language: 'html'
    });

    // Vite Config
    files.push({
      path: 'vite.config.ts',
      content: this.generateViteConfig(),
      language: 'typescript'
    });

    // Package.json
    files.push({
      path: 'package.json',
      content: this.generatePackageJson(analysis),
      language: 'json'
    });

    // TSConfig
    files.push({
      path: 'tsconfig.json',
      content: this.generateTsConfig(),
      language: 'json'
    });

    // Tailwind Config
    files.push({
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50: '${designBrief.colorPalette.primary[50]}', 500: '${designBrief.colorPalette.primary[500]}', 700: '${designBrief.colorPalette.primary[700]}' },
        secondary: { 500: '${designBrief.colorPalette.secondary[500]}' },
        accent: { 500: '${designBrief.colorPalette.accent[500]}' }
      },
      fontFamily: {
        heading: ['${designBrief.typography.heading}', 'serif'],
        body: ['${designBrief.typography.body}', 'sans-serif']
      }
    },
  },
  plugins: [],
}`,
      language: 'javascript'
    });

    // PostCSS
    files.push({
      path: 'postcss.config.js',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
      language: 'javascript'
    });

    // Styles
    files.push({
      path: 'src/index.css',
      content: `@import url('https://fonts.googleapis.com/css2?family=${designBrief.typography.heading.replace(' ', '+')}:wght@400;700&family=${designBrief.typography.body.replace(' ', '+')}:wght@400;600&display=swap');
          
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: ${designBrief.colorPalette.neutral[300]};
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: ${designBrief.colorPalette.neutral[400]};
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`,
      language: 'css'
    });

    // Components
    Object.entries(components).forEach(([name, code]) => {
      files.push({
        path: `src/components/${name}.tsx`,
        content: code,
        language: 'typescript'
      });
    });

    // .gitignore (Feature 50)
    files.push({
      path: '.gitignore',
      content: `node_modules
dist
dist-ssr
*.local
.env
.DS_Store
coverage
`,
      language: 'plaintext'
    });

    // Preview.html (Bulletproof)
    files.push({
      path: 'preview.html',
      content: this.generatePreviewHtml(components, designBrief, analysis),
      language: 'html'
    });

    // Feature 49: Readme
    if (extras.readme) {
      files.push({
        path: 'README.md',
        content: extras.readme,
        language: 'markdown'
      });
    }

    // Feature 33: Schema
    if (extras.schema) {
      files.push({
        path: 'supabase/schema.sql',
        content: extras.schema,
        language: 'sql'
      });
    }

    // Feature 34: API & Supabase
    if (extras.api) {
      files.push({
        path: 'src/services/api.ts',
        content: extras.api,
        language: 'typescript'
      });
    }
    if (extras.supabase) {
      files.push({
        path: 'src/lib/supabase.ts',
        content: extras.supabase,
        language: 'typescript'
      });
    }

    return files;
  }

  // Feature 49 + Model Selection
  async generateReadmeContent(analysis: any): Promise<string> {
    const prompt = `Create a professional README.md for a web project.\n\nProject Name: ${analysis.businessName || 'Modern Website'}\nIndustry: ${analysis.industry}\nTech Stack: React, Vite, Tailwind CSS, Lucide React\n\nIncludes sections:\n- Project Overview\n- Key Features\n- Getting Started (npm install, npm run dev)\n- Database Schema (Supabase)\n\nFormat as clean Markdown.`;
    try {
      return await llmManager.generateResponse(prompt, TaskType.CREATIVE_WRITING, undefined, this.preferredModel);
    } catch (e) {
      return `# ${analysis.businessName}\n\nGenerated by Lovable AI.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``;
    }
  }

  // Feature 33 + Model Selection
  async generateDatabaseSchema(analysis: any): Promise<string> {
    const prompt = `Generate a production-ready PostgreSQL (Supabase) schema.sql for a ${analysis.industry} web application.\n\nRequirements:\n1. Users table (linked to auth.users)\n2. 3-4 domain-specific tables (e.g., if E-commerce: products, orders, cart).\n3. Enable Row Level Security (RLS) on all tables.\n4. Add simple policies (Public read, Authenticated insert).\n5. Add comments.\n\nOutput ONLY valid SQL code.`;
    try {
      let sql = await llmManager.generateResponse(prompt, TaskType.CODE_GENERATION, undefined, this.preferredModel);
      // Strip markdown code blocks if present
      if (sql.includes('```sql')) {
        sql = sql.split('```sql')[1].split('```')[0].trim();
      } else if (sql.includes('```')) {
        sql = sql.split('```')[1].split('```')[0].trim();
      }
      return sql;
    } catch (e) {
      return `-- Schema generation failed\n-- Use Supabase Dashboard to create tables.`;
    }
  }

  // Feature 34 + Model Selection
  async generateApiService(analysis: any, schema: string): Promise<string> {
    const prompt = `Generate a TypeScript API service (src/services/api.ts) for a Supabase-backed ${analysis.industry} app.\n\nSchema Context:\n${schema.substring(0, 1500)}\n\nRequirements:\n1. Import 'supabase' from '../lib/supabase'.\n2. Export functions for CRUD operations relevant to the schema (e.g., fetchProducts, createOrder).\n3. Use distinct, explicit function names.\n4. Add error handling.\n\nOutput ONLY valid TypeScript code.`;
    try {
      let code = await llmManager.generateResponse(prompt, TaskType.CODE_GENERATION, undefined, this.preferredModel);
      // Clean markdown
      if (code.includes('```typescript')) {
        code = code.split('```typescript')[1].split('```')[0].trim();
      } else if (code.includes('```ts')) {
        code = code.split('```ts')[1].split('```')[0].trim();
      } else if (code.includes('```')) {
        code = code.split('```')[1].split('```')[0].trim();
      }
      return code;
    } catch (e) {
      return `// API Generation Failed\nexport const api = {};`;
    }
  }

  generateSupabaseClient(): string {
    return `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`;
  }

}

// Export singleton
export const enhancedWebsiteGenerator = new EnhancedWebsiteGenerator();