export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // for future detail page
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
}

export const newsCategories = [
  'Tất cả',
  'Tin tức',
  'Kiến thức nông nghiệp',
  'Giá thị trường',
  'Kinh nghiệm trồng trọt',
  'An toàn thực phẩm',
  'Hoạt động AgriMarket'
];

export const popularTags = [
  'VietGAP', 'Hữu cơ', 'Sầu riêng', 'Thủy canh', 'Khuyến mãi', 'Gạo ST25', 'Xuất khẩu'
];

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    slug: 'xuat-khau-sau-rieng-dat-ky-luc-trong-quy-1',
    title: 'Xuất khẩu sầu riêng đạt kỷ lục trong quý 1 năm nay',
    description: 'Báo cáo mới nhất cho thấy sản lượng xuất khẩu sầu riêng sang thị trường quốc tế tăng đột biến, mở ra cơ hội lớn cho bà con nông dân.',
    content: '...',
    image: 'https://images.unsplash.com/photo-1596731998522-8eb129d2b23a?q=80&w=800&auto=format&fit=crop',
    category: 'Giá thị trường',
    author: 'Minh Tuấn',
    publishedAt: '24/07/2026',
    readTime: '5 phút',
    tags: ['Sầu riêng', 'Xuất khẩu', 'Giá thị trường']
  },
  {
    id: 'news-2',
    slug: '5-meo-trong-rau-thuy-canh-tai-nha',
    title: '5 Mẹo trồng rau thủy canh tại nhà cực kỳ đơn giản',
    description: 'Chỉ với những vật dụng đơn giản, bạn có thể thiết lập ngay một hệ thống rau sạch tại ban công để phục vụ bữa ăn gia đình.',
    content: '...',
    image: 'https://images.unsplash.com/photo-1595858603370-d5a230721245?q=80&w=800&auto=format&fit=crop',
    category: 'Kinh nghiệm trồng trọt',
    author: 'Lan Anh',
    publishedAt: '23/07/2026',
    readTime: '8 phút',
    tags: ['Thủy canh', 'Rau sạch', 'Tại nhà']
  },
  {
    id: 'news-3',
    slug: 'giai-cuu-nong-san-mua-dich',
    title: 'Chương trình trợ giá nông sản Việt cùng AgriMarket',
    description: 'AgriMarket triển khai chương trình trợ giá, miễn phí vận chuyển cho hàng loạt nông sản nội địa nhằm kích cầu tiêu dùng.',
    content: '...',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    category: 'Hoạt động AgriMarket',
    author: 'Admin',
    publishedAt: '20/07/2026',
    readTime: '4 phút',
    tags: ['Khuyến mãi', 'Trợ giá', 'Hoạt động']
  },
  {
    id: 'news-4',
    slug: 'cach-nhan-biet-trai-cay-sach',
    title: 'Cách nhận biết trái cây sạch không hóa chất bằng mắt thường',
    description: 'Nắm vững những nguyên tắc cơ bản này để bảo vệ sức khỏe gia đình bạn trước vấn nạn thực phẩm bẩn đang lan tràn.',
    content: '...',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop',
    category: 'An toàn thực phẩm',
    author: 'Bác sĩ Hoa',
    publishedAt: '18/07/2026',
    readTime: '6 phút',
    tags: ['An toàn thực phẩm', 'Hữu cơ', 'Sức khỏe']
  },
  {
    id: 'news-5',
    slug: 'ung-dung-iot-vao-nong-nghiep',
    title: 'Ứng dụng IoT vào nông nghiệp công nghệ cao',
    description: 'Việc sử dụng cảm biến, hệ thống tưới tiêu tự động đang dần thay đổi bộ mặt của nông nghiệp Việt Nam theo hướng hiện đại hóa.',
    content: '...',
    image: 'https://images.unsplash.com/photo-1586771107445-d3af9e1281d1?q=80&w=800&auto=format&fit=crop',
    category: 'Kiến thức nông nghiệp',
    author: 'Hoàng Long',
    publishedAt: '15/07/2026',
    readTime: '10 phút',
    tags: ['IoT', 'Công nghệ', 'Tương lai']
  }
];

export const featuredNews = mockNews[0];
