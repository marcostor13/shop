# image-optimize

Image optimization guide for Aesthetica STEM — WebP, lazy loading, CDN, Angular NgOptimizedImage.

**Usage:** `/image-optimize [component-path|setup]`

$ARGUMENTS

## Angular NgOptimizedImage (Built-in)

```typescript
// app.config.ts — register image loader
import { provideImageKitLoader } from '@angular/common'; // or custom

// For Cloudinary:
import { provideCloudinaryLoader } from '@angular/common';
providers: [
  provideCloudinaryLoader('https://res.cloudinary.com/your-account')
]
```

```html
<!-- LCP image (hero): use priority -->
<img ngSrc="/hero-product.webp"
     width="1440" height="800"
     priority
     alt="Aesthetica STEM hero" />

<!-- Below-fold: lazy (default) -->
<img ngSrc="/product-serum.webp"
     width="400" height="533"
     alt="Intensive Serum 30ml" />

<!-- Responsive: use fill + wrapper with aspect ratio -->
<div class="relative aspect-[3/4]">
  <img ngSrc="/product.webp" fill alt="..." class="object-cover" />
</div>
```

## Image Pipeline

### Source formats
- Upload originals as high-res JPG/PNG (source of truth)
- Generate WebP for web (80% quality) + AVIF for modern browsers
- Thumbnail sizes: 400w, 800w, 1200w (srcset)

### NestJS upload endpoint
```typescript
// Uses Sharp for processing
import * as sharp from 'sharp';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<ImageDto> {
  const sizes = [400, 800, 1200];
  const results = await Promise.all(
    sizes.map(async (w) => {
      const buffer = await sharp(file.buffer)
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      const filename = `${basename}-${w}w.webp`;
      return this.storageService.upload(buffer, filename, 'image/webp');
    })
  );
  return { urls: results, srcset: results.map((url, i) => `${url} ${sizes[i]}w`).join(', ') };
}
```

### HTML srcset pattern
```html
<img
  ngSrc="{{ product.images[0] }}"
  [ngSrcset]="product.imageSrcset"
  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
  width="400" height="533"
  alt="{{ product.name }}" />
```

## CDN & Cache Headers (NestJS)

```typescript
@Get('images/:filename')
@Header('Cache-Control', 'public, max-age=31536000, immutable')
@Header('Vary', 'Accept')
serveImage(@Param('filename') filename: string, @Req() req: Request) {
  // Serve WebP if browser supports it (Accept: image/webp)
  const acceptsWebp = req.headers.accept?.includes('image/webp');
  const file = acceptsWebp ? `${filename}.webp` : `${filename}.jpg`;
  return this.storageService.stream(file);
}
```

## Netlify Image Transformation

```toml
# netlify.toml — enable image CDN
[images]
  remote_images = ["https://res.cloudinary.com/*"]
```

```html
<!-- Netlify Image CDN URL pattern -->
<!-- /.netlify/images?url=<source>&w=800&q=82&fm=webp -->
<img src="/.netlify/images?url=/assets/product.jpg&w=800&q=82&fm=webp"
     srcset="/.netlify/images?url=/assets/product.jpg&w=400&fm=webp 400w,
             /.netlify/images?url=/assets/product.jpg&w=800&fm=webp 800w"
     loading="lazy" width="400" height="533" />
```

## Optimization Checklist

- [ ] All images converted to WebP (fallback JPG for old browsers)
- [ ] Hero / LCP images have `priority` attribute (no lazy loading)
- [ ] All `<img>` have explicit `width` and `height` (prevents CLS)
- [ ] `srcset` and `sizes` set for responsive images
- [ ] Product images: aspect-ratio 3:4, max 120KB at 800w
- [ ] Hero images: max 300KB at 1440w
- [ ] Thumbnails: max 30KB at 400w
- [ ] `alt` text is descriptive (not empty, not "image")
- [ ] Static assets served with `Cache-Control: immutable`
- [ ] Preload LCP image in `<head>`:
      `<link rel="preload" as="image" href="/hero.webp" />`

## Core Web Vitals Targets

| Metric | Target | How to achieve |
|---|---|---|
| LCP | ≤ 2.5s | Priority on hero img, preload link, CDN |
| CLS | ≤ 0.1 | Always set width/height on images |
| INP | ≤ 200ms | Lazy hydration, OnPush, signals |
| FCP | ≤ 1.8s | SSR, inline critical CSS |

Apply all optimizations to the component/images in $ARGUMENTS.
