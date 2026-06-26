import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // 1. Lấy giỏ hàng hiện tại của khách
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { 
          include: { 
            product: { 
              include: { 
                batches: { orderBy: { createdAt: 'desc' } } 
              } 
            } 
          } 
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng của bạn đang trống!');
    }

    // 2. Tính toán tổng tiền trước
    let totalAmount = 0;
    cart.items.forEach(item => {
      const latestBatch = item.product.batches[0];
      const price = latestBatch ? latestBatch.price : 0;
      totalAmount += price * item.quantity;
    });

    // 3. SỬ DỤNG TRANSACTION
    return this.prisma.$transaction(async (tx) => {
      // 3a. Tạo Đơn hàng và các Chi tiết đơn hàng
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          shippingAddress: dto.shippingAddress,

          items: {
            create: cart.items.map(item => {
              const latestBatch = item.product.batches[0];
              const price = latestBatch ? latestBatch.price : 0;
              
              return {
                productId: item.productId,
                productBatchId: latestBatch?.id,
                quantity: item.quantity,
                priceAtPurchase: price
              };
            })
          }
        }
      });

      // 3b. Trừ số lượng tồn kho trong Lô hàng (Batch)
      for (const item of cart.items) {
        const latestBatch = item.product.batches[0];
        if (latestBatch) {
          if (latestBatch.quantity < item.quantity) {
            throw new BadRequestException(`Sản phẩm ${item.product.name} không đủ số lượng trong kho!`);
          }
          await tx.productBatch.update({
            where: { id: latestBatch.id },
            data: { quantity: latestBatch.quantity - item.quantity }
          });
        }
      }

      // 3c. Làm sạch giỏ hàng sau khi chốt đơn
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { 
        message: 'Đặt hàng thành công!', 
        orderId: order.id,
        totalAmount: totalAmount 
      };
    });
  }

  /**
   * LẤY LỊCH SỬ ĐƠN HÀNG CỦA KHÁCH HÀNG
   */
  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Sắp xếp: Đơn mới nhất lên đầu
      include: {
        items: {
          include: {
            // Chỉ lấy tên và ảnh của sản phẩm cho nhẹ dữ liệu trả về
            product: {
              select: { 
                name: true, 
                imageUrl: true 
              }
            }
          }
        }
      }
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Bạn chưa có đơn hàng nào!');
    }

    return orders;
  }

  /**
   * CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Dành cho SELLER hoặc ADMIN)
   */
  async updateOrderStatus(orderId: string, status: string) {
    // 1. Kiểm tra xem đơn hàng có tồn tại không
    const order = await this.prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng này!');
    }

    // 2. Cập nhật trạng thái
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus }
    });
  }
}