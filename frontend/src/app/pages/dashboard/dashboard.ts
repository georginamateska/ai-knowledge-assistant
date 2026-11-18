import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../services/document.service';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private documentService = inject(DocumentService);

  documents = this.documentService.documents;

  totalDocuments = computed(() => this.documents().length);
  totalPages = computed(() => this.documents().reduce((sum, d) => sum + d.pages, 0));
  readyCount = computed(() => this.documents().filter((d) => d.status === 'ready').length);
  readyPercent = computed(() =>
    this.totalDocuments() ? Math.round((this.readyCount() / this.totalDocuments()) * 100) : 0,
  );

  recentDocuments = computed(() =>
    [...this.documents()]
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
      .slice(0, 4),
  );
}
