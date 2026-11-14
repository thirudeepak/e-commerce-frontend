export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductOwner {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
  category: string;
  ownerId: string;
  images: ProductImage[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  owner?: ProductOwner;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

