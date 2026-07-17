import { ProductDetail } from '@/types/product-detail';
import { mockProductsList } from './product-list';

export const mockProductDetail: ProductDetail = {
  id: 'prod-1',
  slug: 'san-pham-1',
  name: 'Cà chua Beef Organic Đà Lạt Hộp 500g (Chuẩn VietGAP, Hái tại vườn)',
  image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598511796318-7b82ef45b6db?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop'
  ],
  price: 65000,
  salePrice: 45000,
  discount: 30,
  rating: 4.8,
  reviewCount: 342,
  storeName: 'Nông trại Đà Lạt',
  province: 'Lâm Đồng',
  category: 'Rau củ',
  stock: 156,
  isOrganic: true,
  isFeatured: true,
  isNew: false,
  unit: '500g',
  description: `Cà chua Beef Đà Lạt được trồng theo phương pháp hữu cơ tại các nhà kính hiện đại ở Đà Lạt. Quả to, thịt dày, mọng nước, có màu đỏ tươi đẹp mắt. Sản phẩm chứa nhiều Vitamin A, C, K và các khoáng chất thiết yếu tốt cho sức khỏe. Đặc biệt phù hợp để làm salad, nấu canh hoặc làm nước sốt. 
  
  Chúng tôi cam kết 100% không sử dụng thuốc trừ sâu hóa học, phân bón hóa học trong suốt quá trình trồng trọt. Nông trại áp dụng công nghệ tưới nhỏ giọt tự động của Israel giúp tiết kiệm nước và tối ưu hóa dưỡng chất cho cây.`,
  specifications: {
    'Thương hiệu': 'DaLat Agri',
    'Xuất xứ': 'Đà Lạt, Lâm Đồng, Việt Nam',
    'Khối lượng tịnh': '500g',
    'Quy cách đóng gói': 'Hộp nhựa PET an toàn',
    'Thành phần': '100% Cà chua Beef tươi',
    'Hướng dẫn sử dụng': 'Rửa sạch trước khi dùng. Dùng ăn sống, nấu chín hoặc ép nước.',
  },
  store: {
    id: 'store-1',
    name: 'Nông trại Đà Lạt (DaLat Farm)',
    logo: 'https://images.unsplash.com/photo-1595858603370-d5a230721245?q=80&w=200&auto=format&fit=crop',
    address: 'Xã Xuân Thọ, TP. Đà Lạt, Lâm Đồng',
    rating: 4.9,
    productCount: 125,
    responseRate: 98,
    joinedAt: '2021',
  },
  certificates: [
    {
      id: 'cert-1',
      name: 'VietGAP',
      description: 'Thực hành sản xuất nông nghiệp tốt ở Việt Nam, đảm bảo an toàn thực phẩm.',
      issuedBy: 'Bộ Nông nghiệp và Phát triển nông thôn',
      issuedDate: '15/05/2023',
    },
    {
      id: 'cert-2',
      name: 'Organic',
      description: 'Sản phẩm hữu cơ không hóa chất độc hại.',
      issuedBy: 'Control Union',
      issuedDate: '10/08/2023',
    }
  ],
  batch: {
    id: 'BCH-20231120-01',
    harvestDate: '20/11/2023 05:30',
    packDate: '20/11/2023 14:00',
    expiryDate: '27/11/2023',
    weight: '500kg',
    specification: 'Quả size L (200g-300g/quả)',
    storageCondition: 'Bảo quản ngăn mát tủ lạnh (5-8 độ C)',
    origin: 'Lô số 5, Khu B, Nông trại Đà Lạt',
  },
  reviews: [
    {
      id: 'rev-1',
      customerName: 'Nguyễn Thị Hoa',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
      rating: 5,
      date: '21/11/2023',
      content: 'Cà chua rất tươi và ngon. Quả to, thịt chắc, làm salad cực kỳ hợp. Giao hàng nhanh, đóng gói cẩn thận bằng hộp giấy bảo vệ môi trường. Sẽ tiếp tục ủng hộ shop.',
      images: [
        'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?q=80&w=400&auto=format&fit=crop',
      ],
      likes: 12,
    },
    {
      id: 'rev-2',
      customerName: 'Trần Văn Nam',
      rating: 4,
      date: '19/11/2023',
      content: 'Chất lượng ổn, quả đẹp không bị dập nát. Tuy nhiên có một vài quả hơi xanh, chắc để vài hôm nữa chín đều là vừa.',
      likes: 3,
    },
    {
      id: 'rev-3',
      customerName: 'Lê Ngọc Mai',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
      rating: 5,
      date: '15/11/2023',
      content: 'Món tủ của nhà mình đây rồi. Nấu canh hay ép nước đều rất đậm vị chua ngọt tự nhiên. Bé nhà mình rất thích ăn sống.',
      likes: 25,
    }
  ],
  relatedProducts: mockProductsList.slice(0, 6),
};
