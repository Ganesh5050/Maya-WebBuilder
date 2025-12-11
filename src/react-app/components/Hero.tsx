import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Paperclip, ChevronUp, ChevronDown, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { databaseService } from '@/services/databaseService';

const suggestions = [
  'Movie Browser',
  'Portfolio Website',
  'B2B SaaS',
  'Personal Finance Tracker',
];

export default function Hero() {
  const [prompt, setPrompt] = useState('');
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public');
  const [showDropdown, setShowDropdown] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setAttachedFiles(prevFiles => [...prevFiles, ...imageFiles]);
      console.log('Images attached:', imageFiles.map(f => f.name));
    }
    
    if (files.length !== imageFiles.length) {
      alert('Only image files (JPG, PNG, GIF, etc.) are accepted. Non-image files were ignored.');
    }
  };

  const handleClearFiles = () => {
    setAttachedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (prompt.trim() && user) {
      try {
        setIsCreating(true);
        
        // Create app in database with smart name generation
        const newApp = await databaseService.createApp(
          user.id,
          prompt.trim(),
          visibility
        );
        
        // Navigate to the builder with the new app ID
        navigate(`/apps/${newApp.id}`);
      } catch (error) {
        console.error('Error creating app:', error);
        alert('Failed to create app. Please try again.');
      } finally {
        setIsCreating(false);
      }
    } else if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Bring your app ideas to life using ai — <span className="italic font-serif">no</span> coding.
        </h1>

        {/* Trust Badges */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-12">
          <span className="font-medium">TRUSTED BY OVER 100,000 USERS</span>
          <span>•</span>
          <span className="font-medium">PRODUCT OF THE WEEK ON PRODUCT HUNT</span>
        </div>

        {/* Input Box */}
        <div className="bg-gray-100 rounded-[20px] p-8 mb-8 transition-all duration-300"
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
          }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to build?"
            className="w-full text-xl text-gray-800 placeholder-gray-400 outline-none resize-none mb-6 h-32 bg-transparent"
          />
          <div className="flex items-center justify-between">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileAttach}
                accept="image/*"
                multiple
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded-[10px] bg-gray-100 cursor-pointer"
                style={{
                  boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                }}
              >
                <Paperclip className="w-5 h-5" />
                <span className="font-medium">
                  {attachedFiles.length > 0 
                    ? `${attachedFiles.length} file${attachedFiles.length === 1 ? '' : 's'} attached` 
                    : 'Attach'
                  }
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 font-medium bg-gray-100 rounded-[10px] px-4 py-2 outline-none cursor-pointer transition-colors"
                  style={{
                    boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                  }}>
                  <span>{visibility}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <div className="p-4">
                      <button
                        onClick={() => {
                          setVisibility('Public');
                          setShowDropdown(false);
                        }}
                        className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          visibility === 'Public' ? 'bg-gray-100' : ''
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
                          setVisibility('Private');
                          setShowDropdown(false);
                        }}
                        className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          visibility === 'Private' ? 'bg-gray-100' : ''
                        }`}
                        style={{
                          boxShadow: visibility === 'Private' ? 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset' : 'none'
                        }}>
                        <Lock className="w-4 h-4 text-gray-700 mt-1" />
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
                onClick={handleSubmit}
                disabled={isCreating || !prompt.trim() || !user}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                }}>
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Attached Files Display */}
        {attachedFiles.length > 0 && (
          <div className="bg-white rounded-[20px] p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">
                Attached Screenshots ({attachedFiles.length})
              </h3>
              <button 
                onClick={handleClearFiles}
                className="text-xs text-red-600 hover:text-red-800 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {attachedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <div className="text-center p-2">
                      <div className="text-2xl mb-1">📷</div>
                      <div className="text-xs text-gray-600 truncate max-w-full">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setAttachedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
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
      </div>
    </section>
  );
}
