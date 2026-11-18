import { Injectable, signal } from '@angular/core';
import { DocumentItem } from '../models/document.model';
import { MOCK_DOCUMENTS } from '../data/mock-documents';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly _documents = signal<DocumentItem[]>(MOCK_DOCUMENTS);
  readonly documents = this._documents.asReadonly();

  private nextId = Math.max(0, ...MOCK_DOCUMENTS.map((d) => d.id)) + 1;

  add(file: File): number {
    const id = this.nextId++;
    const newDoc: DocumentItem = {
      id,
      name: file.name,
      pages: Math.floor(Math.random() * 100) + 1,
      sizeMb: Number((file.size / 1024 / 1024).toFixed(1)),
      uploadedAt: new Date().toISOString().slice(0, 10),
      status: 'processing',
    };
    this._documents.update((list) => [newDoc, ...list]);
    return id;
  }

  markReady(id: number) {
    this._documents.update((list) =>
      list.map((d) => (d.id === id ? { ...d, status: 'ready' } : d)),
    );
  }

  remove(id: number) {
    this._documents.update((list) => list.filter((d) => d.id !== id));
  }
}