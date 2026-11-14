import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  searchQuery: string = '';

  ngOnInit(): void {
    if (this.authService.isCustomer()) {
      this.cartService.getCart().subscribe({ error: () => {} });
      this.wishlistService.getWishlist().subscribe({ error: () => {} });
    }
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/']);
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  getRoleBadgeClass(role?: string): string {
    if (role === 'ADMIN') return 'badge-role-admin';
    if (role === 'SALES_PERSON') return 'badge-role-seller';
    return 'badge-role-user';
  }
}
