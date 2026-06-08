import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { NavComponent } from '../../components/layout/nav/nav.component';
import { ProductCardComponent } from '../../components/ui/product-card/product-card.component';
import { ProductsService } from '../../core/services/products.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { ProductListItem } from '../../core/models/product.model';

const CATEGORIES = ['All', 'Cleansers', 'Serums', 'Moisturizers'];

@Component({
  selector: 'app-shop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavComponent, ProductCardComponent],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly seoService = inject(SeoService);
  private readonly cartService = inject(CartService);

  readonly categories = CATEGORIES;
  readonly products = signal<ProductListItem[]>([]);
  readonly isLoading = signal(true);
  readonly activeCategory = signal('All');

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Shop All Products',
      description: "Browse Aesthetica STEM's complete collection of science-backed skincare.",
    });
    this.loadProducts();
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
    this.loadProducts();
  }

  onAddToCart(product: ProductListItem): void {
    this.cartService.addItem(product);
  }

  private loadProducts(): void {
    const category = this.activeCategory() === 'All' ? undefined : this.activeCategory();
    this.isLoading.set(true);
    this.productsService.getAll(category ? { category } : undefined).subscribe({
      next: p => { this.products.set(p); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
