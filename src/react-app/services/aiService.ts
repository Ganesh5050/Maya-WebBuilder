interface AIResponse {
  html: string;
  css: string;
  js: string;
  explanation: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private openaiApiKey: string;
  private geminiApiKey: string;

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.geminiApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
  }

  async generateWebsite(prompt: string, attachedFiles: File[] = []): Promise<AIResponse> {
    try {
      // Prepare the system message
      const systemMessage: Message = {
        role: 'system',
        content: `You are an expert web developer and UI/UX designer. Generate complete, modern, and responsive websites based on user prompts.

Rules:
1. Return ONLY valid HTML, CSS, and JavaScript code
2. Use modern CSS with flexbox/grid
3. Make it responsive for mobile and desktop
4. Include hover effects and smooth transitions
5. Use semantic HTML5 elements
6. Add micro-interactions and animations
7. If images are referenced, use placeholder URLs from picsum.photos
8. Focus on clean, professional design
9. Include proper accessibility attributes

Response format:
{
  "html": "complete HTML code",
  "css": "complete CSS code", 
  "js": "complete JavaScript code",
  "explanation": "brief description of what was built"
}`
      };

      // Prepare user message with file descriptions
      let userContent = `Generate a website based on this prompt: "${prompt}"`;
      
      if (attachedFiles.length > 0) {
        userContent += '\n\nThe user has attached these reference images:';
        attachedFiles.forEach((file, index) => {
          userContent += `\n${index + 1}. ${file.name} (${file.type})`;
        });
        userContent += '\n\nUse these as visual references for the design style and layout.';
      }

      const userMessage: Message = {
        role: 'user',
        content: userContent
      };

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using cheaper model for cost efficiency
          messages: [systemMessage, userMessage],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Parse the JSON response
      try {
        const parsed = JSON.parse(aiResponse);
        return parsed;
      } catch (parseError) {
        // If JSON parsing fails, create a structured response from the text
        return {
          html: this.extractCode(aiResponse, 'html') || '<div><h1>Generated Website</h1><p>Your website has been generated!</p></div>',
          css: this.extractCode(aiResponse, 'css') || 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }',
          js: this.extractCode(aiResponse, 'javascript') || 'console.log("Website loaded");',
          explanation: 'Generated website based on your prompt'
        };
      }

    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  private extractCode(text: string, language: string): string | null {
    const regex = new RegExp(`\`\`\`${language}\\n([\\s\\S]*?)\\n\`\`\``, 'i');
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  // Alternative method using Gemini if OpenAI fails
  async generateWebsiteWithGemini(prompt: string, attachedFiles: File[] = []): Promise<AIResponse> {
    try {
      let userContent = `Generate a complete website with HTML, CSS, and JavaScript based on: "${prompt}"`;
      
      if (attachedFiles.length > 0) {
        userContent += '\n\nReference images attached: ' + attachedFiles.map(f => f.name).join(', ');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userContent
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      return {
        html: this.extractCode(aiResponse, 'html') || '<div><h1>Generated Website</h1></div>',
        css: this.extractCode(aiResponse, 'css') || 'body { font-family: Arial; }',
        js: this.extractCode(aiResponse, 'javascript') || 'console.log("Loaded");',
        explanation: 'Generated with Gemini'
      };

    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }
}

export default AIService;
