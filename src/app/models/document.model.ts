export interface DocumentItem{
    id: number;
    name: string;
    pages: number;
    sizeMb: number;
    uploadedAt: string;
    status: 'processing' | 'ready' | 'error';
}