export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
  notes?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  estimatedTime: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  iconType: 'cod' | 'vnpay' | 'momo' | 'bank';
  description?: string;
}
