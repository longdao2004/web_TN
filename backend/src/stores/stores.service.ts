import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class StoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

      async create(userId: string, createStoreDto: CreateStoreDto) {
    // 1. Kiểm tra xem người dùng đã từng có cửa hàng chưa
    const existingStore = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (existingStore) {
      // Nếu cửa hàng cũ ĐANG HOẠT ĐỘNG (chưa bị xóa) -> Chặn tạo trùng
      if (existingStore.deletedAt === null) {
        throw new BadRequestException('Bạn đã gửi đăng ký hoặc đã có một cửa hàng đang hoạt động');
      }

      // Nếu cửa hàng cũ ĐÃ BỊ KHÓA/XÓA TRƯỚC ĐÓ -> Tái kích hoạt và cập nhật thông tin cửa hàng mới
      // Giải pháp này xử lý triệt để lỗi trùng lặp Unique Constraint (ownerId) của PostgreSQL
      const restoredStore = await this.prisma.store.update({
        where: { id: existingStore.id },
        data: {
          ...createStoreDto,
          deletedAt: null, // Mở khóa hoạt động lại
        },
      });

      return restoredStore;
    }

    // 2. Nếu người dùng chưa từng tạo cửa hàng bao giờ -> Tạo mới bình thường
    const store = await this.prisma.store.create({
      data: {
        ...createStoreDto,
        ownerId: userId,
      },
    });

    return store;
  }

  async getMyStore(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId, deletedAt: null },
      include: {
        _count: {
          select: { products: { where: { deletedAt: null } } },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Không tìm thấy cửa hàng của bạn');
    }

    return store;
  }

  async update(userId: string, updateStoreDto: UpdateStoreDto, files?: any) {
    const store = await this.getMyStore(userId);
    let logoUrl = store.logoUrl;
    if (files?.logo?.[0]) {
      const uploadResult = await this.cloudinary.uploadImage(files.logo[0]);
      logoUrl = uploadResult.url;
    }
    let coverUrl = (store as any).coverUrl;
    if (files?.cover?.[0]) {
      const uploadResult = await this.cloudinary.uploadImage(files.cover[0]);
      coverUrl = uploadResult.url;
    }
    return this.prisma.store.update({
      where: { id: store.id },
      data: {
        ...updateStoreDto,
        logoUrl,
        coverUrl,
      } as any,
    });
  }

  async findAll(filters?: {
    search?: string;
    province?: string;
    sort?: string;
  }) {
    const whereClause: any = { deletedAt: null };

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters?.province) {
      whereClause.address = { contains: filters.province, mode: 'insensitive' };
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (filters?.sort === 'rating') {
      orderByClause = { createdAt: 'desc' };
    } else if (filters?.sort === 'newest') {
      orderByClause = { createdAt: 'desc' };
    }

    // 🟢 Tải danh sách cửa hàng kèm theo reviews của tất cả sản phẩm
    const stores = await this.prisma.store.findMany({
      where: whereClause,
      include: {
        owner: {
          select: { fullName: true, email: true },
        },
        _count: {
          select: { products: { where: { deletedAt: null } } },
        },
        products: {
          where: { deletedAt: null },
          select: {
            reviews: {
              where: { deletedAt: null },
              select: { rating: true },
            },
          },
        },
      },
      orderBy: orderByClause,
    });

    // 🟢 Tính toán điểm trung bình sao và tổng lượt đánh giá của toàn bộ cửa hàng
    return stores.map((store) => {
      const allReviews = store.products?.flatMap((p) => p.reviews) || [];
      const reviewsCount = allReviews.length;
      const rating =
        reviewsCount > 0
          ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1))
          : 5.0;

      const { products, ...rest } = store;
      return {
        ...rest,
        rating,
        reviewsCount,
      };
    });
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id, deletedAt: null },
      include: {
        owner: {
          select: { fullName: true, email: true },
        },
        _count: {
          select: { products: { where: { deletedAt: null } } },
        },
        products: {
          where: { deletedAt: null },
          select: {
            reviews: {
              where: { deletedAt: null },
              select: { rating: true },
            },
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Không tìm thấy cửa hàng');
    }

    // 🟢 Tính điểm đánh giá cho trang chi tiết cửa hàng
    const allReviews = store.products?.flatMap((p) => p.reviews) || [];
    const reviewsCount = allReviews.length;
    const rating =
      reviewsCount > 0
        ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1))
        : 5.0;

    const { products, ...rest } = store;
    return {
      ...rest,
      rating,
      reviewsCount,
    };
  }

    async remove(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id, deletedAt: null },
    });
    if (!store) {
      throw new NotFoundException('Không tìm thấy cửa hàng');
    }

    // 1. Khóa cửa hàng (Xóa mềm)
    await this.prisma.store.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // 2. Tự động hạ vai trò của chủ cửa hàng về BUYER (vì cửa hàng đã bị khóa)
    await this.prisma.user.update({
      where: { id: store.ownerId },
      data: { role: Role.BUYER },
    });

    return { message: 'Đã khóa/xóa cửa hàng và chuyển vai trò chủ shop về người mua thành công' };
  }
}





