import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ProductApiService } from './product-api.service';
import { IProduct, IProductQuery, ProductSortField, SortOrder } from '../interfaces/product.model';

@Injectable({ providedIn: 'root' })
export class ProductStateService {
  private api = inject(ProductApiService);
  readonly products = signal<IProduct[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);

  readonly searchInput = signal('');
  readonly category = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly sortField = signal<ProductSortField>('title');
  readonly sortOrder = signal<SortOrder>('asc');

  readonly search = toSignal(
    toObservable(this.searchInput).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.page.set(1)),
    ),
    { initialValue: '' },
  );

  readonly skip = computed(() => (this.page() - 1) * this.pageSize());
  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  private readonly query = computed<IProductQuery>(() => ({
    limit: this.pageSize(),
    skip: this.skip(),
    search: this.search(),
    category: this.category(),
    sortBy: this.sortField(),
    order: this.sortOrder(),
  }));

  constructor() {
    toObservable(this.query)
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((q) => this.api.getProducts(q).pipe(catchError(() => of(null)))),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (res) {
          this.products.set(res.products);
          this.total.set(res.total);
        }
        this.loading.set(false);
      });
  }

  setCategory(category: string | null): void {
    this.category.set(category);
    this.page.set(1);
  }

  setSortField(field: ProductSortField): void {
    this.sortField.set(field);
    this.page.set(1);
  }

  setSortOrder(order: SortOrder): void {
    this.sortOrder.set(order);
    this.page.set(1);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  setPage(page: number): void {
    this.page.set(page);
  }

  onSearchInput(text: string): void {
    this.searchInput.set(text);
  }
}
