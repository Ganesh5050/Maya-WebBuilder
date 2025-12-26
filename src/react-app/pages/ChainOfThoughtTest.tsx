import { ChainOfThoughtDemo } from '../../components/prompt-kit/chain-of-thought-demo';
import { NoScrollTest } from '../../components/prompt-kit/no-scroll-test';

export default function ChainOfThoughtTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chain of Thought UI Implementation
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of the Chain of Thought components integrated with the chat interface.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ChainOfThoughtDemo />
        </div>
        
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">No Horizontal Scroll Test:</h2>
          <NoScrollTest />
        </div>
        
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Features Implemented:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">✅ Chain of Thought Components</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Expandable/collapsible sections</li>
                <li>• Icon integration with Lucide React</li>
                <li>• Professional styling with Tailwind</li>
                <li>• Context-based state management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">✅ Chat Integration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatic Chain of Thought detection</li>
                <li>• JSON parsing and rendering</li>
                <li>• Progress updates with file lists</li>
                <li>• Code block syntax highlighting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}