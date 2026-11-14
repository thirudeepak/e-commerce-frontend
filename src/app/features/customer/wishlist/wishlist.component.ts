import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { Wishlist, WishlistItem } from '../../../core/models/wishlist.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  wishlist: Wishlist | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.wishlist = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to load wishlist');
      }
    });
  }

  removeItem(item: WishlistItem): void {
    this.wishlistService.removeFromWishlist(item.productId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.wishlist = res.data;
          this.toastService.info('Removed from wishlist');
        }
      },
      error: (err) => this.toastService.error(err.message)
    });
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.wishlist = res.data;
          this.toastService.info('Wishlist cleared');
        }
      },
      error: (err) => this.toastService.error(err.message)
    });
  }

  moveToCart(item: WishlistItem): void {
    this.cartService.addToCart(item.productId, 1).subscribe({
      next: () => {
        this.toastService.success(`Moved "${item.product?.name}" to Cart!`);
        this.removeItem(item);
      },
      error: (err) => this.toastService.error(err.message || 'Could not move to cart')
    });
  }

  getItemImage(item: WishlistItem): string {
    let imgs = item.product?.images;
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch { imgs = []; }
    }
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]?.url) {
      return imgs[0].url;
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
  }

  formatPrice(price?: string | number): string {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toLocaleString('en-IN');
  }

  getSellerBadgeClass(sellerName?: string): string {
    if (sellerName && sellerName.toLowerCase().includes('apex')) {
      return 'badge-seller1';
    }
    return 'badge-seller2';
  }
}
