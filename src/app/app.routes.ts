import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documents } from './pages/documents/documents';
import { Chat } from './pages/chat/chat';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'documents', component: Documents },
    { path: 'chat', component: Chat },
];
