# solid-review

Review and fix code for Clean Code, SOLID principles, and add unit tests.

**Usage:** `/solid-review <file-path>`

$ARGUMENTS

## Instructions

Review the file in $ARGUMENTS. Apply all principles below, then generate the corresponding test file.

## Clean Code Rules

```
1. Names reveal intent: `getUserByEmailFromDatabase` → `findUserByEmail`
2. Functions do ONE thing — if it has "and" in the name, split it
3. Functions ≤ 20 lines; extract when longer
4. No magic numbers: const MAX_LOGIN_ATTEMPTS = 5
5. No comments that repeat the code; keep WHY comments only
6. No nested conditionals >2 levels — use guard clauses
7. Return early, don't nest happy path
```

### Guard clause pattern
```typescript
// BAD
function process(user: User | null) {
  if (user) {
    if (user.isActive) {
      // 50 lines of happy path
    }
  }
}

// GOOD
function process(user: User | null): void {
  if (!user) return;
  if (!user.isActive) throw new ForbiddenException('Account inactive');
  // happy path, flat
}
```

## SOLID Principles

### S — Single Responsibility
```typescript
// BAD: ProductService fetches, validates, sends emails, logs
// GOOD: split into ProductRepository, ProductValidator, NotificationService, Logger

// Each class has ONE reason to change
@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>) {}
  async findBySlug(slug: string): Promise<Product | null> {
    return this.model.findOne({ slug, isActive: true }).exec();
  }
}

@Injectable()
export class ProductService {
  constructor(
    private readonly repo: ProductRepository,
    private readonly cache: CacheService,
  ) {}
  async getBySlug(slug: string): Promise<Product> {
    const cached = await this.cache.get<Product>(`product:${slug}`);
    if (cached) return cached;
    const product = await this.repo.findBySlug(slug);
    if (!product) throw new NotFoundException(`Product not found: ${slug}`);
    await this.cache.set(`product:${slug}`, product, 3600);
    return product;
  }
}
```

### O — Open/Closed (extend without modifying)
```typescript
// Use abstract classes / interfaces for extensibility
abstract class PaymentProcessor {
  abstract charge(amount: number, token: string): Promise<PaymentResult>;
}

@Injectable()
class StripeProcessor extends PaymentProcessor {
  async charge(amount: number, token: string): Promise<PaymentResult> { ... }
}

// Adding MercadoPago: create new class, no changes to existing code
@Injectable()
class MercadoPagoProcessor extends PaymentProcessor { ... }
```

### L — Liskov Substitution
```typescript
// Subtypes must be usable wherever parent is expected
// Don't throw in overrides what the parent doesn't throw
// Don't add preconditions stricter than parent
```

### I — Interface Segregation
```typescript
// BAD: one fat interface
interface IProductService {
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product>;
  create(dto: CreateProductDto): Promise<Product>;
  sendNewProductEmail(product: Product): Promise<void>; // ← wrong here
  generateSitemap(): Promise<string>;                    // ← wrong here
}

// GOOD: focused interfaces
interface IProductReader { findAll(): Promise<Product[]>; findBySlug(slug: string): Promise<Product>; }
interface IProductWriter { create(dto: CreateProductDto): Promise<Product>; update(...): Promise<Product>; }
```

### D — Dependency Inversion
```typescript
// Depend on abstractions, not concretions
// ALWAYS inject via constructor / inject(), never `new`

// BAD
class OrderService {
  private stripe = new StripeProcessor(); // ← hardcoded
}

// GOOD
@Injectable()
class OrderService {
  constructor(private readonly payment: PaymentProcessor) {} // ← injected
}
```

## Angular-specific Clean Code

```typescript
// 1. Smart/Dumb component split
// Smart (page): fetches data, handles state
// Dumb (ui): @Input only, emits @Output, no services

// 2. Avoid logic in templates — move to computed signals
// BAD: *ngIf="items.length > 0 && !isLoading && user?.role === 'admin'"
hasAdminItems = computed(() =>
  this.items().length > 0 && !this.isLoading() && this.user()?.role === 'admin'
);

// 3. Unsubscribe with takeUntilDestroyed
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
this.route.params.pipe(takeUntilDestroyed()).subscribe(...);

// 4. trackBy for ngFor
trackByProductId = (i: number, p: Product) => p._id;
```

## Unit Tests

### Angular component test pattern
```typescript
// <name>.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    _id: '1', name: 'Test Serum', slug: 'test-serum',
    price: 89, images: ['/test.webp'], category: 'Serums',
    description: 'Test', stock: 10, isActive: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],  // standalone
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should display product name', () => {
    const el = fixture.nativeElement.querySelector('h3');
    expect(el.textContent).toContain('Test Serum');
  });

  it('should emit addToCart when button clicked', () => {
    const spy = jest.spyOn(component.addToCart, 'emit');
    fixture.nativeElement.querySelector('button').click();
    expect(spy).toHaveBeenCalledWith(mockProduct);
  });
});
```

### NestJS service test pattern
```typescript
// <name>.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  const mockRepo = {
    findBySlug: jest.fn(),
  };
  const mockCache = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: mockRepo },
        { provide: CacheService, useValue: mockCache },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  describe('getBySlug', () => {
    it('returns cached product when cache hit', async () => {
      const product = { slug: 'test' } as Product;
      mockCache.get.mockResolvedValue(product);
      const result = await service.getBySlug('test');
      expect(result).toBe(product);
      expect(mockRepo.findBySlug).not.toHaveBeenCalled();
    });

    it('fetches from repo and caches on cache miss', async () => {
      const product = { slug: 'test' } as Product;
      mockRepo.findBySlug.mockResolvedValue(product);
      const result = await service.getBySlug('test');
      expect(result).toBe(product);
      expect(mockCache.set).toHaveBeenCalledWith('product:test', product, 3600);
    });

    it('throws NotFoundException when product not found', async () => {
      mockRepo.findBySlug.mockResolvedValue(null);
      await expect(service.getBySlug('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### NestJS controller test pattern (e2e)
```typescript
// test/<resource>.e2e-spec.ts
describe('/api/v1/products (e2e)', () => {
  it('GET / returns 200 with products array', () =>
    request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200)
      .expect(res => expect(Array.isArray(res.body)).toBe(true))
  );

  it('GET /:slug returns 404 for unknown slug', () =>
    request(app.getHttpServer())
      .get('/api/v1/products/does-not-exist')
      .expect(404)
  );
});
```

## Coverage Targets

- **Statements:** ≥80%
- **Branches:** ≥75%
- **Functions:** ≥80%
- **Lines:** ≥80%

```json
// jest.config.js
coverageThreshold: {
  global: { statements: 80, branches: 75, functions: 80, lines: 80 }
}
```

Now apply all of the above to the file in $ARGUMENTS: identify violations, fix them, and generate the spec file.
