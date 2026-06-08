import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { NavComponent } from '../../components/layout/nav/nav.component';
import { ProductCardComponent } from '../../components/ui/product-card/product-card.component';
import { ProductsService } from '../../core/services/products.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { ProductListItem } from '../../core/models/product.model';

const FEATURED_KEY = makeStateKey<ProductListItem[]>('featured-products');

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NavComponent, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly seoService = inject(SeoService);
  private readonly cartService = inject(CartService);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly featuredProducts = signal<ProductListItem[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Science-Backed Skincare',
      description:
        'Aesthetica STEM — premium skincare formulated where science meets beauty. Shop clinically proven serums, moisturizers, and cleansers.',
      canonical: 'https://aesthetica.com',
    });
    this.loadFeaturedProducts();
  }

  onAddToCart(product: ProductListItem): void {
    this.cartService.addItem(product);
  }

  private loadFeaturedProducts(): void {
    const transferred = this.transferState.get(FEATURED_KEY, null);
    if (transferred) {
      this.featuredProducts.set(transferred);
      this.isLoading.set(false);
      return;
    }

    this.productsService.getFeatured().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: products => {
        this.featuredProducts.set(products);
        this.isLoading.set(false);
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(FEATURED_KEY, products);
        }
      },
      error: () => {
        this.error.set('Failed to load products');
        this.isLoading.set(false);
      },
    });
  }
}
