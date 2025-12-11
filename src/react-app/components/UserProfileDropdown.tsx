import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Gift, MessageSquare, FileText, Sun, Volume2, Bell, Command, MessageCircle, LogOut, Moon, X, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';

interface UserProfileDropdownProps {
  isCollapsed?: boolean;
}

export default function UserProfileDropdown({ isCollapsed = false }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user display information
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    
    // Try to get user's full name from user metadata
    const fullName = user.user_metadata?.full_name;
    const firstName = user.user_metadata?.first_name;
    const lastName = user.user_metadata?.last_name;
    
    if (fullName) return fullName;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    
    // Fallback to email
    return user.email || 'Guest';
  };

  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  // Generate unique referral URL for the user
  const getReferralUrl = () => {
    if (!user?.email) return '';
    const baseUrl = window.location.origin;
    const encodedEmail = btoa(user.email).replace(/[+/=]/g, '').substring(0, 8);
    return `${baseUrl}/signup?ref=${encodedEmail}`;
  };

  const copyReferralLink = () => {
    const referralUrl = getReferralUrl();
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      // You could show a toast notification here
      alert('Referral link copied to clipboard!');
    }
  };

  // Handler functions
  const handleUpgradeToPro = () => {
    navigate('/apps/settings/subscription');
  };

  const handleGetFreeCredits = () => {
    setShowCreditsModal(true);
    setIsOpen(false);
  };

  const handleToggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    // Apply theme to document
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleToggleNotifications = () => {
    const newState = !desktopNotifications;
    setDesktopNotifications(newState);
    // Request notification permission if enabling
    if (newState && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleKeyboardShortcuts = () => {
    setShowKeyboardShortcuts(true);
    setIsOpen(false);
  };

  const handleFeedback = () => {
    setShowFeedbackModal(true);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-3 font-medium transition-all duration-200 hover:opacity-90 w-full"
        style={{
          backgroundColor: 'rgb(245, 245, 245)',
          borderRadius: '10px',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
        }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundColor: 'rgb(0, 0, 0)',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 8px'
          }}
        >
          <span className="text-sm font-bold text-white">{getUserInitial()}</span>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
              <div className="text-xs text-gray-500">Free • 35 credits remaining</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-2 w-80 py-2 z-50"
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
          }}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 8px'
                }}
              >
                <span className="text-sm font-bold text-white">{getUserInitial()}</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                <div className="text-xs text-gray-500">Free • 35 credits remaining</div>
              </div>
            </div>
          </div>

          {/* Get Free Credits */}
          <div className="px-4 py-3 border-b border-gray-100">
            <button 
              onClick={handleGetFreeCredits}
              className="flex items-center space-x-3 w-full text-left p-2 rounded-lg transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <div className="w-6 h-6 text-orange-500">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Get free credits</div>
                <div className="text-xs text-gray-500">Learn more</div>
              </div>
            </button>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button 
              onClick={handleUpgradeToPro}
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <div className="w-4 h-4">
                <Crown className="w-4 h-4" />
              </div>
              <span>Upgrade to Pro</span>
            </button>

            <button 
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left mt-1"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Join our Discord</span>
            </button>

            <button 
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left mt-1"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <FileText className="w-4 h-4" />
              <span>Docs</span>
            </button>
          </div>

          {/* Settings Section */}
          <div className="border-t border-gray-100 py-2">
            <button 
              onClick={handleToggleTheme}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>Appearance: {isDarkMode ? 'Dark' : 'Light'}</span>
              </div>
            </button>

            <button 
              onClick={handleToggleSound}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left mt-1"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4" />
                <span>Sound notifications: {soundEnabled ? 'On' : 'Off'}</span>
              </div>
            </button>

            <button 
              onClick={handleToggleNotifications}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left mt-1"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4" />
                <span>Desktop notifications: {desktopNotifications ? 'On' : 'Off'}</span>
              </div>
            </button>

            <button 
              onClick={handleKeyboardShortcuts}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left mt-1"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <div className="flex items-center space-x-3">
                <Command className="w-4 h-4" />
                <span>Keyboard shortcuts</span>
              </div>
              <span className="text-xs text-gray-400">Ctrl /</span>
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-100 py-2">
            <button 
              onClick={handleFeedback}
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-90 w-full text-left"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Leave feedback</span>
            </button>

            <button 
              className="flex items-center space-x-3 px-4 py-3 font-medium transition-all duration-200 hover:opacity-90 w-full text-left mt-1"
              style={{
                backgroundColor: 'rgb(254, 242, 242)',
                color: 'rgb(220, 38, 38)',
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}

      {/* Get Free Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 transition-all duration-300"
            style={{
              boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Get Free Credits</h3>
              <button onClick={() => setShowCreditsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-[10px] border border-orange-200 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xs font-bold">D</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Daily Login Bonus</h4>
                    <p className="text-sm text-gray-600">Get 10 free credits for logging in daily</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-[10px] border border-blue-200 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">R</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Refer a Friend</h4>
                    <p className="text-sm text-gray-600 mb-4">Get 50 credits for each friend who signs up</p>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Your unique referral link</p>
                          <p className="text-xs text-gray-400 mt-1">Share this link with friends to earn credits</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">50</p>
                          <p className="text-xs text-gray-500">credits</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={getReferralUrl()} 
                            readOnly
                            className="w-full text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 font-mono pr-20"
                            style={{
                              boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                            }}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <button 
                              onClick={copyReferralLink}
                              className="px-3 py-1 text-white text-xs font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                              style={{
                                backgroundColor: 'rgb(0, 0, 0)',
                                boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                              }}
                            >
                              Copy Link
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Active</span>
                          </div>
                          <span className="text-xs text-gray-500">Unlimited uses</span>
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
                          View Stats →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-[10px] border border-green-200 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">P</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Complete Your Profile</h4>
                    <p className="text-sm text-gray-600">Get 25 credits for completing your profile</p>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowCreditsModal(false)}
              className="w-full mt-6 text-white py-3 font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(0, 0, 0)',
                borderRadius: '10px',
                boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 transition-all duration-300"
            style={{
              boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h3>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">New App</span>
                <kbd className="px-3 py-1 bg-gray-100 rounded-[6px] text-xs font-medium text-gray-700"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                >Ctrl + N</kbd>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Search</span>
                <kbd className="px-3 py-1 bg-gray-100 rounded-[6px] text-xs font-medium text-gray-700"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                >Ctrl + /</kbd>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Toggle Theme</span>
                <kbd className="px-3 py-1 bg-gray-100 rounded-[6px] text-xs font-medium text-gray-700"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                >Ctrl + D</kbd>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Settings</span>
                <kbd className="px-3 py-1 bg-gray-100 rounded-[6px] text-xs font-medium text-gray-700"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                >Ctrl + ,</kbd>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Help</span>
                <kbd className="px-3 py-1 bg-gray-100 rounded-[6px] text-xs font-medium text-gray-700"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                >Ctrl + ?</kbd>
              </div>
            </div>
            <button 
              onClick={() => setShowKeyboardShortcuts(false)}
              className="w-full mt-6 text-white py-3 font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(0, 0, 0)',
                borderRadius: '10px',
                boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 transition-all duration-300"
            style={{
              boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Leave Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of feedback</label>
                <select className="w-full px-4 py-3 bg-gray-100 rounded-[10px] text-gray-700 outline-none transition-all duration-200 focus:text-gray-900"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                >
                  <option>General Feedback</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your feedback</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-100 rounded-[10px] text-gray-700 placeholder-gray-500 outline-none transition-all duration-200 focus:text-gray-900 resize-none"
                  placeholder="Tell us what you think..."
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 bg-gray-100 rounded-[10px] text-gray-700 placeholder-gray-500 outline-none transition-all duration-200 focus:text-gray-900"
                  placeholder="your@email.com"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-3 font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(245, 245, 245)',
                  color: 'rgb(0, 0, 0)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.6468px 13.6468px -2.91667px'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowFeedbackModal(false);
                  // Here you would normally submit the feedback
                }}
                className="flex-1 text-white py-3 font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                }}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
