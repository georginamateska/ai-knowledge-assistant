import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MOCK_DOCUMENTS } from '../../data/mock-documents';

@Component({
  imports: [DatePipe],
  selector: 'app-documents',
  styleUrl: './documents.css',
  templateUrl: './documents.html',
})
export class Documents {
  documents = signal(MOCK_DOCUMENTS);
  searchText = signal('');

  filteredDocuments = computed(() => {
    const text = this.searchText().toLowerCase();
    return this.documents().filter((d) => d.name.toLowerCase().includes(text));
  });

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  deleteDocument(id: number) {
    if (confirm('Delete this document?')) {
      this.documents.update((list) => list.filter((d) => d.id !== id));
    }
  }
}
