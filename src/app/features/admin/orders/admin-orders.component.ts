import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter = '';
  searchQuery = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders(1, 100, this.statusFilter || undefined).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.orders = res.data.orders;
          this.applyFilters();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to load orders');
      }
    });
  }

  applyFilters(): void {
    let result = [...this.orders];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.user?.name && o.user.name.toLowerCase().includes(q)) ||
          (o.user?.email && o.user.email.toLowerCase().includes(q)) ||
          (o.items && o.items.some((i) => i.productName && i.productName.toLowerCase().includes(q)))
      );
    }

    const min =
      this.minAmount !== null &&
      this.minAmount !== undefined &&
      (this.minAmount as unknown as string) !== '' &&
      !isNaN(Number(this.minAmount))
        ? Number(this.minAmount)
        : null;

    const max =
      this.maxAmount !== null &&
      this.maxAmount !== undefined &&
      (this.maxAmount as unknown as string) !== '' &&
      !isNaN(Number(this.maxAmount))
        ? Number(this.maxAmount)
        : null;

    if (min !== null) {
      result = result.filter((o) => Number(o.totalAmount) >= min);
    }

    if (max !== null) {
      result = result.filter((o) => Number(o.totalAmount) <= max);
    }

    this.filteredOrders = result;
  }

  hasActiveFilters(): boolean {
    return (
      this.statusFilter !== '' ||
      !!this.searchQuery.trim() ||
      this.minAmount !== null ||
      this.maxAmount !== null
    );
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.searchQuery = '';
    this.minAmount = null;
    this.maxAmount = null;
    this.loadOrders();
  }

  filterStatus(status: string): void {
    this.statusFilter = status;
    this.loadOrders();
  }

  onStatusChange(order: Order, newStatus: OrderStatus): void {
    if (order.orderStatus === newStatus) return;

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        order.orderStatus = newStatus;
        this.toastService.success(`Order status updated to ${newStatus}`);
      },
      error: (err) => this.toastService.error(err.message || 'Update status failed')
    });
  }

  formatPrice(price: number): string {
    return (Number(price) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
