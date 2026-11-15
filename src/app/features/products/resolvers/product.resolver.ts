import { ResolveFn } from '@angular/router';
import { IProductDetail } from '../interfaces/product.model';
import { inject } from '@angular/core';
import { ProductApiService } from '../services/product-api.service';

export const ProductResolver: ResolveFn<IProductDetail> = (route) =>
  inject(ProductApiService).getProduct(Number(route.paramMap.get('id')));
