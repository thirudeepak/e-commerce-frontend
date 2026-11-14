import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminDashboard } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private toastService = inject(ToastService);

  dashboard: AdminDashboard | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadAdminMetrics();
  }

  loadAdminMetrics(): void {
    this.isLoading = true;
    this.dashboardService.getAdminDashboard().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.dashboard = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to load admin metrics');
      }
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
