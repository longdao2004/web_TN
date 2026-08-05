export interface Store {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  address: string;
  description: string;
  certificates: string[] | { name: string; description: string; icon: string }[];
  productsCount: number;
  rating: number;
  reviewsCount: number;
  joinDate?: string;
  isFeatured?: boolean;
  phone?: string;
  email?: string;
  website?: string;
  statistics?: {
    totalProducts: number;
    totalSold?: number;
    totalCustomers?: number;
    responseRate?: string;
    averageRating: number;
  };
}
