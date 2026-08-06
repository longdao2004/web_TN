export const products = [
  {
    id: 'p1',
    name: 'Cà chua Đà Lạt chuẩn VietGAP',
    price: 35000,
    originalPrice: 45000,
    rating: 4.8,
    reviews: 124,
    store: 'Nông trại Đà Lạt xanh',
    image: '/images/products/cahoi.avif',
    badges: ['Bán chạy', 'VietGAP'],
    unit: '1kg'
  },
  {
    id: 'p2',
    name: 'Xà lách thủy tinh hữu cơ',
    price: 25000,
    rating: 4.9,
    reviews: 86,
    store: 'Rau sạch Mộc Châu',
    image: '/images/products/chua.avif',
    badges: ['Organic'],
    unit: '500g'
  },
  {
    id: 'p3',
    name: 'Dâu tây New Zealand trồng chậu',
    price: 180000,
    originalPrice: 200000,
    rating: 4.7,
    reviews: 215,
    store: 'Dâu Tây Đà Lạt',
    image: '/images/products/raukinh.jpg',
    badges: ['Khuyến mãi'],
    unit: 'Hộp 500g'
  },
  {
    id: 'p4',
    name: 'Cam sành Hàm Yên mọng nước',
    price: 45000,
    rating: 4.6,
    reviews: 95,
    store: 'Hợp tác xã Hàm Yên',
    image: '/images/products/dautay.avif',
    badges: [],
    unit: '1kg'
  },
  {
    id: 'p5',
    name: 'Thịt bò tươi thăn ngoại (Striploin)',
    price: 320000,
    rating: 4.9,
    reviews: 42,
    store: 'Meat Deli Hà Nội',
    image: '/images/products/thoc.avif',
    badges: ['Mới'],
    unit: '1kg'
  },
  {
    id: 'p6',
    name: 'Cua Cà Mau loại 1 (Dây trói nhỏ)',
    price: 450000,
    originalPrice: 500000,
    rating: 4.8,
    reviews: 310,
    store: 'Vựa hải sản Năm Căn',
    image: '/images/products/gia_vi.avif',
    badges: ['Hỏa tốc', 'Bán chạy'],
    unit: '1kg'
  },
  {
    id: 'p7',
    name: 'Gạo ST25 chuẩn lúa tôm',
    price: 185000,
    rating: 5.0,
    reviews: 512,
    store: 'Đại lý gạo Sóc Trăng',
    image: '/images/products/thucan.avif',
    badges: ['Đặc sản'],
    unit: 'Bao 5kg'
  },
  {
    id: 'p8',
    name: 'Hạt điều rang muối Bình Phước',
    price: 150000,
    rating: 4.7,
    reviews: 188,
    store: 'Nông sản Bình Phước',
    image: '/images/products/gia_vi.avif',
    badges: [],
    unit: 'Hộp 500g'
  }
];

export type MockProduct = typeof products[0];
