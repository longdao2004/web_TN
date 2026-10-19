import { Product } from '../types/product';
import { ProductDetail } from '../types/product-detail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const productService = {
  // 1. LẤY DANH SÁCH SẢN PHẨM (ĐÃ ĐỒNG BỘ HIỂN THỊ GIÁ LÔ MỚI NHẤT TRÊN THẺ)
  getProducts: async (filters?: { 
    search?: string, 
    categoryId?: string, 
    storeId?: string, 
    minPrice?: number, 
    maxPrice?: number, 
    sortBy?: string, 
    order?: 'asc' | 'desc' 
  }): Promise<any> => {
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
    return data.map((item: any) => {
      // 🟢 Sắp xếp lấy lô mới nhất cho từng sản phẩm ngoài danh sách
      const sorted = (item.batches || []).slice().sort((a: any, b: any) => 
        new Date(b.createdAt || b.harvestDate || 0).getTime() - new Date(a.createdAt || a.harvestDate || 0).getTime()
      );
      const latest = sorted[0];

      const rawPrice = latest?.price || 0;
      const rawOriginalPrice = latest?.originalPrice || null;

      let actualPrice = rawPrice;
      let originalPrice: number | undefined = undefined;
      let isDiscounted = false;
      let discountPercent = 0;

      // 🟢 Tự động nhận diện thông minh: Số nhỏ hơn là giá bán thực tế, số lớn hơn là giá gốc
      if (rawOriginalPrice && rawOriginalPrice > 0 && rawOriginalPrice !== rawPrice) {
        actualPrice = Math.min(rawPrice, rawOriginalPrice);
        originalPrice = Math.max(rawPrice, rawOriginalPrice);
        isDiscounted = true;
        discountPercent = Math.round(((originalPrice - actualPrice) / originalPrice) * 100);
      }

      return {
        id: item.id,
        slug: item.id,
        name: item.name,
        image: item.imageUrl || '',
        price: actualPrice, // Giá bán thực tế (khách trả)
        originalPrice: isDiscounted ? originalPrice : undefined, //  Giá gốc niêm yết (gạch ngang)
        salePrice: isDiscounted ? actualPrice : undefined,
        discount: isDiscounted ? discountPercent : undefined, // chỉ hiển thị khi có khuyến mãi
        badges: isDiscounted
          ? [`-${discountPercent}%`, "Khuyến mãi"]
          : [],
        isExpired: item.batches?.length > 0 && !(item.batches?.some((b: any) => new Date(b.expiryDate).getTime() > Date.now())),
        stock: item.batches?.filter((b: any) => new Date(b.expiryDate).getTime() > Date.now()).reduce((acc: number, b: any) => acc + b.quantity, 0) || 0,
        batches: item.batches || [],
        certificates: item.certificates || [],
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
      };
    });
  },

  // 2. CHI TIẾT SẢN PHẨM (LUÔN ƯU TIÊN LÔ HÀNG MỚI NHẤT)
  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    const res = await fetch(`${API_URL}/products/${slug}`, { method: 'GET' });
    if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
    const item = await res.json();

    // 🟢 BƯỚC 1: Sắp xếp lấy Lô hàng MỚI NHẤT lên đầu tiên
    const sortedBatches = (item.batches || []).slice().sort((a: any, b: any) => {
      const timeA = new Date(b.createdAt || b.harvestDate || 0).getTime();
      const timeB = new Date(a.createdAt || a.harvestDate || 0).getTime();
      return timeA - timeB; // Giảm dần: mới nhất đứng đầu
    });
    const latestBatch = sortedBatches[0]; // Lô hàng mới nhất

    const rawBatchPrice = latestBatch?.price || 0;
    const rawBatchOriginalPrice = latestBatch?.originalPrice || null;
    let detailActualPrice = rawBatchPrice;
    let detailOriginalPrice: number | undefined = undefined;
    let isDetailDiscounted = false;
    let detailDiscountPercent = 0;

    if (rawBatchOriginalPrice && rawBatchOriginalPrice > 0 && rawBatchOriginalPrice !== rawBatchPrice) {
      detailActualPrice = Math.min(rawBatchPrice, rawBatchOriginalPrice);
      detailOriginalPrice = Math.max(rawBatchPrice, rawBatchOriginalPrice);
      isDetailDiscounted = true;
      detailDiscountPercent = Math.round(((detailOriginalPrice - detailActualPrice) / detailOriginalPrice) * 100);
    }

    return {
      id: item.id,
      slug: item.id,
      name: item.name,
      image: item.imageUrl || '',
      images: [item.imageUrl || ''],
      // 🟢 BƯỚC 2: Hiển thị đúng Giá của Lô hàng mới nhất & Giá gốc ưu đãi
      price: isDetailDiscounted ? detailOriginalPrice! : detailActualPrice,
      salePrice: isDetailDiscounted ? detailActualPrice : undefined,
      originalPrice: isDetailDiscounted ? detailOriginalPrice : undefined,
      discount: detailDiscountPercent,
      rating: 5,
      reviewCount: item.reviews?.length || 0,
      storeName: item.store?.name || 'Cửa hàng',
      province: item.origin || 'Chưa cập nhật',
      category: item.category?.name || '',
      isExpired: item.batches?.length > 0 && !(item.batches?.some((b: any) => new Date(b.expiryDate).getTime() > Date.now())),
      stock: item.batches?.filter((b: any) => new Date(b.expiryDate).getTime() > Date.now()).reduce((acc: number, b: any) => acc + b.quantity, 0) || 0,
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
        productCount: item.store?._count?.products || item.store?.products?.length || 1,
        responseRate: 100,
        joinedAt: '',
      },
      certificates: item.certificates?.map((cert: any) => ({
        id: cert.id,
        name: cert.name,
        image: cert.imageUrl,
        issuedBy: 'Bộ Nông Nghiệp',
      })) || [],
      // 🟢 BƯỚC 3: Hiển thị đúng Ngày thu hoạch, Hạn dùng & Thông tin của Lô hàng mới nhất
      batch: {
        id: latestBatch?.id || '',
        harvestDate: latestBatch?.harvestDate || '',
        packDate: '',
        expiryDate: latestBatch?.expiryDate || '',
        weight: '',
        specification: latestBatch?.specification || 'Chưa cập nhật',
        storageCondition: latestBatch?.storageCondition || 'Chưa cập nhật',
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
  },
  
  // 3. THÊM SẢN PHẨM MỚI (FormData có upload ảnh)
  createProduct: async (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi khi tạo sản phẩm');
    }
    
    return res.json();
  },

  // 4. CẬP NHẬT SẢN PHẨM
  updateProduct: async (id: string, data: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data,
    });
    if (!res.ok) throw new Error('Lỗi khi cập nhật sản phẩm');
    return res.json();
  },

  // 5. XÓA SẢN PHẨM
  deleteProduct: async (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error('Lỗi khi xóa sản phẩm');
    return res.json();
  },
};