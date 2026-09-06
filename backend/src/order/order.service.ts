import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                batches: { orderBy: { createdAt: 'desc' } },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng của bạn đang trống!');
    }

    let totalAmount = 0;
    cart.items.forEach((item) => {
      const latestBatch = item.product.batches[0];
      const price = latestBatch ? latestBatch.price : 0;
      totalAmount += price * item.quantity;
    });

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          shippingAddress: dto.shippingAddress,

          items: {
            create: cart.items.map((item) => {
              const latestBatch = item.product.batches[0];
              const price = latestBatch ? latestBatch.price : 0;

              return {
                productId: item.productId,
                productBatchId: latestBatch?.id,
                quantity: item.quantity,
                priceAtPurchase: price,
              };
            }),
          },
        },
      });

      for (const item of cart.items) {
        const latestBatch = item.product.batches[0];
        if (latestBatch) {
          if (latestBatch.quantity < item.quantity) {
            throw new BadRequestException(
              `Sản phẩm ${item.product.name} không đủ số lượng trong kho!`,
            );
          }
          await tx.productBatch.update({
            where: { id: latestBatch.id },
            data: { quantity: latestBatch.quantity - item.quantity },
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return {
        message: 'Đặt hàng thành công!',
        orderId: order.id,
        totalAmount: totalAmount,
      };
    });
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Bạn chưa có đơn hàng nào!');
    }

    return orders;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng này!');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        // Lấy thêm thông tin người đặt hàng (Tên, Số điện thoại)
        user: {
          select: {
            fullName: true,
            phone: true,
          }
        },
        items: {
          include: {
            batch: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.userId !== userId) {
      throw new NotFoundException('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  }
}
