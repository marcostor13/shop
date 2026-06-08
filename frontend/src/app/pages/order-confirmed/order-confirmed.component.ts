import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavComponent } from '../../components/layout/nav/nav.component';

@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NavComponent],
  template: `
    <app-nav />
    <main class="max-w-[1440px] mx-auto px-[80px] max-md:px-5 py-16 text-center">
      <div class="w-16 h-16 rounded-full bg-[var(--color-serum-pink)] flex items-center justify-center mx-auto mb-6">
        <span class="material-symbols-outlined text-3xl">check</span>
      </div>
      <h1 class="font-serif text-[40px] mb-4">Thank you for your order</h1>
      <p class="font-sans text-[var(--color-secondary)]">A confirmation has been sent to your email.</p>
      <a routerLink="/" class="inline-block mt-8 border border-[var(--color-primary)] font-sans text-sm font-medium tracking-[0.05em] uppercase px-8 py-4">
        Return to Home
      </a>
    </main>`,
})
export class OrderConfirmedComponent {}
