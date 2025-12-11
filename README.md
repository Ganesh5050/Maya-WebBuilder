# AI Website Builder - Smart Template-Based Architecture

## Overview
A sophisticated AI-powered website builder that generates unique, context-aware websites based on user prompts. Uses intelligent prompt analysis and template-based architecture similar to Bolt.diy.

## Architecture

### Frontend (React)
- **Chat Interface**: Users describe their website requirements
- **Live Preview**: Real-time website preview in iframe
- **Loading States**: Professional 3D animated loaders
- **Responsive Design**: Works on all devices

### Backend Intelligence Layer
- **Prompt Analyzer**: Extracts keywords and intent from user input
- **Template Engine**: Selects appropriate website template
- **Content Generator**: Uses AI APIs to generate unique content
- **Website Builder**: Combines templates with AI-generated content

## How It Works

### 1. User Input
User types: "I need a portfolio website for my photography business"

### 2. Prompt Analysis
```
Input: "portfolio website for my photography business"
Analysis: {
  type: "portfolio",
  industry: "photography", 
  features: ["gallery", "about", "contact"],
  style: "visual",
  keywords: ["portfolio", "photography", "gallery"]
}
```

### 3. Template Selection
Based on analysis, selects `portfolio.html` template

### 4. AI Content Generation
- Generates company name suggestions
- Creates photography-focused copy
- Suggests color schemes (dark, visual-focused)
- Writes portfolio descriptions

### 5. Final Website
Combines template structure with AI-generated unique content

## Template Types

### 1. Portfolio Template
- **For**: Photographers, designers, artists, developers
- **Sections**: Hero, Gallery, About, Services, Contact
- **Features**: Image galleries, project showcases

### 2. Business Template  
- **For**: Companies, agencies, consultants
- **Sections**: Hero, Services, About, Testimonials, Contact
- **Features**: Service descriptions, client logos

### 3. Restaurant Template
- **For**: Restaurants, cafes, food services
- **Sections**: Menu, About, Reservations, Location, Gallery
- **Features**: Menu displays, booking forms

### 4. E-commerce Template
- **For**: Online stores, product sales
- **Sections**: Products, Categories, Cart, Checkout
- **Features**: Product grids, pricing tables

### 5. Blog Template
- **For**: Content creators, writers
- **Sections**: Articles, Categories, About, Newsletter
- **Features**: Article layouts, search functionality

## AI Integration

### Supported Providers
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)
- Local models via Ollama

### Content Generation
- **Industry-specific copy**: Tailored content based on business type
- **SEO optimization**: Meta tags, descriptions, keywords
- **Brand consistency**: Unified tone and style
- **Call-to-actions**: Relevant CTAs for each template type

## Smart Features

### WebContainer Integration (Future)
- Live code execution
- Real-time editing
- Instant preview updates

### Deployment Options (Future)
- **Netlify**: One-click deployment
- **Vercel**: Automatic deployments
- **GitHub Pages**: Static site hosting
- **Custom domains**: Domain mapping

### File Management (Future)
- **File Locking**: Prevent conflicts during generation
- **Version Control**: Track website changes
- **Export Options**: Download as ZIP, HTML, or React components

## Development Workflow

### Backend Development (No Frontend Changes)
1. Create `/src/services/` directory
2. Implement prompt analysis logic
3. Build template engine
4. Integrate AI content generation
5. Connect to existing frontend function

### Frontend Integration
- Single function change in `AppBuilder.tsx`
- Replace `generateRealisticAIWebsite()` with `generateSmartWebsite()`
- All UI components remain unchanged

## File Structure
```
/src/
├── react-app/
│   ├── pages/
│   │   └── AppBuilder.tsx          # Main frontend (unchanged)
│   └── components/                 # UI components (unchanged)
├── services/
│   ├── promptAnalyzer.js           # Analyze user prompts
│   ├── templateEngine.js           # Template selection logic
│   ├── contentGenerator.js         # AI-powered content creation
│   └── websiteBuilder.js           # Main orchestrator
├── templates/
│   ├── portfolio.html              # Portfolio template
│   ├── business.html               # Business template
│   ├── restaurant.html             # Restaurant template
│   ├── blog.html                   # Blog template
│   └── ecommerce.html              # E-commerce template
└── config/
    ├── aiProviders.js              # AI provider configurations
    └── templates.js                # Template definitions
```

## Getting Started

### Prerequisites
- Node.js 16+
- AI API key (OpenAI, Anthropic, etc.)
- React development environment

### Installation
```bash
npm install
npm run dev
```

### Configuration
```javascript
// config/aiProviders.js
export const AI_CONFIG = {
  provider: 'openai', // or 'anthropic', 'google'
  apiKey: process.env.AI_API_KEY,
  model: 'gpt-4'
};
```

## API Endpoints

### Generate Website
```
POST /api/generate
{
  "prompt": "I need a portfolio website for photography",
  "template": "portfolio",
  "options": {
    "style": "modern",
    "features": ["gallery", "contact"]
  }
}
```

### Analyze Prompt
```
POST /api/analyze
{
  "prompt": "restaurant website with menu"
}
```

## Testing

### Backend Testing
- Prompt analysis accuracy
- Template selection logic
- AI content generation quality
- Performance benchmarks

### Integration Testing
- Frontend-backend communication
- Template rendering
- Error handling
- Loading states

## Future Enhancements

### Phase 2 Features
- Custom template creation
- Advanced styling options
- Image generation integration
- Multi-language support

### Phase 3 Features
- Real-time collaboration
- Advanced analytics
- CMS integration
- Mobile app generation

## Contributing

1. Fork repository
2. Create feature branch
3. Implement backend features
4. Test thoroughly
5. Submit pull request

## License
MIT License - see LICENSE file for details

---

## Original Mocha Setup
This app was created using https://getmocha.com.
Need help or want to join our community? Join our [Discord](https://discord.gg/shDEGBSe2d).

To run the devserver:
```
npm install
npm run dev
