import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // 1. Import CloudinaryService

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService, // 2. Tiêm CloudinaryService vào constructor
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  // 3. Nhận thêm tham số file ảnh từ Controller
  async updateProfile(userId: string, updateUserDto: UpdateUserDto, file?: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Nếu người dùng có chọn ảnh mới, tải ảnh lên Cloudinary và lấy URL
    let avatarUrl = user.avatarUrl;
    if (file) {
      const uploadResult = await this.cloudinary.uploadImage(file);
      avatarUrl = uploadResult.url;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
        ...(avatarUrl ? { avatarUrl } : {}), // Cập nhật avatarUrl mới
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: updateRoleDto.role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Đã khóa/xóa người dùng thành công' };
  }
}