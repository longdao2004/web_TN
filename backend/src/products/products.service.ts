import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    // Bóc tách dữ liệu lô hàng ra khỏi thông tin chung của sản phẩm
    const { harvestDate, expiryDate, quantity, price, categoryId, storeId, ...productData } = createProductDto;

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

  findAll() {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        store: true,
        // Chỉ lấy những lô hàng còn hạn sử dụng (expiryDate lớn hơn ngày hiện tại)
        batches: {
          where: {
            expiryDate: { gt: new Date() }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { batches: true, category: true, store: true },
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