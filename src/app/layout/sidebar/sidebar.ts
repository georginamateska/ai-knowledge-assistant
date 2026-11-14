import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  navItems = [
    {label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    {label: 'Documents', path: '/documents', icon: '📄' },
    {label: 'AI Chat', path: '/chat', img: '/AI.png' },
  ];
}
