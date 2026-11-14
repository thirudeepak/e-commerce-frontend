import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public Storefront Routes
  {
    path: '',
    loadComponent: () =>
      import('./features/customer/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/customer/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // User Account Profile (All Authenticated Roles)
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/customer/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'profile/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/customer/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'users/view/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/customer/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },

  // Customer Protected Routes (USER only)
  {
    path: 'cart',
    canActivate: [authGuard, roleGuard(['USER'])],
    loadComponent: () =>
      import('./features/customer/cart/cart.component').then(
        (m) => m.CartComponent
      ),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard, roleGuard(['USER'])],
    loadComponent: () =>
      import('./features/customer/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
  },
  {
    path: 'orders/my',
    canActivate: [authGuard, roleGuard(['USER'])],
    loadComponent: () =>
      import('./features/customer/orders/orders.component').then(
        (m) => m.OrdersComponent
      ),
  },

  // Seller / Sales Person Routes
  {
    path: 'seller/dashboard',
    canActivate: [authGuard, roleGuard(['SALES_PERSON', 'ADMIN'])],
    loadComponent: () =>
      import('./features/seller/dashboard/seller-dashboard.component').then(
        (m) => m.SellerDashboardComponent
      ),
  },
  {
    path: 'seller/products',
    canActivate: [authGuard, roleGuard(['SALES_PERSON', 'ADMIN'])],
    loadComponent: () =>
      import('./features/seller/products/seller-products.component').then(
        (m) => m.SellerProductsComponent
      ),
  },

  // Admin Routes
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  {
    path: 'admin/orders',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/orders/admin-orders.component').then(
        (m) => m.AdminOrdersComponent
      ),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/users/admin-users.component').then(
        (m) => m.AdminUsersComponent
      ),
  },

  // Fallback
  {
    path: '**',
    redirectTo: '',
  },
];
