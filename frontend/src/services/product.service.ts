import { Product } from '../types/product';
import { ProductDetail } from '../types/product-detail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const productService = {
  // 1. LẤY DANH SÁCH SẢN PHẨM (ĐỒNG BỘ GIÁ VÀ NHẬN DIỆN LÔ MỚI NHẤT)
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
    const result = data.map((item: any) => {
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

      // 🟢 KIỂM TRA LÔ MỚI VỀ:
      // 1. Lô mới nhất phải còn hạn sử dụng
      const isLatestActive = latest && new Date(latest.expiryDate).getTime() > Date.now();
      // 2. Lô được thu hoạch/nhập kho trong vòng 7 ngày gần nhất (hoặc là đợt hàng thứ 2 trở lên gối đầu)
      const batchTime = new Date(latest?.createdAt || latest?.harvestDate || 0).getTime();
      const isWithin7Days = Date.now() - batchTime < 7 * 24 * 60 * 60 * 1000;
      const isNewBatch = Boolean(isLatestActive && (isWithin7Days || (item.batches?.length > 1)));

      return {
        id: item.id,
        slug: item.id,
        name: item.name,
        image: item.imageUrl || '',
        price: actualPrice, // Giá bán thực tế (khách trả)
        originalPrice: isDiscounted ? originalPrice : undefined, // Giá gốc niêm yết (gạch ngang)
        salePrice: isDiscounted ? actualPrice : undefined,
        discount: isDiscounted ? discountPercent : undefined, // Chỉ hiện khi có giảm giá (tránh hiện số 0 xấu)
        badges: [
          ...(isDiscounted ? [`-${discountPercent}%`, "Khuyến mãi"] : []),
          ...(isNewBatch ? ["Lô mới về"] : []),
        ],
        isNewBatch: isNewBatch, // Cờ nhận diện đợt hàng mới để hiện huy hiệu
        isExpired: item.batches?.length > 0 && !(item.batches?.some((b: any) => new Date(b.expiryDate).getTime() > Date.now())),
        stock: item.batches?.filter((b: any) => new Date(b.expiryDate).getTime() > Date.now()).reduce((acc: number, b: any) => acc + b.quantity, 0) || 0,
        batches: item.batches || [],
        certificates: item.certificates || [],
        store: item.store?.name || 'Cửa hàng',
        storeName: item.store?.name || 'Cửa hàng',
        province: item.origin || 'Chưa cập nhật',
        category: item.category?.name || '',
        // 🟢 Chuẩn hóa điểm số sao kiểu số
        rating: item.reviews?.length > 0 ? Number((item.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / item.reviews.length).toFixed(1)) : 5,
        reviewCount: item.reviews?.length || 0,
        reviews: item.reviews?.length || 0,
        soldCount: item.soldCount || 0, // 🟢 Số lượng đã bán
        isOrganic: true,
        isFeatured: false,
        isNew: true,
        unit: item.unit || 'kg',
      };
    });

    // 🟢 Nếu người dùng chọn "Đánh giá cao":
    // Ưu tiên sản phẩm có đánh giá thật từ người mua (reviewCount > 0) lên trước, sau đó so sánh số sao
    if (filters?.sortBy === 'rating') {
      result.sort((a: any, b: any) => {
        // 1. Sản phẩm có đánh giá thật (> 0) luôn đứng trước sản phẩm 0 đánh giá
        if ((b.reviewCount > 0) !== (a.reviewCount > 0)) {
          return b.reviewCount > 0 ? 1 : -1;
        }
        // 2. So sánh điểm sao trung bình từ cao xuống thấp
        const diff = Number(b.rating) - Number(a.rating);
        if (diff !== 0) return diff;
        // 3. Nếu cùng số sao thì ưu tiên sản phẩm có nhiều lượt đánh giá hơn
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
    }

    // 🟢 Nếu người dùng chọn "Bán chạy": Sắp xếp theo số lượng đã bán (soldCount) từ cao xuống thấp
    if (filters?.sortBy === 'bestseller') {
      result.sort((a: any, b: any) => (b.soldCount || 0) - (a.soldCount || 0));
    }

    return result;
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

    // 🟢 KIỂM TRA LÔ MỚI VỀ CHO TRANG CHI TIẾT
    const isLatestActiveDetail = latestBatch && new Date(latestBatch.expiryDate).getTime() > Date.now();
    const batchTimeDetail = new Date(latestBatch?.createdAt || latestBatch?.harvestDate || 0).getTime();
    const isWithin7DaysDetail = Date.now() - batchTimeDetail < 7 * 24 * 60 * 60 * 1000;
    const isNewBatchDetail = Boolean(isLatestActiveDetail && (isWithin7DaysDetail || (item.batches?.length > 1)));

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
      discount: isDetailDiscounted ? detailDiscountPercent : undefined,
      isNewBatch: isNewBatchDetail,
      badges: [
        ...(isDetailDiscounted ? [`-${detailDiscountPercent}%`, "Khuyến mãi"] : []),
        ...(isNewBatchDetail ? ["Lô mới về"] : []),
      ],
      // 🟢 Điểm sao chuẩn xác cho trang chi tiết (kiểu number)
      rating: item.reviews?.length > 0 ? Number((item.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / item.reviews.length).toFixed(1)) : 5,
      reviewCount: item.reviews?.length || 0,
      soldCount: item.soldCount || 0,
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