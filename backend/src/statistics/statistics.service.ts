import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverviewStats(userId: string) {
    // 1. Tìm cửa hàng của User này
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!store) {
      return { totalOrders: 0, totalRevenue: 0, totalProducts: 0 };
    }

    // 2. Lấy Tổng số Đơn hàng (Chỉ đếm các đơn có chứa sản phẩm của Cửa hàng này)
    // Nghiệp vụ: Thường đếm các đơn hàng thực tế phát sinh, ta sẽ loại trừ các đơn đã bị Hủy (CANCELLED).
    const totalOrders = await this.prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              storeId: store.id,
            },
          },
        },
        status: { not: 'CANCELLED' }, // Không đếm những đơn đã bị hủy
      },
    });

    // 3. Lấy Tổng số Sản phẩm của Cửa hàng
    // Nghiệp vụ: Đếm những sản phẩm đang bán, chưa bị xóa mềm (deletedAt: null).
    const totalProducts = await this.prisma.product.count({
      where: { 
        storeId: store.id, 
        deletedAt: null 
      },
    });

    // 4. Tính Doanh thu Thực tế (Net Revenue)
    // Nghiệp vụ: Chỉ ghi nhận doanh thu khi đơn hàng đã giao thành công (COMPLETED).
    // Các trạng thái PENDING, PACKING, SHIPPING (đang chờ/giao) sẽ không được cộng vào tổng tiền.
    // Vì một Đơn hàng (Order) có thể chứa nhiều sản phẩm từ các shop khác nhau, 
    // ta phải tính doanh thu bằng cách gom tổng tiền các món hàng (OrderItem) thuộc về shop này.
    const storeOrderItems = await this.prisma.orderItem.findMany({
      where: {
        product: {
          storeId: store.id, // Hàng của shop này
        },
        order: {
          status: 'COMPLETED', // Chỉ tính doanh thu của những đơn đã giao và thanh toán thành công
        },
      },
    });

    // Cộng dồn Doanh thu: (Số lượng * Giá lúc mua)
    // Logic: Nếu khách mua 2 món giá 100k, thì doanh thu của sản phẩm đó trong đơn là 2 * 100k = 200k.
    const totalRevenue = storeOrderItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0,
    );

    return {
      totalOrders,
      totalProducts,
      totalRevenue,
    };
  }
}
