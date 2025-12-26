import { ProgressBar } from '@tremor/react';
import { useState, useEffect } from 'react';

interface GenerationPhase {
  phase: string;
  message: string;
  icon: string;
  progress: number;
  status: 'pending' | 'active' | 'complete';
}

interface ProfessionalGenerationProgressProps {
  currentProgress: number;
  currentMessage: string;
  estimatedTimeRemaining: number;
}

export function ProfessionalGenerationProgress({ 
  currentProgress, 
  currentMessage, 
  estimatedTimeRemaining 
}: ProfessionalGenerationProgressProps) {
  const [phases] = useState<GenerationPhase[]>([
    { phase: 'analyzing', message: 'Analyzing requirements', icon: '🔍', progress: 12.5, status: 'pending' },
    { phase: 'researching', message: 'Researching competitors', icon: '🌐', progress: 25, status: 'pending' },
    { phase: 'designing', message: 'Generating design system', icon: '🎨', progress: 43.75, status: 'pending' },
    { phase: 'components', message: 'Creating premium components', icon: '🧩', progress: 68.75, status: 'pending' },
    { phase: 'pages', message: 'Building responsive pages', icon: '📄', progress: 87.5, status: 'pending' },
    { phase: 'styling', message: 'Applying animations', icon: '✨', progress: 95, status: 'pending' },
    { phase: 'optimizing', message: 'Optimizing performance', icon: '⚡', progress: 98, status: 'pending' },
    { phase: 'finalizing', message: 'Running quality checks', icon: '🎯', progress: 100, status: 'pending' }
  ]);

  const [updatedPhases, setUpdatedPhases] = useState(phases);

  useEffect(() => {
    setUpdatedPhases(phases.map(phase => {
      if (currentProgress > phase.progress) {
        return { ...phase, status: 'complete' as const };
      } else if (currentProgress >= phase.progress - 12.5 && currentProgress <= phase.progress) {
        return { ...phase, status: 'active' as const };
      }
      return { ...phase, status: 'pending' as const };
    }));
  }, [currentProgress, phases]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            🚀 Professional AI Website Generation
          </h3>
          <span className="text-sm text-gray-500">
            {Math.round(currentProgress)}% Complete
          </span>
        </div>
        
        {/* Overall Progress Bar */}
        <ProgressBar 
          value={currentProgress} 
          className="mb-2"
          color="blue"
        />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{currentMessage}</span>
          <span className="text-gray-500">
            {estimatedTimeRemaining > 0 ? `${estimatedTimeRemaining}s remaining` : 'Almost done!'}
          </span>
        </div>
      </div>

      {/* Phase List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Generation Phases:</h4>
        {updatedPhases.map((phase, index) => (
          <div 
            key={phase.phase}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              phase.status === 'active' 
                ? 'bg-blue-50 border border-blue-200' 
                : phase.status === 'complete'
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-100'
            }`}
          >
            {/* Status Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              phase.status === 'complete' 
                ? 'bg-green-500 text-white' 
                : phase.status === 'active'
                ? 'bg-blue-500 text-white animate-pulse'
                : 'bg-gray-300 text-gray-600'
            }`}>
              {phase.status === 'complete' ? '✓' : 
               phase.status === 'active' ? '⟳' : 
               index + 1}
            </div>
            
            {/* Phase Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{phase.icon}</span>
                <span className={`font-medium ${
                  phase.status === 'active' ? 'text-blue-700' :
                  phase.status === 'complete' ? 'text-green-700' :
                  'text-gray-600'
                }`}>
                  {phase.message}
                </span>
              </div>
              {phase.status === 'active' && (
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((currentProgress - (phase.progress - 12.5)) / 12.5) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress Percentage */}
            <div className={`text-sm font-medium ${
              phase.status === 'complete' ? 'text-green-600' :
              phase.status === 'active' ? 'text-blue-600' :
              'text-gray-400'
            }`}>
              {phase.status === 'complete' ? '100%' : 
               phase.status === 'active' ? `${Math.round(currentProgress)}%` :
               '0%'}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Why 35+ seconds? Quality AI Development Time
            </h4>
            <p className="text-sm text-gray-600">
              AI needs proper time without pressure to analyze your industry, research competitors, 
              generate unique designs, create premium components, and ensure 100% quality. 
              Real professional development takes time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}