export interface ThinkingState {
    isActive: boolean;
    duration: number; // in seconds
    content: string[]; // buffer of thinking steps
}

export interface FileEdit {
    fileName: string;
    action: 'created' | 'edited';
    timestamp: number;
}

export interface ImageGen {
    description: string;
    url?: string;
    timestamp: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string; // The final markdown text
    timestamp: number;

    // Assistant specific
    thinking?: ThinkingState;
    fileEdits?: FileEdit[];
    images?: ImageGen[];
    summary?: string;
    assetIntro?: string;
    fileIntro?: string;

    status: 'sending' | 'thinking' | 'streaming' | 'complete' | 'error';
}
