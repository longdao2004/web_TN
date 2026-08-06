import { Order, TimelineStep } from '@/types/order';

export const mockOrderSuccess: Order = {
  id: 'order-1',
  code: 'DH202600001',
  createdAt: '20/07/2026',
  status: 'Đang xác nhận',
  totalAmount: 560000,
  paymentMethod: 'Thanh toán khi nhận hàng (COD)',
  deliveryInfo: {
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
  },
  products: [
    {
      id: 'p1',
      name: 'Cà chua Cherry Đà Lạt',
      image: '/images/products/cahoi.avif',
      price: 45000,
      quantity: 2,
    },
    {
      id: 'p2',
      name: 'Rau xà lách thủy canh thủy tinh mỏng',
      image: '/images/products/thucan.avif',
      price: 25000,
      quantity: 4,
    },
    {
      id: 'p3',
      name: 'Bơ sáp Đắk Lắk size lớn (Loại 1)',
      image: '/images/products/ca.avif',
      price: 120000,
      quantity: 1,
    }
  ],
};

export const mockTimelineSteps: TimelineStep[] = [
  { id: 'step-1', label: 'Đặt hàng thành công', isCompleted: true, isActive: true },
  { id: 'step-2', label: 'Người bán xác nhận', isCompleted: false, isActive: false },
  { id: 'step-3', label: 'Đóng gói', isCompleted: false, isActive: false },
  { id: 'step-4', label: 'Đang giao', isCompleted: false, isActive: false },
  { id: 'step-5', label: 'Giao thành công', isCompleted: false, isActive: false },
];

export const mockRecommendedProducts = [
  {
    id: "rec1",
    name: "Cà Rốt Baby Hữu Cơ Đà Lạt",
    price: 35000,
    originalPrice: 45000,
    rating: 4.8,
    reviews: 124,
    store: "Nông trại Rau Sạch ĐL",
    image: "/images/products/raukinh.jpg",
    badges: ["Khuyến mãi", "Hữu cơ"],
    unit: "500g"
  },
  {
    id: "rec2",
    name: "Dưa Lưới Taki Nhật Bản Cuống Tươi",
    price: 180000,
    rating: 4.9,
    reviews: 89,
    store: "HTX Nông Nghiệp Xanh",
    image: "/images/products/cachuabi.avif",
    badges: ["Mới", "Freeship"],
    unit: "Kg"
  },
  {
    id: "rec3",
    name: "Nấm Mối Đen Trồng Bào Tử Hữu Cơ",
    price: 250000,
    originalPrice: 280000,
    rating: 5.0,
    reviews: 42,
    store: "Trại Nấm Đồng Nai",
    image: "/images/products/thucan.avif",
    badges: ["Đặc sản"],
    unit: "Kg"
  },
  {
    id: "rec4",
    name: "Sầu Riêng Ri6 Bao Ăn Từng Múi Hạt Lép",
    price: 320000,
    rating: 4.7,
    reviews: 512,
    store: "Vựa Trái Cây Miền Tây",
    image: "/images/products/gia_vi.avif",
    badges: [],
    unit: "Trái"
  }
];
