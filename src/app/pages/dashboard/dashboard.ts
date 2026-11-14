import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MOCK_DOCUMENTS } from '../../data/mock-documents';

@Component({
  imports: [DatePipe],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  documents = MOCK_DOCUMENTS;

 totalDocuments = this.documents.length;
  totalPages = this.documents.reduce((sum, d) => sum + d.pages, 0);
  readyCount = this.documents.filter((d) => d.status === 'ready').length;
  readyPercent = this.totalDocuments
    ? Math.round((this.readyCount / this.totalDocuments) * 100)
    : 0;

  recentDocuments = [...this.documents]
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    .slice(0, 4);
}
