import { Order, OrderItem } from './order.model';
import { Product } from './product.model';

export interface AdminBankAccount {
  dailyBankBalance: number;
  totalBankBalance: number;
  pendingSettlements: number;
  currency: string;
  lastSettlementCheck: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalSalesPersons: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  bankAccount: AdminBankAccount;
  statusSummary: Record<string, number>;
  recentOrders: Order[];
}

export interface SalesDashboard {
  totalProductsOwned: number;
  totalItemsSold: number;
  totalSalesRevenue: number;
  recentSoldItems: OrderItem[];
}

export interface UserDashboard {
  totalOrders: number;
  totalSpent: number;
  recentOrders: Order[];
}

