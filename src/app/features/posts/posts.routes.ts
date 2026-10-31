import { Routes } from '@angular/router';
import { postResolver } from './resolvers/post.resolver';

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/posts-list/posts-list.component').then((m) => m.PostsListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/post-form/post-create.component').then((m) => m.PostCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/post-detail/post-detail.component').then((m) => m.PostDetailComponent),
    resolve: { post: postResolver },
  },
];
