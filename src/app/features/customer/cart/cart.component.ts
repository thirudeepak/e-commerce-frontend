import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Cart, CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private paymentService = inject(PaymentService);
  public authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  cart: Cart | null = null;
  isLoading = true;
  isCheckingOut = false;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.cart = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to load cart');
      }
    });
  }

  updateQuantity(item: CartItem, newQty: number): void {
    if (newQty < 1) return;
    this.cartService.updateQuantity(item.id, newQty).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.cart = res.data;
        }
      },
      error: (err) => this.toastService.error(err.message || 'Quantity update failed')
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.cart = res.data;
          this.toastService.info('Item removed from cart');
        }
      },
      error: (err) => this.toastService.error(err.message)
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.cart = res.data;
          this.toastService.info('Cart cleared');
        }
      },
      error: (err) => this.toastService.error(err.message)
    });
  }

  getItemImage(item: CartItem): string {
    let imgs = item.product?.images;
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch { imgs = []; }
    }
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]?.url) {
      return imgs[0].url;
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
  }

  formatPrice(price: number): string {
    return (Number(price) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  proceedToCheckout(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.info('Please sign in before checkout');
      this.router.navigate(['/login']);
      return;
    }

    this.isCheckingOut = true;

    // 1. Create order on backend
    this.paymentService.createRazorpayOrder().subscribe({
      next: (orderRes) => {
        this.isCheckingOut = false;
        if (!orderRes.success || !orderRes.data) {
          this.toastService.error('Failed to create payment order');
          return;
        }

        const razorpayOrder = orderRes.data;

        // 2. Open Razorpay Checkout modal
        this.paymentService.openRazorpayModal(
          razorpayOrder,
          user,
          (paymentSuccess) => {
            // 3. Verify payment signature on backend
            this.toastService.info('Verifying payment signature with backend...');
            this.paymentService.verifyPayment({
              razorpayOrderId: paymentSuccess.razorpay_order_id,
              razorpayPaymentId: paymentSuccess.razorpay_payment_id,
              razorpaySignature: paymentSuccess.razorpay_signature,
              deliveryAddress: user.address || undefined
            }).subscribe({
              next: () => {
                this.toastService.success('Payment confirmed! Order successfully placed.');
                // Refresh cart
                this.cartService.getCart().subscribe({ error: () => {} });
                this.router.navigate(['/orders/my']);
              },
              error: (verifyErr) => {
                this.toastService.error(verifyErr.message || 'Payment signature verification failed.');
              }
            });
          },
          () => {
            this.toastService.info('Payment checkout dismissed');
          }
        );
      },
      error: (err) => {
        this.isCheckingOut = false;
        this.toastService.error(err.message || 'Checkout failed. Verify product stock.');
      }
    });
  }
}
