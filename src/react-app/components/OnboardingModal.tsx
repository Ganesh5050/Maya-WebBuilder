import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageSquare, Code, Download, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

interface OnboardingStep {
    title: string;
    description: string;
    image: string;
    icon: React.ElementType;
    badge?: string;
}

const steps: OnboardingStep[] = [
    {
        title: "Welcome to AppBuilder",
        description: "The next-generation AI website builder. Turn your ideas into production-ready React applications in seconds.",
        image: "https://images.unsplash.com/photo-1639322537228-ad7117a7a6eb?q=80&w=1000&auto=format&fit=crop",
        icon: Sparkles,
        badge: "Beta 2.0"
    },
    {
        title: "Describe & Generate",
        description: "Chat with our advanced AI assistant to describe your vision. Watch as it builds your UI in real-time, responding to every detail.",
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1000&auto=format&fit=crop",
        icon: MessageSquare
    },
    {
        title: "Pro Code Editor",
        description: "Access the full codebase with our VS Code-style editor. Make manual tweaks, add libraries, and customize every aspect.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
        icon: Code
    },
    {
        title: "Review & Export",
        description: "Preview across all devices, check responsiveness, and when you're ready, download the source code or deploy instantly.",
        image: "https://images.unsplash.com/photo-1626785774573-4b79931434f3?q=80&w=1000&auto=format&fit=crop",
        icon: Download
    }
];

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeen = localStorage.getItem('has_seen_onboarding');

        if (!hasSeen) {
            // Delay opening for 1.5s for better UX
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        // Mark as seen
        localStorage.setItem('has_seen_onboarding', 'true');

        // Wait for animation
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    if (!isOpen) return null;

    const CurrentIcon = steps[currentStep].icon;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Card */}
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[500px] flex overflow-hidden transform transition-all duration-500 ${isClosing ? 'scale-95' : 'scale-100'}`}>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-black/5 text-gray-500 hover:text-gray-900 rounded-full transition-colors backdrop-blur-md"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side - Image */}
                <div className="hidden md:block w-1/2 relative h-full">
                    {/* Animated Image Transition */}
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${currentStep === index ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={step.image}
                                alt={step.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* Text Overlay */}
                            <div className="absolute bottom-8 left-8 right-8 text-white transform transition-transform duration-500 translate-y-0">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3 border border-white/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                    Step {index + 1} of {steps.length}
                                </div>
                                <h3 className="text-2xl font-bold leading-tight mb-2 text-shadow-sm">{step.title}</h3>
                                {step.badge && (
                                    <span className="inline-block px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-900/50">
                                        {step.badge}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side - Content */}
                <div className="w-full md:w-1/2 flex flex-col p-8 sm:p-10 relative">

                    {/* Icon Header */}
                    <div className="mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm mb-6 transform transition-all hover:scale-105 duration-300">
                            <CurrentIcon className="w-7 h-7" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 transition-colors">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {steps[currentStep].description}
                        </p>
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-8">
                        {/* Progress Dots */}
                        <div className="flex items-center gap-2 mb-8">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                                            ? 'w-8 bg-blue-600'
                                            : 'w-2 bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentStep === 0
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-all shadow-lg shadow-gray-900/20 active:scale-95 group"
                            >
                                <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
                                {currentStep === steps.length - 1 ? (
                                    <Sparkles className="w-4 h-4" />
                                ) : (
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
