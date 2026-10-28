import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost, IPostCreate, IPostEdit, IPostResponse } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostApiService {
  private http = inject(HttpClient);
  private readonly url = 'https://dummyjson.com/posts';

  getPosts(limit: number, skip: number): Observable<IPostResponse> {
    return this.http.get<IPostResponse>(`${this.url}?limit=${limit}&skip=${skip}`);
  }

  getById(id: number): Observable<IPost> {
    return this.http.get<IPost>(`${this.url}/${id}`);
  }

  create(post: IPostCreate): Observable<IPost> {
    return this.http.post<IPost>(`${this.url}/add`, post);
  }

  update(id: number, post: IPostEdit): Observable<IPost> {
    return this.http.put<IPost>(`${this.url}/${id}`, post);
  }

  delete(id: number): Observable<IPost> {
    return this.http.delete<IPost>(`${this.url}/${id}`);
  }
}