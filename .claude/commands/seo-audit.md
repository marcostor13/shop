# seo-audit

SEO audit and implementation checklist for an Aesthetica STEM shop page.

**Usage:** `/seo-audit <page|component-path>`

$ARGUMENTS

## Instructions

Audit or implement SEO for the page/component in $ARGUMENTS. Check and fix all items below.

## Angular SEO Implementation

### 1. Meta tags (every routed component)
```typescript
import { Title, Meta } from '@angular/platform-browser';
import { JsonLdService } from '../shared/services/json-ld.service';

@Component({ ... })
export class ProductPageComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);
  private jsonLd = inject(JsonLdService);

  ngOnInit() {
    this.title.setTitle(`${this.product().name} | Aesthetica STEM`);
    this.meta.updateTag({ name: 'description', content: this.product().metaDescription });
    this.meta.updateTag({ property: 'og:title', content: this.product().name });
    this.meta.updateTag({ property: 'og:description', content: this.product().metaDescription });
    this.meta.updateTag({ property: 'og:image', content: this.product().images[0] });
    this.meta.updateTag({ property: 'og:url', content: this.canonicalUrl() });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ rel: 'canonical', href: this.canonicalUrl() });
    this.jsonLd.setProduct(this.product());
  }
}
```

### 2. JSON-LD Structured Data Service
```typescript
// shared/services/json-ld.service.ts
@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private doc = inject(DOCUMENT);

  setProduct(product: Product): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    };
    this.injectScript(schema);
  }

  setBreadcrumb(items: { name: string; url: string }[]): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };
    this.injectScript(schema);
  }

  private injectScript(data: object): void {
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
```

### 3. Sitemap (NestJS endpoint)
```typescript
// sitemap.controller.ts
@Get('sitemap.xml')
@Header('Content-Type', 'application/xml')
@Header('Cache-Control', 'public, max-age=86400')
async sitemap(): Promise<string> {
  const products = await this.productsService.findAllSlugs();
  const baseUrl = process.env.FRONTEND_URL;
  const urls = [
    { loc: baseUrl, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/shop`, priority: '0.9', changefreq: 'daily' },
    ...products.map(p => ({
      loc: `${baseUrl}/shop/${p.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: p.updatedAt.toISOString(),
    })),
  ];
  return this.buildXml(urls);
}
```

### 4. robots.txt
```
User-agent: *
Allow: /
Disallow: /checkout
Disallow: /cart
Disallow: /account
Disallow: /api/

Sitemap: https://aesthetica.com/sitemap.xml
```

### 5. SSR Transfer State (avoid double API calls)
```typescript
// In page component
const PRODUCTS_KEY = makeStateKey<Product[]>('featured-products');

ngOnInit() {
  const cached = this.transferState.get(PRODUCTS_KEY, null);
  if (cached) {
    this.products.set(cached);
    return;
  }
  this.productsService.getFeatured().subscribe(data => {
    this.transferState.set(PRODUCTS_KEY, data);
    this.products.set(data);
  });
}
```

## SEO Audit Checklist

- [ ] `<title>` unique, ≤60 chars, keyword-first
- [ ] `meta description` unique, 150-160 chars, with CTA
- [ ] `og:image` 1200×630px minimum
- [ ] Canonical URL set (no trailing slash inconsistency)
- [ ] JSON-LD present (Product / BreadcrumbList / Organization)
- [ ] Heading hierarchy: single `<h1>`, logical `<h2>` → `<h6>`
- [ ] Images: `alt` text descriptive, not keyword-stuffed
- [ ] Internal links with descriptive anchor text (not "click here")
- [ ] Core Web Vitals: LCP image has `priority` attribute
- [ ] Page accessible server-side (SSR working, no blank HTML)
- [ ] Sitemap includes page URL with correct `lastmod`
- [ ] Google Search Console submitted
