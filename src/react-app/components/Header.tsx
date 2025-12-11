import { Link } from 'react-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const { user, signOut } = useAuth();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">Mocha</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Learn
            </a>
            <a href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">
              Blog
            </a>
            <a href="/spotlight" className="text-gray-700 hover:text-gray-900 transition-colors">
              Spotlight
            </a>
            
            {user ? (
              <>
                <Link 
                  to="/apps" 
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  My Apps
                </Link>
                <div className="flex items-center space-x-3">
                  {/* Account Button with Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                      className="flex items-center space-x-2"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center relative"
                        style={{
                          backgroundColor: 'rgb(0, 0, 0)',
                          boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                        }}
                      >
                        <span className="text-white text-sm font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Account Dropdown */}
                    {isAccountDropdownOpen && (
                      <div 
                        className="absolute right-0 top-full mt-2 w-56 py-2 z-50"
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
                          border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          <div className="text-xs text-gray-500">Free plan</div>
                        </div>
                        
                        <div className="py-1">
                          <Link 
                            to="/apps/settings/subscription"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <span>Settings</span>
                          </Link>
                          
                          <button 
                            onClick={() => {
                              signOut();
                              setIsAccountDropdownOpen(false);
                            }}
                            className="flex items-center justify-center px-3 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 mx-auto"
                            style={{
                              backgroundColor: 'rgb(254, 242, 242)',
                              color: 'rgb(220, 38, 38)',
                              borderRadius: '8px',
                              margin: '4px 8px',
                              width: '80%',
                              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                            }}
                          >
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Separate Sign Out Button */}
                  <button
                    onClick={signOut}
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: 'rgb(245, 245, 245)',
                      borderRadius: '10px',
                      boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset',
                      color: 'rgb(0, 0, 0)'
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <a href="/signin" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Sign in
                </a>
                <a href="/signup" className="text-white px-5 py-2.5 font-medium transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderRadius: '10px',
                    boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                  }}>
                  Join Mocha— It's free!
                </a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
