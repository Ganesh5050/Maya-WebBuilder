import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { FileEdit, ImageGen } from './types';
import './styles.css';

// 1. Camera/Image SVG (First one provided)
// 1. ImageGenIconSvg (Header Icon - Restore Original)
const ImageGenIconSvg = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%" className={className}>
        <path fill="currentColor" d="M8.25 17.5a1.75 1.75 0 1 0-3.5 0v1.75H6.5c.861 0 1.75-.808 1.75-1.75m7.806-13.616a2.75 2.75 0 0 1 3.888 0l.172.171a2.75 2.75 0 0 1 0 3.89l-6.172 6.172a2.75 2.75 0 0 1-3.888 0l-.172-.172a2.75 2.75 0 0 1 0-3.89zm2.828 1.06a1.25 1.25 0 0 0-1.768 0l-6.172 6.173a1.25 1.25 0 0 0 0 1.767l.172.171a1.25 1.25 0 0 0 1.768 0l6.172-6.17a1.25 1.25 0 0 0 0-1.769zM9.75 17.5c0 1.82-1.611 3.25-3.25 3.25H4a.75.75 0 0 1-.75-.75v-2.5a3.25 3.25 0 0 1 6.5 0"></path>
    </svg>
);

// 1.5 ImageIconSvg (For Items - Mountain Icon)
const ImageIconSvg = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="100%" height="100%" className={className}>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
    </svg>
);

// 2. Screenshot Icon (Provided by user)
const ScreenshotIconSvg = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%" className={className}>
        <path fill="currentColor" d="M3.25 17v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 0 7 19.25h2a.75.75 0 0 1 0 1.5H7A3.75 3.75 0 0 1 3.25 17m16 0v-2.052a.75.75 0 0 1 1.5 0V17A3.75 3.75 0 0 1 17 20.75h-2a.75.75 0 0 1 0-1.5h2A2.25 2.25 0 0 0 19.25 17m-3.5-6.5a.25.25 0 0 0-.25-.25h-1a.75.75 0 0 1-.53-.22l-1.28-1.28h-1.38l-1.28 1.28a.75.75 0 0 1-.53.22h-1a.25.25 0 0 0-.25.25V15c0 .138.112.25.25.25h7a.25.25 0 0 0 .25-.25zM3.25 9V7A3.75 3.75 0 0 1 7 3.25h2a.75.75 0 0 1 0 1.5H7A2.25 2.25 0 0 0 4.75 7v2a.75.75 0 0 1-1.5 0m16 0V7A2.25 2.25 0 0 0 17 4.75h-2a.75.75 0 0 1 0-1.5h2A3.75 3.75 0 0 1 20.75 7v2a.75.75 0 0 1-1.5 0m-6 3.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0m4 2.5a1.75 1.75 0 0 1-1.75 1.75h-7A1.75 1.75 0 0 1 6.75 15v-4.5c0-.966.784-1.75 1.75-1.75h.69l1.28-1.28.114-.094A.75.75 0 0 1 11 7.25h2c.199 0 .39.08.53.22l1.28 1.28h.69c.966 0 1.75.784 1.75 1.75z"></path>
    </svg>
);

// 3. File Creation (Edit) Icon (First one provided)
const FileCreationIconSvg = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%" className={className}>
        <path fill="currentColor" d="M17.47 14.47a2.871 2.871 0 0 1 4.06 4.06l-4 4a.75.75 0 0 1-.53.22h-3a.75.75 0 0 1-.75-.75v-3c0-.199.08-.39.22-.53zM4.25 18V6A3.75 3.75 0 0 1 8 2.25h5c.199 0 .39.08.53.22l6 6c.14.14.22.331.22.53v2a.75.75 0 0 1-1.5 0V9.75H16A3.75 3.75 0 0 1 12.25 6V3.75H8A2.25 2.25 0 0 0 5.75 6v12A2.25 2.25 0 0 0 8 20.25h2a.75.75 0 0 1 0 1.5H8A3.75 3.75 0 0 1 4.25 18m16.22-2.47a1.37 1.37 0 0 0-1.94 0l-3.78 3.78v1.94h1.94l3.78-3.78a1.37 1.37 0 0 0 0-1.94M13.75 6A2.25 2.25 0 0 0 16 8.25h1.19l-3.44-3.44z"></path>
    </svg>
);

// 4. Project Header Folder Icon (New one)
const ProjectHeaderIconSvg = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%" className={className}>
        <path fillRule="evenodd" d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z" clipRule="evenodd" />
    </svg>
);

interface FileEditListProps {
    edits: FileEdit[];
    images: ImageGen[];
    isComplete: boolean;
}

export const FileEditList: React.FC<FileEditListProps> = ({ edits, images, isComplete }) => {
    // Files State
    const [processingIndex, setProcessingIndex] = useState<number>(0);
    const [completedIndex, setCompletedIndex] = useState<number>(-1);

    // Images State
    const [processingImageIndex, setProcessingImageIndex] = useState<number>(0);
    const [completedImageIndex, setCompletedImageIndex] = useState<number>(-1);

    // Group Collapse States
    const [isImagesOpen, setIsImagesOpen] = useState(true);
    const [isFilesOpen, setIsFilesOpen] = useState(true);

    // Sequential Processing Effect (Files)
    useEffect(() => {
        // Strictly wait for images to finish first
        if (images.length > 0 && completedImageIndex < images.length - 1) {
            return;
        }

        if (processingIndex < edits.length) {
            const timer = setTimeout(() => {
                setCompletedIndex(processingIndex);
                setProcessingIndex(prev => prev + 1);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [edits.length, processingIndex, images.length, completedImageIndex]);

    // Sequential Processing Effect (Images)
    useEffect(() => {
        if (processingImageIndex < images.length) {
            const timer = setTimeout(() => {
                setCompletedImageIndex(processingImageIndex);
                setProcessingImageIndex(prev => prev + 1);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [images.length, processingImageIndex]);

    // Force completion if parent signals complete
    useEffect(() => {
        if (isComplete) {
            setCompletedIndex(edits.length - 1);
            setProcessingIndex(edits.length);
            setCompletedImageIndex(images.length - 1);
            setProcessingImageIndex(images.length);
        }
    }, [isComplete, edits.length, images.length]);

    if (edits.length === 0 && images.length === 0) return null;

    // Slicing
    const itemsToShow = edits.slice(0, processingIndex + 1);
    const imagesToShow = images.slice(0, processingImageIndex + 1);

    return (
        <div className="mt-2 space-y-4">
            {/* 1. IMAGE GENERATION GROUP */}
            {imagesToShow.length > 0 && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                        onClick={() => setIsImagesOpen(!isImagesOpen)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                                <ImageGenIconSvg className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm text-gray-700">Generated Assets</span>
                            {processingImageIndex < images.length && (
                                <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium mr-2">{isImagesOpen ? 'Hide' : 'Show'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 chevron ${isImagesOpen ? 'rotated' : ''}`} />
                        </div>
                    </button>

                    <div className={`nested-accordion-content ${isImagesOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-3 space-y-2 bg-white">
                            {imagesToShow.map((img, idx) => {
                                const isProcessing = idx === processingImageIndex;
                                const isDone = idx <= completedImageIndex;

                                // Safety check
                                if (!isProcessing && !isDone) return null;

                                return (
                                    <div key={idx} className={`image-gen-enter flex items-start gap-3 p-3 rounded-xl border shadow-sm transition-all group ${isProcessing ? 'bg-amber-50 border-amber-200 animate-pulse-slow' : 'bg-white border-gray-100 hover:border-amber-200'} `}>
                                        <div className={`p-2 rounded-lg mt-0.5 ${isProcessing ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
                                            {isProcessing ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                img.description === 'Screenshot taken' ? (
                                                    <ScreenshotIconSvg className="w-3.5 h-3.5 text-amber-500" />
                                                ) : (
                                                    <ImageIconSvg className="w-3.5 h-3.5 text-amber-500" />
                                                )
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2 mb-1">
                                                {isProcessing ? 'Generating Image...' : 'Generated Image'}
                                            </span>
                                            <span className={`text-xs leading-relaxed italic transition-colors ${isProcessing ? 'text-amber-700' : 'text-gray-600'}`}>
                                                "{img.description}"
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. FILE CREATION GROUP */}
            {itemsToShow.length > 0 && (images.length === 0 || completedImageIndex === images.length - 1) && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                        onClick={() => setIsFilesOpen(!isFilesOpen)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                <ProjectHeaderIconSvg className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm text-gray-700">Project Components</span>
                            {processingIndex < edits.length && (
                                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium mr-2">{isFilesOpen ? 'Hide' : 'Show'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 chevron ${isFilesOpen ? 'rotated' : ''}`} />
                        </div>
                    </button>

                    <div className={`nested-accordion-content ${isFilesOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-3 space-y-2 bg-white">
                            {itemsToShow.map((edit, idx) => {
                                const isProcessing = idx === processingIndex;
                                const isDone = idx <= completedIndex;

                                if (!isProcessing && !isDone) return null;

                                return (
                                    <div key={idx} className={`file-edit-enter flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all group ${isProcessing ? 'bg-blue-50 border-blue-200 animate-pulse-slow' : 'bg-white border-gray-100 hover:border-blue-200'} `}>
                                        <div className={`p-2 rounded-lg ${edit.action === 'created' ? 'bg-blue-100/50 text-blue-600' : 'bg-amber-100/50 text-amber-600'} `}>
                                            <FileCreationIconSvg className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                                {isProcessing ? (
                                                    <>
                                                        {edit.action === 'created' ? 'Creating...' : 'Editing...'}
                                                        <Loader2 className="w-3 h-3 animate-spin ml-1" />
                                                    </>
                                                ) : (
                                                    <>{edit.action === 'created' ? 'Created' : 'Edited'}</>
                                                )}
                                            </span>
                                            <span className={`font-mono text-sm font-medium transition-colors ${isProcessing ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'}`}>
                                                {edit.fileName}
                                            </span>
                                        </div>
                                        {isDone && (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto animate-fade-in" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Buttons removed as per user request */}
        </div>
    );
};
