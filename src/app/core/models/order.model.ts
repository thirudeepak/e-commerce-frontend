import { Product } from './product.model';
import { User } from './user.model';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
  seller?: User;
  order?: Order;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  deliveryAddress?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt?: string;
  items?: OrderItem[];
  user?: User;
}

export interface RazorpayOrderData {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  totalAmount: number;
}

