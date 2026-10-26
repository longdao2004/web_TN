import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/order.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    userId: string,
    dto: CreateOrderDto & { productId?: string; quantity?: number },
  ) {
    // ========================================================
    // TRƯỜNG HỢP 1: MUA NGAY (Trực tiếp từ trang chi tiết sản phẩm)
    // ========================================================
    if (dto.productId && dto.quantity) {
      const { productId, quantity } = dto;

      const product = await this.prisma.product.findUnique({
        where: { id: productId, deletedAt: null },
        include: { batches: { orderBy: { createdAt: 'desc' } } },
      });

      if (!product) throw new NotFoundException('Sản phẩm không tồn tại!');
      if (!product.isActive) {
        throw new BadRequestException('Sản phẩm này hiện đang tạm ngừng kinh doanh!');
      }
      const latestBatch = product.batches[0];
      if (!latestBatch) {
        throw new BadRequestException('Sản phẩm hiện chưa có lô hàng để bán!');
      }
      if (new Date(latestBatch.expiryDate).getTime() <= Date.now()) {
        throw new BadRequestException('Sản phẩm đã hết hạn sử dụng, không thể đặt hàng!');
      }
      if (latestBatch.quantity < quantity) {
        throw new BadRequestException('Sản phẩm không đủ số lượng trong kho!');
      }

      const price = latestBatch.price;
      const totalAmount = price * quantity;

      return this.prisma.$transaction(async (tx) => {
        // 1. Kiểm tra lại tồn kho trong transaction
        const currentBatch = await tx.productBatch.findUnique({
          where: { id: latestBatch.id },
        });
        if (!currentBatch || currentBatch.quantity < quantity) {
          throw new BadRequestException('Sản phẩm vừa hết hàng, vui lòng thử lại!');
        }

        // 2. Tạo đơn hàng (Lưu cả phone và storeId)
        const order = await tx.order.create({
          data: {
            userId,
            storeId: product.storeId,
            totalAmount,
            shippingAddress: dto.shippingAddress,
            phone: dto.phone,
            status: OrderStatus.PENDING,
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

        // 3. Trừ kho nguyên tử (Atomic decrement chống overselling)
        await tx.productBatch.update({
          where: { id: latestBatch.id },
          data: { quantity: { decrement: quantity } },
        });

        // 4. Tăng số lượng đã bán
        await tx.product.update({
          where: { id: product.id },
          data: { soldCount: { increment: quantity } },
        });

        return {
          message: 'Đặt hàng thành công!',
          orderId: order.id,
          totalAmount,
        };
      });
    }

    // ========================================================
    // TRƯỜNG HỢP 2: ĐẶT HÀNG TỪ GIỎ HÀNG (Có hỗ trợ Đa gian hàng)
    // ========================================================
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

    let checkoutItems = cart.items;
    if (dto.cartItemIds && dto.cartItemIds.length > 0) {
      checkoutItems = cart.items.filter((item) =>
        dto.cartItemIds!.includes(item.id),
      );
      if (checkoutItems.length === 0) {
        throw new BadRequestException(
          'Không tìm thấy sản phẩm được chọn trong giỏ hàng!',
        );
      }
    }

    // Nhóm sản phẩm theo từng Cửa hàng (Store) để tách đơn hàng độc lập
    const itemsByStore: Record<string, typeof checkoutItems> = {};
    for (const item of checkoutItems) {
      const sId = item.product.storeId;
      if (!itemsByStore[sId]) itemsByStore[sId] = [];
      itemsByStore[sId].push(item);
    }

    return this.prisma.$transaction(async (tx) => {
      const createdOrders: any[] = [];
      let grandTotal = 0;

      for (const storeId of Object.keys(itemsByStore)) {
        const storeItems = itemsByStore[storeId];
        let storeTotal = 0;

        for (const item of storeItems) {
          const latestBatch = item.product.batches[0];
          if (!latestBatch) {
            throw new BadRequestException(
              `Sản phẩm ${item.product.name} chưa có lô hàng để bán!`,
            );
          }
          if (latestBatch.quantity < item.quantity) {
            throw new BadRequestException(
              `Sản phẩm ${item.product.name} không đủ tồn kho (còn ${latestBatch.quantity})!`,
            );
          }
          storeTotal += latestBatch.price * item.quantity;
        }

        // Tạo đơn hàng riêng cho từng Store
        const order = await tx.order.create({
          data: {
            userId,
            storeId,
            totalAmount: storeTotal,
            shippingAddress: dto.shippingAddress,
            phone: dto.phone,
            status: OrderStatus.PENDING,
            items: {
              create: storeItems.map((item) => {
                const latestBatch = item.product.batches[0];
                return {
                  productId: item.productId,
                  productBatchId: latestBatch.id,
                  quantity: item.quantity,
                  priceAtPurchase: latestBatch.price,
                };
              }),
            },
          },
        });

        // Trừ tồn kho và tăng soldCount nguyên tử cho từng sản phẩm
        for (const item of storeItems) {
          const latestBatch = item.product.batches[0];
          await tx.productBatch.update({
            where: { id: latestBatch.id },
            data: { quantity: { decrement: item.quantity } },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: { soldCount: { increment: item.quantity } },
          });
        }

        createdOrders.push(order);
        grandTotal += storeTotal;
      }

      // Xóa các món đã mua khỏi giỏ hàng
      const boughtItemIds = checkoutItems.map((item) => item.id);
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          id: { in: boughtItemIds },
        },
      });

      return {
        message: 'Đặt hàng thành công!',
        orderId: createdOrders[0]?.id,
        orderIds: createdOrders.map((o) => o.id),
        totalAmount: grandTotal,
      };
    });
  }

  // Truy vấn lịch sử đơn hàng của người dùng
  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { id: true, name: true, logoUrl: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true } },
            batch: true,
          },
        },
      },
    });
  }

  // Lấy danh sách đơn hàng cho người bán (Seller) và Quản trị viên (Admin)
  async getStoreOrders(userId: string, role?: string) {
    if (role === Role.ADMIN) {
      return this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          store: { select: { id: true, name: true, logoUrl: true } },
          user: { select: { fullName: true, phone: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, imageUrl: true } },
              batch: true,
            },
          },
        },
      });
    }

    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!store) {
      throw new NotFoundException('Bạn chưa có cửa hàng!');
    }

    return this.prisma.order.findMany({
      where: {
        OR: [
          { storeId: store.id },
          { items: { some: { product: { storeId: store.id } } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, phone: true } },
        items: {
          where: { product: { storeId: store.id } },
          include: {
            product: { select: { id: true, name: true, imageUrl: true } },
            batch: true,
          },
        },
      },
    });
  }

  // Cập nhật trạng thái đơn hàng (Có phân quyền BOLA/IDOR và tự động cập nhật thanh toán COD)
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    userId: string,
    userRole: Role,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng này!');
    }

    // BẢO MẬT: Nếu là SELLER, chỉ được cập nhật đơn hàng thuộc shop của mình
    if (userRole === Role.SELLER) {
      const store = await this.prisma.store.findUnique({
        where: { ownerId: userId },
      });
      if (!store || order.storeId !== store.id) {
        throw new ForbiddenException(
          'Bạn không có quyền cập nhật trạng thái đơn hàng này!',
        );
      }
    }

    // HỦY ĐƠN: Hoàn tồn kho VÀ giảm soldCount
    if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      return this.prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CANCELLED },
        });

        for (const item of order.items) {
          if (item.productBatchId) {
            await tx.productBatch.update({
              where: { id: item.productBatchId },
              data: { quantity: { increment: item.quantity } },
            });
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { soldCount: { decrement: item.quantity } },
          });
        }
        return updatedOrder;
      });
    }

    // HOÀN THÀNH ĐƠN (COMPLETED): Tự động đánh dấu thanh toán COD thành công
    if (status === OrderStatus.COMPLETED) {
      await this.prisma.payment.updateMany({
        where: { orderId: orderId, isSuccess: false },
        data: { isSuccess: true, paymentDate: new Date() },
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  // Xem chi tiết đơn hàng
  async getOrderById(orderId: string, userId: string, role?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { fullName: true, phone: true } },
        store: { select: { id: true, name: true, logoUrl: true, ownerId: true } },
        items: {
          include: {
            batch: true,
            product: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const isBuyer = order.userId === userId;
    const isSeller = (order.store as any)?.ownerId === userId;
    const isAdmin = role === Role.ADMIN;

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  }

  // Người mua hủy đơn (Chống Race Condition hoàn kho 2 lần)
  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng!');
    if (order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này!');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Kiểm tra trạng thái trực tiếp trong Transaction để chống race condition
      const checkOrder = await tx.order.findUnique({ where: { id: orderId } });
      if (!checkOrder || checkOrder.status !== OrderStatus.PENDING) {
        throw new BadRequestException(
          'Đơn hàng đã được xử lý hoặc đã hủy trước đó, không thể hủy lại!',
        );
      }

      // 2. Chuyển trạng thái sang CANCELLED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });

      // 3. Hoàn tồn kho VÀ giảm soldCount
      for (const item of order.items) {
        if (item.productBatchId) {
          await tx.productBatch.update({
            where: { id: item.productBatchId },
            data: { quantity: { increment: item.quantity } },
          });
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { soldCount: { decrement: item.quantity } },
        });
      }

      return {
        message: 'Hủy đơn hàng thành công và đã hoàn lại số lượng vào kho!',
        order: updatedOrder,
      };
    });
  }
}