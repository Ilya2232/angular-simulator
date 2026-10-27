import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/user.component').then(m => m.UsersComponent)
  },
  {
    path: 'posts',
    loadChildren: () => import('./features/posts/posts.routes').then(m => m.POSTS_ROUTES),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
];
