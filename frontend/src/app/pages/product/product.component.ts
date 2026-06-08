import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { NavComponent } from '../../components/layout/nav/nav.component';
import { ProductsService } from '../../core/services/products.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavComponent, NgOptimizedImage],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly seoService = inject(SeoService);
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(true);
  readonly activeAccordion = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ slug }) => {
      this.loadProduct(slug);
    });
  }

  toggleAccordion(section: string): void {
    this.activeAccordion.update(current => current === section ? null : section);
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.addItem({ _id: p._id, name: p.name, slug: p.slug, price: p.price, images: p.images, category: p.category, tags: p.tags });
  }

  private loadProduct(slug: string): void {
    this.isLoading.set(true);
    this.productsService.getBySlug(slug).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: p => { this.product.set(p); this.seoService.setProduct(p); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
