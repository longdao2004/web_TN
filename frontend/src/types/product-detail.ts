import { Product } from './product';

export interface Store {
  id: string;
  name: string;
  logo: string;
  address: string;
  rating: number;
  productCount: number;
  responseRate: number;
  joinedAt: string;
}

export interface Certificate {
  id: string;
  name: string;
  icon?: string;
  description: string;
  issuedBy: string;
  issuedDate: string;
}

export interface Batch {
  id: string;
  harvestDate: string;
  packDate: string;
  expiryDate: string;
  weight: string;
  specification: string;
  storageCondition: string;
  origin: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
  likes: number;
}

export interface ProductDetail extends Omit<Product, 'certificate'> {
  description: string;
  specifications: Record<string, string>;
  images: string[];
  store: Store;
  certificates: Certificate[];
  batch: Batch;
  reviews: Review[];
  relatedProducts: Product[];
}
