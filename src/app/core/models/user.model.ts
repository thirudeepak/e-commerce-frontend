export type UserRole = 'ADMIN' | 'SALES_PERSON' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  isActive?: boolean;
  roleId?: string;
  roleDetails?: {
    id: string;
    name: string;
    description: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

