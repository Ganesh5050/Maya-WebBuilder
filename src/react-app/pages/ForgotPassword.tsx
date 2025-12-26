import { useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: 'Check your email for the password reset link.'
            });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to send reset email' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16 sm:pt-24 items-center px-4">
            <div className="w-full max-w-md">
                <Link to="/signin" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to sign in
                </Link>

                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                        <Mail className="w-7 h-7 text-gray-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Forgot password?</h1>
                    <p className="text-gray-600">No worries, we'll send you reset instructions.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-200/40">
                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder-gray-400"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Remember your password? <Link to="/signin" className="text-black font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
