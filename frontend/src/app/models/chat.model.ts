export interface Source {
    documentName: string;
    page: number;
}

export interface ChatMessage{
    id: number;
    role: 'user' | 'assistant';
    text: string;
    sources?: Source[];
}