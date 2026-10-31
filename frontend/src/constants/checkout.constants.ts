import { ShippingMethod, PaymentMethod } from "@/types/checkout";

export interface AppPaymentMethod extends PaymentMethod {
  provider: 'COD' | 'VNPAY';
}

// Bảng giá và thời gian giao hàng chuẩn theo phân loại sinh học nông sản
export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship-standard',
    name: 'Giao hàng tiêu chuẩn',
    estimatedTime: '2 - 3 ngày làm việc (Hàng khô, bảo quản thường)',
    price: 25000,
  },
  {
    id: 'ship-cold',
    name: 'Vận chuyển chuỗi lạnh (Cold Chain)',
    estimatedTime: '1 - 2 ngày (Xe thùng lạnh chuyên dụng 2°C - 8°C)',
    price: 40000,
  },
  {
    id: 'ship-express',
    name: 'Giao hàng hỏa tốc (Nông sản siêu tươi)',
    estimatedTime: 'Nhận hàng trong 2H (Túi giữ nhiệt + đá gel)',
    price: 50000,
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