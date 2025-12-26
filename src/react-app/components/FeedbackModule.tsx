import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bug, Lightbulb, Star, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FeedbackModule() {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'bug' | 'feature' | 'general'>('general');
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        setIsSubmitting(false);
        setSubmitted(true);

        // Reset and close after delay
        setTimeout(() => {
            setSubmitted(false);
            setIsOpen(false);
            setComment('');
            setRating(0);
            setType('general');
        }, 2000);
    };

    return (
        <>
            {/* Feedback Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 h-8 px-3 py-2 text-sm font-medium rounded-xl transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden lg:inline">Feedback</span>
            </button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                        Send Feedback
                                    </h3>
                                    <p className="text-xs text-blue-600 font-medium mt-0.5">Help us improve your experience</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-lg hover:bg-white/50 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            type="spring"
                                        >
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                        </motion.div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
                                        <p className="text-gray-500 max-w-xs">Your feedback has been received. We appreciate your contribution to making this tool better.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Feedback Type Selector */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setType('bug')}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${type === 'bug'
                                                    ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Bug className="w-5 h-5" />
                                                <span className="text-xs font-semibold">Report Bug</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setType('feature')}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${type === 'feature'
                                                    ? 'bg-purple-50 border-purple-200 text-purple-700 ring-1 ring-purple-200'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Lightbulb className="w-5 h-5" />
                                                <span className="text-xs font-semibold">Feature</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setType('general')}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${type === 'general'
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                                <span className="text-xs font-semibold">General</span>
                                            </button>
                                        </div>

                                        {/* Rating */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                How would you rate your experience?
                                            </label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Text Area */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tell us more
                                            </label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder={
                                                    type === 'bug' ? "What happened? Steps to reproduce..." :
                                                        type === 'feature' ? "Describe the feature and why it's useful..." :
                                                            "Share your thoughts..."
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                                                rows={4}
                                                required
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !comment.trim()}
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all ${isSubmitting || !comment.trim()
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform active:scale-[0.98]'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Feedback
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
