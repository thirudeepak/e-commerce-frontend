import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  user: User | null = null;
  isLoading = true;
  copiedId = false;

  // Address editing
  isEditingAddress = false;
  editAddressText = '';
  isSavingAddress = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadUserById(id);
      } else {
        this.loadCurrentProfile();
      }
    });
  }

  loadCurrentProfile(): void {
    this.isLoading = true;
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.user = res.data;
        } else {
          this.user = this.authService.currentUser();
        }
      },
      error: () => {
        this.isLoading = false;
        this.user = this.authService.currentUser();
      }
    });
  }

  loadUserById(id: string): void {
    this.isLoading = true;
    this.authService.getUserById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.user = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Could not load user profile');
        this.user = this.authService.currentUser();
      }
    });
  }

  copyUserId(): void {
    if (this.user?.id) {
      navigator.clipboard.writeText(this.user.id);
      this.copiedId = true;
      this.toastService.success('User ID copied to clipboard');
      setTimeout(() => (this.copiedId = false), 2000);
    }
  }

  formatDate(dateStr?: string | Date): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  startEditAddress(): void {
    this.editAddressText = this.user?.address || '';
    this.isEditingAddress = true;
  }

  cancelEditAddress(): void {
    this.isEditingAddress = false;
  }

  saveAddress(): void {
    if (!this.editAddressText.trim()) {
      this.toastService.error('Please enter a valid delivery address');
      return;
    }

    this.isSavingAddress = true;
    this.authService.updateProfile({ address: this.editAddressText.trim() }).subscribe({
      next: (res) => {
        this.isSavingAddress = false;
        this.isEditingAddress = false;
        if (this.user) {
          this.user.address = res.data.address;
        }
        this.toastService.success('Delivery address updated successfully!');
      },
      error: (err) => {
        this.isSavingAddress = false;
        this.toastService.error(err.message || 'Failed to update address');
      }
    });
  }

  getRoleBadgeClass(role?: string): string {
    if (role === 'ADMIN') return 'badge-admin';
    if (role === 'SALES_PERSON') return 'badge-seller';
    return 'badge-user';
  }
}

