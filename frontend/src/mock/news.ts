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
  viewCount?: number;
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

const mockLongContent = `
<h2>1. Giới thiệu tổng quan</h2>
<p>Nông nghiệp bền vững đang là xu hướng tất yếu trong bối cảnh biến đổi khí hậu diễn biến phức tạp. Việc áp dụng các kỹ thuật mới không chỉ giúp tăng năng suất mà còn bảo vệ môi trường sinh thái, đảm bảo sức khỏe cho cả người sản xuất và người tiêu dùng.</p>

<p>Trong bài viết này, chúng ta sẽ cùng điểm qua những phương pháp hiện đại nhất đang được các nông trại hữu cơ áp dụng thành công trên toàn quốc.</p>

<h2>2. Lợi ích mang lại</h2>
<p>Thay đổi phương thức canh tác mang lại nhiều lợi ích thiết thực:</p>
<ul>
  <li>Tối ưu hóa chi phí phân bón và thuốc bảo vệ thực vật.</li>
  <li>Nâng cao chất lượng nông sản, đạt chuẩn xuất khẩu quốc tế (VietGAP, GlobalGAP).</li>
  <li>Gia tăng độ phì nhiêu của đất trồng theo thời gian.</li>
  <li>Bảo vệ nguồn nước ngầm khỏi sự ô nhiễm hóa chất.</li>
</ul>

<h2>3. Yêu cầu kỹ thuật cốt lõi</h2>
<p>Để đạt được những lợi ích trên, người nông dân cần chú trọng vào các yếu tố sau:</p>
<img src="https://images.unsplash.com/photo-1595858603370-d5a230721245?q=80&w=1200&auto=format&fit=crop" alt="Minh họa kỹ thuật" />
<p>Hình ảnh minh họa hệ thống tưới tiêu nhỏ giọt tự động, giúp tiết kiệm tới 60% lượng nước so với phương pháp tưới truyền thống.</p>

<blockquote>
  <p>"Một nền nông nghiệp thông minh là nền nông nghiệp biết lắng nghe nhịp đập của tự nhiên và áp dụng công nghệ để hòa nhịp cùng nó." - Chuyên gia Nông nghiệp Nguyễn Văn A.</p>
</blockquote>

<h2>4. Những lưu ý quan trọng</h2>
<p>Khi bắt đầu chuyển đổi sang mô hình mới, bà con cần lưu ý: không nên nóng vội thay đổi toàn bộ diện tích cùng lúc. Hãy thử nghiệm trên một diện tích nhỏ để đánh giá tính phù hợp của thổ nhưỡng và khí hậu địa phương trước khi nhân rộng.</p>

<h2>5. Kết luận</h2>
<p>Con đường chuyển đổi sang nông nghiệp sạch và bền vững có thể nhiều chông gai ban đầu, nhưng quả ngọt thu được chắc chắn sẽ xứng đáng với công sức bỏ ra. AgriMarket sẽ luôn đồng hành cùng bà con trong quá trình đưa những sản phẩm chất lượng nhất tới tay người tiêu dùng.</p>
`;

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    slug: 'xuat-khau-sau-rieng-dat-ky-luc-trong-quy-1',
    title: 'Xuất khẩu sầu riêng đạt kỷ lục trong quý 1 năm nay',
    description: 'Báo cáo mới nhất cho thấy sản lượng xuất khẩu sầu riêng sang thị trường quốc tế tăng đột biến, mở ra cơ hội lớn cho bà con nông dân.',
    content: mockLongContent,
    image: 'https://images.unsplash.com/photo-1596731998522-8eb129d2b23a?q=80&w=800&auto=format&fit=crop',
    category: 'Giá thị trường',
    author: 'Minh Tuấn',
    publishedAt: '24/07/2026',
    readTime: '5 phút',
    tags: ['Sầu riêng', 'Xuất khẩu', 'Giá thị trường'],
    viewCount: 12500
  },
  {
    id: 'news-2',
    slug: '5-meo-trong-rau-thuy-canh-tai-nha',
    title: '5 Mẹo trồng rau thủy canh tại nhà cực kỳ đơn giản',
    description: 'Chỉ với những vật dụng đơn giản, bạn có thể thiết lập ngay một hệ thống rau sạch tại ban công để phục vụ bữa ăn gia đình.',
    content: mockLongContent,
    image: 'https://images.unsplash.com/photo-1595858603370-d5a230721245?q=80&w=800&auto=format&fit=crop',
    category: 'Kinh nghiệm trồng trọt',
    author: 'Lan Anh',
    publishedAt: '23/07/2026',
    readTime: '8 phút',
    tags: ['Thủy canh', 'Rau sạch', 'Tại nhà'],
    viewCount: 8400
  },
  {
    id: 'news-3',
    slug: 'giai-cuu-nong-san-mua-dich',
    title: 'Chương trình trợ giá nông sản Việt cùng AgriMarket',
    description: 'AgriMarket triển khai chương trình trợ giá, miễn phí vận chuyển cho hàng loạt nông sản nội địa nhằm kích cầu tiêu dùng.',
    content: mockLongContent,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    category: 'Hoạt động AgriMarket',
    author: 'Admin',
    publishedAt: '20/07/2026',
    readTime: '4 phút',
    tags: ['Khuyến mãi', 'Trợ giá', 'Hoạt động'],
    viewCount: 22000
  },
  {
    id: 'news-4',
    slug: 'cach-nhan-biet-trai-cay-sach',
    title: 'Cách nhận biết trái cây sạch không hóa chất bằng mắt thường',
    description: 'Nắm vững những nguyên tắc cơ bản này để bảo vệ sức khỏe gia đình bạn trước vấn nạn thực phẩm bẩn đang lan tràn.',
    content: mockLongContent,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop',
    category: 'An toàn thực phẩm',
    author: 'Bác sĩ Hoa',
    publishedAt: '18/07/2026',
    readTime: '6 phút',
    tags: ['An toàn thực phẩm', 'Hữu cơ', 'Sức khỏe'],
    viewCount: 15300
  },
  {
    id: 'news-5',
    slug: 'ung-dung-iot-vao-nong-nghiep',
    title: 'Ứng dụng IoT vào nông nghiệp công nghệ cao',
    description: 'Việc sử dụng cảm biến, hệ thống tưới tiêu tự động đang dần thay đổi bộ mặt của nông nghiệp Việt Nam theo hướng hiện đại hóa.',
    content: mockLongContent,
    image: 'https://images.unsplash.com/photo-1586771107445-d3af9e1281d1?q=80&w=800&auto=format&fit=crop',
    category: 'Kiến thức nông nghiệp',
    author: 'Hoàng Long',
    publishedAt: '15/07/2026',
    readTime: '10 phút',
    tags: ['IoT', 'Công nghệ', 'Tương lai'],
    viewCount: 9100
  }
];

export const featuredNews = mockNews[0];
