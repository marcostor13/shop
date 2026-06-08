import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) slug: string;
  @Prop({ trim: true }) description: string;
  @Prop({ required: true, min: 0 }) price: number;
  @Prop({ min: 0 }) comparePrice: number;
  @Prop({ type: [String], default: [] }) images: string[];
  @Prop({ required: true, trim: true }) category: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ trim: true }) sku: string;
  @Prop({ default: 0, min: 0 }) stock: number;
  @Prop({ trim: true }) metaTitle: string;
  @Prop({ trim: true }) metaDescription: string;
  @Prop({ default: true }) isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });
