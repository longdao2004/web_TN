import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) {}

  create(createProductDto: CreateProductDto) {
    // Bóc tách dữ liệu lô hàng ra khỏi thông tin chung của sản phẩm
    const {
      harvestDate,
      expiryDate,
      quantity,
      price,
      originalPrice,
      categoryId,
      storeId,
      specification,
      storageCondition,
      ...productData
    } = createProductDto;

    // Chuẩn hóa giá thông minh: Giá nhỏ hơn luôn là giá bán thực tế, giá lớn hơn là giá gốc niêm yết
    let finalPrice = Number(price);
    let finalOriginalPrice: number | null = null;
    if (originalPrice && Number(originalPrice) > 0 && Number(originalPrice) !== Number(price)) {
      finalPrice = Math.min(Number(price), Number(originalPrice));
      finalOriginalPrice = Math.max(Number(price), Number(originalPrice));
    }

    // Prisma Nested Writes: Tạo Product và ProductBatch trong cùng một Transaction
    return this.prisma.product.create({
      data: {
        ...productData,
        // Liên kết khóa ngoại
        category: { connect: { id: categoryId } },
        store: { connect: { id: storeId } },
        // Tạo luôn lô hàng đầu tiên đi kèm
        batches: {
          create: {
            harvestDate: new Date(harvestDate),
            expiryDate: new Date(expiryDate),
            quantity: Number(quantity),
            price: finalPrice,
            originalPrice: finalOriginalPrice,
            specification,
            storageCondition,
          },
        },
      },
      // Trả về kết quả kèm theo thông tin danh mục và lô hàng vừa tạo
      include: {
        category: true,
        batches: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  findAll(filters?: {
    search?: string;
    categoryId?: string;
    storeId?: string; // Bổ sung lọc theo cửa hàng
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    const whereClause: any = { deletedAt: null };

    // Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường)
    if (filters?.search) {
      whereClause.name = { contains: filters.search, mode: 'insensitive' };
    }
    // Lọc theo danh mục
    if (filters?.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }
    // Lọc sản phẩm thuộc về một cửa hàng cụ thể (Dùng cho Khối chi tiết cửa hàng ở Frontend)
    if (filters?.storeId) {
      whereClause.storeId = filters.storeId;
    }
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      whereClause.batches = {
        some: {
          expiryDate: { gt: new Date() },
          price: {
            ...(filters.minPrice !== undefined
              ? { gte: filters.minPrice }
              : {}),
            ...(filters.maxPrice !== undefined
              ? { lte: filters.maxPrice }
              : {}),
          },
        },
      };
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (filters?.sortBy === 'price') {
      orderByClause = undefined;
    // 🟢 Nhận diện cả 'bestseller' (Bán chạy) và 'rating' (Đánh giá) để sắp xếp theo số lượng bán
    } else if (filters?.sortBy === 'bestseller' || filters?.sortBy === 'rating') {
      orderByClause = { soldCount: filters.order || 'desc' };
    } else if (filters?.sortBy === 'newest') {
      orderByClause = { createdAt: 'desc' };
    }

    return this.prisma.product
      .findMany({
        where: whereClause,
        include: {
          category: true,
          store: { include: { _count: { select: { products: { where: { deletedAt: null } } } } } },
          reviews: {
            select: { id: true, rating: true },
          },
          certificates: true,
          batches: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: orderByClause,
      })
      .then((products) => {
        if (filters?.sortBy === 'price') {
          return products.sort((a, b) => {
            const priceA = a.batches?.[0]?.price || 0;
            const priceB = b.batches?.[0]?.price || 0;
            return filters.order === 'desc' ? priceB - priceA : priceA - priceB;
          });
        }
        return products;
      });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        batches: { orderBy: { createdAt: 'desc' } },
        category: true,
        store: { include: { _count: { select: { products: { where: { deletedAt: null } } } } } },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        certificates: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto, file?: any) {
    const { price, originalPrice, stock, harvestDate, expiryDate, categoryId, storeId, specification, storageCondition, ...productData } = updateProductDto as any;
    let imageUrl = undefined;
    if (file) {
      const uploadResult = await this.cloudinary.uploadImage(file);
      imageUrl = uploadResult.secure_url || uploadResult.url;
    }
    
    const batchUpdateData: any = {};
    // Chuẩn hóa thông minh: số nhỏ hơn luôn là giá bán thực tế, số lớn hơn là giá gốc niêm yết
    if (price !== undefined || originalPrice !== undefined) {
      const p = price !== undefined ? Number(price) : undefined;
      const op = (originalPrice !== undefined && originalPrice !== "" && Number(originalPrice) > 0) ? Number(originalPrice) : null;

      if (p !== undefined && op !== null && p !== op) {
        batchUpdateData.price = Math.min(p, op);
        batchUpdateData.originalPrice = Math.max(p, op);
      } else {
        if (p !== undefined) batchUpdateData.price = p;
        if (originalPrice !== undefined) batchUpdateData.originalPrice = op;
      }
    }
    if (stock !== undefined) batchUpdateData.quantity = Number(stock);
    if (harvestDate) batchUpdateData.harvestDate = new Date(harvestDate);
    if (expiryDate) batchUpdateData.expiryDate = new Date(expiryDate);
    if (specification !== undefined) batchUpdateData.specification = specification;
    if (storageCondition !== undefined) batchUpdateData.storageCondition = storageCondition;

    // 🟢 1. Cập nhật thông tin cơ bản của sản phẩm
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(imageUrl ? { imageUrl } : {}),
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
    });

    // 🟢 2. Chỉ cập nhật Lô hàng MỚI NHẤT, giữ nguyên lịch sử của các lô cũ
    if (Object.keys(batchUpdateData).length > 0) {
      const latestBatch = await this.prisma.productBatch.findFirst({
        where: { productId: id },
        orderBy: { createdAt: 'desc' },
      });
      if (latestBatch) {
        await this.prisma.productBatch.update({
          where: { id: latestBatch.id },
          data: batchUpdateData,
        });
      }
    }

    return updatedProduct;
  }

  remove(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}