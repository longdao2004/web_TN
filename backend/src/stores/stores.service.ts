import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createStoreDto: CreateStoreDto) {
    // Check if user already has a store
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

    // Automatically upgrade user role to SELLER if they are BUYER
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
          select: { products: true }
        }
      }
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

  async findAll() {
    return this.prisma.store.findMany({
      where: { deletedAt: null },
      include: {
        owner: {
          select: { fullName: true, email: true }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
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
