import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavComponent } from '../../components/layout/nav/nav.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NavComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  readonly cartService = inject(CartService);
}
