export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  storeName: string;
  province: string;
  category: string;
  certificate?: string[];
  stock: number;
  isOrganic: boolean;
  isFeatured: boolean;
  isNew: boolean;
  unit: string;
}
