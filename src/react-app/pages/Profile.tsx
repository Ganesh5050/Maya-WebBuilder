import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    User, Mail, Lock, LogOut, ArrowLeft,
    Loader2, Shield, CheckCircle, AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/signin');
        }
    }, [user, navigate]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/apps')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                                <Shield className="w-4 h-4" />
                            </div>
                            <span>Account Settings</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <h2 className="text-sm font-medium text-gray-700">Profile Information</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Managed by Supabase Auth</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                            <div className="font-mono text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                                {user.id}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <h2 className="text-sm font-medium text-gray-700">Security</h2>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            {message && (
                                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {message.text}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || !password}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all ${loading || !password
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-black hover:bg-gray-800'
                                        }`}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    );
}
