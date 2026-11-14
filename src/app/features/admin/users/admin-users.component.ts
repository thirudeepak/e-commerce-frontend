import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  name = '';
  email = '';
  password = '';
  role: UserRole = 'SALES_PERSON';
  isSubmitting = false;

  onCreateUser(): void {
    if (!this.name || !this.email || !this.password) {
      this.toastService.error('Please enter name, email, and password');
      return;
    }

    this.isSubmitting = true;
    this.authService.createAdminUser({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.toastService.success(`User "${res.data.name}" created with role ${res.data.role}!`);
        this.name = '';
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.error(err.message || 'User creation failed');
      }
    });
  }
}
