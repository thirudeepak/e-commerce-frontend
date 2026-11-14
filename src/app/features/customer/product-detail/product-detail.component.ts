import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  public authService = inject(AuthService);
  private toastService = inject(ToastService);

  canShop(): boolean {
    return !this.authService.isAdmin() && !this.authService.isSeller();
  }

  product: Product | null = null;
  activeImageUrl: string = '';
  quantity: number = 1;
  isLoading = true;
  isAdding = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.product = res.data;
          let imgs = this.product.images;
          if (typeof imgs === 'string') {
            try {
              imgs = JSON.parse(imgs);
            } catch {
              imgs = [];
            }
          }
          this.product.images = Array.isArray(imgs) ? imgs : [];

          if (this.product.images.length > 0 && this.product.images[0]?.url) {
            this.activeImageUrl = this.product.images[0].url;
          } else {
            this.activeImageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Product not found');
      }
    });
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  formatPrice(price: string | number): string {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toLocaleString('en-IN');
  }

  getSellerBadgeClass(sellerName?: string): string {
    if (sellerName && sellerName.toLowerCase().includes('apex')) {
      return 'badge-seller1';
    }
    return 'badge-seller2';
  }

  addToCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please sign in to add products to your cart');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) return;

    this.isAdding = true;
    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        this.isAdding = false;
        this.toastService.success(`Added ${this.quantity} item(s) to your cart!`);
      },
      error: (err) => {
        this.isAdding = false;
        this.toastService.error(err.message || 'Failed to add to cart');
      }
    });
  }

  toggleWishlist(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please sign in to manage wishlist');
      return;
    }
    if (!this.product) return;

    this.wishlistService.addToWishlist(this.product.id).subscribe({
      next: () => this.toastService.success('Added to wishlist!'),
      error: (err) => this.toastService.error(err.message)
    });
  }
}
