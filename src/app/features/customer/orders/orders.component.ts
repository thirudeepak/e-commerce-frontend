import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  orders: Order[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.orders = res.data.orders;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to load orders');
      }
    });
  }

  getItemImage(item: any): string {
    let imgs = item.product?.images;
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch { imgs = []; }
    }
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]?.url) {
      return imgs[0].url;
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
  }

  formatPrice(price: number): string {
    return (Number(price) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderStatusBadge(status: string): string {
    if (status === 'CONFIRMED' || status === 'DELIVERED') return 'badge-stock-in';
    if (status === 'CANCELLED') return 'badge-stock-out';
    return 'badge-seller1';
  }

  getPaymentStatusBadge(status: string): string {
    if (status === 'PAID') return 'badge-seller2';
    if (status === 'FAILED') return 'badge-stock-out';
    return 'badge-role-admin';
  }
}
