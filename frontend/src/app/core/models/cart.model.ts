import { ProductListItem } from './product.model';

export interface CartItem {
  product: ProductListItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
