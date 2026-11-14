import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.css'
})
export class SellerProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  isModalOpen = false;
  isSaving = false;
  editingProduct: Product | null = null;

  // Search & Filter properties
  searchKeyword = '';
  selectedCategory = 'All';
  minPrice: number | null = null;
  maxPrice: number | null = null;

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

  formName = '';
  formCategory = 'Audio';
  formPrice: number | null = null;
  formStock: number | null = 10;
  formDescription = '';
  selectedFiles: File[] = [];
  imagePreviewUrl: string | null = null;

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts(): void {
    this.isLoading = true;
    const currentUser = this.authService.currentUser();
    this.productService.getProducts({ page: 1, limit: 100 }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          // Parse images safely on all retrieved products
          const list = res.data.products.map((p) => {
            if (typeof p.images === 'string') {
              try { p.images = JSON.parse(p.images); } catch { p.images = []; }
            }
            p.images = Array.isArray(p.images) ? p.images : [];
            return p;
          });

          // Filter to show products owned by this seller
          if (currentUser?.role === 'SALES_PERSON') {
            this.products = list.filter((p) => p.ownerId === currentUser.id);
          } else {
            this.products = list;
          }
          this.applyFilters();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to load products');
      }
    });
  }

  applyFilters(): void {
    let result = [...this.products];

    if (this.searchKeyword.trim()) {
      const q = this.searchKeyword.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategory !== 'All') {
      result = result.filter((p) => p.category === this.selectedCategory);
    }

    const min =
      this.minPrice !== null &&
      this.minPrice !== undefined &&
      (this.minPrice as unknown as string) !== '' &&
      !isNaN(Number(this.minPrice))
        ? Number(this.minPrice)
        : null;

    const max =
      this.maxPrice !== null &&
      this.maxPrice !== undefined &&
      (this.maxPrice as unknown as string) !== '' &&
      !isNaN(Number(this.maxPrice))
        ? Number(this.maxPrice)
        : null;

    if (min !== null) {
      result = result.filter((p) => Number(p.price) >= min);
    }

    if (max !== null) {
      result = result.filter((p) => Number(p.price) <= max);
    }

    this.filteredProducts = result;
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
    this.searchKeyword = '';
    this.selectedCategory = 'All';
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
  }

  getImage(p: Product): string {
    let imgs = p.images;
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch { imgs = []; }
    }
    if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]?.url) {
      return imgs[0].url;
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
  }

  formatPrice(price: string | number): string {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  openAddModal(): void {
    this.editingProduct = null;
    this.formName = '';
    this.formCategory = 'Audio';
    this.formPrice = null;
    this.formStock = 10;
    this.formDescription = '';
    this.selectedFiles = [];
    this.imagePreviewUrl = null;
    this.isModalOpen = true;
  }

  openEditModal(p: Product): void {
    this.editingProduct = p;
    this.formName = p.name;
    this.formCategory = p.category;
    this.formPrice = Number(p.price);
    this.formStock = p.stock;
    this.formDescription = p.description || '';
    this.selectedFiles = [];
    this.imagePreviewUrl = this.getImage(p);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.imagePreviewUrl = null;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
      const file = this.selectedFiles[0];
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }

  saveProduct(): void {
    if (!this.formName || !this.formPrice) {
      this.toastService.error('Please fill required product name and price');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.formName);
    formData.append('category', this.formCategory);
    formData.append('price', this.formPrice.toString());
    formData.append('stock', (this.formStock || 0).toString());
    formData.append('description', this.formDescription);

    for (const file of this.selectedFiles) {
      formData.append('images', file, file.name);
    }

    this.isSaving = true;

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, formData).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.toastService.success('Product updated successfully!');
          this.closeModal();
          this.loadMyProducts();
        },
        error: (err) => {
          this.isSaving = false;
          this.toastService.error(err.message || 'Update failed');
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.toastService.success('Product created and uploaded to Cloudinary!');
          this.closeModal();
          this.loadMyProducts();
        },
        error: (err) => {
          this.isSaving = false;
          this.toastService.error(err.message || 'Product creation failed');
        }
      });
    }
  }

  deleteProduct(p: Product): void {
    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
      this.productService.deleteProduct(p.id).subscribe({
        next: () => {
          this.toastService.info('Product deleted');
          this.loadMyProducts();
        },
        error: (err) => this.toastService.error(err.message || 'Delete failed')
      });
    }
  }
}
