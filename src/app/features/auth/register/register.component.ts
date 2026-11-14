import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  role: UserRole = 'USER';
  isLoading = false;

  onRegister(): void {
    if (!this.name || !this.email || !this.password) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success('Registration successful! Welcome to NexusMarket.');
        if (res.data.user.role === 'SALES_PERSON') {
          this.router.navigate(['/seller/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Registration failed');
      }
    });
  }
}
