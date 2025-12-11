# Bolt.diy Implementation Plan for Website Builder

## Executive Summary
This document outlines how we're implementing Bolt.diy-style features into our website builder while maintaining the existing React frontend unchanged.

## Current State vs Bolt.diy Comparison

| Feature | Our Current State | Bolt.diy | Implementation Plan |
|---------|-------------------|----------|-------------------|
| Frontend | ✅ Beautiful React UI | ✅ Similar | **NO CHANGES** |
| AI Integration | ❌ Static templates | ✅ Multi-LLM | ✅ Backend implementation |
| Template System | ❌ One generic template | ✅ Multiple templates | ✅ Add template library |
| Prompt Analysis | ❌ None | ✅ Smart analysis | ✅ Add prompt analyzer |
| WebContainer | ❌ None | ✅ Live execution | 🔄 Future Phase 2 |
| Deployment | ❌ None | ✅ Multiple platforms | 🔄 Future Phase 2 |
| File Management | ❌ None | ✅ Version control | 🔄 Future Phase 2 |

## Phase 1: Core Intelligence (Backend Only)

### 1.1 Prompt Analyzer (`/src/services/promptAnalyzer.js`)
**Purpose**: Extract intent and keywords from user prompts
**Similar to**: Bolt.diy's prompt analysis system

```javascript
// Example functionality
analyzePrompt("I need a portfolio website for my photography business")
// Returns: {
//   type: "portfolio",
//   industry: "photography",
//   features: ["gallery", "about", "contact"],
//   style: "visual",
//   confidence: 0.95
// }
```

**Keyword Mapping**:
- Portfolio: ["portfolio", "gallery", "showcase", "work", "projects"]
- Business: ["business", "company", "agency", "consultant", "services"]
- Restaurant: ["restaurant", "cafe", "food", "menu", "dining"]
- E-commerce: ["shop", "store", "sell", "products", "buy"]
- Blog: ["blog", "articles", "content", "posts", "writing"]

### 1.2 Template Engine (`/src/services/templateEngine.js`)
**Purpose**: Select appropriate template based on analysis
**Similar to**: Bolt.diy's template scaffolding

```javascript
// Template selection logic
selectTemplate(analysisResult) {
  if (analysisResult.type === "portfolio") return "portfolio.html";
  if (analysisResult.type === "business") return "business.html";
  // ... etc
}
```

### 1.3 Content Generator (`/src/services/contentGenerator.js`)
**Purpose**: Use AI to generate unique content for templates
**Similar to**: Bolt.diy's AI-powered code generation

```javascript
// AI content generation
generateContent(prompt, template, analysis) {
  // Use your AI API key to generate:
  // - Industry-specific copy
  // - Relevant color schemes
  // - Appropriate section content
  // - SEO metadata
}
```

### 1.4 Website Builder (`/src/services/websiteBuilder.js`)
**Purpose**: Orchestrate the entire process
**Similar to**: Bolt.diy's main generation engine

```javascript
async generateSmartWebsite(prompt) {
  // 1. Analyze prompt
  const analysis = await promptAnalyzer.analyze(prompt);
  
  // 2. Select template
  const template = await templateEngine.select(analysis);
  
  // 3. Generate AI content
  const content = await contentGenerator.generate(prompt, template, analysis);
  
  // 4. Combine template + content
  const website = await combineTemplateAndContent(template, content);
  
  return website;
}
```

## Phase 2: Advanced Features (Future)

### 2.1 WebContainer Integration
**Bolt.diy Feature**: Live code execution in browser
**Our Plan**: Add WebContainer for real-time editing
**Frontend Impact**: New "Edit" tab, no changes to existing UI

### 2.2 Deployment Options
**Bolt.diy Feature**: Netlify, Vercel, GitHub Pages deployment
**Our Plan**: Add deployment buttons to existing interface
**Frontend Impact**: New section in sidebar, no changes to core UI

### 2.3 File Management
**Bolt.diy Feature**: Version control, file locking, diff view
**Our Plan**: Add version history and export options
**Frontend Impact**: New modal/panel, no changes to main interface

## Template Library Structure

### Portfolio Template (`/src/templates/portfolio.html`)
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{COMPANY_NAME}} - {{INDUSTRY}} Portfolio</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <style>{{CUSTOM_STYLES}}</style>
</head>
<body>
  <nav>{{NAVIGATION}}</nav>
  <hero>{{HERO_SECTION}}</hero>
  <gallery>{{GALLERY_ITEMS}}</gallery>
  <about>{{ABOUT_CONTENT}}</about>
  <contact>{{CONTACT_FORM}}</contact>
</body>
</html>
```

### Business Template (`/src/templates/business.html`)
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{COMPANY_NAME}} - {{BUSINESS_TYPE}}</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <style>{{CUSTOM_STYLES}}</style>
</head>
<body>
  <nav>{{NAVIGATION}}</nav>
  <hero>{{HERO_SECTION}}</hero>
  <services>{{SERVICES_LIST}}</services>
  <testimonials>{{TESTIMONIALS}}</testimonials>
  <about>{{ABOUT_CONTENT}}</about>
  <contact>{{CONTACT_FORM}}</contact>
</body>
</html>
```

## Frontend Integration Strategy

### Current Function in AppBuilder.tsx
```javascript
const generateRealisticAIWebsite = (request: string): string => {
  // Currently returns static template
};
```

### New Function (Backend Integration)
```javascript
const generateSmartWebsite = async (request: string): Promise<string> => {
  // Import our new backend service
  const { generateSmartWebsite } = await import('../services/websiteBuilder');
  return await generateSmartWebsite(request);
};
```

### Integration Steps
1. ✅ **Keep existing function** (no breaking changes)
2. ✅ **Add new import** for backend service
3. ✅ **Replace function call** in one place
4. ✅ **Test thoroughly** with existing UI

## AI Provider Configuration

### Configuration File (`/src/config/aiProviders.js`)
```javascript
export const AI_PROVIDERS = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-sonnet-20240229',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  google: {
    apiKey: process.env.GOOGLE_AI_API_KEY,
    model: 'gemini-pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  }
};

export const CURRENT_PROVIDER = 'openai'; // Can be changed dynamically
```

## Content Generation Prompts

### Portfolio Content Prompt
```
Generate content for a photography portfolio website:
- Industry: {{INDUSTRY}}
- Style: {{STYLE}}
- Features: {{FEATURES}}

Create:
1. Hero section with compelling headline
2. About section with photographer bio
3. Gallery descriptions (3-5 projects)
4. Contact information
5. SEO metadata

Tone: Professional, visual, artistic
Length: Concise, impactful
```

### Business Content Prompt
```
Generate content for a business website:
- Industry: {{INDUSTRY}}
- Company type: {{BUSINESS_TYPE}}
- Services: {{SERVICES}}

Create:
1. Hero section with value proposition
2. Services descriptions (3-5 services)
3. About company story
4. Client testimonials
5. Contact information
6. SEO metadata

Tone: Professional, trustworthy, results-oriented
Length: Business-appropriate, comprehensive
```

## Testing Strategy

### Backend Testing (No Frontend Impact)
```javascript
// Test prompt analysis
test('Portfolio prompt analysis', () => {
  const result = analyzePrompt("portfolio website for photographer");
  expect(result.type).toBe('portfolio');
  expect(result.industry).toBe('photography');
});

// Test template selection
test('Template selection', () => {
  const template = selectTemplate({ type: 'portfolio' });
  expect(template).toBe('portfolio.html');
});

// Test content generation
test('AI content generation', async () => {
  const content = await generateContent('photography portfolio', 'portfolio.html', {});
  expect(content).toContain('gallery');
});
```

### Integration Testing
```javascript
// Test full pipeline
test('Full website generation', async () => {
  const website = await generateSmartWebsite("portfolio for photographer");
  expect(website).toContain('<!DOCTYPE html>');
  expect(website).toContain('gallery');
  expect(website).toContain('portfolio');
});
```

## Performance Considerations

### Response Time Targets
- Prompt Analysis: < 100ms
- Template Selection: < 50ms
- AI Content Generation: < 5000ms
- Total Generation: < 6000ms

### Caching Strategy
```javascript
// Cache template analysis results
const analysisCache = new Map();

// Cache AI-generated content for similar prompts
const contentCache = new Map();

// Cache rendered templates
const templateCache = new Map();
```

## Error Handling

### Fallback Strategy
```javascript
async function generateSmartWebsite(prompt) {
  try {
    // Try AI generation first
    return await aiGeneration(prompt);
  } catch (error) {
    console.error('AI generation failed:', error);
    // Fallback to improved static template
    return await generateEnhancedTemplate(prompt);
  }
}
```

## Monitoring and Analytics

### Metrics to Track
- Prompt analysis accuracy
- Template selection success rate
- AI content generation time
- User satisfaction scores
- Error rates by provider

### Logging Strategy
```javascript
// Log generation attempts
logger.info('Website generation started', { 
  prompt: prompt.substring(0, 100),
  timestamp: new Date().toISOString()
});

// Log results
logger.info('Website generated', {
  template: result.template,
  contentLength: result.content.length,
  generationTime: Date.now() - startTime
});
```

## Security Considerations

### API Key Management
- Store API keys in environment variables
- Rotate keys regularly
- Monitor API usage for anomalies
- Implement rate limiting

### Content Sanitization
- Sanitize AI-generated content
- Prevent XSS in generated websites
- Validate template variables
- Escape user input properly

## Deployment Strategy

### Backend Deployment
1. Deploy services to serverless functions
2. Configure AI provider endpoints
3. Set up monitoring and logging
4. Test API endpoints

### Frontend Integration
1. Update import paths
2. Test with existing UI
3. Verify loading states work
4. Monitor performance

## Success Metrics

### Technical Metrics
- ✅ Prompt analysis accuracy: > 90%
- ✅ Template selection accuracy: > 95%
- ✅ Content generation quality: > 85% user satisfaction
- ✅ Response time: < 6 seconds

### Business Metrics
- ✅ User engagement increase
- ✅ Website variety improvement
- ✅ Customer satisfaction scores
- ✅ Retention rates

## Next Steps

### Immediate Actions (This Week)
1. ✅ Create `/src/services/` directory structure
2. ✅ Implement prompt analyzer
3. ✅ Build template engine
4. ✅ Create 5 core templates
5. ✅ Integrate AI content generation

### Week 2 Actions
1. ✅ Test backend functionality
2. ✅ Integrate with existing frontend
3. ✅ Monitor performance
4. ✅ Gather user feedback

### Future Actions (Phase 2)
1. 🔄 WebContainer integration
2. 🔄 Deployment options
3. 🔄 File management system
4. 🔄 Advanced editing features

---

**Key Principle**: Zero frontend disruption while adding Bolt.diy-style intelligence to the backend.
