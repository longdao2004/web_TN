export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  code: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  deliveryInfo: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  products: OrderProduct[];
  store?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    address?: string;
    phone?: string;
    rating?: number;
  };
  discount?: number;
  shippingFee?: number;
}

export interface TimelineStep {
  id: string;
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}
