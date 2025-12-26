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
    path: 'perfil',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
];
