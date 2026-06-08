import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>
  ) {}

  async findAll(filter?: { category?: string; tags?: string[] }): Promise<Product[]> {
    const query: Record<string, unknown> = { isActive: true };
    if (filter?.category) query.category = filter.category;
    if (filter?.tags?.length) query.tags = { $in: filter.tags };
    return this.model
      .find(query)
      .select('name slug price comparePrice images category tags stock')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findFeatured(limit = 3): Promise<Product[]> {
    return this.model
      .find({ isActive: true })
      .select('name slug price comparePrice images category tags stock')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.model.findOne({ slug, isActive: true }).lean().exec();
  }

  async findById(id: string): Promise<Product | null> {
    return this.model.findById(id).lean().exec();
  }

  async findAllSlugs(): Promise<Pick<Product, 'slug'>[]> {
    return this.model
      .find({ isActive: true })
      .select('slug updatedAt')
      .lean()
      .exec();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const created = new this.model(dto);
    return created.save();
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product | null> {
    return this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
