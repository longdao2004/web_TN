import { Product } from '../types/product';
import { ProductDetail } from '../types/product-detail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_URL}/products`, { method: 'GET' });
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm');
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      slug: item.id,
      name: item.name,
      image: item.imageUrl || '',
      price: item.batches?.[0]?.price || 0,
      stock: item.batches?.reduce((acc: number, b: any) => acc + b.quantity, 0) || 0,
      storeName: item.store?.name || 'Cửa hàng',
      province: item.origin || 'Chưa cập nhật',
      category: item.category?.name || '',
      rating: 5,
      reviewCount: 0,
      isOrganic: true,
      isFeatured: false,
      isNew: true,
      unit: item.unit || 'kg',
    }));
  },

  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    const res = await fetch(`${API_URL}/products/${slug}`, { method: 'GET' });
    if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
    const item = await res.json();
    return {
      id: item.id,
      slug: item.id,
      name: item.name,
      image: item.imageUrl || '',
      images: [item.imageUrl || ''],
      price: item.batches?.[0]?.price || 0,
      salePrice: item.batches?.[0]?.price || 0,
      discount: 0,
      rating: 5,
      reviewCount: 0,
      storeName: item.store?.name || 'C?a hàng',
      province: item.origin || 'Chua c?p nh?t',
      category: item.category?.name || '',
      stock: item.batches?.reduce((acc: number, b: any) => acc + b.quantity, 0) || 0,
      isOrganic: true,
      isFeatured: false,
      isNew: true,
      unit: item.unit || 'kg',
      description: item.description || '',
      specifications: {},
      store: {
        id: item.store?.id || '',
        slug: item.store?.id || '',
        name: item.store?.name || '',
        logo: '',
        address: '',
        rating: 5,
        productCount: 0,
        responseRate: 100,
        joinedAt: '',
      },
      certificates: [],
      batch: {
        id: item.batches?.[0]?.id || '',
        harvestDate: item.batches?.[0]?.harvestDate || '',
        packDate: '',
        expiryDate: item.batches?.[0]?.expiryDate || '',
        weight: '',
        specification: '',
        storageCondition: '',
        origin: item.origin || '',
      },
      reviews: [],
      relatedProducts: [],
    };
  }
};
