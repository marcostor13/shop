import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavComponent } from '../../components/layout/nav/nav.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavComponent],
  template: `<app-nav /><main class="max-w-[1440px] mx-auto px-[80px] max-md:px-5 py-16"><h1 class="font-serif text-[40px]">Checkout</h1></main>`,
})
export class CheckoutComponent {}
