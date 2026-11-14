import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Order, RazorpayOrderData } from '../models/order.model';
import { User } from '../models/user.model';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  createRazorpayOrder(): Observable<ApiResponse<RazorpayOrderData>> {
    return this.http.post<ApiResponse<RazorpayOrderData>>(`${this.apiUrl}/create-order`, {});
  }

  verifyPayment(verificationPayload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    deliveryAddress?: string;
  }): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/verify`, verificationPayload);
  }

  /**
   * Triggers the official Razorpay Checkout popup modal
   */
  openRazorpayModal(
    orderData: RazorpayOrderData,
    user: User,
    onSuccess: (paymentResult: any) => void,
    onDismiss?: () => void
  ): void {
    const options = {
      key: orderData.keyId || environment.razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'NexusMarket',
      description: 'E-Commerce Marketplace Checkout',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=128',
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: user.name,
        email: user.email
      },
      theme: {
        color: '#4F46E5'
      },
      handler: (response: any) => {
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss();
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}

