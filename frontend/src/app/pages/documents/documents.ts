import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-documents',
  styleUrl: './documents.css',
  templateUrl: './documents.html',
})
export class Documents implements OnInit{
  private documentService = inject(DocumentService);
  
  documents = this.documentService.documents;
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
      this.documentService.remove(id);
    }   
  } 
  
  ngOnInit(){
      this.documentService.load();
    }
}
