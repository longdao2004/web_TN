import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Tạo danh mục mới
  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name.trim(),
        description: createCategoryDto.description?.trim(),
      },
    });
  }

  // 2. Lấy danh sách danh mục (kèm số lượng sản phẩm đang có)
  findAll() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Xem chi tiết 1 danh mục
  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  // 4. Cập nhật thông tin danh mục
  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(updateCategoryDto.name ? { name: updateCategoryDto.name.trim() } : {}),
        ...(updateCategoryDto.description !== undefined
          ? { description: updateCategoryDto.description?.trim() }
          : {}),
      },
    });
  }

  // 5. Xóa mềm danh mục (Có kiểm tra an toàn: Không xóa nếu danh mục đang có sản phẩm)
  async remove(id: string) {
    const activeProductsCount = await this.prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (activeProductsCount > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục đang có ${activeProductsCount} sản phẩm hoạt động! Vui lòng chuyển các sản phẩm sang danh mục khác trước khi xóa.`,
      );
    }

    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}