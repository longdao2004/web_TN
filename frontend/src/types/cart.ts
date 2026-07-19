export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  store: {
    id: string;
    name: string;
    slug: string;
  };
  certificates?: string[];
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
}

export interface CartSummaryData {
  subTotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
}
