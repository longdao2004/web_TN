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
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createStoreDto: CreateStoreDto) {
    // Kiểm tra xem người dùng đã có cửa hàng chưa
    const existingStore = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });
    if (existingStore) {
      throw new BadRequestException('Bạn đã có một cửa hàng');
    }

    // Tạo store
    const store = await this.prisma.store.create({
      data: {
        ...createStoreDto,
        ownerId: userId,
      },
    });

    // Tự động nâng cấp quyền người dùng lên SELLER nếu họ đang là BUYER
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user && user.role === Role.BUYER) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.SELLER },
      });
    }

    return store;
  }

  async getMyStore(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId, deletedAt: null },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Không tìm thấy cửa hàng của bạn');
    }

    return store;
  }

  async update(userId: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.getMyStore(userId);
    return this.prisma.store.update({
      where: { id: store.id },
      data: updateStoreDto,
    });
  }

  async findAll(filters?: { search?: string, province?: string, sort?: string }) {
    const whereClause: any = { deletedAt: null };

    if (filters?.search) {
      whereClause.name = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters?.province) {
      whereClause.address = { contains: filters.province, mode: 'insensitive' };
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (filters?.sort === 'rating') {
      // Sắp xếp giả cho đánh giá vì đánh giá chưa phải dữ liệu thật
      orderByClause = { createdAt: 'desc' };
    } else if (filters?.sort === 'newest') {
      orderByClause = { createdAt: 'desc' };
    }

    return this.prisma.store.findMany({
      where: whereClause,
      include: {
        owner: {
          select: { fullName: true, email: true },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: orderByClause,
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
          select: { products: true },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Không tìm thấy cửa hàng');
    }

    return store;
  }

  async remove(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id, deletedAt: null },
    });
    if (!store) {
      throw new NotFoundException('Không tìm thấy cửa hàng');
    }

    await this.prisma.store.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Đã khóa/xóa cửa hàng thành công' };
  }
}
