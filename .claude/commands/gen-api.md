# gen-api

Generate a complete NestJS API endpoint with controller, service, DTO, and module.

**Usage:** `/gen-api <resource> [CRUD|custom:<action>]`

$ARGUMENTS

## Instructions

Generate NestJS feature module for the resource in $ARGUMENTS following these patterns:

### File structure
```
src/<resource>/
├── <resource>.module.ts
├── <resource>.controller.ts
├── <resource>.service.ts
├── dto/
│   ├── create-<resource>.dto.ts
│   └── update-<resource>.dto.ts
└── schemas/
    └── <resource>.schema.ts  (if MongoDB schema needed)
```

### Controller pattern
```typescript
import { Controller, Get, Post, Body, Param, Delete, Patch, 
         UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';

@Controller('api/v1/<resource>')
export class <Resource>Controller {
  constructor(private readonly <resource>Service: <Resource>Service) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll(@Query() query: any) {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: Create<Resource>Dto) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: Update<Resource>Dto) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {}
}
```

### DTO pattern
```typescript
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class Create<Resource>Dto {
  @IsString() @IsNotEmpty()
  name: string;
  // add fields based on resource
}

export class Update<Resource>Dto extends PartialType(Create<Resource>Dto) {}
```

### Service pattern
```typescript
@Injectable()
export class <Resource>Service {
  constructor(
    @InjectModel(<Resource>.name) private model: Model<<Resource>Document>,
    private cacheManager: Cache,
  ) {}

  async findAll(query?: any): Promise<<Resource>[]> {
    const cacheKey = `<resource>:all:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as <Resource>[];
    
    const result = await this.model.find({ isActive: true }).exec();
    await this.cacheManager.set(cacheKey, result, 3600);
    return result;
  }
}
```

### Cache-Control headers for GET endpoints
```typescript
@Get() async findAll(@Res({ passthrough: true }) res: Response) {
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
}
```

## Clean Code & SOLID Rules

```
S — Service does ONE thing: repo is separate from business logic
O — Use abstract PaymentProcessor; new providers don't touch existing code
D — Inject everything; never `new` a dependency
- Guard clauses in service methods (throw early on not found)
- ≤ 20 lines per method; extract private helpers
- No magic numbers: use named constants
- Repository pattern: controller → service → repository
```

### Repository layer (separates DB from business logic)
```typescript
@Injectable()
export class <Resource>Repository {
  constructor(@InjectModel(<Resource>.name) private model: Model<<Resource>Document>) {}

  async findAll(filter?: object): Promise<<Resource>[]> {
    return this.model.find({ isActive: true, ...filter }).lean().exec();
  }

  async findBySlug(slug: string): Promise<<Resource> | null> {
    return this.model.findOne({ slug, isActive: true }).lean().exec();
  }

  async findById(id: string): Promise<<Resource> | null> {
    return this.model.findById(id).lean().exec();
  }
}
```

## Unit Tests (generate alongside)

```typescript
// <resource>.service.spec.ts
describe('<Resource>Service', () => {
  let service: <Resource>Service;
  const mockRepo = { findAll: jest.fn(), findBySlug: jest.fn(), findById: jest.fn() };
  const mockCache = { get: jest.fn().mockResolvedValue(null), set: jest.fn(), del: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        <Resource>Service,
        { provide: <Resource>Repository, useValue: mockRepo },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();
    service = module.get<<Resource>Service>(<Resource>Service);
    jest.clearAllMocks();
  });

  it('should return cached data without hitting repo', async () => {
    mockCache.get.mockResolvedValue([mock<Resource>]);
    await service.findAll();
    expect(mockRepo.findAll).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when resource not found', async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    await expect(service.getBySlug('missing')).rejects.toThrow(NotFoundException);
  });
});
```

Generate all files for the resource specified in $ARGUMENTS: module, controller, service, repository, DTOs, and spec files.
