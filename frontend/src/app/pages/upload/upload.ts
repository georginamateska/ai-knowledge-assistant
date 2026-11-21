import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../services/document.service';

const MAX_SIZE_MB = 20;

@Component({
  selector: 'app-upload',
  imports: [RouterLink],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  private documentService = inject(DocumentService);

  isDragging = signal(false);
  selectedFile = signal<File | null>(null);
  errorMessage = signal('');
  uploadState = signal<'idle' | 'uploading' | 'done'>('idle');
  progress = signal(0);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
    input.value = '';
  }

  handleFile(file: File) {
    this.errorMessage.set('');
    this.selectedFile.set(null);
    this.uploadState.set('idle');
    this.progress.set(0);

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      this.errorMessage.set('Only PDF files are allowed.');
      return;
    }
    if (file.size === 0) {
      this.errorMessage.set('This file is empty.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      this.errorMessage.set(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    this.selectedFile.set(file);
  }
startUpload() {
  const file = this.selectedFile();
  if (!file) return;

  this.uploadState.set('uploading');
  this.progress.set(40);

  this.documentService.upload(file).subscribe({
    next: () => {
      this.progress.set(100);
      this.uploadState.set('done');
    },
    error: (err) => {
      this.uploadState.set('idle');
      this.progress.set(0);
      this.selectedFile.set(null);
      this.errorMessage.set(err.error?.detail ?? 'Upload failed. Is the backend running?');
    },
  });
};

  reset() {
    this.selectedFile.set(null);
    this.errorMessage.set('');
    this.uploadState.set('idle');
    this.progress.set(0);
  }

  formatSize(bytes: number): string {
    return (bytes / 1024 / 1024).toFixed(2);
  }
}