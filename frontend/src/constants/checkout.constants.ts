import { ShippingMethod, PaymentMethod } from "@/types/checkout";

export interface AppPaymentMethod extends PaymentMethod {
  provider: 'COD' | 'VNPAY';
}

// Bảng giá và thời gian giao hàng chuẩn của hệ thống
export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship-standard',
    name: 'Giao hàng tiêu chuẩn',
    estimatedTime: '2 - 3 ngày làm việc',
    price: 30000,
  },
  {
    id: 'ship-express',
    name: 'Giao hàng hỏa tốc (Nông sản tươi)',
    estimatedTime: 'Nhận hàng trong 2H',
    price: 55000,
  },
];

// Cổng thanh toán tích hợp thật (COD và VNPay)
export const PAYMENT_METHODS: AppPaymentMethod[] = [
  {
    id: 'pay-cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    provider: 'COD',
    iconType: 'cod',
    description: 'Thanh toán bằng tiền mặt trực tiếp khi shipper giao hàng',
  },
  {
    id: 'pay-vnpay',
    name: 'Cổng thanh toán VNPay',
    provider: 'VNPAY',
    iconType: 'vnpay',
    description: 'Thanh toán an toàn qua VNPAY-QR, Thẻ ATM / Tài khoản ngân hàng, Thẻ quốc tế',
  },
];