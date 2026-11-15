import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICartPayload, ICartResponse } from '../interfaces/cart.model';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private http = inject(HttpClient);
  private readonly url = 'https://dummyjson.com/carts';

  getUserCart(userId: number): Observable<{ carts: ICartResponse[] }> {
    return this.http.get<{ carts: ICartResponse[] }>(`${this.url}/user/${userId}`);
  }

  createCart(payload: ICartPayload): Observable<ICartResponse> {
    return this.http.post<ICartResponse>(`${this.url}/add`, payload);
  }

  updateCart(id: number, payload: ICartPayload): Observable<ICartResponse> {
    return this.http.put<ICartResponse>(`${this.url}/${id}`, payload);
  }

  deleteCart(id: number): Observable<ICartResponse> {
    return this.http.delete<ICartResponse>(`${this.url}/${id}`);
  }
}
