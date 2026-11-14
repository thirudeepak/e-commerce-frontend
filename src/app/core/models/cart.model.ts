import { Product } from './product.model';

export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  cartId: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalAmount: number;
}

