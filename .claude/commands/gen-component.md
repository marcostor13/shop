# gen-component

Generate an Angular 21 standalone component following the Aesthetica STEM design system.

**Usage:** `/gen-component <name> [page|ui|layout]`

$ARGUMENTS

## Instructions

Generate a complete Angular 21 standalone component with:

1. **File structure:** `<name>/<name>.component.ts` + `<name>.component.html` (no separate CSS — TailwindCSS inline)
2. **TypeScript:** standalone: true, OnPush, signals, inject() pattern
3. **Template:** TailwindCSS classes using design system tokens below
4. **Inputs/Outputs:** use `input()` and `output()` signals (Angular 21)

## Design Tokens to use (Tailwind classes)

```
Colors: text-primary, bg-surface, text-secondary, bg-[#2D4B4B] (scientific-teal),
        bg-[#FDF0ED] (serum-pink), border-[rgba(26,26,26,0.08)] (glass-border),
        bg-[#F5F3F3] (surface-container-low)

Typography:
  headline: font-serif text-4xl font-normal (EB Garamond)
  body: font-sans text-lg font-normal (Hanken Grotesk)
  label-caps: font-sans text-xs font-semibold tracking-[0.1em] uppercase

Layout: max-w-[1440px] mx-auto px-[80px] max-md:px-5
Spacing: gap-[120px] for sections, gap-6 gap-8 for components
Border-radius: rounded-sm (2px, near-square)
```

## Component Template (TypeScript)

```typescript
import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-<name>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  templateUrl: './<name>.component.html',
})
export class <Name>Component {
  // inputs
  // outputs
  // inject services
  // signals
}
```

## Component Categories

- **page**: Full page component, include meta tags with Angular Meta service
- **ui**: Reusable UI element (button, card, badge, accordion)
- **layout**: Structural component (header, footer, sidebar)

## Animations to add when appropriate

```html
<!-- fade-in-up on scroll -->
<div class="opacity-0 translate-y-10 transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)]"
     #reveal>
```

## Clean Code & SOLID Rules for Components

```
- Single Responsibility: one component = one UI concern
- Smart/Dumb split: page components fetch data; ui components are pure @Input/@Output
- No logic in templates — move to computed() signals
- ≤ 20 lines per method; extract helpers
- Guard clauses over nested if/else
- trackBy on every *ngFor: trackBy="trackById"
```

### Smart component (page) — data fetching
```typescript
// products-page.component.ts — fetches, owns state
@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, ... })
export class ProductsPageComponent {
  private productsService = inject(ProductsService);
  private transferState = inject(TransferState);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void { this.loadProducts(); }

  private loadProducts(): void {
    this.productsService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => { this.products.set(data); this.isLoading.set(false); },
        error: err => { this.error.set('Failed to load products'); this.isLoading.set(false); },
      });
  }
}
```

### Dumb component (ui) — pure presentation
```typescript
// product-card.component.ts — no services, only inputs/outputs
@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, ... })
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  onAddToCart(): void { this.addToCart.emit(this.product()); }
}
```

## Unit Test (generate spec file alongside)

```typescript
// <name>.component.spec.ts
describe('<Name>Component', () => {
  let fixture: ComponentFixture<<Name>Component>;
  let component: <Name>Component;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<Name>Component],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(<Name>Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  // Add: input rendering tests, output emission tests, conditional display tests
});
```

Generate the component files now based on the name and type provided in $ARGUMENTS. Always generate BOTH the component and its spec file.
