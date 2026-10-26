import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // 1. TẠO SẢN PHẨM MỚI (Tự động gán storeId theo tài khoản Seller)
    // 1. TẠO SẢN PHẨM MỚI (Tự động gán storeId theo tài khoản Seller)
  async create(
    createProductDto: CreateProductDto,
    userId: string,
    userRole: Role,
  ) {
    let storeId = createProductDto.storeId;

    // Nếu là Seller, bắt buộc lấy storeId của chính họ để tránh gán nhầm sang shop khác
    if (userRole === Role.SELLER) {
      const store = await this.prisma.store.findUnique({
        where: { ownerId: userId },
      });
      if (!store) {
        throw new ForbiddenException('Bạn chưa có cửa hàng để tạo sản phẩm!');
      }
      storeId = store.id;
    }

    const {
      harvestDate,
      expiryDate,
      quantity,
      price,
      originalPrice,
      categoryId,
      storeId: _, //  BÓC TÁCH storeId RA ĐỂ KHÔNG BỊ LỌT VÀO productData
      specification,
      storageCondition,
      ...productData
    } = createProductDto;

    // Chuẩn hóa giá: Giá bán thực tế và giá gốc
    const finalPrice = Number(price);
    const finalOriginalPrice = originalPrice ? Number(originalPrice) : null;

    return this.prisma.product.create({
      data: {
        ...productData,
        category: { connect: { id: categoryId } },
        store: { connect: { id: storeId } },
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
      include: {
        category: true,
        batches: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  // 2. LẤY DANH SÁCH SẢN PHẨM (Có lọc và sắp xếp)
  findAll(filters?: {
    search?: string;
    categoryId?: string;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    const whereClause: any = { deletedAt: null };

    if (filters?.search) {
      whereClause.name = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters?.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }
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
          store: {
            include: {
              _count: {
                select: { products: { where: { deletedAt: null } } },
              },
            },
          },
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

  // 3. XEM CHI TIẾT SẢN PHẨM
  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        batches: { orderBy: { createdAt: 'desc' } },
        category: true,
        store: {
          include: {
            _count: {
              select: { products: { where: { deletedAt: null } } },
            },
          },
        },
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

  // 4. CẬP NHẬT SẢN PHẨM (Kiểm tra quyền sở hữu BOLA/IDOR)
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
    userRole: Role,
    file?: any,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: { store: true },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại!');
    }

    // BẢO MẬT: Chỉ chủ shop sở hữu hoặc ADMIN mới được sửa sản phẩm này
    if (userRole !== Role.ADMIN && product.store.ownerId !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa sản phẩm này!',
      );
    }

    const {
      price,
      originalPrice,
      quantity,
      stock,
      harvestDate,
      expiryDate,
      categoryId,
      storeId,
      specification,
      storageCondition,
      ...productData
    } = updateProductDto as any;

    let imageUrl = undefined;
    if (file) {
      const uploadResult = await this.cloudinary.uploadImage(file);
      imageUrl = uploadResult.secure_url || uploadResult.url;
    }

    const batchUpdateData: any = {};
    if (price !== undefined) batchUpdateData.price = Number(price);
    if (originalPrice !== undefined)
      batchUpdateData.originalPrice =
        originalPrice && Number(originalPrice) > 0
          ? Number(originalPrice)
          : null;
    const finalQuantity = quantity !== undefined ? quantity : stock;
    if (finalQuantity !== undefined) batchUpdateData.quantity = Number(finalQuantity);
    if (harvestDate) batchUpdateData.harvestDate = new Date(harvestDate);
    if (expiryDate) batchUpdateData.expiryDate = new Date(expiryDate);
    if (specification !== undefined)
      batchUpdateData.specification = specification;
    if (storageCondition !== undefined)
      batchUpdateData.storageCondition = storageCondition;

    // 1. Cập nhật thông tin cơ bản sản phẩm
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(imageUrl ? { imageUrl } : {}),
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
    });

    // 2. Cập nhật lô hàng mới nhất
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

  // 5. XÓA MỀM SẢN PHẨM (Kiểm tra quyền sở hữu BOLA/IDOR)
  async remove(id: string, userId: string, userRole: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: { store: true },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại!');
    }

    // BẢO MẬT: Chỉ chủ shop sở hữu hoặc ADMIN mới được xóa sản phẩm này
    if (userRole !== Role.ADMIN && product.store.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa sản phẩm này!');
    }

    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}