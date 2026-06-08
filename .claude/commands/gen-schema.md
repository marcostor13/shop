# gen-schema

Generate a MongoDB Mongoose schema for the Aesthetica STEM shop.

**Usage:** `/gen-schema <entity>`

$ARGUMENTS

## Instructions

Generate a complete Mongoose schema for the entity in $ARGUMENTS.

### Schema pattern
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type <Entity>Document = HydratedDocument<<Entity>>;

@Schema({ timestamps: true, versionKey: false })
export class <Entity> {
  @Prop({ required: true })
  field: string;
}

export const <Entity>Schema = SchemaFactory.createForClass(<Entity>);
// Add indexes:
<Entity>Schema.index({ slug: 1 }, { unique: true });
```

## Pre-built schemas for this shop

### Product
```typescript
@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop() description: string;
  @Prop({ required: true, min: 0 }) price: number;
  @Prop() comparePrice: number;
  @Prop({ type: [String], default: [] }) images: string[];
  @Prop({ required: true }) category: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop() sku: string;
  @Prop({ default: 0 }) stock: number;
  @Prop() metaTitle: string;
  @Prop() metaDescription: string;
  @Prop({ default: true }) isActive: boolean;
}
```

### Order
```typescript
@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ required: true, unique: true }) orderNumber: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) user: Types.ObjectId;
  @Prop([{ product: { type: Types.ObjectId, ref: 'Product' }, qty: Number, price: Number }])
  items: Array<{ product: Types.ObjectId; qty: number; price: number }>;
  @Prop({ required: true }) subtotal: number;
  @Prop({ default: 0 }) tax: number;
  @Prop({ default: 0 }) shipping: number;
  @Prop({ required: true }) total: number;
  @Prop({ enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' })
  status: string;
  @Prop({ type: Object }) shippingAddress: Record<string, string>;
  @Prop() paymentMethod: string;
}
```

### User
```typescript
@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, lowercase: true }) email: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop({ type: [Object], default: [] }) addresses: Record<string, string>[];
  @Prop({ enum: ['customer','admin'], default: 'customer' }) role: string;
}
```

Generate the schema file for the entity specified in $ARGUMENTS, using these patterns and adding relevant indexes.
