import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role } from '../auth/role.enum';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo đánh giá mới cho sản phẩm.
   * Logic bảo mật & nghiệp vụ:
   * 1. Sản phẩm phải tồn tại.
   * 2. Người dùng phải từng mua sản phẩm này trong đơn hàng COMPLETED.
   * 3. Mỗi người dùng chỉ được đánh giá 1 lần cho 1 sản phẩm (tránh spam).
   */
  async create(userId: string, createReviewDto: CreateReviewDto) {
    // 1. Kiểm tra sản phẩm có tồn tại hay không
    const product = await this.prisma.product.findUnique({
      where: { id: createReviewDto.productId, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // 2. Chặn đánh giá trùng lặp: Kiểm tra người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        productId: createReviewDto.productId,
        deletedAt: null,
      },
    });
    if (existingReview) {
      throw new BadRequestException(
        'Bạn đã đánh giá sản phẩm này rồi! Vui lòng chỉnh sửa đánh giá hiện tại nếu muốn thay đổi ý kiến.',
      );
    }

    // 3. Kiểm tra xem người dùng đã thực sự mua và nhận hàng thành công chưa
    const hasBoughtAndCompleted = await this.prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.COMPLETED,
        items: {
          some: {
            productId: createReviewDto.productId,
          },
        },
      },
    });

    if (!hasBoughtAndCompleted) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công (Đơn hàng Hoàn thành)!',
      );
    }

    // 4. Lưu đánh giá vào CSDL
    return this.prisma.review.create({
      data: {
        userId,
        productId: createReviewDto.productId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      where: { deletedAt: null },
      take: 10,
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
        product: { select: { name: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId, deletedAt: null },
      include: {
        product: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, deletedAt: null },
      include: {
        user: {
          select: { fullName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId, deletedAt: null },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa đánh giá này');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: updateReviewDto,
    });
  }

  async remove(userId: string, userRole: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId, deletedAt: null },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (review.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });
  }
}