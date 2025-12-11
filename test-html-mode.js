// Test the new HTML mode for instant preview
const API_KEY = process.env.VITE_GROQ_API_KEY || 'your-groq-api-key-here';
const MODEL = 'llama-3.1-8b-instant';
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function testHTMLMode() {
  console.log('🎨 Testing HTML Mode for Instant Preview...');
  
  const prompt = 'Create a modern portfolio website for Sarah Johnson, a UX Designer';
  
  const requestData = {
    model: MODEL,
    messages: [{
      role: 'user',
      content: `Create a complete, modern, responsive HTML website for: "${prompt}"

Generate a single HTML file with:
- Complete HTML structure with DOCTYPE
- Embedded CSS styles (modern, responsive design)
- Interactive JavaScript if needed
- Professional design with good typography
- Mobile-responsive layout
- Real content (no placeholders)
- Industry-appropriate colors and styling

Make it look professional and modern. Return ONLY the HTML code, no explanations.`
    }],
    max_tokens: 4000,
    temperature: 0.7
  };
  
  try {
    console.log('📤 Generating HTML website...');
    const startTime = Date.now();
    
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestData)
    });
    
    const endTime = Date.now();
    console.log(`📨 Response in ${endTime - startTime}ms`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const htmlContent = data.choices?.[0]?.message?.content;
    
    if (!htmlContent) {
      throw new Error('No HTML content generated');
    }
    
    // Clean up the HTML (remove markdown formatting if present)
    let cleanHtml = htmlContent;
    if (cleanHtml.includes('```html')) {
      cleanHtml = cleanHtml.split('```html')[1]?.split('```')[0] || cleanHtml;
    }
    if (cleanHtml.includes('```')) {
      cleanHtml = cleanHtml.split('```')[1] || cleanHtml;
    }
    
    console.log('✅ HTML Generation Successful!');
    console.log('📏 HTML Length:', cleanHtml.length, 'characters');
    console.log('📊 Tokens Used:', data.usage?.total_tokens);
    
    // Quality checks
    const hasDoctype = cleanHtml.includes('<!DOCTYPE html>');
    const hasCSS = cleanHtml.includes('<style>') || cleanHtml.includes('css');
    const hasResponsive = cleanHtml.includes('viewport');
    const hasContent = cleanHtml.includes('Sarah') || cleanHtml.includes('UX');
    
    console.log('\n🔍 Quality Check:');
    console.log('✅ DOCTYPE:', hasDoctype ? 'Yes' : 'No');
    console.log('✅ CSS Styling:', hasCSS ? 'Yes' : 'No');
    console.log('✅ Responsive:', hasResponsive ? 'Yes' : 'No');
    console.log('✅ Custom Content:', hasContent ? 'Yes' : 'No');
    
    console.log('\n📝 Preview (first 200 chars):');
    console.log(cleanHtml.substring(0, 200) + '...');
    
    if (hasDoctype && hasCSS && hasResponsive) {
      console.log('\n🎉 PERFECT! HTML mode is working!');
      console.log('✅ Users will now get INSTANT PREVIEW');
      console.log('✅ No more download-only experience');
      console.log('✅ Just like other AI website builders!');
    } else {
      console.log('\n⚠️ HTML quality could be improved');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHTMLMode();