import { Product } from './product.model';

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product?: Product;
}

export interface Wishlist {
  wishlistId: string;
  userId: string;
  items: WishlistItem[];
  totalItems: number;
}

