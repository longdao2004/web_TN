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

  async createOrder(
    userId: string,
    dto: CreateOrderDto & { productId?: string; quantity?: number },
  ) {
    // Trường hợp 1: MUA NGAY (Trực tiếp từ trang chi tiết sản phẩm, không động vào giỏ hàng)
    if (dto.productId && dto.quantity) {
      const { productId, quantity } = dto; // Trích xuất hằng số để TypeScript đảm bảo kiểu number

      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { batches: { orderBy: { createdAt: 'desc' } } },
      });

      if (!product) throw new NotFoundException('Sản phẩm không tồn tại!');
      const latestBatch = product.batches[0];
      if (!latestBatch || latestBatch.quantity < quantity) {
        throw new BadRequestException('Sản phẩm không đủ số lượng trong kho!');
      }

      const price = latestBatch.price;
      const totalAmount = price * quantity;

      return this.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            userId,
            totalAmount,
            status: 'PENDING',
            shippingAddress: dto.shippingAddress,
            items: {
              create: [
                {
                  productId: product.id,
                  productBatchId: latestBatch.id,
                  quantity: quantity,
                  priceAtPurchase: price,
                },
              ],
            },
          },
        });

        // Trừ tồn kho
        await tx.productBatch.update({
          where: { id: latestBatch.id },
          data: { quantity: latestBatch.quantity - quantity },
        });

        return {
          message: 'Đặt hàng thành công!',
          orderId: order.id,
          totalAmount,
        };
      });
    }

    // Trường hợp 2: ĐẶT HÀNG TỪ GIỎ HÀNG (Giữ nguyên như cũ)
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

    // Kiểm tra nếu giỏ hàng trống
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
        // Kiểm tra tồn kho trước khi trừ
        if (latestBatch) {
          if (latestBatch.quantity < item.quantity) {
            throw new BadRequestException(
              `Sản phẩm ${item.product.name} không đủ số lượng trong kho!`,
            );
          }
          await tx.productBatch.update({
            where: { id: latestBatch.id },
            data: { quantity: latestBatch.quantity - item.quantity }, // trừ tồn kho
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return {
        message: 'Đặt hàng thành công!',
        orderId: order.id,
        totalAmount,
      };
    });
  }

  //Truy vấn lịch sử đơn hàng của người dùng
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

    async getStoreOrders(userId: string) {
    // 1. Lấy thông tin cửa hàng của user hiện tại
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!store) {
      throw new NotFoundException('Bạn chưa có cửa hàng!');
    }

    // 2. Lấy các đơn hàng chứa sản phẩm thuộc về cửa hàng này
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              storeId: store.id,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { fullName: true, phone: true } // Lấy thông tin người mua
        },
        items: {
          where: { product: { storeId: store.id } }, // Chỉ lấy đúng các món của store này
          include: {
            product: { select: { name: true, imageUrl: true } },
            batch: true,
          },
        },
      },
    });

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
          },
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
                    store: {
                      select: {
                        id: true,
                        name: true,
                        logoUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.userId !== userId) {
      throw new NotFoundException('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  }

  // Hủy đơn hàng và tự động hoàn lại số lượng vào kho lô hàng
  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng!');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Bạn không có quyền hủy đơn hàng này!');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        'Đơn hàng đã được người bán xử lý hoặc đã hoàn tất, không thể hủy!',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Chuyển trạng thái sang CANCELLED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      // 2. Hoàn lại số lượng tồn kho cho các lô hàng (batch)
      for (const item of order.items) {
        await tx.productBatch.update({
          where: { id: item.productBatchId },
          data: {
            quantity: { increment: item.quantity },
          },
        });
      }

      return {
        message: 'Hủy đơn hàng thành công và đã hoàn lại số lượng vào kho!',
        order: updatedOrder,
      };
    });
  }
}
