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

  stats = [
    { label: 'Documents uploaded', value: this.documents.length, icon: '📄' },
    {
      label: 'Total pages',
      value: this.documents.reduce((sum, d) => sum + d.pages, 0),
      icon: '📖',
    },
    {
      label: 'Ready for questions',
      value: this.documents.filter((d) => d.status === 'ready').length,
      icon: '✅',
    },
  ];

  recentDocuments = [...this.documents]
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    .slice(0, 4);
}
