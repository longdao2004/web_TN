import { MockProduct, products } from './products';

// Giả lập logic tìm kiếm cơ bản
export const searchProducts = (query: string): MockProduct[] => {
  if (!query || query.trim() === '') {
    return products;
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  return products.filter((product) => {
    // Tìm trong tên sản phẩm
    if (product.name.toLowerCase().includes(normalizedQuery)) return true;
    
    // Tìm trong tên cửa hàng
    if (product.store && product.store.toLowerCase().includes(normalizedQuery)) return true;
    
    // Tìm trong danh mục/tags giả định thông qua badges
    if (product.badges && product.badges.some((b: string) => b.toLowerCase().includes(normalizedQuery))) return true;

    return false;
  });
};

export const getPopularSearches = () => {
  return ['Cà chua', 'Dâu tây', 'Rau hữu cơ', 'Sầu riêng', 'Gạo ST25', 'Thịt bò sạch'];
};
