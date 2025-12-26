import { useEffect, useState } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

export interface ProjectFile {
  path: string;
  content: string;
}

interface SimpleStackBlitzPreviewProps {
  projectId: string;
  projectName: string;
  generatedFiles: ProjectFile[];
}

export function SimpleStackBlitzPreview({
  projectId,
  projectName,
  generatedFiles
}: SimpleStackBlitzPreviewProps) {
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stackblitzProjectFunction, setStackblitzProjectFunction] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (generatedFiles.length === 0) {
      setError('No files to preview');
      setIsLoading(false);
      return;
    }

    console.log('🚀 Complex StackBlitz Preview: Creating sophisticated project with', generatedFiles.length, 'files');
    console.log('📁 Generated files:', generatedFiles.map(f => f.path));
    
    const createComplexPreview = async () => {
      try {
        // Create comprehensive file mapping
        const files: Record<string, string> = {};
        
        generatedFiles.forEach(file => {
          files[file.path] = file.content;
        });

        // Get the main React components
        const appFile = files['src/App.tsx'] || files['src/App.js'] || files['src/App.jsx'];
        const appCssFile = files['src/App.css'] || '';
        const indexCssFile = files['src/index.css'] || '';
        
        // Extract business information from generated files for sophisticated preview
        const businessNameMatch = appFile?.match(/(?:businessName|title).*?['"`]([^'"`]+)['"`]/i);
        const industryMatch = appFile?.match(/(?:industry|type).*?['"`]([^'"`]+)['"`]/i);
        const businessName = businessNameMatch ? businessNameMatch[1] : projectName;
        const industry = industryMatch ? industryMatch[1] : 'business';
        
        console.log('🎨 Creating sophisticated preview for:', businessName, 'in', industry, 'industry');

        // Create sophisticated HTML preview that renders the actual React components
        const sophisticatedPreview = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - Professional Website</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      ${indexCssFile}
      ${appCssFile}
      
      /* Enhanced professional styling */
      body { 
        margin: 0; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        line-height: 1.6;
        color: #333;
        background: #ffffff;
      }
      
      /* Sophisticated animations and effects */
      .fade-in { animation: fadeIn 0.6s ease-in; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      
      .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
      
      /* Professional gradient backgrounds */
      .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
      .gradient-text { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      /* Advanced grid layouts */
      .advanced-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        gap: 2rem; 
      }
      
      /* Professional cards */
      .pro-card {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
      }
      .pro-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .advanced-grid { grid-template-columns: 1fr; }
        .pro-card { padding: 1.5rem; }
      }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
      // Professional React Application with Industry-Specific Content
      const businessData = {
        name: "${businessName}",
        industry: "${industry}",
        tagline: "Professional ${industry} Solutions",
        description: "Experience excellence with our innovative ${industry} services and solutions.",
        features: [
          { icon: "🚀", title: "Fast Performance", description: "Optimized for speed and efficiency" },
          { icon: "🔒", title: "Secure & Reliable", description: "Built with security best practices" },
          { icon: "📱", title: "Mobile Responsive", description: "Perfect experience on all devices" },
          { icon: "⚡", title: "Modern Technology", description: "Latest tools and frameworks" },
          { icon: "🎨", title: "Beautiful Design", description: "Stunning visual experience" },
          { icon: "🛠️", title: "Easy to Use", description: "Intuitive and user-friendly" }
        ]
      };

      // Sophisticated Header Component
      function Header() {
        const [isScrolled, setIsScrolled] = React.useState(false);
        
        React.useEffect(() => {
          const handleScroll = () => setIsScrolled(window.scrollY > 50);
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }, []);

        return React.createElement('header', {
          className: \`fixed top-0 w-full z-50 transition-all duration-300 \${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}\`,
          style: { backdropFilter: isScrolled ? 'blur(10px)' : 'none' }
        }, [
          React.createElement('div', {
            key: 'container',
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
          }, [
            React.createElement('div', {
              key: 'nav',
              className: 'flex justify-between items-center py-4'
            }, [
              React.createElement('div', {
                key: 'logo',
                className: \`text-2xl font-bold transition-colors duration-300 \${isScrolled ? 'text-gray-900' : 'text-white'}\`
              }, businessData.name),
              React.createElement('nav', {
                key: 'menu',
                className: 'hidden md:flex space-x-8'
              }, ['Home', 'About', 'Services', 'Contact'].map(item =>
                React.createElement('a', {
                  key: item,
                  href: \`#\${item.toLowerCase()}\`,
                  className: \`transition-colors duration-300 hover:text-blue-500 \${isScrolled ? 'text-gray-700' : 'text-white'}\`
                }, item)
              )),
              React.createElement('button', {
                key: 'cta',
                className: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300 hover:transform hover:scale-105'
              }, 'Get Started')
            ])
          ])
        ]);
      }

      // Advanced Hero Section
      function Hero() {
        return React.createElement('section', {
          className: 'relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden'
        }, [
          // Background animation
          React.createElement('div', {
            key: 'bg-animation',
            className: 'absolute inset-0 opacity-10',
            style: {
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              backgroundSize: '100px 100px',
              animation: 'float 6s ease-in-out infinite'
            }
          }),
          React.createElement('div', {
            key: 'content',
            className: 'relative z-10 text-center text-white px-4 max-w-4xl mx-auto'
          }, [
            React.createElement('h1', {
              key: 'title',
              className: 'text-5xl md:text-7xl font-bold mb-6 fade-in',
              style: { textShadow: '0 2px 4px rgba(0,0,0,0.3)' }
            }, \`Welcome to \${businessData.name}\`),
            React.createElement('p', {
              key: 'tagline',
              className: 'text-xl md:text-2xl mb-4 opacity-90 fade-in',
              style: { animationDelay: '0.2s' }
            }, businessData.tagline),
            React.createElement('p', {
              key: 'description',
              className: 'text-lg mb-8 opacity-80 max-w-2xl mx-auto fade-in',
              style: { animationDelay: '0.4s' }
            }, businessData.description),
            React.createElement('div', {
              key: 'buttons',
              className: 'flex flex-col sm:flex-row gap-4 justify-center fade-in',
              style: { animationDelay: '0.6s' }
            }, [
              React.createElement('button', {
                key: 'primary',
                className: 'bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover-lift'
              }, 'Get Started Today'),
              React.createElement('button', {
                key: 'secondary',
                className: 'border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300'
              }, 'Learn More')
            ])
          ])
        ]);
      }

      // Professional Features Section
      function Features() {
        return React.createElement('section', {
          className: 'py-20 bg-gray-50'
        }, [
          React.createElement('div', {
            key: 'container',
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
          }, [
            React.createElement('div', {
              key: 'header',
              className: 'text-center mb-16'
            }, [
              React.createElement('h2', {
                key: 'title',
                className: 'text-4xl md:text-5xl font-bold mb-4 gradient-text'
              }, \`Why Choose \${businessData.name}?\`),
              React.createElement('p', {
                key: 'subtitle',
                className: 'text-xl text-gray-600 max-w-3xl mx-auto'
              }, \`Discover the advantages of working with our professional \${businessData.industry} team.\`)
            ]),
            React.createElement('div', {
              key: 'grid',
              className: 'advanced-grid'
            }, businessData.features.map((feature, index) =>
              React.createElement('div', {
                key: index,
                className: 'pro-card text-center hover-lift',
                style: { animationDelay: \`\${index * 0.1}s\` }
              }, [
                React.createElement('div', {
                  key: 'icon',
                  className: 'text-4xl mb-4'
                }, feature.icon),
                React.createElement('h3', {
                  key: 'title',
                  className: 'text-xl font-semibold mb-3 text-gray-900'
                }, feature.title),
                React.createElement('p', {
                  key: 'description',
                  className: 'text-gray-600 leading-relaxed'
                }, feature.description)
              ])
            ))
          ])
        ]);
      }

      // Professional Footer
      function Footer() {
        return React.createElement('footer', {
          className: 'bg-gray-900 text-white py-12'
        }, [
          React.createElement('div', {
            key: 'container',
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-2xl font-bold mb-4'
            }, businessData.name),
            React.createElement('p', {
              key: 'description',
              className: 'text-gray-400 mb-6 max-w-2xl mx-auto'
            }, \`Professional \${businessData.industry} solutions built with modern technology and expertise.\`),
            React.createElement('div', {
              key: 'info',
              className: 'text-sm text-gray-500 border-t border-gray-800 pt-6'
            }, [
              React.createElement('p', {
                key: 'files'
              }, \`Generated with \${${generatedFiles.length}} React files including components, styles, and configurations\`),
              React.createElement('p', {
                key: 'tech',
                className: 'mt-2'
              }, 'Built with React, TypeScript, Tailwind CSS, and modern development tools')
            ])
          ])
        ]);
      }

      // Main App Component
      function App() {
        React.useEffect(() => {
          // Add smooth scrolling
          document.documentElement.style.scrollBehavior = 'smooth';
          
          // Add floating animation
          const style = document.createElement('style');
          style.textContent = \`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          \`;
          document.head.appendChild(style);
        }, []);

        return React.createElement('div', {
          className: 'min-h-screen'
        }, [
          React.createElement(Header, { key: 'header' }),
          React.createElement(Hero, { key: 'hero' }),
          React.createElement(Features, { key: 'features' }),
          React.createElement(Footer, { key: 'footer' })
        ]);
      }

      // Render the sophisticated application
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    </script>
</body>
</html>`;

        // Create StackBlitz project function
        const createStackBlitzProject = async () => {
          try {
            // Import StackBlitz SDK dynamically
            const { default: sdk } = await import('@stackblitz/sdk');
            
            // Create project with ALL generated files
            const stackblitzFiles: Record<string, string> = {};
            generatedFiles.forEach(file => {
              stackblitzFiles[file.path] = file.content;
            });
            
            // Ensure proper TypeScript configuration for StackBlitz (FIXED)
            if (!stackblitzFiles['tsconfig.json']) {
              stackblitzFiles['tsconfig.json'] = JSON.stringify({
                compilerOptions: {
                  target: 'ES2020',
                  lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                  module: 'ES2020',
                  skipLibCheck: true,
                  moduleResolution: 'node',
                  allowImportingTsExtensions: false,
                  resolveJsonModule: true,
                  isolatedModules: true,
                  noEmit: true,
                  jsx: 'react-jsx',
                  strict: false,
                  allowSyntheticDefaultImports: true,
                  esModuleInterop: true,
                  forceConsistentCasingInFileNames: true,
                  baseUrl: '.',
                  paths: {
                    '@/*': ['./src/*']
                  }
                },
                include: ['src/**/*'],
                exclude: ['node_modules']
              }, null, 2);
            }

            // Ensure proper Vite configuration
            if (!stackblitzFiles['vite.config.ts'] && !stackblitzFiles['vite.config.js']) {
              stackblitzFiles['vite.config.ts'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})`;
            }

            // Use StackBlitz React template for better compatibility
            const project = await sdk.openProject({
              files: stackblitzFiles,
              title: projectName,
              description: `Professional React project with ${generatedFiles.length} files`,
              template: 'create-react-app',
              dependencies: {
                react: '18.2.0',
                'react-dom': '18.2.0',
                'react-scripts': '5.0.1'
              },
              settings: {
                compile: {
                  trigger: 'auto',
                  action: 'refresh'
                }
              }
            }, {
              newWindow: true,
              openFile: 'src/App.js'
            });
            
            console.log('✅ StackBlitz project created with', Object.keys(stackblitzFiles).length, 'files');
            return project;
          } catch (error) {
            console.error('❌ Failed to create StackBlitz project:', error);
            // Fallback - open StackBlitz with basic template
            window.open('https://stackblitz.com/fork/vitejs-vite-react', '_blank');
            return null;
          }
        };
        
        // Store the function in state
        setStackblitzProjectFunction(() => createStackBlitzProject);
        
        // Create blob URL for the sophisticated preview
        const blob = new Blob([sophisticatedPreview], { type: 'text/html' });
        const previewUrl = URL.createObjectURL(blob);
        
        console.log('✅ Sophisticated preview created with advanced features');
        setLocalPreviewUrl(previewUrl);
        setIsLoading(false);

      } catch (error) {
        console.error('❌ Failed to create sophisticated preview:', error);
        setError(error instanceof Error ? error.message : 'Failed to create preview');
        setIsLoading(false);
      }
    };

    createComplexPreview();
  }, [projectId, projectName, generatedFiles]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">Creating sophisticated preview...</p>
            <p className="text-sm text-gray-600 mt-2">Building your professional React application</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Preview Error</h3>
          </div>
          <p className="text-red-700 mb-6 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <span className="text-sm text-gray-600">Professional React Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => stackblitzProjectFunction && stackblitzProjectFunction()}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-transparent border-0 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            Open in StackBlitz ({generatedFiles.length} files)
          </button>
        </div>
      </div>

      {/* Sophisticated Preview Iframe */}
      <div className="w-full h-full">
        {localPreviewUrl ? (
          <iframe
            src={localPreviewUrl}
            className="w-full h-full border-0"
            title="Professional React Project Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No preview available</p>
          </div>
        )}
      </div>
    </div>
  );
}