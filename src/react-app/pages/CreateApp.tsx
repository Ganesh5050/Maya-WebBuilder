import { useState } from 'react';
import { X, Paperclip, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { TemplatesModal } from '../components/TemplatesModal';
import { ProjectTemplate } from '../data/projectTemplates';

const suggestions = [
  'Movie Browser',
  'Portfolio Website',
  'B2B SaaS',
  'Personal Finance Tracker',
];

export default function CreateApp() {
  const [appIdea, setAppIdea] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const userCredits = 35; // User has 35 credits (read-only for this component)
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/apps');
  };

  const handleSubmit = async () => {
    if (appIdea.trim() && userCredits > 0) {
      try {
        // Import necessary modules
        const { databaseService } = await import('../../services/databaseService');
        // const { useAuth } = await import('../../contexts/AuthContext');

        // Get current user (this is a workaround since we can't use hooks here)
        const user = (window as any).__currentUser;

        if (!user) {
          console.error('No user found');
          alert('Please sign in to create an app');
          return;
        }

        // Create app in database with the prompt as description
        const newApp = await databaseService.createApp(user.id, appIdea, visibility === 'public' ? 'Public' : 'Private');

        // Navigate to the new app
        navigate(`/apps/${newApp.id}`);
      } catch (error) {
        console.error('Error creating app:', error);
        // Fallback to old behavior
        const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        navigate(`/apps/${randomId}`);
      }
    }
  };

  const handleUpgradePlan = () => {
    navigate('/pricing');
  };

  const handleEnterOrUpgrade = () => {
    if (userCredits <= 0) {
      handleUpgradePlan();
    } else {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnterOrUpgrade();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
          <span className="ml-2 text-sm">Close</span>
        </button>

        {/* Main Content */}
        <div className="p-8 pt-16">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              Bring your app ideas to life using ai — <span className="italic font-serif">no</span> coding.
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-8">
              <span className="font-medium">TRUSTED BY OVER 100,000 USERS</span>
              <span>•</span>
              <span className="font-medium">PRODUCT OF THE WEEK ON PRODUCT HUNT</span>
            </div>
          </div>

          {/* Input Box - Matching Hero Design */}
          <div className="bg-gray-100 rounded-[20px] p-8 mb-8 transition-all duration-300"
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
            }}>
            <textarea
              value={appIdea}
              onChange={(e) => setAppIdea(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to build?"
              className="w-full text-xl text-gray-800 placeholder-gray-400 outline-none resize-none mb-6 h-32 bg-transparent"
            />

            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded-[10px] bg-gray-100"
                style={{
                  boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                }}>
                <Paperclip className="w-5 h-5" />
                <span className="font-medium">Attach</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-700 font-medium bg-gray-100 rounded-[10px] px-4 py-2 outline-none cursor-pointer transition-colors"
                    style={{
                      boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                    }}>
                    <span className="text-sm">{visibility === 'public' ? 'Public' : 'Private'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <div className="p-4">
                        <button
                          onClick={() => {
                            setVisibility('public');
                            setShowDropdown(false);
                          }}
                          className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${visibility === 'public' ? 'bg-gray-100' : ''
                            }`}
                          style={{
                            boxShadow: visibility === 'public' ? 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset' : 'none'
                          }}>
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Public</div>
                            <div className="text-sm text-gray-600">Anyone can view and clone</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setVisibility('private');
                            setShowDropdown(false);
                          }}
                          className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${visibility === 'private' ? 'bg-gray-100' : ''
                            }`}
                          style={{
                            boxShadow: visibility === 'private' ? 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset' : 'none'
                          }}>
                          <svg className="w-4 h-4 text-gray-700 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Private</div>
                            <div className="text-sm text-gray-600">Not cloneable by others</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleEnterOrUpgrade}
                  className={`${userCredits <= 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200'} p-2 rounded-[10px] transition-colors`}
                  style={{
                    boxShadow: userCredits <= 0
                      ? 'rgba(59, 130, 246, 0.5) 0px 0.706592px 0.706592px -0.583333px, rgba(59, 130, 246, 0.5) 0px 1.80656px 1.80656px -1.16667px, rgba(59, 130, 246, 0.5) 0px 3.62176px 3.62176px -1.75px, rgba(59, 130, 246, 0.5) 0px 6.8656px 6.8656px -2.33333px, rgba(59, 130, 246, 0.5) 0px 13.6468px 13.6468px -2.91667px'
                      : 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}>
                  {userCredits <= 0 ? (
                    <span className="text-white font-medium text-sm">Upgrade plan</span>
                  ) : (
                    <ChevronUp className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Credits Display */}
          <div className="text-center mb-6">
            <span className="text-sm text-gray-600">
              You have <span className={`font-medium ${userCredits <= 0 ? 'text-red-600' : 'text-green-600'}`}>{userCredits} credits</span> remaining
            </span>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setAppIdea(suggestion)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-[10px] text-gray-700 hover:bg-gray-200 transition-colors"
                style={{
                  boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                }}>
                <span>{suggestion}</span>
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                </div>
              </button>
            ))}
          </div>

          {/* Templates Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
            >
              <Sparkles className="w-5 h-5" />
              Browse Templates
            </button>
            <p className="text-xs text-gray-500 mt-2">Start with a professional template and customize it</p>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={(template: ProjectTemplate) => {
          setAppIdea(template.prompt);
        }}
      />
    </div>
  );
}
