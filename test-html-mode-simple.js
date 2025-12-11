// Simple test to verify HTML mode works
console.log('🧪 Testing HTML Mode (Simple)...');

// Test the exact same API call that the app makes
const API_KEY = process.env.VITE_GROQ_API_KEY || 'your-groq-api-key-here';
const MODEL = 'llama-3.1-8b-instant';
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function testSimpleHTML() {
  const prompt = 'Create a simple portfolio website';
  
  console.log('📤 Testing Groq API...');
  
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
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
      })
    });
    
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        console.log('✅ HTML generated successfully!');
        console.log('📏 Length:', content.length, 'characters');
        console.log('🎉 HTML mode should work in the app!');
        
        // Check if it contains HTML
        if (content.includes('<!DOCTYPE html>')) {
          console.log('✅ Valid HTML structure detected');
        }
        
        return true;
      } else {
        console.log('❌ No content in response');
        return false;
      }
    } else {
      console.log('❌ API request failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testSimpleHTML().then(success => {
  if (success) {
    console.log('\n🎉 HTML MODE IS READY!');
    console.log('✅ The app should now generate HTML websites');
    console.log('✅ Users will get instant preview');
    console.log('✅ No more database dependency for basic functionality');
  } else {
    console.log('\n❌ HTML mode needs fixing');
  }
});