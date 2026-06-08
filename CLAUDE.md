# Aesthetica STEM — Online Shop

**Stack:** Angular 21 (SSR) · NestJS · MongoDB · GitHub · Coolify · Netlify

## Architecture

```
Shop/
├── frontend/        # Angular 21 + SSR + TailwindCSS
├── backend/         # NestJS REST + JWT + Mongoose
├── infrastructure/  # Docker, Coolify configs, nginx
└── .claude/         # Skills, commands, settings
```

**Frontend → Netlify** (SSR via Node adapter or prerender static)
**Backend → Coolify** (Docker container, self-hosted VPS)
**DB → MongoDB Atlas** (or Coolify-managed MongoDB)

## Design System — Aesthetica STEM

**Brand:** High-end minimalism + Beauty in STEM. Clean, scientific, premium.

### Colors (Tailwind custom tokens)

| Token | Hex | Use |
|---|---|---|
| `primary` | #000000 | Text, CTAs, borders |
| `on-primary` | #FFFFFF | Text on black |
| `surface` | #FBF9F9 | Page background |
| `secondary` | #5E5E5B | Muted text |
| `scientific-teal` | #2D4B4B | Accent CTAs |
| `serum-pink` | #FDF0ED | Highlights, badges |
| `surface-container-low` | #F5F3F3 | Cards |
| `surface-container` | #EFEDED | Containers |
| `glass-border` | rgba(26,26,26,0.08) | Dividers |
| `error` | #BA1A1A | Errors |

### Typography

| Token | Font | Size | Weight |
|---|---|---|---|
| `display-lg` | EB Garamond | 64px | 400 |
| `headline-lg` | EB Garamond | 40px | 400 |
| `headline-md` | EB Garamond | 28px | 400 |
| `body-lg` | Hanken Grotesk | 18px | 400 |
| `body-md` | Hanken Grotesk | 16px | 400 |
| `label-caps` | Hanken Grotesk | 12px | 600 UPPERCASE |
| `button` | Hanken Grotesk | 14px | 500 |

Fonts: `EB Garamond` (serif, headlines) + `Hanken Grotesk` (sans, body) + `Material Symbols Outlined`

### Spacing & Layout

- Max-width: 1440px · Desktop margin: 80px · Mobile: 20px
- Section gap: 120px · Grid: 12-col desktop / 4-col mobile
- Border-radius: 2px (minimal, near-square)

### Easing & Motion

- Standard easing: `cubic-bezier(0.2, 0, 0, 1)`
- Transitions: colors 300ms, images 700ms ease-out
- Animations: `fade-in-up` (1s), `reveal` clip-path (1.5s)
- Scroll trigger: IntersectionObserver threshold 0.15

### Pages

| Page | Route | Key components |
|---|---|---|
| Home | `/` | Hero, FeaturedProducts, Journal |
| Shop | `/shop` | FilterSidebar, ProductGrid |
| Product | `/shop/:slug` | ImageGallery, Accordion, AddToBag |
| Cart | `/cart` | CartItems, QuantityControl, OrderSummary |
| Checkout | `/checkout` | StepForm (contact/shipping/payment) |
| Confirmation | `/order-confirmed` | ThankYou, OrderSummary |
| About | `/ethos` | BrandStory |

## Angular 21 Patterns

```typescript
// Standalone components (default in Angular 21)
@Component({ standalone: true, imports: [...], ... })

// Signals (preferred over observables for state)
count = signal(0);
doubled = computed(() => this.count() * 2);

// inject() over constructor injection
private router = inject(Router);

// SSR: use isPlatformBrowser for browser-only code
private platformId = inject(PLATFORM_ID);
isBrowser = isPlatformBrowser(this.platformId);
```

### SSR (Angular Universal / @angular/ssr)

```typescript
// app.config.ts
provideServerRendering()

// Transferstate for API data (avoids double fetch)
const key = makeStateKey<Product[]>('products');
transferState.set(key, data);
const cached = transferState.get(key, null);
```

### Image Optimization

```html
<!-- Angular Image directive (built-in) -->
<img ngSrc="/product.webp" width="800" height="1000" priority />
<!-- priority for LCP images, lazy for below-fold -->
```

### Cache Strategy

```typescript
// HTTP Interceptor for API cache
// Browser: HttpContext cache tokens
// SSR: TransferState for hydration
// CDN: Cache-Control headers from NestJS
```

## NestJS Patterns

```typescript
// Module structure: feature-based
// AuthModule, ProductsModule, CartModule, OrdersModule, UsersModule

// DTO with class-validator
export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() @Min(0) price: number;
  @IsArray() images: string[];
}

// Cache with @nestjs/cache-manager
@Get() @UseInterceptors(CacheInterceptor) findAll() {}

// SSR-friendly headers
res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
```

## MongoDB Schemas

```typescript
// Product
{ name, slug, description, price, comparePrice, images[], category,
  tags[], sku, stock, metaTitle, metaDescription, isActive, createdAt }

// Order
{ orderNumber, user, items[{product,qty,price}], subtotal, tax, shipping,
  total, status, shippingAddress, paymentMethod, createdAt }

// User
{ email, passwordHash, firstName, lastName, addresses[], role, createdAt }
```

## SEO Patterns

```typescript
// Angular: use @angular/platform-browser Meta service
meta.updateTag({ name: 'description', content: product.metaDescription });
meta.updateTag({ property: 'og:image', content: product.images[0] });
title.setTitle(`${product.name} | Aesthetica STEM`);

// Structured Data (JSON-LD) in component
const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', ... };
```

```typescript
// NestJS: Sitemap endpoint
@Get('sitemap.xml') async sitemap() { /* generate XML */ }
// robots.txt: allow all, disallow /checkout /cart /account
```

## Deployment

### Local Dev
```bash
# Backend
cd backend && npm run start:dev   # :3000

# Frontend  
cd frontend && npm run dev        # :4200 (or ng serve)
```

### GitHub → Coolify (Backend)
- Branch `main` → auto-deploy via Coolify webhook
- Dockerfile in `backend/`
- Env vars set in Coolify dashboard

### GitHub → Netlify (Frontend)
- Branch `main` → Netlify auto-build
- Build: `npm run build:ssr` → publish `.output/public` or `dist/browser`
- SSR: Netlify Functions or Edge Functions

## Commands Reference

| Command | Purpose |
|---|---|
| `/gen-component` | Generate Angular component (design system) |
| `/gen-api` | Generate NestJS endpoint + DTO + service |
| `/gen-schema` | Generate MongoDB schema + Mongoose model |
| `/seo-audit` | SEO audit checklist for a page |
| `/design-ref` | Look up design tokens / components |
| `/deploy` | Deployment workflow guide |
| `/image-optimize` | Image optimization checklist |

## Key Rules

- **Components:** Standalone, signals-first, OnPush change detection
- **Styling:** TailwindCSS only, no inline styles, use design tokens
- **API:** RESTful, versioned (`/api/v1/`), DTOs always, validation pipe global
- **Images:** WebP format, ngSrc directive, width/height always set
- **SEO:** Meta tags in every routed component, canonical URLs, JSON-LD for products
- **Security:** JWT httpOnly cookies, CSRF protection, rate limiting on API
- **i18n:** Spanish primary, English secondary (Angular i18n or ngx-translate)
