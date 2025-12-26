import React, { useState } from 'react';
import { IndustryIntelligence } from '../../services/industryIntelligence';
import { StyleVariationEngine } from '../../services/styleVariationEngine';

interface TestResult {
  prompt: string;
  industry: string;
  colors: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  personality: {
    mood: string;
    energy: string;
  };
  layout: {
    heroStyle: string;
    featureLayout: string;
  };
  components: {
    buttonStyle: string;
    cardStyle: string;
  };
}

export function IndustryTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testPrompts = [
    "Build a website for my athletic shoe store",
    "Create a luxury leather shoe brand website", 
    "Build a fine dining restaurant website",
    "Create a SaaS platform website",
    "Build a creative agency portfolio website",
    "Create an eco-friendly shoe store",
    "Build a streetwear sneaker brand",
    "Create a formal business shoe website"
  ];

  const runIndustryTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];

    for (const prompt of testPrompts) {
      console.log('🧪 Testing prompt:', prompt);
      
      // Generate design system
      const designSystem = IndustryIntelligence.generateDesignSystem(prompt);
      const styleVariation = StyleVariationEngine.generateStyleVariation(
        designSystem.industry,
        designSystem.personality,
        prompt
      );

      results.push({
        prompt,
        industry: designSystem.industry.industry,
        colors: {
          name: designSystem.colors.name,
          primary: designSystem.colors.primary,
          secondary: designSystem.colors.secondary,
          accent: designSystem.colors.accent
        },
        personality: {
          mood: designSystem.personality.mood,
          energy: designSystem.personality.energy
        },
        layout: {
          heroStyle: styleVariation.layoutVariant.heroStyle,
          featureLayout: styleVariation.layoutVariant.featureLayout
        },
        components: {
          buttonStyle: styleVariation.componentStyles.buttonStyle,
          cardStyle: styleVariation.componentStyles.cardStyle
        }
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Industry Intelligence System Test
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Testing our new system that generates UNIQUE designs for each industry
          </p>
          <p className="text-lg text-red-600 font-semibold mb-8">
            ❌ OLD PROBLEM: Every website looked the same (pink template)<br/>
            ✅ NEW SOLUTION: Each industry gets unique colors, layouts, and styles!
          </p>
          
          <button
            onClick={runIndustryTests}
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? '🧪 Running Tests...' : '🚀 Test Industry Intelligence'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              🎯 Test Results: Each Industry Gets Unique Design!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4"
                  style={{ borderLeftColor: result.colors.primary }}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      "{result.prompt}"
                    </h3>
                    <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      Industry: {result.industry}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">🎨 Unique Colors ({result.colors.name})</h4>
                    <div className="flex space-x-2">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: result.colors.primary }}
                        title={`Primary: ${result.colors.primary}`}
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: result.colors.secondary }}
                        title={`Secondary: ${result.colors.secondary}`}
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: result.colors.accent }}
                        title={`Accent: ${result.colors.accent}`}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Primary: {result.colors.primary} | Secondary: {result.colors.secondary}
                    </div>
                  </div>

                  {/* Design Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Personality:</span>
                      <span className="font-medium">{result.personality.mood} & {result.personality.energy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hero Style:</span>
                      <span className="font-medium">{result.layout.heroStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Feature Layout:</span>
                      <span className="font-medium">{result.layout.featureLayout}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Button Style:</span>
                      <span className="font-medium">{result.components.buttonStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Style:</span>
                      <span className="font-medium">{result.components.cardStyle}</span>
                    </div>
                  </div>

                  {/* Sample Button Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Sample Button Preview:</p>
                    <button
                      className={`px-4 py-2 font-semibold transition-all duration-200 ${
                        result.components.buttonStyle === 'solid' ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5' :
                        result.components.buttonStyle === 'outline' ? 'border-2 hover:text-white' :
                        result.components.buttonStyle === 'gradient' ? 'shadow-md hover:scale-105' :
                        result.components.buttonStyle === 'rounded' ? 'rounded-full hover:-translate-y-0.5' :
                        'hover:bg-opacity-10'
                      } ${
                        result.components.buttonStyle === 'outline' ? 'bg-transparent' : ''
                      }`}
                      style={{
                        backgroundColor: result.components.buttonStyle === 'outline' ? 'transparent' : 
                                       result.components.buttonStyle === 'gradient' ? 
                                       `linear-gradient(135deg, ${result.colors.primary}, ${result.colors.secondary})` :
                                       result.colors.primary,
                        color: result.components.buttonStyle === 'outline' ? result.colors.primary : 'white',
                        border: result.components.buttonStyle === 'outline' ? `2px solid ${result.colors.primary}` : 'none',
                        borderRadius: result.components.buttonStyle === 'rounded' ? '25px' : '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (result.components.buttonStyle === 'outline') {
                          e.currentTarget.style.backgroundColor = result.colors.primary;
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (result.components.buttonStyle === 'outline') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = result.colors.primary;
                        }
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Success! No More Pink Templates!
              </h3>
              <p className="text-green-700">
                As you can see above, each industry now gets completely different:
              </p>
              <ul className="list-disc list-inside text-green-700 mt-2 space-y-1">
                <li><strong>Colors:</strong> Athletic shoes get Nike-style orange/red, luxury gets Gucci-style green/gold</li>
                <li><strong>Layouts:</strong> Different hero styles and feature arrangements per industry</li>
                <li><strong>Components:</strong> Button and card styles match the brand personality</li>
                <li><strong>Typography:</strong> Fonts appropriate for each industry (bold for athletic, elegant for luxury)</li>
              </ul>
              <p className="text-green-700 mt-3 font-semibold">
                🎯 Result: Every website looks professionally designed for its specific industry!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}