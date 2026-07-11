import { Product } from '@/types/product';

export const mockProductsList: Product[] = Array.from({ length: 30 }).map((_, i) => {
  const isOrganic = (i % 2) === 0;
  const isNew = (i % 3) === 0;
  const isFeatured = (i % 4) === 0;
  const hasSale = (i % 5) === 0 || (i % 7) === 0;
  const originalPrice = 50000 + ((i * 25000) % 350000);
  const discount = hasSale ? 10 + ((i * 5) % 40) : 0;
  const salePrice = hasSale ? originalPrice * (1 - discount / 100) : undefined;

  const categories = ['Rau củ', 'Trái cây', 'Thịt tươi', 'Hải sản', 'Gạo & Ngũ cốc', 'Đồ khô'];
  const provinces = ['Lâm Đồng', 'Sơn La', 'Cà Mau', 'Hà Nội', 'Sóc Trăng', 'Bình Phước'];
  const stores = ['Nông trại Đà Lạt', 'Vựa Hải Sản Năm Căn', 'Meat Deli', 'Hợp tác xã Hàm Yên'];
  const certificates = ['VietGAP', 'GlobalGAP', 'OCOP', 'Organic'];

  const images = [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format&fit=crop'
  ];

  const rating = Number((((i * 7) % 20) / 10 + 3).toFixed(1)); // 3.0 to 4.9
  const reviewCount = 10 + ((i * 47) % 490);
  const stock = (i * 31) % 200;

  return {
    id: `prod-${i + 1}`,
    slug: `san-pham-${i + 1}`,
    name: `Sản phẩm nông sản tươi sạch chuẩn vị số ${i + 1}`,
    image: images[i % images.length],
    price: originalPrice,
    salePrice: salePrice,
    discount: discount,
    rating: rating,
    reviewCount: reviewCount,
    storeName: stores[i % stores.length],
    province: provinces[i % provinces.length],
    category: categories[i % categories.length],
    certificate: isOrganic ? ['Organic'] : [certificates[i % certificates.length]],
    stock: stock,
    isOrganic,
    isFeatured,
    isNew,
    unit: i % 2 === 0 ? '1kg' : '500g',
  };
});
