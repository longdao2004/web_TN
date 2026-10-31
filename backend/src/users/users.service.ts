import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // 1. Import CloudinaryService
import { Role } from '../auth/role.enum';


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

    let avatarUrl = user.avatarUrl;
    if (file) {
      const uploadResult = await this.cloudinary.uploadImage(file);
      avatarUrl = uploadResult.url;
    }

    // Bóc tách tường minh các trường được phép sửa, tuyệt đối không lấy 'role'
    const { fullName, phone, address } = updateUserDto;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined ? { fullName } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(avatarUrl ? { avatarUrl } : {}),
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

    async updateRole(id: string, updateRoleDto: UpdateRoleDto, currentAdminId?: string) {
    // 1. CẤM TUYỆT ĐỐI việc nâng người dùng thành Quản trị viên (ADMIN) qua giao diện này
    if (updateRoleDto.role === Role.ADMIN) {
      throw new BadRequestException('Bảo mật: Không được phép cấp quyền Quản trị viên (ADMIN) từ giao diện này!');
    }

    // 2. Chặn Admin tự hạ quyền của chính mình
    if (currentAdminId && id === currentAdminId) {
      throw new BadRequestException('Bạn không thể tự hạ quyền Quản trị viên của chính mình!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // 3. Nếu muốn nâng lên SELLER: Bắt buộc người đó phải có hồ sơ gian hàng trong hệ thống
    if (updateRoleDto.role === Role.SELLER) {
      const store = await this.prisma.store.findUnique({
        where: { ownerId: id },
      });
      if (!store) {
        throw new BadRequestException('Người dùng này chưa nộp hồ sơ gian hàng, không thể cấp quyền SELLER!');
      }
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

  async remove(id: string, currentAdminId?: string) {
    // Chặn Admin tự khóa tài khoản của chính mình
    if (currentAdminId && id === currentAdminId) {
      throw new BadRequestException('Quản trị viên không thể tự khóa tài khoản của chính mình!');
    }

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