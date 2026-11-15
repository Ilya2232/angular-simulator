import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ICategory,
  IProductDetail,
  IProductQuery,
  IProductResponse,
} from '../interfaces/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private http = inject(HttpClient);
  private readonly url = 'https://dummyjson.com/products';

  getProducts(query: IProductQuery): Observable<IProductResponse> {
    const endpoint = query.search
      ? `${this.url}/search`
      : query.category
        ? `${this.url}/category/${query.category}`
        : this.url;

    let params = new HttpParams()
      .set('limit', query.limit)
      .set('skip', query.skip)
      .set('sortBy', query.sortBy)
      .set('order', query.order);

    if (query.search) {
      params = params.set('q', query.search);
    }

    return this.http.get<IProductResponse>(endpoint, { params });
  }

  getProduct(id: number): Observable<IProductDetail> {
    return this.http.get<IProductDetail>(`${this.url}/${id}`);
  }

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.url}/categories`);
  }
}
