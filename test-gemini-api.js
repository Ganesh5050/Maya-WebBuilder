// Test Google Gemini API
const API_KEY = 'AIzaSyDQ6k5IP-X8OEbBiaqUJO7BFg1oBJF3qz0';
const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

async function testGeminiAPI() {
  console.log('🧪 Testing Google Gemini API...');
  console.log('📍 Endpoint:', ENDPOINT.substring(0, 80) + '...');
  console.log('🤖 Model:', MODEL);
  
  const requestData = {
    contents: [{
      parts: [{
        text: 'Say "Hello, I am working!" in exactly 5 words.'
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 100
    }
  };
  
  try {
    console.log('📤 Sending request...');
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    console.log('📨 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status);
      console.error('Error details:', errorText.substring(0, 500));
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response received!');
    console.log('📝 Full response:', JSON.stringify(data, null, 2));
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('💬 Generated text:', content);
    
    if (content) {
      console.log('✅ SUCCESS! Google Gemini API is working!');
    } else {
      console.log('⚠️ Response received but no content found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGeminiAPI();
