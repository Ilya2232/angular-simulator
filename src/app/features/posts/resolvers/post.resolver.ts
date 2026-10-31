import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IPost } from '../models/post.model';
import { PostApiService } from '../services/post-api.service';

export const postResolver: ResolveFn<IPost> = (route) =>
  inject(PostApiService).getById(Number(route.paramMap.get('id')));
