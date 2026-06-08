import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { NavComponent } from '../../components/layout/nav/nav.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-ethos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavComponent],
  template: `
    <app-nav />
    <main class="max-w-[1440px] mx-auto px-[80px] max-md:px-5 py-[120px]">
      <p class="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-secondary)] mb-4">Our Story</p>
      <h1 class="font-serif text-[64px] max-md:text-[40px] leading-[1.1] tracking-[-0.02em] max-w-2xl">
        Beauty Rooted in Science
      </h1>
      <p class="font-sans text-lg leading-relaxed text-[var(--color-secondary)] max-w-xl mt-8">
        Aesthetica STEM was founded on a single belief: that the most effective skincare
        is grounded in rigorous science, not marketing claims.
      </p>
    </main>`,
})
export class EthosComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Our Ethos',
      description: 'Learn about the science and values behind Aesthetica STEM.',
    });
  }
}
