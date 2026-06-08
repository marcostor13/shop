import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './schemas/product.schema';

const mockProduct: Partial<Product> = {
  name: 'Intensive Serum',
  slug: 'intensive-serum',
  price: 89,
  images: ['/serum.webp'],
  category: 'Serums',
  stock: 20,
  isActive: true,
};

const mockRepo = {
  findAll: jest.fn(),
  findFeatured: jest.fn(),
  findBySlug: jest.fn(),
  findById: jest.fn(),
  findAllSlugs: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockCache = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockRepo },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
    mockCache.get.mockResolvedValue(null);
  });

  describe('findFeatured', () => {
    it('returns cached products without hitting repo', async () => {
      mockCache.get.mockResolvedValue([mockProduct]);
      const result = await service.findFeatured();
      expect(result).toEqual([mockProduct]);
      expect(mockRepo.findFeatured).not.toHaveBeenCalled();
    });

    it('fetches from repo and caches on cache miss', async () => {
      mockRepo.findFeatured.mockResolvedValue([mockProduct]);
      const result = await service.findFeatured();
      expect(result).toEqual([mockProduct]);
      expect(mockCache.set).toHaveBeenCalledWith('products:featured', [mockProduct], 1800);
    });
  });

  describe('findBySlug', () => {
    it('returns product by slug from cache', async () => {
      mockCache.get.mockResolvedValue(mockProduct);
      const result = await service.findBySlug('intensive-serum');
      expect(result).toEqual(mockProduct);
      expect(mockRepo.findBySlug).not.toHaveBeenCalled();
    });

    it('fetches from repo on cache miss', async () => {
      mockRepo.findBySlug.mockResolvedValue(mockProduct);
      const result = await service.findBySlug('intensive-serum');
      expect(result).toEqual(mockProduct);
      expect(mockCache.set).toHaveBeenCalledWith('product:intensive-serum', mockProduct, 7200);
    });

    it('throws NotFoundException when product not found', async () => {
      mockRepo.findBySlug.mockResolvedValue(null);
      await expect(service.findBySlug('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('throws NotFoundException when product not found', async () => {
      mockRepo.update.mockResolvedValue(null);
      await expect(service.update('bad-id', { name: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('invalidates cache after update', async () => {
      mockRepo.update.mockResolvedValue({ ...mockProduct, name: 'Updated' });
      await service.update('some-id', { name: 'Updated' });
      expect(mockCache.del).toHaveBeenCalledWith('product:intensive-serum');
    });
  });
});
