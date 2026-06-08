import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  private readonly cartService = inject(CartService);

  readonly cartCount = this.cartService.itemCount;
  readonly isMobileMenuOpen = signal(false);
  readonly navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Ethos', path: '/ethos' },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
