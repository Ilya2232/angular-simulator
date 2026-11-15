import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStateService } from '../../services/product-state.service';
import { ProductApiService } from '../../services/product-api.service';
import { PAGE_SIZE_OPTIONS } from '../../products.constants';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [
    RouterLink,
    FormsModule,
    CardModule,
    SkeletonModule,
    SelectModule,
    InputTextModule,
    PaginatorModule,
    CurrencyPipe,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  readonly state = inject(ProductStateService);
  private api = inject(ProductApiService);

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly skeletons = Array.from({ length: 10 });
  readonly categories = toSignal(this.api.getCategories(), { initialValue: [] });

  readonly sortFields = [
    { label: 'Title', value: 'title' },
    { label: 'Price', value: 'price' },
    { label: 'Rating', value: 'rating' },
    { label: 'Stock', value: 'stock' },
  ];

  readonly sortOrders = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
  ];

  onPageChange(event: PaginatorState): void {
    if (event.rows !== this.state.pageSize()) {
      this.state.setPageSize(event.rows!);
    } else {
      this.state.setPage((event.page ?? 0) + 1);
    }
  }
}
