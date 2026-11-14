# NexusMarket Frontend — Multi-Vendor E-Commerce Client

[![Angular 18](https://img.shields.io/badge/Angular-18-DD0031?logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![FontAwesome](https://img.shields.io/badge/FontAwesome-6_Free-528DD7?logo=fontawesome)](https://fontawesome.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

The modern, responsive client Single Page Application (SPA) for the **NexusMarket** multi-vendor platform, built with **Angular 18**.

- **Backend Repository:** [https://github.com/thirudeepak/e-commerce-backend](https://github.com/thirudeepak/e-commerce-backend)

---

## 🚀 Key Highlights

- **Modern Angular 18 Architecture**:
  - 100% Standalone Components (Zero NgModules).
  - Native Angular Signals (`signal`, `computed`) for reactive state management.
  - Functional HTTP `authInterceptor` for automatic Bearer JWT header injection.
  - Functional `authGuard` and `roleGuard` protecting routes across roles.
  - 100% strict file separation (`.component.ts`, `.component.html`, `.component.css`) across all 17 components.

- **Role-Based Access Control (RBAC) Portals**:
  - **Customer (`USER`)**: Public storefront, reactive keyword & min-to-max price filtering, shopping cart with stock checking, wishlist bookmarks, profile with shipping address management, Razorpay payment popup, and personal order tracking.
  - **Merchant (`SALES_PERSON`)**: Inventory management, multipart image uploads via Cloudinary, stock replenishment, and store-specific sales order dashboard.
  - **Administrator (`ADMIN`)**: Platform analytics, settled daily bank balance tracking, order fulfillment status transitions (`CONFIRMED` ➔ `DELIVERED`), and RBAC user provisioning.

---

## 🛠️ Tech Stack

- **Framework:** Angular 18 (Standalone Components)
- **Language:** TypeScript 5.5
- **Styling:** Modular CSS3 with Custom Properties (CSS variables) & CSS Grid/Flexbox
- **Icons:** FontAwesome 6 Free Webfonts
- **Payment Modal:** Razorpay Checkout JS SDK

---

## 🏁 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/thirudeepak/e-commerce-frontend.git
cd e-commerce-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Copy template to .env
cp .env.example .env
```

Make sure `src/environments/environment.ts` points to your active backend API:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  razorpayKey: 'rzp_test_your_key_id'
};
```

### 4. Run Development Server
```bash
npm start
# Navigate to http://localhost:4200/
```

### 5. Build for Production
```bash
npm run build
# Compiles distribution bundle into dist/ecommerce-frontend/
```

---

## 👥 Seeded User Accounts (Password: `Password123!`)

| Role | Email | Purpose |
|---|---|---|
| `ADMIN` | `admin@ecommerce.com` | Full platform governance & daily bank balance |
| `SALES_PERSON` | `seller1@ecommerce.com` | Apex Electronics (10 managed products) |
| `SALES_PERSON` | `seller2@ecommerce.com` | Prime Gear (20 managed products) |
| `USER` | `alice@ecommerce.com` | Customer with seeded Bengaluru shipping address |
| `USER` | `bob@ecommerce.com` | Customer with seeded Hyderabad shipping address |

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
