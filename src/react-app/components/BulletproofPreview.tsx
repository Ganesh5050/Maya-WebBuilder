import { useEffect, useState, useRef } from 'react';
import { inspectorScript } from '../../lib/inspectorScript';
import { ExternalLink, AlertCircle } from 'lucide-react';

export interface ProjectFile {
  path: string;
  content: string;
}

interface BulletproofPreviewProps {
  projectId: string;
  projectName: string;
  generatedFiles: ProjectFile[];
  inspectorMode?: boolean;
}

export function BulletproofPreview({
  projectId,
  projectName,
  generatedFiles,
  inspectorMode = false
}: BulletproofPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send inspector toggle when mode changes
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      console.log('🔄 Sending TOGGLE_INSPECTOR:', inspectorMode);
      iframeRef.current.contentWindow.postMessage({
        type: 'TOGGLE_INSPECTOR',
        active: inspectorMode
      }, '*');
    }
  }, [inspectorMode, previewUrl]);

  useEffect(() => {
    if (generatedFiles.length === 0) {
      setError('No files to preview');
      setIsLoading(false);
      return;
    }

    console.log('🚀 Creating BULLETPROOF Preview with', generatedFiles.length, 'files');

    // CHECK FOR PRE-RENDERED PREVIEW.HTML (From Enhanced Generator)
    const previewFile = generatedFiles.find(f => f.path === 'preview.html');
    if (previewFile) {
      console.log('✨ Found generated preview.html, using dynamic content!');

      // Inject Inspector Script before closing body
      let htmlContent = previewFile.content;
      if (!htmlContent.includes('inspectorScript')) {
        htmlContent = htmlContent.replace('</body>', `<script>${inspectorScript}</script></body>`);
      }

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setIsLoading(false);
      return () => URL.revokeObjectURL(url);
    }

    // FALLBACK: Generic Template (only used if preview.html is missing)
    const businessName = projectName || 'My Business';

    // Create the most reliable HTML preview possible
    const bulletproofHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      * { box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
        margin: 0;
        line-height: 1.6;
        color: #333;
      }
      .fade-in { 
        animation: fadeIn 0.8s ease-out; 
      }
      @keyframes fadeIn { 
        from { opacity: 0; transform: translateY(30px); } 
        to { opacity: 1; transform: translateY(0); } 
      }
      .hover-lift { 
        transition: all 0.3s ease; 
      }
      .hover-lift:hover { 
        transform: translateY(-8px); 
        box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
      }
      .gradient-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .success-badge {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Success Banner -->
    <div class="bg-green-50 border-b border-green-200 py-3">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <span class="success-badge">
                ✅ Website Generated Successfully! ${generatedFiles.length} files created
            </span>
        </div>
    </div>

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">${businessName}</h1>
                    <p class="text-gray-600 mt-1">Professional Website • AI Generated</p>
                </div>
                <nav class="flex flex-wrap gap-6">
                    <a href="#home" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
                    <a href="#about" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
                    <a href="#services" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
                    <a href="#contact" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
                </nav>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                    Get Started
                </button>
            </div>
        </div>
    </header>
    
    <!-- Hero Section -->
    <section id="home" class="gradient-bg text-white py-24">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <div class="fade-in">
                <h2 class="text-5xl md:text-7xl font-bold mb-6">Welcome to ${businessName}</h2>
                <p class="text-xl md:text-2xl mb-4 opacity-90">Professional Solutions for Modern Businesses</p>
                <p class="text-lg mb-10 opacity-80 max-w-3xl mx-auto">
                    Experience excellence with our innovative services and cutting-edge solutions designed to elevate your business to new heights.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover-lift">
                        Start Your Journey
                    </button>
                    <button class="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Features Section -->
    <section id="services" class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-20 fade-in">
                <h3 class="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Why Choose ${businessName}?</h3>
                <p class="text-xl text-gray-600 max-w-4xl mx-auto">
                    Discover the advantages that set us apart and make us the preferred choice for businesses worldwide.
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-gray-50 p-8 rounded-2xl text-center hover-lift fade-in">
                    <div class="text-5xl mb-6">🚀</div>
                    <h4 class="text-2xl font-bold mb-4 text-gray-900">Lightning Fast</h4>
                    <p class="text-gray-600 leading-relaxed">Optimized for maximum speed and performance with cutting-edge technology.</p>
                </div>
                <div class="bg-gray-50 p-8 rounded-2xl text-center hover-lift fade-in">
                    <div class="text-5xl mb-6">🔒</div>
                    <h4 class="text-2xl font-bold mb-4 text-gray-900">Ultra Secure</h4>
                    <p class="text-gray-600 leading-relaxed">Built with enterprise-grade security and industry best practices.</p>
                </div>
                <div class="bg-gray-50 p-8 rounded-2xl text-center hover-lift fade-in">
                    <div class="text-5xl mb-6">📱</div>
                    <h4 class="text-2xl font-bold mb-4 text-gray-900">Mobile First</h4>
                    <p class="text-gray-600 leading-relaxed">Perfect experience across all devices and screen sizes.</p>
                </div>
                <div class="bg-gray-50 p-8 rounded-2xl text-center hover-lift fade-in">
                    <div class="text-5xl mb-6">⚡</div>
                    <h4 class="text-2xl font-bold mb-4 text-gray-900">Modern Tech</h4>
                    <p class="text-gray-600 leading-relaxed">Latest frameworks and tools for superior performance.</p>
                </div>
                <div class="bg-gray-50 p-8 rounded-2xl text-center hover-lift fade-in">
                    <div class="text-5xl mb-6">🎨</div>
                    <h4 class="text-2xl font-bold mb-4 text-gray-900">Beautiful Design</h4>
                    <p class="text-gray-600 leading-relaxed">Stunning visuals that captivate and engage your audience.</p>
                </div>
                <div class="bg-gray-50 p-8 rounded-2xl text-center hover-lift fade-in">
                    <div class="text-5xl mb-6">🛠️</div>
                    <h4 class="text-2xl font-bold mb-4 text-gray-900">Easy to Use</h4>
                    <p class="text-gray-600 leading-relaxed">Intuitive interface designed for seamless user experience.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div class="fade-in">
                    <h3 class="text-4xl font-bold mb-6 text-gray-900">About ${businessName}</h3>
                    <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                        We are a forward-thinking company dedicated to delivering exceptional solutions that drive success. 
                        Our team of experts combines innovation with reliability to create outstanding results.
                    </p>
                    <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                        With years of experience and a commitment to excellence, we've helped countless businesses 
                        achieve their goals and exceed their expectations.
                    </p>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                        Learn Our Story
                    </button>
                </div>
                <div class="fade-in">
                    <div class="bg-white p-8 rounded-2xl shadow-lg">
                        <h4 class="text-2xl font-bold mb-6 text-gray-900">Project Details</h4>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="font-medium text-gray-700">Files Generated:</span>
                                <span class="font-bold text-blue-600">${generatedFiles.length}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="font-medium text-gray-700">Technology:</span>
                                <span class="font-bold text-green-600">React + Tailwind</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="font-medium text-gray-700">Status:</span>
                                <span class="font-bold text-green-600">✅ Ready</span>
                            </div>
                            <div class="flex justify-between items-center py-2">
                                <span class="font-medium text-gray-700">Generated:</span>
                                <span class="font-bold text-gray-600">Just Now</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-white">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <div class="fade-in">
                <h3 class="text-4xl font-bold mb-6 text-gray-900">Ready to Get Started?</h3>
                <p class="text-xl text-gray-600 mb-10">
                    Contact us today to learn how ${businessName} can help transform your business.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors">
                        Contact Us Now
                    </button>
                    <button class="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-4 rounded-lg font-bold text-lg transition-all">
                        Request Quote
                    </button>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center">
                <h4 class="text-3xl font-bold mb-4">${businessName}</h4>
                <p class="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                    Professional solutions built with modern technology, AI-powered innovation, and expert craftsmanship.
                </p>
                <div class="border-t border-gray-800 pt-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <p>Generated with ${generatedFiles.length} React files • Built with AI Website Builder</p>
                        <p>&copy; 2024 ${businessName}. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    
    <script>
        // Add smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
        
        // Add click handlers for buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('Button clicked:', button.textContent);
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.6);transform:scale(0);animation:ripple 0.6s linear;pointer-events:none;';
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
        document.head.appendChild(style);
        
        console.log('🎉 ${businessName} website loaded successfully!');
        console.log('📊 Generated with ${generatedFiles.length} files');
    </script>
    <script>${inspectorScript}</script>
</body>
</html>`;

    const blob = new Blob([bulletproofHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setIsLoading(false);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [projectId, projectName, generatedFiles]);

  const openInStackBlitz = () => {
    const businessName = projectName || 'My Business';

    // Use StackBlitz URL-based approach (most reliable)
    const stackblitzUrl = 'https://stackblitz.com/fork/js?' + new URLSearchParams({
      title: businessName,
      description: `Professional website for ${businessName} - Generated by AI`,
      file: 'index.html'
    }).toString();

    console.log('🚀 Opening StackBlitz with URL approach (most reliable)');
    window.open(stackblitzUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-blue-600 absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">Creating your professional website...</p>
            <p className="text-sm text-gray-600 mt-2">Building bulletproof preview with {generatedFiles.length} files</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Preview Error</h3>
          </div>
          <p className="text-red-700 mb-6 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Bulletproof Preview • {generatedFiles.length} files</span>
        </div>
        <button
          onClick={openInStackBlitz}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-all font-medium"
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
            title="Bulletproof Professional Website Preview"
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms"
            ref={iframeRef}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading bulletproof preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}