import { DocumentItem } from "../models/document.model";

export const MOCK_DOCUMENTS: DocumentItem[] = [
    { id: 1, name: 'Machine Learning Basics.pdf', pages: 124, sizeMb: 4.2, uploadedAt: '2026-11-07', status: 'ready' },
    { id: 2, name: 'Research Paper - NLP.pdf', pages: 18, sizeMb: 1.1, uploadedAt: '2026-11-06', status: 'ready' },
    { id: 3, name: 'Biology Lecture Notes.pdf', pages: 56, sizeMb: 2.8, uploadedAt: '2026-11-04', status: 'processing' },
    { id: 4, name: 'Scanned Contract.pdf', pages: 9, sizeMb: 6.5, uploadedAt: '2026-11-02', status: 'error' },
    { id: 5, name: 'History of Europe.pdf', pages: 312, sizeMb: 12.4, uploadedAt: '2026-10-28', status: 'ready' },
]