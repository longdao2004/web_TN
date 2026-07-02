import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductBatchDto } from './dto/create-product-batch.dto';
import { UpdateProductBatchDto } from './dto/update-product-batch.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class ProductBatchesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo lô hàng mới cho sản phẩm.
   * Logic quan trọng: Chỉ chủ sở hữu gian hàng (Seller) mới được phép tạo lô hàng cho sản phẩm của mình.
   */
  async create(userId: string, createProductBatchDto: CreateProductBatchDto) {
    // 1. Kiểm tra sản phẩm có tồn tại và ai là chủ cửa hàng
    const product = await this.prisma.product.findUnique({
      where: { id: createProductBatchDto.productId, deletedAt: null },
      include: { store: true }, // Include store để lấy ownerId
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // 2. Phân quyền: Ngăn chặn chủ cửa hàng khác hoặc người ngoài tạo lô hàng
    if (product.store.ownerId !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo lô hàng cho sản phẩm này',
      );
    }

    // 3. Tạo lô hàng
    return this.prisma.productBatch.create({
      data: {
        productId: createProductBatchDto.productId,
        harvestDate: new Date(createProductBatchDto.harvestDate),
        expiryDate: new Date(createProductBatchDto.expiryDate),
        quantity: createProductBatchDto.quantity,
        price: createProductBatchDto.price,
      },
    });
  }

  /**
   * Lấy danh sách lô hàng của một sản phẩm.
   * Logic quan trọng: Ưu tiên trả về các lô hàng có ngày hết hạn gần nhất lên trước để ưu tiên hiển thị/bán.
   */
  async findByProduct(productId: string) {
    return this.prisma.productBatch.findMany({
      where: { productId },
      orderBy: { expiryDate: 'asc' }, // Sắp xếp theo hạn sử dụng tăng dần
    });
  }

  /**
   * Cập nhật thông tin lô hàng.
   * Logic: Kiểm tra quyền sở hữu như lúc tạo.
   */
  async update(
    userId: string,
    batchId: string,
    updateProductBatchDto: UpdateProductBatchDto,
  ) {
    const batch = await this.prisma.productBatch.findUnique({
      where: { id: batchId },
      include: { product: { include: { store: true } } },
    });

    if (!batch) {
      throw new NotFoundException('Lô hàng không tồn tại');
    }

    if (batch.product.store.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật lô hàng này');
    }

    const updateData: any = { ...updateProductBatchDto };
    // Format lại chuỗi ISO thành Date Object nếu có cập nhật
    if (updateData.harvestDate)
      updateData.harvestDate = new Date(updateData.harvestDate);
    if (updateData.expiryDate)
      updateData.expiryDate = new Date(updateData.expiryDate);

    return this.prisma.productBatch.update({
      where: { id: batchId },
      data: updateData,
    });
  }

  /**
   * Xóa lô hàng.
   * Logic quan trọng:
   * - Phân quyền: Chủ cửa hàng hoặc Admin.
   * - An toàn dữ liệu: Không cho phép xóa lô hàng nếu đã có người đặt mua (có trong OrderItem).
   */
  async remove(userId: string, userRole: string, batchId: string) {
    const batch = await this.prisma.productBatch.findUnique({
      where: { id: batchId },
      include: { product: { include: { store: true } } },
    });

    if (!batch) {
      throw new NotFoundException('Lô hàng không tồn tại');
    }

    // Admin có thể xóa, hoặc đúng chủ cửa hàng mới được xóa
    if (batch.product.store.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa lô hàng này');
    }

    // Đảm bảo tính toàn vẹn: Kiểm tra xem đã có đơn hàng nào mua lô này chưa
    const orders = await this.prisma.orderItem.findFirst({
      where: { productBatchId: batchId },
    });
    if (orders) {
      throw new ForbiddenException(
        'Không thể xóa lô hàng đã có người đặt mua. Hãy cập nhật số lượng về 0 thay vì xóa.',
      );
    }

    await this.prisma.productBatch.delete({
      where: { id: batchId },
    });

    return { message: 'Xóa lô hàng thành công' };
  }
}
