import { Product } from '../types/product';
import { ProductDetail } from '../types/product-detail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const productService = {
  getProducts: async (filters?: { search?: string, categoryId?: string, storeId?: string, minPrice?: number, maxPrice?: number, sortBy?: string, order?: 'asc' | 'desc' }): Promise<any> => {
    let url = `${API_URL}/products`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.storeId) params.append('storeId', filters.storeId);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm');
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      slug: item.id,
      name: item.name,
      image: item.imageUrl || '',
      price: item.batches?.[0]?.price || 0,
      stock: item.batches?.reduce((acc: number, b: any) => acc + b.quantity, 0) || 0,
      store: item.store?.name || 'Cửa hàng',
      storeName: item.store?.name || 'Cửa hàng',
      province: item.origin || 'Chưa cập nhật',
      category: item.category?.name || '',
      rating: item.reviews?.length > 0 ? (item.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / item.reviews.length).toFixed(1) : 5,
      reviewCount: item.reviews?.length || 0,
      reviews: item.reviews?.length || 0,
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
      reviewCount: item.reviews?.length || 0,
      storeName: item.store?.name || 'Cửa hàng',
      province: item.origin || 'Chưa cập nhật',
      category: item.category?.name || '',
      stock: item.batches?.reduce((acc: number, b: any) => acc + b.quantity, 0) || 0,
      isOrganic: true,
      isFeatured: false,
      isNew: true,
      unit: item.unit || 'kg',
      description: item.description || '',
      specifications: {
        "Xuất xứ": item.origin || 'Đang cập nhật',
        "Đơn vị tính": item.unit || 'Đang cập nhật',
        "Danh mục": item.category?.name || 'Đang cập nhật'
      },
      store: {
        id: item.store?.id || '',
        slug: item.store?.id || '',
        name: item.store?.name || '',
        logo: item.store?.logoUrl || '',
        address: item.store?.address || 'Đang cập nhật',
        rating: 5,
        productCount: 0,
        responseRate: 100,
        joinedAt: '',
      },
      certificates: item.certificates?.map((cert: any) => ({
        id: cert.id,
        name: cert.name,
        image: cert.imageUrl,
        issuedBy: 'Bộ Nông Nghiệp',
      })) || [],
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
      reviews: item.reviews?.map((r: any) => ({
        id: r.id,
        customerName: r.user?.fullName || 'Người dùng ẩn danh',
        avatar: r.user?.avatarUrl || `https://ui-avatars.com/api/?name=${(r.user?.fullName || 'U').charAt(0)}`,
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString('vi-VN'),
        content: r.comment,
        likes: 0,
        images: []
      })) || [],
      relatedProducts: [],
    };
  }
};
