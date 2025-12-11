// List available Google Gemini models
const API_KEY = 'AIzaSyDQ6k5IP-X8OEbBiaqUJO7BFg1oBJF3qz0';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

async function listModels() {
  console.log('🔍 Listing available Google Gemini models...');
  console.log('📍 Endpoint:', ENDPOINT.substring(0, 70) + '...');
  
  try {
    const response = await fetch(ENDPOINT);
    
    console.log('📨 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status);
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Models list received!');
    console.log('\n📋 Available models:\n');
    
    if (data.models && Array.isArray(data.models)) {
      data.models.forEach(model => {
        console.log(`\n🤖 ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      });
      
      console.log('\n\n✅ Models that support generateContent:');
      const generateContentModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      generateContentModels.forEach(model => {
        console.log(`   • ${model.name}`);
      });
    } else {
      console.log('⚠️ No models found in response');
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Failed to list models:', error.message);
  }
}

listModels();
