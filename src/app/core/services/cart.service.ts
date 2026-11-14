import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  cart = signal<Cart | null>(null);
  cartCount = signal<number>(0);

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.cartCount.set(res.data.totalItems || 0);
        }
      })
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.cartCount.set(res.data.totalItems || 0);
        }
      })
    );
  }

  updateQuantity(cartItemId: string, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(`${this.apiUrl}/item/${cartItemId}`, { quantity }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.cartCount.set(res.data.totalItems || 0);
        }
      })
    );
  }

  removeItem(cartItemId: string): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/item/${cartItemId}`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.cartCount.set(res.data.totalItems || 0);
        }
      })
    );
  }

  clearCart(): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/clear`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.cart.set(res.data);
          this.cartCount.set(0);
        }
      })
    );
  }
}

