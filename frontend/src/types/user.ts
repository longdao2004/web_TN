export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
}
