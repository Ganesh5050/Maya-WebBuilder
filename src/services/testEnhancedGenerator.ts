// Quick test to verify enhanced generator is working
import { enhancedWebsiteGenerator } from './enhancedWebsiteGenerator';

export async function testEnhancedGenerator() {
  console.log('🧪 Testing Enhanced Website Generator...');

  try {
    const files = await enhancedWebsiteGenerator.generateUniqueWebsite(
      'Create a luxury jewelry website for high-end customers',
      (progress) => {
        console.log(`📊 ${progress.message}`);
      }
    );

    console.log('✅ Test successful!');
    console.log('📁 Generated files:', files.length);
    console.log('📋 File list:', files.map(f => f.path));

    // Check for uniqueness indicators
    const appFile = files.find(f => f.path === 'src/App.tsx');
    const heroFile = files.find(f => f.path === 'src/components/Hero.tsx');
    const cssFile = files.find(f => f.path === 'src/index.css');

    console.log('🎨 Checking for uniqueness...');
    console.log('App component exists:', !!appFile);
    console.log('Hero component exists:', !!heroFile);
    console.log('CSS file exists:', !!cssFile);

    if (cssFile) {
      const hasCustomColors = cssFile.content.includes('--primary-');
      const hasCustomFonts = cssFile.content.includes('font-family');
      console.log('Has custom colors:', hasCustomColors);
      console.log('Has custom fonts:', hasCustomFonts);
    }

    return {
      success: true,
      fileCount: files.length,
      files: files.map(f => ({ path: f.path, size: f.content.length }))
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Auto-run test if this file is imported
// Auto-run test
testEnhancedGenerator().then(() => console.log('Done')).catch(console.error);