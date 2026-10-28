import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // 1. THỐNG KÊ CHO NGƯỜI BÁN (SELLER)
  // ==========================================
  async getOverviewStats(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!store) {
      return {
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        expiringBatchesCount: 0,
        orderStatusFunnel: {
          pending: 0,
          packing: 0,
          shipping: 0,
          completed: 0,
          cancelled: 0,
        },
        alerts: {
          expiringSoon: [],
          lowStock: [],
        },
        revenueChart7Days: [],
      };
    }

    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { storeId: store.id },
          { items: { some: { product: { storeId: store.id } } } },
        ],
      },
      include: {
        items: {
          where: { product: { storeId: store.id } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const orderStatusFunnel = {
      pending: orders.filter((o) => o.status === 'PENDING').length,
      packing: orders.filter((o) => o.status === 'PACKING').length,
      shipping: orders.filter((o) => o.status === 'SHIPPING').length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    };

    const totalOrders = orders.filter((o) => o.status !== 'CANCELLED').length;
    const pendingOrders = orderStatusFunnel.pending;

    let totalRevenue = 0;
    orders
      .filter((o) => o.status === 'COMPLETED')
      .forEach((o) => {
        o.items.forEach((item) => {
          totalRevenue += item.quantity * item.priceAtPurchase;
        });
      });

    const totalProducts = await this.prisma.product.count({
      where: { storeId: store.id, deletedAt: null },
    });

    const revenueChart7Days: any[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayName = dayNames[d.getDay()];

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return o.status === 'COMPLETED' && orderDate >= d && orderDate < nextD;
      });

      let dayRevenue = 0;
      dayOrders.forEach((o) => {
        o.items.forEach((item) => {
          dayRevenue += item.quantity * item.priceAtPurchase;
        });
      });

      revenueChart7Days.push({
        date: dateStr,
        dayName: dayName,
        fullDate: d.toISOString().split('T')[0],
        revenue: dayRevenue,
        ordersCount: dayOrders.length,
      });
    }

    const prodsWithBatches = await this.prisma.product.findMany({
      where: { storeId: store.id, deletedAt: null },
      select: {
        id: true,
        name: true,
        unit: true,
        batches: {
          orderBy: { harvestDate: 'desc' },
        },
      },
    });

    const today = new Date();
    const expiringSoon: any[] = [];
    const lowStock: any[] = [];

    for (const prod of prodsWithBatches) {
      for (const b of prod.batches) {
        const exp = new Date(b.expiryDate);
        const daysLeft = Math.ceil(
          (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (b.quantity > 0 && daysLeft >= 0 && daysLeft <= 7) {
          expiringSoon.push({
            batchId: b.id,
            productName: prod.name,
            quantity: b.quantity,
            unit: prod.unit || 'kg',
            expiryDate: b.expiryDate,
            daysLeft: daysLeft,
          });
        }

        if (b.quantity > 0 && b.quantity <= 10) {
          lowStock.push({
            batchId: b.id,
            productName: prod.name,
            quantity: b.quantity,
            unit: prod.unit || 'kg',
            expiryDate: b.expiryDate,
          });
        }
      }
    }

    expiringSoon.sort((a, b) => a.daysLeft - b.daysLeft);
    lowStock.sort((a, b) => a.quantity - b.quantity);

    return {
      totalOrders,
      totalProducts,
      totalRevenue,
      pendingOrders,
      expiringBatchesCount: expiringSoon.length,
      orderStatusFunnel,
      alerts: {
        expiringSoon: expiringSoon.slice(0, 5),
        lowStock: lowStock.slice(0, 5),
      },
      revenueChart7Days,
    };
  }

  // ==========================================
  // 2. THỐNG KÊ TOÀN SÀN CHO ADMIN
  // ==========================================
  async getAdminOverviewStats() {
    // 1. Tổng số Người dùng theo vai trò
    const totalUsers = await this.prisma.user.count({
      where: { deletedAt: null },
    });

    const userRoles = {
      customers: await this.prisma.user.count({
        where: { role: 'BUYER', deletedAt: null },
      }),
      sellers: await this.prisma.user.count({
        where: { role: 'SELLER', deletedAt: null },
      }),
      admins: await this.prisma.user.count({
        where: { role: 'ADMIN', deletedAt: null },
      }),
    };

    // 2. Tổng số Cửa hàng & Sản phẩm đang hoạt động
    const totalStores = await this.prisma.store.count({
      where: { deletedAt: null },
    });

    const totalProducts = await this.prisma.product.count({
      where: { deletedAt: null },
    });

    // 3. Toàn bộ Đơn hàng trong hệ thống
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true } },
        store: { select: { name: true } },
      },
    });

    const totalOrders = orders.filter((o) => o.status !== 'CANCELLED').length;

    const orderStatusFunnel = {
      pending: orders.filter((o) => o.status === 'PENDING').length,
      packing: orders.filter((o) => o.status === 'PACKING').length,
      shipping: orders.filter((o) => o.status === 'SHIPPING').length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    };

    // Doanh thu thực tế toàn sàn (các đơn COMPLETED)
    let totalRevenue = 0;
    orders
      .filter((o) => o.status === 'COMPLETED')
      .forEach((o) => {
        totalRevenue += o.totalAmount;
      });

    // 4. Biểu đồ doanh thu toàn sàn 7 ngày gần nhất
    const revenueChart7Days: any[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayName = dayNames[d.getDay()];

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return o.status === 'COMPLETED' && orderDate >= d && orderDate < nextD;
      });

      let dayRevenue = 0;
      dayOrders.forEach((o) => {
        dayRevenue += o.totalAmount;
      });

      revenueChart7Days.push({
        date: dateStr,
        dayName: dayName,
        fullDate: d.toISOString().split('T')[0],
        revenue: dayRevenue,
        ordersCount: dayOrders.length,
      });
    }

    // 5. Lấy 5 đơn hàng mới nhất toàn sàn
    const recentOrders = orders.slice(0, 5).map((o) => ({
      id: o.id,
      customerName: o.user?.fullName || 'Khách vãng lai',
      storeName: o.store?.name || 'Cửa hàng nông sản',
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
    }));

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalStores,
      totalProducts,
      userRoles,
      orderStatusFunnel,
      revenueChart7Days,
      recentOrders,
    };
  }
}