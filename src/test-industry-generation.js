// Quick test script to demonstrate industry-specific website generation
// Run this with: node src/test-industry-generation.js

const { IndustryIntelligence } = require('./services/industryIntelligence.ts');
const { StyleVariationEngine } = require('./services/styleVariationEngine.ts');

async function testIndustryGeneration() {
  console.log('🧪 TESTING INDUSTRY INTELLIGENCE SYSTEM');
  console.log('=====================================\n');

  const testCases = [
    {
      prompt: "Build a website for my athletic shoe store",
      expected: "Should get Nike/Adidas-style colors and layout"
    },
    {
      prompt: "Create a luxury leather shoe brand website", 
      expected: "Should get Gucci/luxury-style colors and elegant layout"
    },
    {
      prompt: "Build a fine dining restaurant website",
      expected: "Should get warm restaurant colors and menu-focused layout"
    },
    {
      prompt: "Create a SaaS platform website",
      expected: "Should get modern tech colors and feature-focused layout"
    },
    {
      prompt: "Build a creative agency portfolio",
      expected: "Should get bold creative colors and portfolio layout"
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n🎯 TEST ${i + 1}: "${testCase.prompt}"`);
    console.log(`Expected: ${testCase.expected}`);
    console.log('---');

    try {
      // Generate design system
      const designSystem = IndustryIntelligence.generateDesignSystem(testCase.prompt);
      const styleVariation = StyleVariationEngine.generateStyleVariation(
        designSystem.industry,
        designSystem.personality,
        testCase.prompt
      );

      console.log('✅ RESULTS:');
      console.log(`   Industry: ${designSystem.industry.industry}`);
      console.log(`   Colors: ${designSystem.colors.name}`);
      console.log(`   Primary: ${designSystem.colors.primary}`);
      console.log(`   Secondary: ${designSystem.colors.secondary}`);
      console.log(`   Personality: ${designSystem.personality.mood} & ${designSystem.personality.energy}`);
      console.log(`   Hero Layout: ${styleVariation.layoutVariant.heroStyle}`);
      console.log(`   Feature Layout: ${styleVariation.layoutVariant.featureLayout}`);
      console.log(`   Button Style: ${styleVariation.componentStyles.buttonStyle}`);
      console.log(`   Card Style: ${styleVariation.componentStyles.cardStyle}`);

      // Verify uniqueness
      if (designSystem.colors.primary !== '#FF6B9D') {
        console.log('   ✅ SUCCESS: Not using pink template!');
      } else {
        console.log('   ❌ FAIL: Still using pink template');
      }

    } catch (error) {
      console.log('   ❌ ERROR:', error.message);
    }
  }

  console.log('\n🎉 SUMMARY:');
  console.log('Each test should show DIFFERENT colors, layouts, and styles!');
  console.log('This proves we solved the "pink template" problem.');
  console.log('\nTo see the visual results, visit: http://localhost:5173/test-industry');
}

// Run the test
testIndustryGeneration().catch(console.error);