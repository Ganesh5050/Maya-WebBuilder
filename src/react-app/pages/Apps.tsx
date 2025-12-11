import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Grid3X3, Clock, Star, Settings, MoreHorizontal, Search, ExternalLink } from 'lucide-react';
import UserProfileDropdown from '@/react-app/components/UserProfileDropdown';
import { databaseService, App } from '@/services/databaseService';
import { useAuth } from '@/contexts/AuthContext';

export default function Apps() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadApps = async () => {
      if (user) {
        try {
          const userApps = await databaseService.getUserApps(user.id);
          setApps(userApps);
        } catch (error) {
          console.error('Error loading apps:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadApps();
    
    // Listen for apps data changes from other components
    const handleAppsDataChanged = () => {
      loadApps();
    };
    
    window.addEventListener('appsDataChanged', handleAppsDataChanged);
    
    return () => {
      window.removeEventListener('appsDataChanged', handleAppsDataChanged);
    };
  }, [user]);

  const handleToggleStar = async (appId: string) => {
    if (user) {
      try {
        await databaseService.toggleStar(appId, user.id);
        const userApps = await databaseService.getUserApps(user.id);
        setApps(userApps);
        window.dispatchEvent(new CustomEvent('appsDataChanged'));
      } catch (error) {
        console.error('Error toggling star:', error);
      }
    }
  };

  const handleAppClick = async (appId: string) => {
    if (user) {
      try {
        await databaseService.updateLastAccessed(appId, user.id);
        navigate(`/apps/${appId}`);
      } catch (error) {
        console.error('Error updating last accessed:', error);
        navigate(`/apps/${appId}`);
      }
    }
  };

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
              <span className="text-xl font-bold text-gray-900">Mocha</span>
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
              <button 
                className="p-2 font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(245, 245, 245)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                }}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <nav className="space-y-2">
              <a 
                href="#" 
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                }}
              >
                <Grid3X3 className="w-4 h-4 text-white" />
                <span className="text-white">All apps</span>
              </a>
              <a 
                href="/apps/recent" 
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(245, 245, 245)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                }}
              >
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Recent</span>
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
              <div className="flex items-center space-x-6 flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">All apps</h1>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-[10px] text-gray-700 placeholder-gray-500 outline-none transition-all duration-200 focus:text-gray-900 text-sm w-96"
                    style={{
                      boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Showing 1 of 1 results</span>
              </div>
            </div>
          </div>

          {/* Apps Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-5 flex items-center space-x-2">
                  <span>Name</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M6 8L3 5h6l-3 3z"/>
                    </svg>
                  </button>
                </div>
                <div className="col-span-3 flex items-center space-x-2">
                  <span>Status</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M6 8L3 5h6l-3 3z"/>
                    </svg>
                  </button>
                </div>
                <div className="col-span-3 flex items-center space-x-2">
                  <span>Visibility</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M6 8L3 5h6l-3 3z"/>
                    </svg>
                  </button>
                </div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* App Rows */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your apps...</p>
                </div>
              ) : apps.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No apps yet</h3>
                  <p className="text-gray-600 mb-6">Create your first app to get started</p>
                  <a 
                    href="/"
                    className="px-6 py-3 font-medium transition-all duration-200 hover:opacity-90 inline-block"
                    style={{
                      backgroundColor: 'rgb(0, 0, 0)',
                      color: 'rgb(255, 255, 255)',
                      borderRadius: '10px'
                    }}
                  >
                    Create your first app
                  </a>
                </div>
              ) : (
                apps.map((app) => (
                <div key={app.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleAppClick(app.id)}>
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
                        <Star className="w-4 h-4" fill={app.starred ? 'currentColor' : 'none'} />
                      </button>
                      <div>
                        <h3 className="font-medium text-gray-900">{app.name}</h3>
                        <p className="text-sm text-gray-500">{app.url}</p>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {app.status}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-sm text-gray-900">{app.visibility}</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
