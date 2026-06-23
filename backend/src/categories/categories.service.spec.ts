import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  // Nhúng PrismaService vào để gọi Database
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
      },
    });
  }

  findAll() {
    // Chỉ lấy ra những danh mục chưa bị xóa mềm (deletedAt = null)
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' } // Sắp xếp mới nhất lên đầu
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: string) {
    // Xóa mềm: Không xóa khỏi CSDL mà chỉ cập nhật trường deletedAt thành thời gian hiện tại
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}