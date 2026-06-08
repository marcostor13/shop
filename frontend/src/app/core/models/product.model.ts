export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  imageSrcset?: string;
  category: string;
  tags: string[];
  sku?: string;
  stock: number;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListItem
  extends Pick<Product, '_id' | 'name' | 'slug' | 'price' | 'comparePrice' | 'images' | 'category' | 'tags'> {}
