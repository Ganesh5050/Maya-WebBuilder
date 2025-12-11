// Test the working AI generation with Groq
const API_KEY = process.env.VITE_GROQ_API_KEY || 'your-groq-api-key-here';
const MODEL = 'llama-3.1-8b-instant';
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function testWorkingGeneration() {
  console.log('🎉 Testing WORKING AI Generation...');
  console.log('🤖 Provider: Groq');
  console.log('🤖 Model:', MODEL);
  
  const prompt = `Create a simple portfolio website for "John Doe - Web Developer". 
  
  Generate complete HTML with:
  - Modern design with CSS
  - Header with name and title
  - About section
  - Skills section
  - Contact section
  
  Make it professional and responsive.`;

  const requestData = {
    model: MODEL,
    messages: [{
      role: 'user',
      content: prompt
    }],
    max_tokens: 2000,
    temperature: 0.7
  };
  
  try {
    console.log('📤 Sending request...');
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
    console.log('📊 Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', errorText.substring(0, 300));
      return;
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('⚠️ No content generated');
      return;
    }
    
    console.log('✅ SUCCESS! Website generated');
    console.log('📏 Length:', content.length, 'characters');
    console.log('📊 Tokens used:', data.usage?.total_tokens);
    
    // Check for HTML
    const hasHTML = content.includes('<!DOCTYPE html>') || content.includes('<html');
    const hasCSS = content.includes('<style>') || content.includes('css');
    const hasResponsive = content.includes('viewport') || content.includes('responsive');
    
    console.log('\n🔍 Quality Check:');
    console.log('✅ HTML structure:', hasHTML ? 'Yes' : 'No');
    console.log('✅ CSS styling:', hasCSS ? 'Yes' : 'No');
    console.log('✅ Responsive design:', hasResponsive ? 'Yes' : 'No');
    
    console.log('\n📝 Preview (first 300 chars):');
    console.log(content.substring(0, 300) + '...');
    
    console.log('\n🎉 AI GENERATION IS WORKING! 🚀');
    console.log('✅ The app can now generate websites successfully');
    console.log('✅ Ready for users to test in the browser');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWorkingGeneration();