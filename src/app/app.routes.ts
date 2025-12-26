import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/hybrid-view-manager/hybrid-view-manager.component').then(
        (m) => m.HybridViewManagerComponent
      ),
  },
  {
    path: 'explorar',
    loadComponent: () =>
      import('./features/explore/explore.component').then((m) => m.ExploreComponent),
  },
  {
    path: 'comunidades',
    loadComponent: () =>
      import('./features/communities/communities.component').then((m) => m.CommunitiesComponent),
  },
  {
    path: 'actividad',
    loadComponent: () =>
      import('./features/activity/activity.component').then((m) => m.ActivityComponent),
  },
  {
    path: 'mensajes',
    loadComponent: () =>
      import('./features/messages/messages.component').then((m) => m.MessagesComponent),
  },
  {
    path: 'inbox',
    loadComponent: () => import('./features/inbox/inbox.component').then((m) => m.InboxComponent),
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./features/config/config.component').then((m) => m.ConfigComponent),
  },
];
