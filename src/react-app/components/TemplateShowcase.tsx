export default function TemplateShowcase() {
  const templates = [
    {
      name: 'Movie Browser',
      icon: '🎬',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Portfolio Website',
      icon: '💼',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      name: 'B2B Platform',
      icon: '🏢',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      name: 'SaaS Application',
      icon: '☁️',
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      name: 'Personal Finance Tracker',
      icon: '💰',
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      name: 'Fitness App',
      icon: '💪',
      color: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      name: 'Personal Link Tree',
      icon: '🌳',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      name: 'Beautiful Waiting List',
      icon: '📝',
      color: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <div className="bg-gray-50 py-16 overflow-hidden">
      {/* Continuous scrolling container */}
      <div className="relative">
        <div className="flex animate-scroll">
          {/* First set of templates */}
          {templates.map((template, index) => (
            <div
              key={`template-1-${index}`}
              className="flex-shrink-0 mx-4 bg-white rounded-[20px] shadow-sm border border-gray-200 min-w-[240px] transition-all duration-300 hover:shadow-lg hover:border-gray-300"
              style={{
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
              }}
            >
              <div className={`${template.color} rounded-t-[20px] p-6 text-center`}>
                <div className={`text-4xl mb-3 ${template.iconColor}`}>{template.icon}</div>
                <h3 className="text-gray-900 font-semibold text-lg">{template.name}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Modern UI Design</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Responsive Layout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">User Friendly</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Quick Setup</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {templates.map((template, index) => (
            <div
              key={`template-2-${index}`}
              className="flex-shrink-0 mx-4 bg-white rounded-[20px] shadow-sm border border-gray-200 min-w-[240px] transition-all duration-300 hover:shadow-lg hover:border-gray-300"
              style={{
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
              }}
            >
              <div className={`${template.color} rounded-t-[20px] p-6 text-center`}>
                <div className={`text-4xl mb-3 ${template.iconColor}`}>{template.icon}</div>
                <h3 className="text-gray-900 font-semibold text-lg">{template.name}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Modern UI Design</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Responsive Layout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">User Friendly</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Quick Setup</span>
                    <div className="flex space">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
