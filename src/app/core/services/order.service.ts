import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  getMyOrders(page: number = 1, limit: number = 10): Observable<ApiResponse<{ orders: Order[]; total: number; page: number; totalPages: number }>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/my`, { params });
  }

  getSellerOrders(page: number = 1, limit: number = 10): Observable<ApiResponse<{ items: any[]; total: number; page: number; totalPages: number }>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/seller`, { params });
  }

  getAllOrders(page: number = 1, limit: number = 10, orderStatus?: string, paymentStatus?: string): Observable<ApiResponse<{ orders: Order[]; total: number; page: number; totalPages: number }>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (orderStatus) params = params.set('orderStatus', orderStatus);
    if (paymentStatus) params = params.set('paymentStatus', paymentStatus);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, { params });
  }

  getOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${id}/status`, { status });
  }
}

