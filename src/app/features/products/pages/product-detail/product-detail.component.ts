import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IProductDetail } from '../../interfaces/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CardModule, ButtonModule, RouterLink, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private cart = inject(CartService);
  readonly product: IProductDetail = this.route.snapshot.data['product'];
  readonly selectedImage = signal(this.product.images[0]);

  constructor() {
    this.cart.load();
  }

  addToCart(): void {
    this.cart.addProduct(this.product);
  }
}
