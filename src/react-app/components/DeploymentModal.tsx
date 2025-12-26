import React, { useState, useEffect } from 'react';
import { X, Rocket, CheckCircle2, AlertCircle, Loader2, ExternalLink, Check, ChevronDown, Globe, Lock } from 'lucide-react';
import { vercelDeploymentService } from '../../services/deploymentService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectFiles: Array<{ path: string; content: string }>;
    projectName: string;
}

export function DeploymentModal({ isOpen, onClose, projectFiles, projectName }: Props) {
    const [status, setStatus] = useState<'IDLE' | 'DEPLOYING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const [logs, setLogs] = useState<string[]>([]);
    const [deployUrl, setDeployUrl] = useState('');
    const [token, setToken] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // RUI-Style Dropdown States
    const [publishStatus, setPublishStatus] = useState<'Published' | 'Unpublished'>('Published');
    const [publishVisibility, setPublishVisibility] = useState<'Public' | 'Private'>('Public');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('VERCEL_TOKEN');
        if (savedToken) setToken(savedToken);
    }, []);

    const handleDeploy = async () => {
        if (!token) {
            setErrorMsg('Please enter a valid Vercel API Token');
            return;
        }

        // Save token
        localStorage.setItem('VERCEL_TOKEN', token);

        // Reset state
        setStatus('DEPLOYING');
        setLogs(['🚀 Initializing deployment...', '📦 Packaging files...']);
        setErrorMsg('');

        try {
            const result = await vercelDeploymentService.deployProject(
                projectFiles,
                projectName,
                (msg) => setLogs(prev => [...prev, msg])
            );

            if (result.success && result.url) {
                setStatus('SUCCESS');
                setDeployUrl(result.url);
                setLogs(prev => [...prev, '✅ Deployment Complete!']);
            } else {
                setStatus('ERROR');
                setErrorMsg(result.error || 'Deployment failed');
            }
        } catch (err: any) {
            setStatus('ERROR');
            setErrorMsg(err.message || 'Unknown error occurred');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 transform transition-all scale-100 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Rocket className={`w-5 h-5 ${status === 'DEPLOYING' ? 'text-blue-500 animate-pulse' : 'text-gray-700'}`} />
                            Deploy to Vercel
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">Publish your app to the edge</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {status === 'IDLE' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">Deployment Configuration</h3>
                                <p className="text-xs text-blue-700 mb-3">
                                    Configure how your app will be deployed.
                                </p>
                            </div>

                            {/* Status & Visibility Configuration (RUI Style) */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Status Dropdown */}
                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
                                    <button
                                        onClick={() => {
                                            setShowStatusDropdown(!showStatusDropdown);
                                            setShowVisibilityDropdown(false);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:ring-2 hover:ring-blue-100 transition-all text-sm font-medium text-gray-700 group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2 h-2 rounded-full ring-2 ring-white shadow-sm ${publishStatus === 'Published' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            {publishStatus}
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </button>

                                    {showStatusDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-[60]" onClick={() => setShowStatusDropdown(false)} />
                                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-1.5 z-[70] animate-in fade-in zoom-in-95 duration-100 origin-top">
                                                <button
                                                    onClick={() => { setPublishStatus('Published'); setShowStatusDropdown(false); }}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all mb-1 ${publishStatus === 'Published' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-white shadow-sm"></div>
                                                        <span>Published</span>
                                                    </div>
                                                    {publishStatus === 'Published' && <Check className="w-4 h-4 text-blue-600" />}
                                                </button>
                                                <button
                                                    onClick={() => { setPublishStatus('Unpublished'); setShowStatusDropdown(false); }}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${publishStatus === 'Unpublished' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-2 h-2 rounded-full bg-gray-400 ring-2 ring-white shadow-sm"></div>
                                                        <span>Unpublished</span>
                                                    </div>
                                                    {publishStatus === 'Unpublished' && <Check className="w-4 h-4 text-blue-600" />}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Visibility Dropdown */}
                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Visibility</label>
                                    <button
                                        onClick={() => {
                                            setShowVisibilityDropdown(!showVisibilityDropdown);
                                            setShowStatusDropdown(false);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:ring-2 hover:ring-blue-100 transition-all text-sm font-medium text-gray-700 group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {publishVisibility === 'Public' ? <Globe className="w-4 h-4 text-gray-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
                                            {publishVisibility}
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </button>

                                    {showVisibilityDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-[60]" onClick={() => setShowVisibilityDropdown(false)} />
                                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-1.5 z-[70] animate-in fade-in zoom-in-95 duration-100 origin-top">
                                                <button
                                                    onClick={() => { setPublishVisibility('Public'); setShowVisibilityDropdown(false); }}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all mb-1 ${publishVisibility === 'Public' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <Globe className={`w-4 h-4 ${publishVisibility === 'Public' ? 'text-blue-600' : 'text-gray-400'}`} />
                                                        <span>Public</span>
                                                    </div>
                                                    {publishVisibility === 'Public' && <Check className="w-4 h-4 text-blue-600" />}
                                                </button>
                                                <button
                                                    onClick={() => { setPublishVisibility('Private'); setShowVisibilityDropdown(false); }}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${publishVisibility === 'Private' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <Lock className={`w-4 h-4 ${publishVisibility === 'Private' ? 'text-blue-600' : 'text-gray-400'}`} />
                                                        <span>Private</span>
                                                    </div>
                                                    {publishVisibility === 'Private' && <Check className="w-4 h-4 text-blue-600" />}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Vercel API Token
                                </label>
                                <input
                                    type="password"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="ex: fan_..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1.5">
                                    <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 inline-flex">
                                        Get your token here <ExternalLink className="w-3 h-3" />
                                    </a>
                                </p>
                            </div>

                            {errorMsg && (
                                <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>{errorMsg}</p>
                                </div>
                            )}

                            <button
                                onClick={handleDeploy}
                                className="w-full py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Rocket className="w-4 h-4" />
                                Start Deployment
                            </button>
                        </div>
                    )}

                    {status === 'DEPLOYING' && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Deploying Application...</h3>

                            <div className="bg-gray-900 rounded-xl p-4 text-left h-48 overflow-y-auto font-mono text-xs text-green-400 shadow-inner">
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-1 border-l-2 border-transparent pl-2 hover:border-gray-700 transition-colors">
                                        <span className="opacity-50 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                                        {log}
                                    </div>
                                ))}
                                <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
                            </div>
                        </div>
                    )}

                    {status === 'SUCCESS' && (
                        <div className="text-center py-4">
                            <motion_div_placeholder className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle2 className="w-10 h-10" />
                            </motion_div_placeholder>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">It's Live!</h3>
                            <p className="text-gray-500 mb-6">Your application has been successfully deployed.</p>

                            <a
                                href={deployUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200"
                            >
                                Visit Website <ExternalLink className="w-5 h-5" />
                            </a>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-2 rounded-lg">
                                    <span className="font-mono">{deployUrl}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(deployUrl)}
                                        className="p-1 hover:text-gray-900"
                                        title="Copy URL"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Deployment Failed</h3>
                            <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-6 font-mono text-left overflow-x-auto">
                                {errorMsg}
                            </p>

                            <button
                                onClick={() => setStatus('IDLE')}
                                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple placeholder for motion.div to avoid importing full library if not needed, 
// or if we want to keep specific imports minimal. 
// Can just use div.
const motion_div_placeholder = ({ children, className }: any) => <div className={className}>{children}</div>;
