import { Order, TimelineStep } from '@/types/order';

export const mockTrackingOrder: Order = {
  id: 'order-1',
  code: 'DH202600001',
  createdAt: '20/07/2026 14:30',
  status: 'Đang giao',
  totalAmount: 560000,
  paymentMethod: 'Thanh toán khi nhận hàng (COD)',
  deliveryInfo: {
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
    note: 'Giao trong giờ hành chính từ 8h - 17h, gọi trước khi đến.',
  },
  products: [
    {
      id: 'p1',
      name: 'Cà chua Cherry Đà Lạt Hữu Cơ Loại 1 (Hộp 500g)',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      price: 45000,
      quantity: 2,
    },
    {
      id: 'p2',
      name: 'Rau xà lách thủy canh thủy tinh mỏng',
      image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      price: 25000,
      quantity: 4,
    },
    {
      id: 'p3',
      name: 'Bơ sáp Đắk Lắk size lớn siêu sáp',
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      price: 120000,
      quantity: 1,
    }
  ],
  store: {
    id: 'store-1',
    name: 'Nông trại Đà Lạt (Dalat Farm)',
    slug: 'nong-trai-da-lat',
    logo: 'https://images.unsplash.com/photo-1595858603510-9ce3b708b792?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=60',
    address: '12 Đường Hoa Hồng, Phường 4, TP. Đà Lạt',
    phone: '1900 6789',
    rating: 4.8,
  },
  discount: 30000,
  shippingFee: 35000,
};

export const mockTrackingTimeline: TimelineStep[] = [
  { id: 'step-1', label: 'Đặt hàng thành công', isCompleted: true, isActive: false },
  { id: 'step-2', label: 'Người bán xác nhận', isCompleted: true, isActive: false },
  { id: 'step-3', label: 'Đang chuẩn bị', isCompleted: true, isActive: false },
  { id: 'step-4', label: 'Đang giao', isCompleted: false, isActive: true },
  { id: 'step-5', label: 'Đã giao', isCompleted: false, isActive: false },
];

export const mockTrackingOrderDelivered: Order = {
  ...mockTrackingOrder,
  code: 'DH202600002',
  status: 'Đã giao',
  totalAmount: 120000,
  products: [
    mockTrackingOrder.products[2]
  ]
};

export const mockTrackingTimelineDelivered: TimelineStep[] = [
  { id: 'step-1', label: 'Đặt hàng thành công', isCompleted: true, isActive: false },
  { id: 'step-2', label: 'Người bán xác nhận', isCompleted: true, isActive: false },
  { id: 'step-3', label: 'Đang chuẩn bị', isCompleted: true, isActive: false },
  { id: 'step-4', label: 'Đang giao', isCompleted: true, isActive: false },
  { id: 'step-5', label: 'Đã giao', isCompleted: true, isActive: true },
];

export const mockTrackingRecommendedProducts = [
  {
    id: "rec1",
    name: "Cà Rốt Baby Hữu Cơ Đà Lạt",
    price: 35000,
    originalPrice: 45000,
    rating: 4.8,
    reviews: 124,
    store: "Nông trại Rau Sạch ĐL",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    badges: ["Khuyến mãi", "Hữu cơ"],
    unit: "500g"
  },
  {
    id: "rec2",
    name: "Dưa Lưới Taki Nhật Bản",
    price: 180000,
    rating: 4.9,
    reviews: 89,
    store: "HTX Nông Nghiệp Xanh",
    image: "https://images.unsplash.com/photo-1589383679883-9b986cc01c87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    badges: ["Mới", "Freeship"],
    unit: "Kg"
  },
  {
    id: "rec3",
    name: "Nấm Mối Đen Trồng Bào Tử",
    price: 250000,
    originalPrice: 280000,
    rating: 5.0,
    reviews: 42,
    store: "Trại Nấm Đồng Nai",
    image: "https://images.unsplash.com/photo-1509937528035-ad76254b0356?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    badges: ["Đặc sản"],
    unit: "Kg"
  },
  {
    id: "rec4",
    name: "Sầu Riêng Ri6 Hạt Lép",
    price: 320000,
    rating: 4.7,
    reviews: 512,
    store: "Vựa Trái Cây Miền Tây",
    image: "https://images.unsplash.com/photo-1615555627236-0d19b78e31bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    badges: [],
    unit: "Trái"
  }
];
