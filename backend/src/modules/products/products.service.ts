import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Product } from './schemas/product.schema';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const TTL = {
  LIST: 3_600,
  FEATURED: 1_800,
  DETAIL: 7_200,
} as const;

@Injectable()
export class ProductsService {
  constructor(
    private readonly repo: ProductsRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async findAll(filter?: { category?: string; tags?: string[] }): Promise<Product[]> {
    const key = `products:all:${JSON.stringify(filter ?? {})}`;
    const cached = await this.cache.get<Product[]>(key);
    if (cached) return cached;

    const products = await this.repo.findAll(filter);
    await this.cache.set(key, products, TTL.LIST);
    return products;
  }

  async findFeatured(): Promise<Product[]> {
    const key = 'products:featured';
    const cached = await this.cache.get<Product[]>(key);
    if (cached) return cached;

    const products = await this.repo.findFeatured();
    await this.cache.set(key, products, TTL.FEATURED);
    return products;
  }

  async findBySlug(slug: string): Promise<Product> {
    const key = `product:${slug}`;
    const cached = await this.cache.get<Product>(key);
    if (cached) return cached;

    const product = await this.repo.findBySlug(slug);
    if (!product) throw new NotFoundException(`Product not found: ${slug}`);

    await this.cache.set(key, product, TTL.DETAIL);
    return product;
  }

  async findAllSlugs(): Promise<Pick<Product, 'slug'>[]> {
    return this.repo.findAllSlugs();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = await this.repo.create(dto);
    await this.invalidateListCache();
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.repo.update(id, dto);
    if (!product) throw new NotFoundException(`Product not found: ${id}`);

    await Promise.all([
      this.cache.del(`product:${product.slug}`),
      this.invalidateListCache(),
    ]);
    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException(`Product not found: ${id}`);

    await this.repo.remove(id);
    await Promise.all([
      this.cache.del(`product:${(product as any).slug}`),
      this.invalidateListCache(),
    ]);
  }

  private async invalidateListCache(): Promise<void> {
    await Promise.all([
      this.cache.del('products:all:{}'),
      this.cache.del('products:featured'),
    ]);
  }
}
