// Test full website generation with Google Gemini
const API_KEY = 'AIzaSyDQ6k5IP-X8OEbBiaqUJO7BFg1oBJF3qz0';
const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

async function testWebsiteGeneration() {
  console.log('🧪 Testing full website generation...');
  console.log('🤖 Model:', MODEL);
  
  const prompt = `You are an expert AI Full-Stack Web Developer. Generate 100% COMPLETE, PRODUCTION-READY code.

## PROJECT CONTEXT:
USER REQUEST: "Create a modern restaurant website"
FILE: index.html
PURPOSE: Main HTML file with complete structure
INDUSTRY: restaurant
COLOR SCHEME: warm colors (orange, red, brown)
DESIGN STYLE: elegant

## ABSOLUTE REQUIREMENTS:

### UNIQUENESS (CRITICAL):
- This code must be COMPLETELY UNIQUE to "restaurant website"
- Reflect the SPECIFIC industry: restaurant
- Use colors that match: warm colors
- Design style must be: elegant
- NO GENERIC TEMPLATES - make it industry-specific

### CODE QUALITY:
- Write 100% COMPLETE code (NO placeholders, NO "TODO", NO "Add more here")
- Include ALL imports, ALL functions, ALL styles
- Production-ready with proper error handling
- Modern, clean, maintainable code

### CONTENT:
- Use REAL, MEANINGFUL content specific to "restaurant"
- NO generic placeholders like "Your content here" or "Lorem ipsum"
- Write actual copy that fits the industry
- Include realistic data and examples

## HTML REQUIREMENTS:
- Start with <!DOCTYPE html>
- Complete <head> with meta tags, title, description
- Semantic HTML5: <header>, <nav>, <main>, <section>, <footer>
- Multiple sections (4-6) with REAL content for "restaurant"
- Navigation menu with actual links
- Call-to-action buttons
- Forms if needed (contact, signup, etc.)
- Inline CSS styles (no external stylesheet)
- Industry-specific sections (menu, reservations, gallery)

Generate the COMPLETE, UNIQUE, PRODUCTION-READY HTML code for "restaurant website" NOW:`;

  const requestData = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8000
    }
  };
  
  try {
    console.log('📤 Sending generation request...');
    const startTime = Date.now();
    
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const endTime = Date.now();
    console.log(`📨 Response received in ${endTime - startTime}ms`);
    console.log('📊 Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status);
      console.error('Error details:', errorText.substring(0, 500));
      return;
    }
    
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error('⚠️ No content in response');
      console.log('Full response:', JSON.stringify(data, null, 2));
      return;
    }
    
    console.log('✅ Website generated successfully!');
    console.log('📏 Content length:', content.length, 'characters');
    console.log('📊 Token usage:', data.usageMetadata);
    console.log('\n📝 First 500 characters of generated HTML:\n');
    console.log(content.substring(0, 500));
    console.log('\n...\n');
    console.log('📝 Last 300 characters:\n');
    console.log(content.substring(content.length - 300));
    
    // Check if it's actually HTML
    if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
      console.log('\n✅ Valid HTML detected!');
    } else {
      console.log('\n⚠️ Warning: Content may not be valid HTML');
    }
    
    // Check for restaurant-specific content
    const restaurantKeywords = ['menu', 'food', 'restaurant', 'dining', 'reservation', 'chef', 'cuisine'];
    const foundKeywords = restaurantKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    if (foundKeywords.length > 0) {
      console.log(`\n✅ Restaurant-specific content found: ${foundKeywords.join(', ')}`);
    } else {
      console.log('\n⚠️ Warning: No restaurant-specific keywords found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testWebsiteGeneration();
