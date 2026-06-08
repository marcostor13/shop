import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ProductListItem } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<ProductListItem>();
  readonly badge = input<string | null>(null);
  readonly addToCart = output<ProductListItem>();

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product());
  }
}
