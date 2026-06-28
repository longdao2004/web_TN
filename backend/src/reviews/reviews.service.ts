import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo đánh giá mới cho sản phẩm.
   * Logic quan trọng: 
   * - Phải đảm bảo sản phẩm tồn tại trước khi cho phép đánh giá.
   * - (Tùy chọn mở rộng sau này: Có thể query bảng Order/OrderItem để kiểm tra user đã thực sự mua hàng chưa).
   */
  async create(userId: string, createReviewDto: CreateReviewDto) {
    // 1. Kiểm tra sản phẩm có tồn tại hay không
    const product = await this.prisma.product.findUnique({
      where: { id: createReviewDto.productId, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // 2. Lưu đánh giá vào CSDL
    return this.prisma.review.create({
      data: {
        userId,
        productId: createReviewDto.productId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      },
    });
  }

  /**
   * Lấy toàn bộ đánh giá của 1 sản phẩm cụ thể.
   * Logic quan trọng:
   * - Khi trả về dữ liệu, phải include bảng User nhưng CẦN ẨN thông tin nhạy cảm (email, password), 
   *   chỉ lấy fullName và avatarUrl để hiển thị lên UI.
   */
  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, deletedAt: null },
      include: {
        user: {
          select: { fullName: true, avatarUrl: true }, // Chỉ select các trường an toàn
        },
      },
      orderBy: { createdAt: 'desc' }, // Đánh giá mới nhất hiện lên trên
    });
  }

  /**
   * Người dùng tự sửa đánh giá của mình.
   * Logic quan trọng: Phải kiểm tra quyền sở hữu (userId của token == userId của review).
   */
  async update(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId, deletedAt: null } });
    
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    // Ngăn chặn việc sửa đánh giá của người khác
    if (review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa đánh giá này');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: updateReviewDto,
    });
  }

  /**
   * Xóa đánh giá (Soft Delete).
   * Logic quan trọng: Cho phép chính người viết xóa HOẶC Admin xóa nếu nội dung vi phạm.
   */
  async remove(userId: string, userRole: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId, deletedAt: null } });
    
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    // Điều kiện gắt gao: Phải là chính chủ HOẶC là ADMIN thì mới được xóa
    if (review.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    // Thực hiện Xóa mềm (Soft delete)
    await this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Đã xóa đánh giá thành công' };
  }
}
