# design-ref

Look up Aesthetica STEM design tokens, components, and patterns.

**Usage:** `/design-ref [color|type|spacing|component:<name>|page:<name>]`

$ARGUMENTS

## Design Tokens

### Colors
```css
/* TailwindCSS custom theme — use these class names */
primary              → bg-primary / text-primary           (#000000)
on-primary           → bg-on-primary / text-on-primary     (#FFFFFF)
surface              → bg-surface                          (#FBF9F9)
secondary            → bg-secondary / text-secondary       (#5E5E5B)
scientific-teal      → bg-scientific-teal                  (#2D4B4B)
serum-pink           → bg-serum-pink                       (#FDF0ED)
surface-container-low → bg-surface-container-low           (#F5F3F3)
surface-container    → bg-surface-container                (#EFEDED)
surface-container-high → bg-surface-container-high         (#E9E8E7)
glass-border         → border-glass-border                 (rgba(26,26,26,0.08))
outline              → border-outline                      (#747878)
error                → text-error / bg-error               (#BA1A1A)
```

### Typography classes
```html
<!-- Display / hero text -->
<h1 class="font-serif text-[64px] leading-[1.1] tracking-[-0.02em] font-normal">

<!-- Page headline -->  
<h2 class="font-serif text-[40px] leading-[1.2] font-normal">

<!-- Section headline -->
<h3 class="font-serif text-[28px] leading-[1.3] font-normal">

<!-- Body large -->
<p class="font-sans text-lg leading-relaxed font-normal">

<!-- Body default -->
<p class="font-sans text-base leading-relaxed font-normal">

<!-- Label / caps -->
<span class="font-sans text-xs font-semibold tracking-[0.1em] uppercase">

<!-- Button text -->
<span class="font-sans text-sm font-medium tracking-[0.05em]">
```

### Layout
```html
<!-- Page wrapper -->
<div class="max-w-[1440px] mx-auto px-[80px] max-md:px-5">

<!-- Section gap -->
<section class="py-[120px] max-md:py-16">

<!-- 12-col grid -->
<div class="grid grid-cols-12 gap-6">
  <div class="col-span-7">...</div>   <!-- main content -->
  <div class="col-span-5">...</div>   <!-- sidebar -->
</div>

<!-- Product grid -->
<div class="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
```

## UI Components

### Navigation (glass effect)
```html
<nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl 
            bg-surface/80 border-b border-glass-border h-20">
  <div class="max-w-[1440px] mx-auto px-[80px] max-md:px-5 
              flex items-center justify-between h-full">
    <!-- Logo -->
    <a class="font-serif text-xl">Aesthetica STEM</a>
    <!-- Nav links -->
    <nav class="hidden md:flex gap-8">
      <a class="font-sans text-sm font-medium tracking-[0.05em] 
                relative after:absolute after:bottom-0 after:left-0 
                after:w-full after:h-px after:bg-primary">Shop</a>
    </nav>
  </div>
</nav>
```

### Product Card
```html
<div class="group cursor-pointer">
  <div class="relative overflow-hidden aspect-[3/4] bg-surface-container-low">
    <!-- Badge -->
    <span class="absolute top-3 left-3 z-10 bg-serum-pink 
                 font-sans text-xs font-semibold tracking-[0.1em] uppercase px-3 py-1">
      Bestseller
    </span>
    <!-- Image -->
    <img ngSrc="..." class="w-full h-full object-cover 
                            transition-transform duration-700 ease-out 
                            group-hover:scale-105" />
  </div>
  <!-- Info -->
  <div class="pt-4">
    <p class="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-secondary">
      Serums
    </p>
    <h3 class="font-sans text-base font-normal mt-1">Product Name</h3>
    <p class="font-sans text-sm mt-1">$89.00</p>
  </div>
</div>
```

### Primary Button
```html
<button class="bg-primary text-on-primary font-sans text-sm font-medium 
               tracking-[0.05em] uppercase px-8 py-4 
               hover:bg-secondary transition-colors duration-300 
               focus-visible:outline-2 focus-visible:outline-offset-2 
               focus-visible:outline-primary w-full">
  Add to Bag
</button>
```

### Ghost Button
```html
<button class="border border-primary text-primary font-sans text-sm font-medium 
               tracking-[0.05em] uppercase px-8 py-4 
               hover:bg-primary hover:text-on-primary transition-colors duration-300">
  View All
</button>
```

### Accordion
```html
<div class="border-t border-glass-border">
  <button class="w-full flex justify-between items-center py-5"
          (click)="toggle()" [attr.aria-expanded]="isOpen()">
    <span class="font-sans text-sm font-medium tracking-[0.05em] uppercase">
      The Science
    </span>
    <span class="material-symbols-outlined transition-transform duration-300"
          [class.rotate-180]="isOpen()">expand_more</span>
  </button>
  <div class="overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.2,0,0,1)]"
       [style.max-height]="isOpen() ? '500px' : '0'">
    <div class="pb-5 text-secondary font-sans text-base leading-relaxed">
      Content here
    </div>
  </div>
</div>
```

### Order Summary Box (sticky)
```html
<div class="sticky top-[140px] bg-surface-container-low 
            border border-glass-border p-8">
  <h2 class="font-serif text-2xl mb-6">Order Summary</h2>
  <!-- items -->
  <div class="border-t border-glass-border pt-6 space-y-3">
    <div class="flex justify-between font-sans text-sm">
      <span>Subtotal</span><span>$178.00</span>
    </div>
    <div class="flex justify-between font-sans text-sm text-secondary">
      <span>Shipping</span><span>Complimentary</span>
    </div>
    <div class="flex justify-between font-sans text-base font-medium pt-3 
                border-t border-glass-border">
      <span>Total</span><span>$178.00</span>
    </div>
  </div>
</div>
```

### Form Input (underline style)
```html
<div class="flex flex-col gap-2">
  <label class="font-sans text-xs font-semibold tracking-[0.1em] uppercase">
    Email Address
  </label>
  <input type="email" 
         class="bg-transparent border-0 border-b border-outline pb-3 
                font-sans text-base outline-none
                focus:border-primary transition-colors duration-300"
         placeholder="your@email.com" />
</div>
```

### Scroll Reveal (IntersectionObserver)
```typescript
// In component, after view init
@ViewChildren('reveal') revealEls!: QueryList<ElementRef>;

ngAfterViewInit() {
  if (!isPlatformBrowser(this.platformId)) return;
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove('opacity-0', 'translate-y-10');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.15 }
  );
  this.revealEls.forEach(el => observer.observe(el.nativeElement));
}
```
