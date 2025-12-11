import { supabase } from '@/lib/supabase';

// Database interfaces
export interface App {
  id: string;
  user_id: string;
  name: string;
  url: string;
  description?: string;
  status: 'Draft' | 'Published' | 'Unpublished';
  visibility: 'Public' | 'Private';
  starred: boolean;
  last_accessed: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  app_id: string;
  user_id: string;
  message_text: string;
  files: string[];
  ai_response: any;
  created_at: string;
  message_type?: 'generation' | 'discussion'; // Optional field with fallback
}

export interface WebsiteGeneration {
  id: string;
  app_id: string;
  user_id: string;
  prompt: string;
  html: string;
  css: string;
  js: string;
  created_at: string;
}

export interface Deployment {
  id: string;
  app_id: string;
  user_id: string;
  deployment_id: string;
  url?: string;
  status: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  platform: 'vercel' | 'netlify';
  created_at: string;
  updated_at: string;
}

// Smart app name generator
function generateAppName(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract key concepts and create smart names
  const concepts = {
    'ecommerce|shop|store|marketplace': ['ShopHub', 'MarketFlow', 'StoreCraft', 'TradeSpot', 'RetailGenius'],
    'portfolio|showcase|gallery|creative': ['PortfolioX', 'CreativeHub', 'ShowcasePro', 'ArtisanSpace', 'DesignFlow'],
    'blog|content|writing|article': ['BlogCraft', 'ContentHub', 'WriteSpace', 'ArticleFlow', 'PenPoint'],
    'social|community|network|connect': ['SocialHub', 'ConnectSphere', 'CommunityFlow', 'NetworkPro', 'LinkUp'],
    'business|corporate|company|startup': ['BizHub', 'CorpFlow', 'StartupX', 'EnterprisePro', 'TradeCraft'],
    'education|learning|course|academy': ['EduHub', 'LearnFlow', 'AcademyX', 'SkillCraft', 'KnowledgePro'],
    'health|fitness|wellness|medical': ['HealthHub', 'FitFlow', 'WellnessX', 'MediCare', 'VitalCraft'],
    'travel|tourism|adventure|explore': ['TravelHub', 'WanderFlow', 'AdventureX', 'TourCraft', 'ExplorePro'],
    'restaurant|food|dining|culinary': ['FoodHub', 'DineFlow', 'TasteX', 'CulinaryCraft', 'RestaurantPro'],
    'finance|banking|investment|money': ['FinanceHub', 'MoneyFlow', 'InvestX', 'WealthCraft', 'BankPro'],
    'real estate|property|housing|home': ['PropertyHub', 'HomeFlow', 'EstateX', 'RealtyCraft', 'HousingPro'],
    'technology|software|app|digital': ['TechHub', 'DigitalFlow', 'AppX', 'SoftwareCraft', 'InnovationPro'],
    'entertainment|media|gaming|fun': ['MediaHub', 'EntertainFlow', 'GameX', 'FunCraft', 'PlayPro'],
    'nonprofit|charity|organization|cause': ['CauseHub', 'CharityFlow', 'OrgX', 'NonProfitCraft', 'MissionPro'],
    'personal|cv|resume|profile': ['ProfileHub', 'ResumeFlow', 'PersonalX', 'CVCraft', 'IdentityPro']
  };
  
  // Find matching category
  for (const [category, names] of Object.entries(concepts)) {
    if (new RegExp(category).test(lowerPrompt)) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const suffix = Math.floor(Math.random() * 999) + 1;
      return `${randomName}${suffix}`;
    }
  }
  
  // Fallback: Generate from keywords
  const keywords = lowerPrompt.match(/\b[a-z]+\b/g) || [];
  const adjectives = ['Smart', 'Pro', 'Hub', 'Flow', 'X', 'Craft', 'Genius', 'Spot', 'Space', 'Point'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomKeyword = keywords.length > 0 ? 
    keywords[Math.floor(Math.random() * Math.min(keywords.length, 3))] : 
    'Site';
  const suffix = Math.floor(Math.random() * 999) + 1;
  
  return `${randomAdj}${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)}${suffix}`;
}

// Generate URL-friendly slug from app name
function generateAppUrl(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Math.floor(Math.random() * 999);
}

// AI Assistant Service
class AIAssistantService {
  private apiKey: string;
  
  constructor() {
    // Use one of the provided API keys
    this.apiKey = 'sk-proj-2TlPnQyF8fXJ4K3mV9rH6tY5uI7wOpQsR1zX3cV8bN5mF2jK4lP6qW9eY3tA7';
  }

  async discussCode(context: {
    currentCode?: { html: string; css: string; js: string };
    userMessage: string;
    appHistory?: ChatMessage[];
  }): Promise<string> {
    console.log('🧠 AI Assistant: discussCode called'); // Debug log
    const prompt = this.buildDiscussionPrompt(context);
    console.log('📝 Prompt built:', prompt.substring(0, 200) + '...'); // Debug log
    
    try {
      console.log('🌐 Calling OpenAI API for discussion only...'); // Debug log
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert web development assistant and mentor. You help users understand their code, suggest improvements, and discuss development decisions. 

CRITICAL RULES:
- NEVER write code, HTML, CSS, or JavaScript
- NEVER modify files or suggest code changes
- ONLY provide guidance, explanations, and suggestions
- Discuss concepts, best practices, and ideas
- Be helpful, educational, and encouraging
- If asked for code, explain how to approach it instead of writing it

Your role is to be a conversational mentor, not a code generator.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      console.log('📡 API Response status:', response.status); // Debug log
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 API Data received'); // Debug log
      
      const result = data.choices[0]?.message?.content || 'I apologize, but I couldn\'t process your request.';
      console.log('✅ Discussion response generated (no code)'); // Debug log
      
      return result;
    } catch (error) {
      console.error('❌ AI Assistant error:', error);
      
      // Fallback response when API fails
      return `I'm having trouble connecting to my AI services right now, but I can still help! 

Based on your question: "${context.userMessage}"

Here are some general suggestions:
- If you're asking about layout improvements, consider using CSS Grid or Flexbox for better responsive design
- For performance, optimize images and minimize JavaScript bundles
- For accessibility, add proper ARIA labels and semantic HTML elements
- For user experience, ensure clear navigation and fast load times

Remember: I'm here to discuss ideas and guide you, not write code. Would you like to talk through any specific aspects of your website?`;
    }
  }

  private buildDiscussionPrompt(context: {
    currentCode?: { html: string; css: string; js: string };
    userMessage: string;
    appHistory?: ChatMessage[];
  }): string {
    let prompt = `User Question: ${context.userMessage}\n\n`;

    if (context.currentCode) {
      prompt += `Current Website (for context only - DO NOT generate code):\n`;
      prompt += `The user has a website with HTML, CSS, and JavaScript components.\n`;
      prompt += `They want to discuss ideas, improvements, or concepts about their website.\n\n`;
    }

    if (context.appHistory && context.appHistory.length > 0) {
      prompt += `Recent Development History:\n`;
      context.appHistory.slice(-3).forEach((msg, index) => {
        prompt += `${index + 1}. User asked: "${msg.message_text}"\n`;
        if (msg.ai_response) {
          prompt += `   AI: Provided guidance and suggestions\n`;
        }
      });
    }

    prompt += `\nIMPORTANT: Your role is to be a conversational mentor. Discuss ideas, explain concepts, suggest approaches, but NEVER write actual code. If they ask for code, explain the approach and best practices instead.

Provide helpful, educational guidance about their website project.`;

    return prompt;
  }

  async reviewCode(code: { html: string; css: string; js: string }): Promise<{
    overall: string;
    html: string;
    css: string;
    js: string;
    suggestions: string[];
  }> {
    const prompt = `Please review this website code and provide detailed feedback:\n\nHTML:\n${code.html}\n\nCSS:\n${code.css}\n\nJavaScript:\n${code.js}\n\nProvide feedback in JSON format with: overall assessment, html feedback, css feedback, js feedback, and improvement suggestions array.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert code reviewer. Always respond with valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        return JSON.parse(content || '{}');
      } catch {
        return {
          overall: content || 'Unable to review code at this time.',
          html: '',
          css: '',
          js: '',
          suggestions: []
        };
      }
    } catch (error) {
      console.error('Code review error:', error);
      return {
        overall: 'Unable to review code at this time.',
        html: '',
        css: '',
        js: '',
        suggestions: []
      };
    }
  }
}

class DatabaseService {
  private aiAssistant = new AIAssistantService();
  // Apps CRUD operations
  async createApp(userId: string, prompt: string, visibility: 'Public' | 'Private' = 'Public'): Promise<App> {
    // Generate smart app name from prompt
    const appName = generateAppName(prompt);
    const appUrl = generateAppUrl(appName);
    
    const { data, error } = await supabase
      .from('apps')
      .insert({
        user_id: userId,
        name: appName,
        url: appUrl,
        description: prompt.substring(0, 200), // Store original prompt as description
        visibility,
        status: 'Draft',
        starred: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserApps(userId: string): Promise<App[]> {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getApp(appId: string, userId: string): Promise<App | null> {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('id', appId)
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  async updateApp(appId: string, userId: string, updates: Partial<App>): Promise<App> {
    const { data, error } = await supabase
      .from('apps')
      .update(updates)
      .eq('id', appId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteApp(appId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', appId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async toggleStar(appId: string, userId: string): Promise<App> {
    const app = await this.getApp(appId, userId);
    if (!app) throw new Error('App not found');

    return this.updateApp(appId, userId, { starred: !app.starred });
  }

  async updateLastAccessed(appId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('apps')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', appId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getStarredApps(userId: string): Promise<App[]> {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('user_id', userId)
      .eq('starred', true)
      .order('last_accessed', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Chat Messages CRUD operations
  async saveChatMessage(appId: string, userId: string, message: string, files: string[], aiResponse: any, messageType: 'generation' | 'discussion' = 'generation'): Promise<ChatMessage> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          app_id: appId,
          user_id: userId,
          message_text: message,
          files,
          ai_response: aiResponse,
          message_type: messageType
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      // If message_type column doesn't exist, try without it
      if (error.message && error.message.includes('message_type')) {
        console.log('message_type column not found, using fallback');
        const { data, error: fallbackError } = await supabase
          .from('chat_messages')
          .insert({
            app_id: appId,
            user_id: userId,
            message_text: message,
            files,
            ai_response: aiResponse
          })
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        return data;
      }
      throw error;
    }
  }

  async getAppChatMessages(appId: string, userId: string, messageType?: 'generation' | 'discussion'): Promise<ChatMessage[]> {
    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .eq('app_id', appId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (messageType) {
        query = query.eq('message_type', messageType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      // If message_type column doesn't exist, get all messages
      if (error.message && error.message.includes('message_type')) {
        console.log('message_type column not found, getting all messages');
        const { data, error: fallbackError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('app_id', appId)
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (fallbackError) throw fallbackError;
        return data || [];
      }
      throw error;
    }
  }

  async deleteChatMessages(appId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('app_id', appId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Website Generations CRUD operations
  async saveWebsiteGeneration(appId: string, userId: string, html: string, css: string, js: string, prompt: string): Promise<WebsiteGeneration> {
    console.log('💾 saveWebsiteGeneration called:', {
      appId,
      userId,
      htmlLength: html.length,
      cssLength: css.length,
      jsLength: js.length,
      promptLength: prompt.length
    });
    
    const { data, error } = await supabase
      .from('website_generations')
      .insert({
        app_id: appId,
        user_id: userId,
        html,
        css,
        js,
        prompt
      })
      .select()
      .single();

    if (error) {
      console.error('❌ saveWebsiteGeneration error:', error);
      throw error;
    }
    
    console.log('✅ saveWebsiteGeneration success:', data.id);
    return data;
  }

  async getWebsiteGenerations(appId: string, userId: string): Promise<WebsiteGeneration[]> {
    const { data, error } = await supabase
      .from('website_generations')
      .select('*')
      .eq('app_id', appId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getLatestWebsiteGeneration(appId: string, userId: string): Promise<WebsiteGeneration | null> {
    console.log('🔍 getLatestWebsiteGeneration called:', { appId, userId });
    
    const { data, error } = await supabase
      .from('website_generations')
      .select('*')
      .eq('app_id', appId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle zero rows gracefully

    if (error) {
      console.error('❌ getLatestWebsiteGeneration error:', error.message, error.code);
      return null;
    }
    
    if (!data) {
      console.log('ℹ️ No generations found (expected for new apps)');
      return null;
    }
    
    console.log('✅ getLatestWebsiteGeneration success: Found');
    return data;
  }

  async deleteWebsiteGenerations(appId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('website_generations')
      .delete()
      .eq('app_id', appId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // AI Assistant methods
  async discussWithAI(appId: string, userId: string, message: string, currentCode?: { html: string; css: string; js: string }): Promise<string> {
    console.log('🤖 Database: discussWithAI called'); // Debug log
    console.log('📱 AppId:', appId); // Debug log
    console.log('👤 UserId:', userId); // Debug log
    console.log('💬 Message:', message); // Debug log
    
    // Get recent chat history for context
    const history = await this.getAppChatMessages(appId, userId, 'generation');
    console.log('📚 History length:', history.length); // Debug log
    
    const response = await this.aiAssistant.discussCode({
      currentCode,
      userMessage: message,
      appHistory: history
    });

    console.log('✨ AI Response received:', response.substring(0, 100) + '...'); // Debug log

    // Save discussion message
    await this.saveChatMessage(appId, userId, message, [], response, 'discussion');
    console.log('💾 Discussion message saved'); // Debug log

    return response;
  }

  async reviewCurrentCode(_appId: string, _userId: string, code: { html: string; css: string; js: string }): Promise<{
    overall: string;
    html: string;
    css: string;
    js: string;
    suggestions: string[];
  }> {
    return this.aiAssistant.reviewCode(code);
  }

  // ============================================================================
  // DEPLOYMENT METHODS
  // ============================================================================

  /**
   * Save deployment record
   */
  async saveDeployment(
    appId: string,
    userId: string,
    deploymentId: string,
    platform: 'vercel' | 'netlify',
    status: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED',
    url?: string
  ): Promise<Deployment> {
    console.log('💾 saveDeployment called:', { appId, userId, deploymentId, platform, status, url });
    
    const { data, error } = await supabase
      .from('deployments')
      .insert({
        app_id: appId,
        user_id: userId,
        deployment_id: deploymentId,
        platform,
        status,
        url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ saveDeployment error:', error);
      throw new Error(`Failed to save deployment: ${error.message}`);
    }

    console.log('✅ saveDeployment success:', data.id);
    return data;
  }

  /**
   * Update deployment status
   */
  async updateDeploymentStatus(
    deploymentId: string,
    status: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED',
    url?: string
  ): Promise<void> {
    console.log('🔄 updateDeploymentStatus called:', { deploymentId, status, url });
    
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (url) {
      updateData.url = url;
    }
    
    const { error } = await supabase
      .from('deployments')
      .update(updateData)
      .eq('deployment_id', deploymentId);

    if (error) {
      console.error('❌ updateDeploymentStatus error:', error);
      throw new Error(`Failed to update deployment status: ${error.message}`);
    }

    console.log('✅ updateDeploymentStatus success');
  }

  /**
   * Get deployments for an app
   */
  async getAppDeployments(appId: string, userId: string): Promise<Deployment[]> {
    console.log('🔍 getAppDeployments called:', { appId, userId });
    
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('app_id', appId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ getAppDeployments error:', error);
      return [];
    }

    console.log('✅ getAppDeployments success:', data.length, 'deployments');
    return data || [];
  }

  /**
   * Get latest deployment for an app
   */
  async getLatestDeployment(appId: string, userId: string): Promise<Deployment | null> {
    console.log('🔍 getLatestDeployment called:', { appId, userId });
    
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('app_id', appId)
      .eq('user_id', userId)
      .eq('status', 'READY')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ No deployments found (expected for new apps)');
        return null;
      }
      console.error('❌ getLatestDeployment error:', error);
      return null;
    }

    console.log('✅ getLatestDeployment success:', data ? 'Found' : 'Not found');
    return data;
  }

  /**
   * Delete deployment
   */
  async deleteDeployment(deploymentId: string, userId: string): Promise<void> {
    console.log('🗑️ deleteDeployment called:', { deploymentId, userId });
    
    const { error } = await supabase
      .from('deployments')
      .delete()
      .eq('deployment_id', deploymentId)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ deleteDeployment error:', error);
      throw new Error(`Failed to delete deployment: ${error.message}`);
    }

    console.log('✅ deleteDeployment success');
  }
}

export const databaseService = new DatabaseService();
