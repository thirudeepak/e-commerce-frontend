import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AdminDashboard, SalesDashboard, UserDashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getAdminDashboard(): Observable<ApiResponse<AdminDashboard>> {
    return this.http.get<ApiResponse<AdminDashboard>>(`${this.apiUrl}/admin`);
  }

  getSalesDashboard(): Observable<ApiResponse<SalesDashboard>> {
    return this.http.get<ApiResponse<SalesDashboard>>(`${this.apiUrl}/sales`);
  }

  getUserDashboard(): Observable<ApiResponse<UserDashboard>> {
    return this.http.get<ApiResponse<UserDashboard>>(`${this.apiUrl}/user`);
  }
}

