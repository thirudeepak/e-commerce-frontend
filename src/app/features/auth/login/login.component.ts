import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;

  quickLogin(email: string, pass: string): void {
    this.email = email;
    this.password = pass;
    this.onLogin();
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.toastService.error('Please enter email and password');
      return;
    }

    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(`Welcome back, ${res.data.user.name}!`);
        // Refresh cart & wishlist counts
        this.cartService.getCart().subscribe({ error: () => {} });
        this.wishlistService.getWishlist().subscribe({ error: () => {} });

        // Route intelligently based on role
        if (res.data.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.data.user.role === 'SALES_PERSON') {
          this.router.navigate(['/seller/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Login failed');
      }
    });
  }
}
