import { useState, useEffect } from 'react';

const menuItems = [
  { name: 'Settings', section: 'Project settings' },
  { name: 'Assets', section: 'Project settings', shortcut: 'Ctrl U' },
  { name: 'Publishing', section: 'Project settings' },
  { name: 'Secrets', section: 'Project settings' },
  { name: 'Knowledge', section: 'Project settings' },
  { name: 'Domains', section: 'Global settings' },
];

export default function SettingsTabContent() {
  const [activeMenuItem, setActiveMenuItem] = useState('Settings');
  const [projectName, setProjectName] = useState('ChatAI');
  const [description, setDescription] = useState('AI-powered chat assistant');
  const [visibility, setVisibility] = useState('Public');
  const [showWatermark, setShowWatermark] = useState(true);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

  // API Key Management State
  const [apiKeys, setApiKeys] = useState<{ service: string, keyName: string, preview: string, created: string }[]>([]);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKeyService, setNewKeyService] = useState('OpenAI');
  const [newKeyValue, setNewKeyValue] = useState('');

  const SUPPORTED_KEYS = [
    { label: 'OpenAI', key: 'VITE_OPENAI_API_KEY' },
    { label: 'Anthropic', key: 'VITE_ANTHROPIC_API_KEY' },
    { label: 'Google Gemini', key: 'VITE_GOOGLE_API_KEY' },
    { label: 'Groq', key: 'VITE_GROQ_API_KEY' },
    { label: 'OpenRouter', key: 'VITE_OPENROUTER_API_KEY' },
    { label: 'Grok (xAI)', key: 'VITE_GROK_API_KEY' },
    { label: 'Stability AI', key: 'VITE_STABILITY_API_KEY_1' },
    { label: 'Replicate', key: 'VITE_REPLICATE_API_KEY_1' },
    { label: 'Fal.ai', key: 'VITE_FAL_API_KEY_1' },
    { label: 'Runway', key: 'VITE_RUNWAY_API_KEY_1' },
    { label: 'Unsplash', key: 'VITE_UNSPLASH_ACCESS_KEY' },
    { label: 'HuggingFace', key: 'VITE_HUGGINGFACE_API_KEY' },
    { label: 'Qubrid', key: 'VITE_QUBRID_API_KEY' },
    { label: 'Chute', key: 'VITE_CHUTE_API_KEY' },
    { label: 'AIML', key: 'VITE_AIML_API_KEY' },
    { label: 'ZAI', key: 'VITE_ZAI_API_KEY' }
  ];

  useEffect(() => {
    // Load existing keys from localStorage
    const loadedKeys = [];
    for (const def of SUPPORTED_KEYS) {
      const val = localStorage.getItem(def.key);
      if (val) {
        loadedKeys.push({
          service: def.label,
          keyName: def.key,
          preview: val.substring(0, 3) + '...' + val.substring(val.length - 4),
          created: 'Local'
        });
      }
    }
    setApiKeys(loadedKeys);
  }, [activeMenuItem]);

  const handleSaveKey = () => {
    const def = SUPPORTED_KEYS.find(k => k.label === newKeyService);
    if (def && newKeyValue) {
      localStorage.setItem(def.key, newKeyValue);
      setNewKeyValue('');
      setShowAddKeyModal(false);
      // Refresh list
      const val = newKeyValue;
      setApiKeys(prev => [
        ...prev.filter(p => p.keyName !== def.key),
        {
          service: def.label,
          keyName: def.key,
          preview: val.substring(0, 3) + '...' + val.substring(val.length - 4),
          created: 'Just now'
        }
      ]);
      alert(`Refreshed ${def.label} configuration. Changes apply immediately.`);
    }
  };

  const handleDeleteKey = (keyName: string) => {
    localStorage.removeItem(keyName);
    setApiKeys(prev => prev.filter(p => p.keyName !== keyName));
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - Settings Menu */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">Project settings</h3>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: 'rgb(245, 245, 245)',
              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          {/* Project settings section */}
          <div className="py-2">
            {menuItems
              .filter((item) => item.section === 'Project settings')
              .map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveMenuItem(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 rounded-lg ${activeMenuItem === item.name ? 'bg-gray-100' : ''
                    }`}
                  style={{
                    backgroundColor: activeMenuItem === item.name ? 'rgb(245, 245, 245)' : 'transparent',
                    boxShadow: activeMenuItem === item.name
                      ? 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                      : 'none'
                  }}
                >
                  <span className="text-gray-900">{item.name}</span>
                  {item.shortcut && (
                    <span className="text-xs text-gray-400">{item.shortcut}</span>
                  )}
                </button>
              ))}
          </div>

          {/* Global settings section */}
          <div className="border-t border-gray-200 py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Global settings
            </div>
            {menuItems
              .filter((item) => item.section === 'Global settings')
              .map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveMenuItem(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 rounded-lg ${activeMenuItem === item.name ? 'bg-gray-100' : ''
                    }`}
                  style={{
                    backgroundColor: activeMenuItem === item.name ? 'rgb(245, 245, 245)' : 'transparent',
                    boxShadow: activeMenuItem === item.name
                      ? 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                      : 'none'
                  }}
                >
                  <span className="text-gray-900">{item.name}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="flex-1 bg-white overflow-auto">
        {activeMenuItem === 'Settings' && (
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

            <div className="space-y-8">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Project name
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  This name will be displayed to people who visit your app.
                </p>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  A short description of your project, which may be displayed in search results.
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={280}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {description.length}/280
                </div>
              </div>

              {/* Project Size */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Project size
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Upgrade your plan
                </a>
                <span className="text-sm text-gray-500"> to enable larger project sizes.</span>
                <div className="mt-3 flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-800 h-2 rounded-full" style={{ width: '9%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">9%</span>
                </div>
              </div>

              {/* Project Visibility */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Project visibility
                    </label>
                    <span className="text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>

                  {/* Hero-style Dropdown - moved to right */}
                  <div className="relative">
                    <button
                      onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
                      className="flex items-center space-x-2 text-gray-700 font-medium bg-gray-100 rounded-[10px] px-4 py-2 outline-none cursor-pointer transition-colors"
                      style={{
                        boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                      }}>
                      <span>{visibility}</span>
                      <svg width="16" height="16" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className={`transition-transform ${showVisibilityDropdown ? 'rotate-180' : ''}`}>
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </button>

                    {showVisibilityDropdown && (
                      <div className="absolute bottom-full right-0 mb-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                        <div className="p-4">
                          <button
                            onClick={() => {
                              setVisibility('Public');
                              setShowVisibilityDropdown(false);
                            }}
                            className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${visibility === 'Public' ? 'bg-gray-100' : ''
                              }`}
                            style={{
                              boxShadow: visibility === 'Public' ? 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset' : 'none'
                            }}>
                            <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Public</div>
                              <div className="text-sm text-gray-600">Anyone can view and clone</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setVisibility('Private (Pro)');
                              setShowVisibilityDropdown(false);
                            }}
                            className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${visibility === 'Private (Pro)' ? 'bg-gray-100' : ''
                              }`}
                            style={{
                              boxShadow: visibility === 'Private (Pro)' ? 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset' : 'none'
                            }}>
                            <svg className="w-4 h-4 text-gray-700 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Private (Pro)</div>
                              <div className="text-sm text-gray-600">Not cloneable by others</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    Upgrade your plan
                  </a>{' '}
                  to make your project private and prevent others from cloning it.
                </p>
              </div>

              {/* Show Watermark */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <label className="block text-sm font-medium text-gray-900">
                        Show watermark
                      </label>
                      <span className="text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                        Upgrade your plan
                      </a>{' '}
                      to remove the watermark.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenuItem === 'Assets' && (
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Assets</h1>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 mb-8 hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center text-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-1">Drag and drop files here</p>
                <p className="text-gray-400 text-sm">or click to upload</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Upload Button */}
            <div className="flex justify-end">
              <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors">
                Upload asset
              </button>
            </div>
          </div>
        )}

        {activeMenuItem === 'Publishing' && (
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Publishing</h1>

            {/* Default Domain Section */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-2">Default domain</h2>
              <p className="text-sm text-gray-500 mb-4">
                You're almost there — <a href="#" className="text-gray-700 underline hover:text-gray-900">upgrade</a> to customize this domain.
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  defaultValue="jm36jsglgw76e"
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500 font-medium">.mocha.app</span>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Publish
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Linked Domains Section */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Linked domains</h2>
              <p className="text-sm text-gray-500">
                To link and add more domains please navigate to <a href="#" className="text-gray-700 underline hover:text-gray-900">Domains</a>.
              </p>
            </div>
          </div>
        )}

        {activeMenuItem === 'Secrets' && (
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Secrets</h1>

            <div className="space-y-6">
              {/* Environment Variables */}
              {/* Vercel Configuration */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Vercel Configuration</h2>
                    <p className="text-sm text-gray-500">Configure your Vercel API token for one-click publishing.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vercel API Token
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="v2_..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={localStorage.getItem('VERCEL_TOKEN') || ''}
                        onChange={(e) => {
                          localStorage.setItem('VERCEL_TOKEN', e.target.value);
                        }}
                      />
                      <button
                        className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black transition-colors"
                        onClick={() => alert('Token saved!')}
                      >
                        Save
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      You can generate a token in your <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel Account Settings</a>.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Keys */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">API keys</h2>
                    <p className="text-sm text-gray-500">Manage API keys for external services (OpenAI, Stability, etc.)</p>
                  </div>
                  <button
                    onClick={() => setShowAddKeyModal(true)}
                    className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Add API key
                  </button>
                </div>

                {/* API Keys Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Key Preview
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {apiKeys.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                              <p>No API keys configured</p>
                              <p className="text-sm mt-1">Add API keys to connect external services</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        apiKeys.map((k) => (
                          <tr key={k.keyName}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{k.service}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 font-mono">{k.preview}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded text-xs ${k.created === 'Local' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                {k.created}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => handleDeleteKey(k.keyName)}
                                className="text-red-600 hover:text-red-800 font-medium hover:underline">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Key Modal */}
              {showAddKeyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                  <div className="bg-white rounded-xl p-6 w-[500px] shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Add API Key</h2>
                      <button onClick={() => setShowAddKeyModal(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Service Provider</label>
                        <select
                          className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none"
                          value={newKeyService}
                          onChange={(e) => setNewKeyService(e.target.value)}
                        >
                          {SUPPORTED_KEYS.map(s => (
                            <option key={s.label} value={s.label}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">API Key</label>
                        <input
                          type="password"
                          className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none font-mono"
                          placeholder="sk-..."
                          value={newKeyValue}
                          onChange={(e) => setNewKeyValue(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Key will be stored locally in your browser.</p>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setShowAddKeyModal(false)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveKey}
                          disabled={!newKeyValue}
                          className="px-5 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-black/20">
                          Save Key
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Security notice</p>
                    <p>All secrets are encrypted and stored securely. They are only accessible to your project and are never exposed to client-side code.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenuItem === 'Knowledge' && (
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Knowledge</h1>

            <div className="space-y-6">
              {/* Documentation */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Documentation</h2>
                    <p className="text-sm text-gray-500">Add project documentation to help AI understand your codebase.</p>
                  </div>
                  <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Add documentation
                  </button>
                </div>

                {/* Documentation Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Updated
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>No documentation added yet</p>
                            <p className="text-sm mt-1">Add documentation files to help AI understand your project</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Context Files */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Context files</h2>
                    <p className="text-sm text-gray-500">Upload code files and examples for AI context.</p>
                  </div>
                  <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Upload context
                  </button>
                </div>

                {/* Context Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          File
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Language
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Lines
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Added
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <p>No context files uploaded</p>
                            <p className="text-sm mt-1">Upload code files to provide AI with better context</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">AI assistance</p>
                    <p>The more documentation and context you provide, the better AI can understand your project and provide accurate assistance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenuItem === 'Domains' && (
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Domains</h1>
            <p className="text-gray-500">Connect custom domains and configure SSL certificates for your project.</p>
          </div>
        )}
      </div>
    </div>
  );
}
