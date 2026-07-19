import { Address, ShippingMethod, PaymentMethod } from '@/types/checkout';

export const mockDefaultAddress: Address = {
  id: 'addr-1',
  fullName: 'Trần Văn Nông',
  phone: '0901234567',
  email: 'tranvannong@email.com',
  addressLine: '123 Đường Số 1, Khu dân cư Xanh',
  ward: 'Phường An Phú',
  district: 'Quận 2',
  province: 'TP. Hồ Chí Minh',
  isDefault: true,
  notes: 'Giao hàng vào giờ hành chính, gọi trước khi đến',
};

export const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'ship-standard',
    name: 'Giao hàng tiêu chuẩn',
    estimatedTime: '2 - 3 ngày làm việc',
    price: 30000,
  },
  {
    id: 'ship-express',
    name: 'Giao hàng hỏa tốc',
    estimatedTime: 'Nhận hàng trong 2H',
    price: 55000,
  },
  {
    id: 'ship-store',
    name: 'Nhận tại cửa hàng',
    estimatedTime: 'Lấy ngay trong ngày',
    price: 0,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pay-cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    iconType: 'cod',
    description: 'Thanh toán bằng tiền mặt khi shipper giao hàng',
  },
  {
    id: 'pay-momo',
    name: 'Ví điện tử MoMo',
    iconType: 'momo',
  },
  {
    id: 'pay-vnpay',
    name: 'Cổng thanh toán VNPay',
    iconType: 'vnpay',
  },
  {
    id: 'pay-bank',
    name: 'Chuyển khoản ngân hàng',
    iconType: 'bank',
    description: 'Chuyển khoản thủ công 24/7',
  },
];
