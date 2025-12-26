// Static React Project Generator - Fallback when AI providers are rate limited
// Creates a basic React project without AI generation

export interface StaticProjectFile {
  path: string;
  content: string;
  language: string;
}

export class StaticReactGenerator {
  static generateBasicProject(prompt: string): StaticProjectFile[] {
    const projectName = prompt.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20) || 'my-website';
    
    const files: StaticProjectFile[] = [
      // Package.json
      {
        path: 'package.json',
        language: 'json',
        content: JSON.stringify({
          name: projectName,
          version: '1.0.0',
          private: true,
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            'react-scripts': '5.0.1',
            'web-vitals': '^2.1.4'
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build',
            test: 'react-scripts test',
            eject: 'react-scripts eject'
          },
          eslintConfig: {
            extends: ['react-app', 'react-app/jest']
          },
          browserslist: {
            production: ['>0.2%', 'not dead', 'not op_mini all'],
            development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
          }
        }, null, 2)
      },
      
      // Public/index.html
      {
        path: 'public/index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Generated React website" />
    <title>${prompt}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
      },
      
      // src/index.js
      {
        path: 'src/index.js',
        language: 'javascript',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      },
      
      // src/App.js
      {
        path: 'src/App.js',
        language: 'javascript',
        content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Website</h1>
        <p>
          This is a basic React website generated for: <strong>${prompt}</strong>
        </p>
        <p>
          AI providers are currently rate limited, but your website is ready!
        </p>
        <div className="features">
          <div className="feature">
            <h3>🚀 Fast</h3>
            <p>Built with React for optimal performance</p>
          </div>
          <div className="feature">
            <h3>📱 Responsive</h3>
            <p>Works perfectly on all devices</p>
          </div>
          <div className="feature">
            <h3>🎨 Customizable</h3>
            <p>Easy to modify and extend</p>
          </div>
        </div>
        <button className="cta-button" onClick={() => alert('Welcome to your new website!')}>
          Get Started
        </button>
      </header>
    </div>
  );
}

export default App;`
      },
      
      // src/App.css
      {
        path: 'src/App.css',
        language: 'css',
        content: `.App {
  text-align: center;
}

.App-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.App-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.App-header p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  max-width: 800px;
}

.feature {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature p {
  font-size: 1rem;
  margin: 0;
}

.cta-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: 2rem;
}

.cta-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

@media (max-width: 768px) {
  .App-header h1 {
    font-size: 2rem;
  }
  
  .App-header p {
    font-size: 1rem;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}`
      },
      
      // src/index.css
      {
        path: 'src/index.css',
        language: 'css',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}`
      }
    ];
    
    return files;
  }
}