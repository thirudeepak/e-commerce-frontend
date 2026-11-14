import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  public authService = inject(AuthService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  totalCount = 0;
  isLoading = false;
  addingMap: Record<string, boolean> = {};

  categories = [
    'All',
    'Audio',
    'Wearables',
    'Computer Peripherals',
    'Electronics',
    'Smart Home',
    'Lifestyle & Gear',
    'Storage',
    'Office',
    'Accessories'
  ];

  selectedCategory = 'All';
  searchKeyword = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = 'createdAt:DESC';

  canShop(): boolean {
    return !this.authService.isAdmin() && !this.authService.isSeller();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchKeyword = params['search'] || '';
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    const [field, order] = this.sortBy.split(':');

    const min =
      this.minPrice !== null &&
      this.minPrice !== undefined &&
      (this.minPrice as unknown as string) !== '' &&
      !isNaN(Number(this.minPrice))
        ? Number(this.minPrice)
        : undefined;

    const max =
      this.maxPrice !== null &&
      this.maxPrice !== undefined &&
      (this.maxPrice as unknown as string) !== '' &&
      !isNaN(Number(this.maxPrice))
        ? Number(this.maxPrice)
        : undefined;

    this.productService
      .getProducts({
        page: 1,
        limit: 50,
        search: this.searchKeyword.trim() || undefined,
        category: this.selectedCategory !== 'All' ? this.selectedCategory : undefined,
        minPrice: min,
        maxPrice: max,
        sortBy: field,
        sortOrder: order,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            this.products = res.data.products;
            this.totalCount = res.data.total;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.error(err.message || 'Failed to load products');
        },
      });
  }

  onSearchSubmit(): void {
    this.loadProducts();
  }

  applyPriceFilter(): void {
    this.loadProducts();
  }

  onSelectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.loadProducts();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.loadProducts();
  }

  clearPriceFilter(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return (
      this.selectedCategory !== 'All' ||
      !!this.searchKeyword.trim() ||
      this.minPrice !== null ||
      this.maxPrice !== null
    );
  }

  resetFilters(): void {
    this.selectedCategory = 'All';
    this.searchKeyword = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'createdAt:DESC';
    this.loadProducts();
  }

  getProductImage(p: Product): string {
    let imgs = p.images;
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch { imgs = []; }
    }
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]?.url) {
      return imgs[0].url;
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
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

  isAddingToCart(id: string): boolean {
    return !!this.addingMap[id];
  }

  addToCart(p: Product): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please sign in to add products to your cart');
      return;
    }

    this.addingMap[p.id] = true;
    this.cartService.addToCart(p.id, 1).subscribe({
      next: () => {
        this.addingMap[p.id] = false;
        this.toastService.success(`Added "${p.name}" to your cart!`);
      },
      error: (err) => {
        this.addingMap[p.id] = false;
        this.toastService.error(err.message || 'Could not add to cart');
      }
    });
  }

  isInWishlist(productId: string): boolean {
    const w = this.wishlistService.wishlist();
    if (!w || !w.items) return false;
    return w.items.some((item) => item.productId === productId);
  }

  toggleWishlist(p: Product): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please sign in to save items to your wishlist');
      return;
    }

    if (this.isInWishlist(p.id)) {
      this.wishlistService.removeFromWishlist(p.id).subscribe({
        next: () => this.toastService.info(`Removed "${p.name}" from wishlist`),
        error: (err) => this.toastService.error(err.message)
      });
    } else {
      this.wishlistService.addToWishlist(p.id).subscribe({
        next: () => this.toastService.success(`Saved "${p.name}" to wishlist!`),
        error: (err) => this.toastService.error(err.message)
      });
    }
  }
}
