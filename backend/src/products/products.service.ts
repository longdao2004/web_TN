import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    // Bóc tách dữ liệu lô hàng ra khỏi thông tin chung của sản phẩm
    const {
      harvestDate,
      expiryDate,
      quantity,
      price,
      categoryId,
      storeId,
      ...productData
    } = createProductDto;

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
            quantity: quantity,
            price: price,
          },
        },
      },
      // Trả về kết quả kèm theo thông tin danh mục và lô hàng vừa tạo
      include: {
        category: true,
        batches: true,
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
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        },
      };
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (filters?.sortBy === 'price') {
      // NOTE: Sorting by relation aggregates (like max/min price in batches) can be complex in Prisma. 
      // This is a simplified approach, actual implementation might need sorting after fetch or raw query for exact price sorting.
      // We'll skip complex relation sorting here and just rely on default or simple fields.
      orderByClause = undefined; // Will handle in memory if strictly required, or omit for now
    } else if (filters?.sortBy === 'rating') {
      orderByClause = { soldCount: filters.order || 'desc' }; // Mock rating with soldCount
    } else if (filters?.sortBy === 'newest') {
      orderByClause = { createdAt: 'desc' };
    }

    return this.prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        store: true,
        reviews: {
          select: { id: true, rating: true }
        },
        batches: {
          where: {
            expiryDate: { gt: new Date() },
          },
        },
      },
      orderBy: orderByClause,
    }).then(products => {
      // Manual post-fetch sorting for price if needed since it's nested
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
        batches: {
          where: { expiryDate: { gt: new Date() } }
        },
        category: true, 
        store: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        certificates: true
      },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto, // (Lưu ý: API Update này hiện chỉ cập nhật thông tin chung, chưa xử lý update lô hàng)
    });
  }

  remove(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
