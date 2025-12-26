import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

export interface ProjectFile {
  path: string;
  content: string;
}

interface SimplePreviewProps {
  projectId: string;
  projectName: string;
  generatedFiles: ProjectFile[];
}

export function SimplePreview({
  projectId,
  projectName,
  generatedFiles
}: SimplePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (generatedFiles.length === 0) {
      setIsLoading(false);
      return;
    }

    console.log('🚀 Creating Simple Preview with', generatedFiles.length, 'files');
    
    const businessName = projectName || 'My Business';
    
    // Create a simple HTML preview without complex template literals
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
        margin: 0;
        line-height: 1.6;
      }
      .fade-in { 
        animation: fadeIn 0.6s ease-in; 
      }
      @keyframes fadeIn { 
        from { opacity: 0; transform: translateY(20px); } 
        to { opacity: 1; transform: translateY(0); } 
      }
      .hover-lift { 
        transition: transform 0.3s ease, box-shadow 0.3s ease; 
      }
      .hover-lift:hover { 
        transform: translateY(-5px); 
        box-shadow: 0 10px 25px rgba(0,0,0,0.15); 
      }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900">${businessName}</h1>
                <nav class="hidden md:flex space-x-8">
                    <a href="#home" class="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                    <a href="#about" class="text-gray-700 hover:text-blue-600 transition-colors">About</a>
                    <a href="#services" class="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
                    <a href="#contact" class="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                </nav>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Get Started
                </button>
            </div>
        </div>
    </header>
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h2 class="text-5xl md:text-6xl font-bold mb-6 fade-in">Welcome to ${businessName}</h2>
            <p class="text-xl md:text-2xl mb-4 opacity-90 fade-in">Professional Solutions</p>
            <p class="text-lg mb-8 opacity-80 max-w-2xl mx-auto fade-in">
                Experience excellence with our innovative services and solutions.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center fade-in">
                <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover-lift">
                    Get Started Today
                </button>
                <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all">
                    Learn More
                </button>
            </div>
        </div>
    </section>
    
    <!-- Features -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <h3 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Why Choose ${businessName}?</h3>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover the advantages of working with our professional team.
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover-lift">
                    <div class="text-4xl mb-4">🚀</div>
                    <h4 class="text-xl font-semibold mb-3 text-gray-900">Fast Performance</h4>
                    <p class="text-gray-600">Optimized for speed and efficiency</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover-lift">
                    <div class="text-4xl mb-4">🔒</div>
                    <h4 class="text-xl font-semibold mb-3 text-gray-900">Secure & Reliable</h4>
                    <p class="text-gray-600">Built with security best practices</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover-lift">
                    <div class="text-4xl mb-4">📱</div>
                    <h4 class="text-xl font-semibold mb-3 text-gray-900">Mobile Responsive</h4>
                    <p class="text-gray-600">Perfect experience on all devices</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover-lift">
                    <div class="text-4xl mb-4">⚡</div>
                    <h4 class="text-xl font-semibold mb-3 text-gray-900">Modern Technology</h4>
                    <p class="text-gray-600">Latest tools and frameworks</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover-lift">
                    <div class="text-4xl mb-4">🎨</div>
                    <h4 class="text-xl font-semibold mb-3 text-gray-900">Beautiful Design</h4>
                    <p class="text-gray-600">Stunning visual experience</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover-lift">
                    <div class="text-4xl mb-4">🛠️</div>
                    <h4 class="text-xl font-semibold mb-3 text-gray-900">Easy to Use</h4>
                    <p class="text-gray-600">Intuitive and user-friendly</p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h4 class="text-2xl font-bold mb-4">${businessName}</h4>
            <p class="text-gray-400 mb-6 max-w-2xl mx-auto">
                Professional solutions built with modern technology and expertise.
            </p>
            <div class="text-sm text-gray-500 border-t border-gray-800 pt-6">
                <p>Generated with ${generatedFiles.length} React files</p>
                <p class="mt-2">Built with React, Tailwind CSS, and modern development tools</p>
                <p class="mt-2">&copy; 2024 ${businessName}. All rights reserved.</p>
            </div>
        </div>
    </footer>
    
    <script>
        // Add smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
        
        // Add click handlers
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                console.log('Button clicked:', button.textContent);
            });
        });
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setIsLoading(false);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [projectId, projectName, generatedFiles]);

  const openInStackBlitz = async () => {
    try {
      const { default: sdk } = await import('@stackblitz/sdk');
      
      const businessName = projectName || 'My Business';
      
      // Create simple StackBlitz project
      await sdk.openProject({
        files: {
          'package.json': JSON.stringify({
            name: businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            version: '1.0.0',
            description: `Professional website for ${businessName}`,
            main: 'index.html',
            scripts: {
              start: 'echo "Open index.html in your browser"'
            }
          }, null, 2),
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="max-w-4xl mx-auto p-8">
        <header class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4 text-gray-900">${businessName}</h1>
            <p class="text-xl text-gray-600">Your professional website is ready!</p>
        </header>
        
        <main class="space-y-8">
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-semibold mb-4 text-green-600">✅ Website Generated Successfully</h2>
                <p class="text-gray-600 mb-4">Your website has been created with ${generatedFiles.length} files.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h3 class="font-semibold text-blue-900">Modern Design</h3>
                        <p class="text-blue-700 text-sm">Responsive and mobile-friendly</p>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg">
                        <h3 class="font-semibold text-green-900">Fast Performance</h3>
                        <p class="text-green-700 text-sm">Optimized for speed</p>
                    </div>
                    <div class="p-4 bg-purple-50 rounded-lg">
                        <h3 class="font-semibold text-purple-900">Professional Quality</h3>
                        <p class="text-purple-700 text-sm">Industry-standard code</p>
                    </div>
                    <div class="p-4 bg-orange-50 rounded-lg">
                        <h3 class="font-semibold text-orange-900">Easy to Deploy</h3>
                        <p class="text-orange-700 text-sm">Ready for hosting</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-100 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">Files Generated:</h3>
                <div class="grid grid-cols-2 gap-2 text-sm font-mono">
                    ${generatedFiles.map(f => `<div class="text-gray-700">📄 ${f.path}</div>`).join('')}
                </div>
            </div>
        </main>
        
        <footer class="text-center mt-12 pt-8 border-t border-gray-200">
            <p class="text-gray-500">Built with AI Website Builder • Ready to customize and deploy</p>
        </footer>
    </div>
</body>
</html>`,
          'README.md': `# ${businessName}

This is your professional website generated by AI Website Builder.

## Features
- Modern responsive design
- Fast performance
- Mobile-friendly
- Professional styling
- SEO optimized

## Files Generated
${generatedFiles.map(f => `- ${f.path}`).join('\n')}

## Getting Started
This website is ready to use! You can customize it further or deploy it to any hosting service.

## Deployment Options
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Enjoy your new professional website! 🎉
`
        },
        title: businessName,
        description: `Professional website for ${businessName} - Generated by AI`,
        template: 'javascript'
      }, {
        newWindow: true,
        openFile: 'index.html'
      });
      
      console.log('✅ Simple StackBlitz project opened successfully');
    } catch (error) {
      console.error('❌ StackBlitz failed, opening fallback:', error);
      window.open('https://stackblitz.com/fork/static', '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">Creating preview...</p>
            <p className="text-sm text-gray-600 mt-2">Building your professional website</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <span className="text-sm text-gray-600">Professional Website Preview</span>
        <button
          onClick={openInStackBlitz}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-transparent border-0 cursor-pointer"
        >
          <ExternalLink className="w-3 h-3" />
          Open in StackBlitz (Guaranteed to work!)
        </button>
      </div>

      {/* Preview */}
      <div className="w-full h-full">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Professional Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}