import { useState } from 'react';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

export default function Spotlight() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'help', name: 'Help', icon: '🤝' },
    { id: 'local', name: 'Local Business', icon: '🏪' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'utility', name: 'Utility Service', icon: '⚙️' }
  ];

  const featuredApps = [
    {
      id: 1,
      name: 'TaskMaster Pro',
      category: 'business',
      description: 'Advanced project management tool for teams',
      views: 12500,
      votes: 342,
      trending: true
    },
    {
      id: 2,
      name: 'TravelBuddy',
      category: 'travel',
      description: 'Smart travel planning companion',
      views: 8900,
      votes: 256,
      trending: false
    },
    {
      id: 3,
      name: 'HelpHub',
      category: 'help',
      description: 'Community support platform',
      views: 15600,
      votes: 489,
      trending: true
    },
    {
      id: 4,
      name: 'LocalFinder',
      category: 'local',
      description: 'Discover local businesses near you',
      views: 6700,
      votes: 178,
      trending: false
    },
    {
      id: 5,
      name: 'GameZone',
      category: 'entertainment',
      description: 'Gaming community hub',
      views: 18900,
      votes: 567,
      trending: true
    },
    {
      id: 6,
      name: 'FinanceTracker',
      category: 'finance',
      description: 'Personal expense tracking made easy',
      views: 11200,
      votes: 298,
      trending: false
    },
    {
      id: 7,
      name: 'ShopSmart',
      category: 'ecommerce',
      description: 'AI-powered shopping assistant',
      views: 14300,
      votes: 412,
      trending: true
    },
    {
      id: 8,
      name: 'UtilityPlus',
      category: 'utility',
      description: 'All-in-one utility toolkit',
      views: 9800,
      votes: 267,
      trending: false
    }
  ];

  const filteredApps = featuredApps.filter(app => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              🌟 Spotlight
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Submit your project and get featured. Top projects receive 5000 credits!
            </p>
            <button className="text-white px-8 py-4 font-medium text-lg transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(0, 0, 0)',
                borderRadius: '10px',
                boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
              }}>
              Submit Your App
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pr-12 bg-gray-100 rounded-[20px] text-gray-700 placeholder-gray-500 outline-none transition-all duration-200 focus:text-gray-900"
                style={{
                  boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'text-white hover:opacity-90'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedCategory === category.id ? {
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderRadius: '10px',
                    boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                  } : selectedCategory !== category.id ? {
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  } : {}}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* This Week's Top Apps */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">This Week's Top Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-100 rounded-[20px] p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.name}</h3>
                      <span className="text-sm text-gray-500 capitalize">{app.category}</span>
                    </div>
                    {app.trending && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        🔥 Trending
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{app.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm text-gray-600">{formatNumber(app.views)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-sm text-gray-600">{app.votes}</span>
                      </div>
                    </div>
                    <button className="text-black hover:text-gray-700 font-medium text-sm">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit App CTA */}
          <div className="text-center mt-12">
            <div className="bg-gray-50 rounded-[20px] p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to showcase your app?
              </h3>
              <p className="text-gray-600 mb-6">
                Submit your project to Spotlight and get a chance to win 5000 credits!
              </p>
              <button className="text-white px-8 py-4 font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                }}>
                Submit Your App Now
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
