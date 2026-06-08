import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Cart, CartItem } from '../models/cart.model';
import { ProductListItem } from '../models/product.model';

const CART_STORAGE_KEY = 'aesthetica_cart';
const TAX_RATE = 0.1;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly items = signal<CartItem[]>(this.loadFromStorage());

  readonly cartItems = this.items.asReadonly();
  readonly itemCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );
  readonly tax = computed(() => this.subtotal() * TAX_RATE);
  readonly total = computed(() => this.subtotal() + this.tax());

  readonly cart = computed<Cart>(() => ({
    items: this.items(),
    subtotal: this.subtotal(),
    shipping: 0,
    tax: this.tax(),
    total: this.total(),
  }));

  addItem(product: ProductListItem, quantity = 1): void {
    this.items.update(items => {
      const existing = items.find(i => i.product._id === product._id);
      if (existing) {
        return items.map(i =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...items, { product, quantity }];
    });
    this.saveToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(items =>
      items.map(i => i.product._id === productId ? { ...i, quantity } : i)
    );
    this.saveToStorage();
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(i => i.product._id !== productId));
    this.saveToStorage();
  }

  clear(): void {
    this.items.set([]);
    this.saveToStorage();
  }

  private loadFromStorage(): CartItem[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items()));
  }
}
