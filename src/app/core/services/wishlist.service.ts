import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Wishlist } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/wishlist`;

  wishlist = signal<Wishlist | null>(null);
  wishlistCount = signal<number>(0);

  getWishlist(): Observable<ApiResponse<Wishlist>> {
    return this.http.get<ApiResponse<Wishlist>>(this.apiUrl).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.wishlist.set(res.data);
          this.wishlistCount.set(res.data.totalItems || 0);
        }
      })
    );
  }

  addToWishlist(productId: string): Observable<ApiResponse<Wishlist>> {
    return this.http.post<ApiResponse<Wishlist>>(`${this.apiUrl}/add`, { productId }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.wishlist.set(res.data);
          this.wishlistCount.set(res.data.totalItems || 0);
        }
      })
    );
  }

  removeFromWishlist(productId: string): Observable<ApiResponse<Wishlist>> {
    return this.http.delete<ApiResponse<Wishlist>>(`${this.apiUrl}/item/${productId}`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.wishlist.set(res.data);
          this.wishlistCount.set(res.data.totalItems || 0);
        }
      })
    );
  }

  clearWishlist(): Observable<ApiResponse<Wishlist>> {
    return this.http.delete<ApiResponse<Wishlist>>(`${this.apiUrl}/clear`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.wishlist.set(res.data);
          this.wishlistCount.set(0);
        }
      })
    );
  }
}

