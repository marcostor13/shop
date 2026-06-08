# cache-strategy

Cache implementation guide for Aesthetica STEM — multi-layer caching strategy.

**Usage:** `/cache-strategy [layer:api|ssr|cdn|mongodb] [resource]`

$ARGUMENTS

## Cache Layers Architecture

```
Browser Cache (Service Worker / HTTP)
    ↓
Netlify Edge Cache / CDN
    ↓
NestJS In-Memory Cache (@nestjs/cache-manager + Redis)
    ↓
MongoDB (with indexed queries)
```

## Layer 1 — NestJS API Cache (@nestjs/cache-manager)

### Setup (AppModule)
```typescript
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
        ttl: 3600,          // default 1 hour
        max: 1000,          // max items in memory fallback
      }),
    }),
  ],
})
export class AppModule {}
```

### Cache Interceptor on controllers
```typescript
// Auto-cache GET endpoints
@Get()
@UseInterceptors(CacheInterceptor)
@CacheTTL(3600)              // 1 hour for product list
findAll(): Promise<Product[]> { ... }

@Get('featured')
@UseInterceptors(CacheInterceptor)
@CacheTTL(1800)              // 30 min for featured
findFeatured(): Promise<Product[]> { ... }

@Get(':slug')
@UseInterceptors(CacheInterceptor)
@CacheTTL(7200)              // 2 hours for individual product
findOne(@Param('slug') slug: string): Promise<Product> { ... }
```

### Manual cache invalidation on mutations
```typescript
@Injectable()
export class ProductService {
  constructor(
    private readonly repo: ProductRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.repo.update(id, dto);
    // Invalidate related cache keys
    await Promise.all([
      this.cache.del(`product:${product.slug}`),
      this.cache.del('products:all'),
      this.cache.del('products:featured'),
    ]);
    return product;
  }
}
```

### Cache TTL Strategy
```typescript
// constants/cache-ttl.ts
export const CACHE_TTL = {
  PRODUCTS_LIST: 3_600,      // 1h — changes infrequently
  PRODUCT_DETAIL: 7_200,     // 2h — stable data
  FEATURED: 1_800,           // 30m — marketing updates
  CART: 0,                   // no cache — user-specific
  ORDERS: 0,                 // no cache — sensitive
  SITEMAP: 86_400,           // 24h — SEO
  CATEGORIES: 86_400,        // 24h — very stable
} as const;
```

## Layer 2 — HTTP Cache-Control Headers

```typescript
// cache.interceptor.ts — set headers per route
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const ttlMap: Record<string, number> = {
      '/api/v1/products': 3600,
      '/sitemap.xml': 86400,
    };

    const path = req.path;
    const ttl = Object.entries(ttlMap).find(([k]) => path.startsWith(k))?.[1];

    if (ttl && req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${ttl}, s-maxage=${ttl * 2}`);
      res.setHeader('Vary', 'Accept-Encoding, Accept');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }

    return next.handle();
  }
}
```

## Layer 3 — Angular SSR TransferState

```typescript
// products-page.component.ts
import { TransferState, makeStateKey } from '@angular/core';

const PRODUCTS_KEY = makeStateKey<Product[]>('products-featured');

@Component({ ... })
export class ProductsPageComponent {
  private transferState = inject(TransferState);
  private productsService = inject(ProductsService);
  private platformId = inject(PLATFORM_ID);

  products = signal<Product[]>([]);

  ngOnInit(): void {
    const transferred = this.transferState.get(PRODUCTS_KEY, null);

    if (transferred) {
      this.products.set(transferred);
      if (isPlatformBrowser(this.platformId)) {
        this.transferState.remove(PRODUCTS_KEY);  // clean up
      }
      return;
    }

    this.productsService.getFeatured().subscribe(data => {
      this.products.set(data);
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(PRODUCTS_KEY, data);
      }
    });
  }
}
```

## Layer 4 — Browser Service Worker (optional)

```typescript
// app.config.ts — enable SW for PWA
import { provideServiceWorker } from '@angular/service-worker';

providers: [
  provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000',
  }),
]
```

```json
// ngsw-config.json
{
  "dataGroups": [
    {
      "name": "api-products",
      "urls": ["/api/v1/products/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "3s"
      }
    }
  ]
}
```

## MongoDB Query Optimization

```typescript
// Always use indexes for query fields
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ createdAt: -1 });

// Project only needed fields
async findAll(): Promise<ProductListItem[]> {
  return this.model
    .find({ isActive: true })
    .select('name slug price images category tags')  // never select __v, passwordHash
    .sort({ createdAt: -1 })
    .lean()  // return plain objects, not Mongoose docs (faster)
    .exec();
}
```

## Cache Tests

```typescript
describe('ProductService cache', () => {
  it('returns cached value on second call without hitting repo', async () => {
    mockCache.get.mockResolvedValueOnce(null).mockResolvedValueOnce([mockProduct]);
    mockRepo.findAll.mockResolvedValue([mockProduct]);

    await service.findAll();  // cache miss → repo hit
    await service.findAll();  // cache hit → no repo call

    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('invalidates cache after update', async () => {
    mockRepo.update.mockResolvedValue(mockProduct);
    await service.update('id', { name: 'New Name' });
    expect(mockCache.del).toHaveBeenCalledWith('product:test-serum');
  });
});
```

Apply the cache strategy to the resource/layer in $ARGUMENTS.
