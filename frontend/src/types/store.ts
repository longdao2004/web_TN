export interface Store {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  address: string;
  description: string;
  certificates: string[];
  productsCount: number;
  rating: number;
  reviewsCount: number;
  joinDate?: string;
  isFeatured?: boolean;
}
