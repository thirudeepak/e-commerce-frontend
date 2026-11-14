import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SalesDashboard } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private toastService = inject(ToastService);

  dashboard: SalesDashboard | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getSalesDashboard().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.dashboard = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to load seller metrics');
      }
    });
  }

  formatPrice(price: number): string {
    return (Number(price) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  getOrderStatusBadge(status: string): string {
    if (status === 'CONFIRMED' || status === 'DELIVERED') return 'badge-stock-in';
    return 'badge-seller1';
  }
}
