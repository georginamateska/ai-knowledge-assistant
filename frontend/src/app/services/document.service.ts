import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DocumentItem } from '../models/document.model';

const API = 'http://127.0.0.1:8000';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private http = inject(HttpClient);

  private readonly _documents = signal<DocumentItem[]>([]);
  readonly documents = this._documents.asReadonly();
  readonly loading = signal(false);
  readonly error = signal('');

  load() {
    this.loading.set(true);
    this.error.set('');
    this.http.get<DocumentItem[]>(`${API}/documents`).subscribe({
      next: (docs) => {
        this._documents.set(docs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not reach the server. Is the backend running?');
        this.loading.set(false);
      },
    });
  }

  upload(file: File): Observable<DocumentItem> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<DocumentItem>(`${API}/documents`, form)
      .pipe(tap((doc) => this._documents.update((list) => [doc, ...list])));
  }

  remove(id: number) {
    this.http.delete(`${API}/documents/${id}`).subscribe({
      next: () => this._documents.update((list) => list.filter((d) => d.id !== id)),
      error: () => this.error.set('Could not delete the document.'),
    });
  }
}