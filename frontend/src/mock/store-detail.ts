import { mockStores } from './stores';
import { products as mockProducts } from './products';
import { reviews } from './reviews';

export const getMockStoreDetail = (slug: string) => {
  const baseStore = mockStores.find(s => s.slug === slug);
  if (!baseStore) return null;

  return {
    ...baseStore,
    email: 'lienhe@agrimarket.vn',
    website: 'www.agrimarket.vn',
    phone: '1900 6789',
    joinDate: baseStore.joinDate || '15/08/2022',
    statistics: {
      totalProducts: baseStore.productsCount || 156,
      totalSold: 12540,
      totalCustomers: 8500,
      responseRate: '98%',
      averageRating: baseStore.rating || 4.8,
    },
    introduction: `
      <p>${baseStore.name} được thành lập với khát vọng mang đến nguồn thực phẩm xanh, sạch và an toàn cho mọi gia đình Việt.</p>
      <p>Nằm ở vị trí thuận lợi, thừa hưởng khí hậu ôn đới, chúng tôi tự hào là đơn vị tiên phong ứng dụng công nghệ nhà kính thông minh vào canh tác.</p>
      <br/>
      <h3>Cam kết của chúng tôi:</h3>
      <ul>
        <li>100% sản phẩm đạt chuẩn an toàn vệ sinh thực phẩm và đang trong quá trình lấy chứng nhận Hữu Cơ (Organic).</li>
        <li>Không sử dụng thuốc diệt cỏ, phân bón hóa học độc hại.</li>
        <li>Thu hoạch và đóng gói trong ngày, đảm bảo độ tươi ngon nhất khi đến tay khách hàng.</li>
      </ul>
    `,
    certificates: [
      { name: 'VietGAP', description: 'Thực hành nông nghiệp tốt tại Việt Nam', icon: 'shield' },
      { name: 'OCOP', description: 'Chương trình Mỗi xã một sản phẩm', icon: 'star' },
      { name: 'Hữu cơ (Organic)', description: 'Canh tác không sử dụng hóa chất tổng hợp', icon: 'leaf' },
      { name: 'ISO 22000', description: 'Hệ thống quản lý an toàn thực phẩm', icon: 'award' },
    ],
    products: mockProducts.slice(0, 8),
    reviews: reviews,
    relatedStores: mockStores.filter(s => s.slug !== slug).slice(0, 4)
  };
};
