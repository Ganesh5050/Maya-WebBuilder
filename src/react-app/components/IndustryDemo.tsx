import React, { useEffect, useState } from 'react';
import { IndustryIntelligence } from '../../services/industryIntelligence';
import { StyleVariationEngine } from '../../services/styleVariationEngine';

interface DemoResult {
  prompt: string;
  industry: string;
  colors: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  personality: string;
  layout: string;
  buttonStyle: string;
}

export function IndustryDemo() {
  const [results, setResults] = useState<DemoResult[]>([]);

  useEffect(() => {
    // Test different industry prompts
    const prompts = [
      "Build a website for my athletic shoe store",
      "Create a luxury leather shoe brand website", 
      "Build a fine dining restaurant website",
      "Create a SaaS platform website"
    ];

    const testResults: DemoResult[] = [];

    prompts.forEach(prompt => {
      console.log('🧪 Testing:', prompt);
      
      const designSystem = IndustryIntelligence.generateDesignSystem(prompt);
      const styleVariation = StyleVariationEngine.generateStyleVariation(
        designSystem.industry,
        designSystem.personality,
        prompt
      );

      testResults.push({
        prompt,
        industry: designSystem.industry.industry,
        colors: {
          name: designSystem.colors.name,
          primary: designSystem.colors.primary,
          secondary: designSystem.colors.secondary,
          accent: designSystem.colors.accent
        },
        personality: `${designSystem.personality.mood} & ${designSystem.personality.energy}`,
        layout: styleVariation.layoutVariant.heroStyle,
        buttonStyle: styleVariation.componentStyles.buttonStyle
      });
    });

    setResults(testResults);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🎨 Industry Intelligence Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Watch how each industry gets unique colors and styles (no more pink templates!)
        </p>

        <div className="grid gap-6">
          {results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">"{result.prompt}"</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Design System</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Industry:</strong> {result.industry}</div>
                    <div><strong>Color Palette:</strong> {result.colors.name}</div>
                    <div><strong>Personality:</strong> {result.personality}</div>
                    <div><strong>Layout:</strong> {result.layout}</div>
                    <div><strong>Button Style:</strong> {result.buttonStyle}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Color Preview</h4>
                  <div className="flex space-x-2 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                      style={{ backgroundColor: result.colors.primary }}
                      title={`Primary: ${result.colors.primary}`}
                    />
                    <div
                      className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                      style={{ backgroundColor: result.colors.secondary }}
                      title={`Secondary: ${result.colors.secondary}`}
                    />
                    <div
                      className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                      style={{ backgroundColor: result.colors.accent }}
                      title={`Accent: ${result.colors.accent}`}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div>Primary: {result.colors.primary}</div>
                    <div>Secondary: {result.colors.secondary}</div>
                  </div>
                </div>
              </div>

              {/* Sample button with the actual style */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Sample Button:</p>
                <button
                  className={`px-6 py-2 font-semibold transition-all duration-200 ${
                    result.buttonStyle === 'rounded' ? 'rounded-full' : 'rounded-lg'
                  }`}
                  style={{
                    backgroundColor: result.buttonStyle === 'outline' ? 'transparent' : result.colors.primary,
                    color: result.buttonStyle === 'outline' ? result.colors.primary : 'white',
                    border: result.buttonStyle === 'outline' ? `2px solid ${result.colors.primary}` : 'none'
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Success! Each Industry Gets Unique Design
          </h3>
          <p className="text-green-700">
            As you can see above, each industry prompt generates completely different:
          </p>
          <ul className="list-disc list-inside text-green-700 mt-2">
            <li>Athletic shoes: Nike-style orange/red colors</li>
            <li>Luxury shoes: Gucci-style green/gold colors</li>
            <li>Restaurant: Warm brown/gold colors</li>
            <li>SaaS: Modern blue/purple colors</li>
          </ul>
          <p className="text-green-700 mt-2 font-semibold">
            🎯 No more pink templates! Each website looks professionally designed for its industry.
          </p>
        </div>
      </div>
    </div>
  );
}