import { Injectable, computed, inject, signal } from '@angular/core';
import { TAX_RATE } from '../products.constants';
import { CartApiService } from './cart-api.service';
import { ICartItem } from '../interfaces/cart.model';
import { IProduct } from '../interfaces/product.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private api = inject(CartApiService);
  readonly items = signal<ICartItem[]>([]);
  private auth = inject(AuthService);
  private cartId: number | null = null;

  readonly itemsCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  readonly tax = computed(() => this.subtotal() * TAX_RATE);
  readonly total = computed(() => this.subtotal() + this.tax());

  addProduct(product: IProduct): void {
    this.items.update((list) => {
      const exist = list.some((item) => item.id === product.id);
      if (exist) {
        return list.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...list,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        },
      ];
    });
    this.sync();
  }

  changeQuantity(id: number, quantity: number): void {
    if (quantity < 1) {
      this.remove(id);
      return;
    }
    this.items.update((list) =>
      list.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
    this.sync();
  }

  remove(id: number): void {
    this.items.update((list) => list.filter((i) => i.id !== id));
    this.sync();
  }

  load(): void {
    if (this.cartId !== null) return;
    this.api.getUserCart(this.auth.currentUserId()).subscribe((res) => {
      const cart = res.carts[0];
      if (cart) {
        this.cartId = cart.id;
        this.items.set(cart.products);
      }
    });
  }

  private sync(): void {
    const payload = {
      userId: this.auth.currentUserId(),
      products: this.items().map((item) => ({ id: item.id, quantity: item.quantity })),
    };
    if (this.cartId === null) {
      this.api.createCart(payload).subscribe((res) => (this.cartId = res.id));
    } else {
      this.api.updateCart(this.cartId, payload).subscribe();
    }
  }

  clear(): void {
    if (this.cartId !== null) {
      this.api.deleteCart(this.cartId).subscribe();
    }

    this.items.set([]);
    this.cartId = null;
  }
}
