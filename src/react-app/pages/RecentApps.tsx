import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Grid3X3, Clock, Star, Settings, Search, ExternalLink } from 'lucide-react';
import UserProfileDropdown from '@/react-app/components/UserProfileDropdown';
import { getRecentApps, toggleStar, updateLastAccessed, App } from '@/react-app/data/appsData';

export default function RecentApps() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery] = useState('');
  const [recentApps, setRecentApps] = useState<App[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRecentApps(getRecentApps());
  }, []);

  const handleToggleStar = (appId: number) => {
    toggleStar(appId);
    setRecentApps(getRecentApps()); // Refresh the list
  };

  const handleAppClick = (appId: number) => {
    updateLastAccessed(appId); // Update last accessed time
    navigate(`/apps/${appId}`); // Use React Router navigation
  };

  const filteredApps = recentApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">Mocha</span>
            </a>
          </div>
          <UserProfileDropdown />
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          {/* Apps section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Apps</h3>
              <a href="/apps/new" className="px-4 py-2 font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  color: 'rgb(255, 255, 255)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                }}
              >
                Create new app
              </a>
            </div>
            <nav className="space-y-2">
              <a 
                href="/apps" 
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(245, 245, 245)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                }}
              >
                <Grid3X3 className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">All apps</span>
              </a>
              <a 
                href="/apps/recent" 
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                }}
              >
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white">Recent</span>
              </a>
              <a 
                href="/apps/starred" 
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(245, 245, 245)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                }}
              >
                <Star className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Starred</span>
              </a>
            </nav>
          </div>

          {/* Settings section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Settings</h3>
            <nav className="space-y-2">
              <a 
                href="/apps/settings/subscription" 
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(245, 245, 245)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                }}
              >
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Subscription & Billing</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-3">
              {['Dashboard', 'Learn', 'Spotlight'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                  onClick={() => {
                    if (tab === 'Spotlight') {
                      window.location.href = '/spotlight';
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  style={{
                    backgroundColor: activeTab === tab ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 245)',
                    borderRadius: '10px',
                    boxShadow: activeTab === tab
                      ? 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                      : 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>
            <a href="/apps/new" className="px-4 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(0, 0, 0)',
                color: 'rgb(255, 255, 255)',
                borderRadius: '10px',
                boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
              }}
            >
              Create new app
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">Recent apps</h1>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recent apps..."
                  className="w-full px-4 py-3 text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'rgb(245, 245, 245)',
                    borderRadius: '10px',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                  }}
                />
                <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Recent Apps Grid */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {filteredApps.length > 0 ? (
                <>
                  {/* Table Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                      <div className="col-span-5">Name</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-3">Visibility</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                  </div>

                  {/* App Rows */}
                  <div className="divide-y divide-gray-200">
                    {filteredApps.map((app) => (
                      <div key={app.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-5 flex items-center space-x-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(app.id);
                              }}
                              className={`text-gray-400 hover:text-yellow-500 transition-colors ${
                                app.starred ? 'text-yellow-500' : ''
                              }`}
                            >
                              <Star className={`w-4 h-4 ${app.starred ? 'fill-current' : ''}`} />
                            </button>
                            <div>
                              <button 
                                onClick={() => handleAppClick(app.id)}
                                className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
                              >
                                {app.name}
                              </button>
                              <div className="text-sm text-blue-600 hover:text-blue-800">
                                {app.url}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {app.status}
                            </span>
                          </div>
                          <div className="col-span-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {app.visibility}
                            </span>
                          </div>
                          <div className="col-span-1 flex items-center space-x-2">
                            <button 
                              onClick={() => handleAppClick(app.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent apps</h3>
                  <p className="text-gray-600 mb-6">Your recently accessed apps will appear here</p>
                  <a href="/apps/new" className="px-4 py-2 font-medium transition-all duration-200 hover:opacity-90 inline-block"
                    style={{
                      backgroundColor: 'rgb(0, 0, 0)',
                      color: 'rgb(255, 255, 255)',
                      borderRadius: '10px',
                      boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                    }}
                  >
                    Create your first app
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
