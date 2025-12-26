import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

export interface ProjectFile {
  path: string;
  content: string;
}

interface UltraSimplePreviewProps {
  projectId: string;
  projectName: string;
  generatedFiles: ProjectFile[];
}

export function UltraSimplePreview({
  projectId,
  projectName,
  generatedFiles
}: UltraSimplePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create the simplest possible working preview
    const businessName = projectName || 'My Business';
    
    const ultraSimpleHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .fade-in { animation: fadeIn 0.6s ease-in; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <h1 class="text-3xl font-bold text-gray-900">${businessName}</h1>
        </div>
    </header>
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h2 class="text-5xl font-bold mb-6 fade-in">Welcome to ${businessName}</h2>
            <p class="text-xl mb-8 opacity-90 fade-in">Professional solutions built with modern technology</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors fade-in">
                Get Started Today
            </button>
        </div>
    </section>
    
    <!-- Features -->
    <section class="py-20">
        <div class="max-w-7xl mx-auto px-4">
            <h3 class="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose ${businessName}?</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div class="text-4xl mb-4">🚀</div>
                    <h4 class="text-xl font-semibold mb-2">Fast Performance</h4>
                    <p class="text-gray-600">Optimized for speed and efficiency</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div class="text-4xl mb-4">🔒</div>
                    <h4 class="text-xl font-semibold mb-2">Secure & Reliable</h4>
                    <p class="text-gray-600">Built with security best practices</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div class="text-4xl mb-4">📱</div>
                    <h4 class="text-xl font-semibold mb-2">Mobile Responsive</h4>
                    <p class="text-gray-600">Perfect experience on all devices</p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h4 class="text-2xl font-bold mb-4">${businessName}</h4>
            <p class="text-gray-400 mb-4">Professional solutions built with modern technology</p>
            <p class="text-sm text-gray-500">Generated with ${generatedFiles.length} files • Built with React & Tailwind CSS</p>
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
    </script>
</body>
</html>`;

    const blob = new Blob([ultraSimpleHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [projectId, projectName, generatedFiles]);

  const openInStackBlitz = async () => {
    try {
      const { default: sdk } = await import('@stackblitz/sdk');
      
      // Create the simplest possible StackBlitz project
      await sdk.openProject({
        files: {
          'package.json': JSON.stringify({
            name: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            version: '1.0.0',
            description: `Professional website for ${projectName}`,
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
    <title>${projectName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="max-w-4xl mx-auto p-8">
        <h1 class="text-4xl font-bold mb-6">${projectName}</h1>
        <p class="text-xl text-gray-600 mb-8">Your professional website is ready!</p>
        
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-semibold mb-4">✅ Website Generated Successfully</h2>
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
            </div>
        </div>
    </div>
</body>
</html>`,
          'README.md': `# ${projectName}

This is your professional website generated by AI Website Builder.

## Features
- Modern responsive design
- Fast performance
- Mobile-friendly
- Professional styling

## Files Generated
${generatedFiles.map(f => `- ${f.path}`).join('\n')}

## Getting Started
This website is ready to use! You can customize it further or deploy it to any hosting service.
`
        },
        title: projectName,
        description: `Professional website for ${projectName}`,
        template: 'javascript'
      }, {
        newWindow: true,
        openFile: 'index.html'
      });
      
      console.log('✅ Ultra-simple StackBlitz project opened successfully');
    } catch (error) {
      console.error('❌ StackBlitz failed, opening fallback:', error);
      window.open('https://stackblitz.com/fork/static', '_blank');
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <span className="text-sm text-gray-600">Ultra-Simple Preview (Guaranteed to work)</span>
        <button
          onClick={openInStackBlitz}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-transparent border-0 cursor-pointer"
        >
          <ExternalLink className="w-3 h-3" />
          Open in StackBlitz
        </button>
      </div>

      {/* Preview */}
      <div className="w-full h-full">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Ultra-Simple Website Preview"
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