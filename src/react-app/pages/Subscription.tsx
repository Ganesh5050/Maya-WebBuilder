import { useState } from 'react';
import { Plus, Grid3X3, Clock, Star, Settings, MoreHorizontal, ChevronDown, Info } from 'lucide-react';
import UserProfileDropdown from '@/react-app/components/UserProfileDropdown';

export default function Subscription() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [billingPeriod, setBillingPeriod] = useState('yearly'); // 'monthly' or 'yearly'

  // Pricing calculation
  const calculatePricing = (monthlyPrice: number, monthlyCredits: number) => {
    const yearlyPrice = Math.round(monthlyPrice * 12 * 0.7); // 30% discount for yearly
    const yearlyCredits = monthlyCredits * 12;
    
    return {
      price: billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice,
      credits: billingPeriod === 'monthly' ? monthlyCredits : yearlyCredits,
      period: billingPeriod === 'monthly' ? '/mo' : '/yr',
      billingText: billingPeriod === 'monthly' ? 'per month' : 'per year',
      creditsText: billingPeriod === 'monthly' ? '/mo' : '/yr'
    };
  };

  // Plan pricing data
  const bronzePlan = calculatePricing(20, 1500);
  const silverPlan = calculatePricing(50, 4500);
  const goldPlan = calculatePricing(200, 20000);

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
                href="#" 
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
                href="#" 
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
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  borderRadius: '10px',
                  boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                }}
              >
                <Settings className="w-4 h-4 text-white" />
                <span className="text-white">Subscription & Billing</span>
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
              {['Overview', 'Usage', 'Billing History'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
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
            <a href="/apps/new" className="text-white px-4 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(0, 0, 0)',
                borderRadius: '10px',
                boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
              }}
            >
              Create new app
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Sub Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8 border-b border-gray-200">
              {['Overview', 'Usage', 'Billing History'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'Overview' && (
            <div>
              {/* Billing Period Toggle */}
              <div className="mb-8 flex justify-center">
                <div 
                  className="relative inline-flex items-center"
                  style={{
                    backgroundColor: 'rgb(245, 245, 245)',
                    borderRadius: '34px',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset',
                    opacity: 1,
                    padding: '8px 16px'
                  }}
                >
                  {/* Monthly Option */}
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className="px-2 py-1 text-sm font-medium transition-all duration-200"
                    style={{
                      opacity: billingPeriod === 'monthly' ? 1 : 0.65,
                      color: 'rgb(0, 0, 0)'
                    }}
                  >
                    Monthly
                  </button>

                  {/* Yearly Option */}
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className="px-2 py-1 text-sm font-medium transition-all duration-200 inline-flex items-center"
                    style={{
                      opacity: billingPeriod === 'yearly' ? 1 : 0.65,
                      color: 'rgb(0, 0, 0)',
                      marginLeft: '16px'
                    }}
                  >
                    <span>Yearly</span>
                    {billingPeriod === 'yearly' && (
                      <span
                        className="ml-2 px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: 'rgb(245, 245, 245)',
                          borderRadius: '12px',
                          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                        }}
                      >
                        30% off
                      </span>
                    )}
                  </button>

                  {/* Bottom Line Indicator */}
                  <div
                    style={{
                      backgroundColor: 'rgb(0, 0, 0)',
                      position: 'absolute',
                      bottom: '0',
                      height: '1px',
                      width: billingPeriod === 'monthly' ? '60px' : '80px',
                      transition: 'all 0.2s ease',
                      left: billingPeriod === 'monthly' ? '16px' : 'calc(50% + 8px)',
                      transform: 'none'
                    }}
                  />
                </div>
              </div>
              {/* Current Plan */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">You are currently on a Free plan</h2>
                    <p className="text-gray-600">The free plan includes 120 credits to get you started.</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bronze Plan */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Bronze</h3>
                  <p className="text-gray-600 mb-6">Need to go beyond the free limits and build more?</p>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${bronzePlan.price} <span className="text-lg font-normal text-gray-600">{bronzePlan.period}</span>
                      {billingPeriod === 'yearly' && (
                        <div className="text-sm text-green-600 font-normal">Save 30%</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>{bronzePlan.credits.toLocaleString()} credits {bronzePlan.creditsText}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <button className="w-full text-white py-3 font-medium transition-all duration-200 hover:opacity-90 mb-6"
                    style={{
                      backgroundColor: 'rgb(0, 0, 0)',
                      borderRadius: '10px',
                      boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                    }}>
                    Get Bronze {bronzePlan.billingText}
                  </button>

                  <div>
                    <p className="font-medium text-gray-900 mb-3">Your plan includes:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Everything from the free tier</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Support for medium size apps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Publish up to 5 apps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Customize your domain</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Remove watermarks</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Silver Plan */}
                <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div 
                      className="inline-flex items-center px-3 py-1.5"
                      style={{
                        borderBottomWidth: '1px',
                        borderLeftWidth: '1px',
                        borderRightWidth: '1px',
                        borderTopWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'rgba(216, 231, 242, 0.07)',
                        background: 'linear-gradient(180deg, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 170%)',
                        borderRadius: '22px',
                        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.15) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.15) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.13) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.11) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.04) 0px 30px 30px -4px, rgb(36, 36, 36) 0px 3px 1px 0px inset',
                        opacity: 1
                      }}
                    >
                      <div className="mr-2" style={{ opacity: 1 }}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 256 256" 
                          width="16" 
                          height="16"
                          fill="rgb(255, 255, 255)"
                          style={{ display: 'inline-block' }}
                        >
                          <g fill="rgb(255, 255, 255)">
                            <path d="M183.89,153.34a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68ZM216,144a88,88,0,0,1-176,0c0-27.92,11-56.47,32.66-84.85a8,8,0,0,1,11.93-.89l24.12,23.41,22-60.41a8,8,0,0,1,12.63-3.41C165.21,36,216,84.55,216,144Zm-16,0c0-46.09-35.79-85.92-58.21-106.33L119.52,98.74a8,8,0,0,1-13.09,3L80.06,76.16C64.09,99.21,56,122,56,144a72,72,0,0,0,144,0Z"></path>
                          </g>
                        </svg>
                      </div>
                      <div style={{ transform: 'none', opacity: 1 }}>
                        <p className="text-sm font-medium" style={{ color: 'rgb(255, 255, 255)' }}>
                          Popular
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Silver</h3>
                  <p className="text-gray-600 mb-6">For individuals working on larger projects</p>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${silverPlan.price} <span className="text-lg font-normal text-gray-600">{silverPlan.period}</span>
                      {billingPeriod === 'yearly' && (
                        <div className="text-sm text-green-600 font-normal">Save 30%</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>{silverPlan.credits.toLocaleString()} credits {silverPlan.creditsText}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <button className="w-full text-white py-3 font-medium transition-all duration-200 hover:opacity-90 mb-6"
                    style={{
                      backgroundColor: 'rgb(0, 0, 0)',
                      borderRadius: '10px',
                      boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                    }}>
                    Get Silver {silverPlan.billingText}
                  </button>

                  <div>
                    <p className="font-medium text-gray-900 mb-3">Your plan includes:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Everything in Bronze</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Support for large apps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Custom login options & branding</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Publish up to 15 apps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Priority Customer Support</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Gold Plan */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Gold</h3>
                  <p className="text-gray-600 mb-6">For individuals working on serious and large projects.</p>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${goldPlan.price} <span className="text-lg font-normal text-gray-600">{goldPlan.period}</span>
                      {billingPeriod === 'yearly' && (
                        <div className="text-sm text-green-600 font-normal">Save 30%</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>{goldPlan.credits.toLocaleString()} credits {goldPlan.creditsText}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <button className="w-full text-white py-3 font-medium transition-all duration-200 hover:opacity-90 mb-6"
                    style={{
                      backgroundColor: 'rgb(0, 0, 0)',
                      borderRadius: '10px',
                      boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                    }}>
                    Get Gold {goldPlan.billingText}
                  </button>

                  <div>
                    <p className="font-medium text-gray-900 mb-3">Your plan includes:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Everything in Silver</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Support for near unlimited sized apps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Publish up to 25 apps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Early access to new features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Tab */}
          {activeTab === 'Usage' && (
            <div>
              {/* Credits Section */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <h2 className="text-xl font-medium text-gray-900">Your credits</h2>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '29%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">35 remaining</p>
              </div>

              {/* Usage Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>Date</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Source</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>App</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Amount</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Usage Rows */}
                <div className="divide-y divide-gray-200">
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="text-sm text-gray-900">11/06/2025, 6:15 PM</div>
                      <div className="text-sm text-gray-900">Message</div>
                      <div className="text-sm text-gray-900">Orb AI - AI Agency Solutions</div>
                      <div className="text-sm text-red-600">-5</div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="text-sm text-gray-900">11/06/2025, 6:10 PM</div>
                      <div className="text-sm text-gray-900">Message</div>
                      <div className="text-sm text-gray-900">Orb AI - AI Agency Solutions</div>
                      <div className="text-sm text-red-600">-115</div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="text-sm text-gray-900">11/06/2025, 6:04 PM</div>
                      <div className="text-sm text-gray-900">Signup bonus</div>
                      <div className="text-sm text-gray-900">-</div>
                      <div className="text-sm text-green-600">+120</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing History Tab */}
          {activeTab === 'Billing History' && (
            <div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>Date</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Invoice #</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Amount</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 8L3 5h6l-3 3z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Empty State */}
                <div className="py-16 text-center">
                  <p className="text-gray-500">No billing history to display</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
