import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // 1. THỐNG KÊ CHO NGƯỜI BÁN (SELLER)
  // ==========================================
  async getOverviewStats(userId: string, period = 'all') {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!store) {
      return {
        storeName: 'Cửa hàng nông sản',
        period: 'all',
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        actionRequiredBatchesCount: 0,
        expiringBatchesCount: 0,
        expiredBatchesCount: 0,
        orderStatusFunnel: {
          pending: 0,
          packing: 0,
          shipping: 0,
          completed: 0,
          cancelled: 0,
        },
        alerts: {
          expired: [],
          expiringSoon: [],
          lowStock: [],
        },
        revenueChart7Days: [],
        topProducts: [],
        categoryBreakdown: [],
        cashFlow: {
          completedRevenue: 0,
          pendingRevenue: 0,
          cancelledRevenue: 0,
        },
        paymentSplit: {
          codOrders: 0,
          codRevenue: 0,
          onlineOrders: 0,
          onlineRevenue: 0,
        },
        slowMovingProducts: [],
        customerMetrics: {
          totalCustomers: 0,
          repeatCustomers: 0,
          repeatRate: 0,
          averageOrderValue: 0,
        },
        topCustomers: [],
        reviewMetrics: {
          averageRating: 0,
          totalReviews: 0,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          recentReviews: [],
        },
        recentOrdersForExport: [],
      };
    }

    // 1. Lấy tất cả đơn hàng liên quan đến Store (Bao gồm chi tiết món, khách hàng, thanh toán)
    const allOrders = await this.prisma.order.findMany({
      where: {
        OR: [
          { storeId: store.id },
          { items: { some: { product: { storeId: store.id } } } },
        ],
      },
      include: {
        items: {
          where: { product: { storeId: store.id } },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                unit: true,
                categoryId: true,
                category: { select: { id: true, name: true } },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Xác định mốc thời gian lọc nếu có (Mặc định 'all' là không lọc ngày)
    const now = new Date();
    let startDate: Date | null = null;
    if (period === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredOrders = startDate
      ? allOrders.filter((o) => new Date(o.createdAt) >= startDate)
      : allOrders;

    // 3. Tiến độ đơn hàng & KPI Cơ bản
    const orderStatusFunnel = {
      pending: filteredOrders.filter((o) => o.status === 'PENDING').length,
      packing: filteredOrders.filter((o) => o.status === 'PACKING').length,
      shipping: filteredOrders.filter((o) => o.status === 'SHIPPING').length,
      completed: filteredOrders.filter((o) => o.status === 'COMPLETED').length,
      cancelled: filteredOrders.filter((o) => o.status === 'CANCELLED').length,
    };

    const totalOrders = filteredOrders.filter((o) => o.status !== 'CANCELLED').length;
    const pendingOrders = orderStatusFunnel.pending;

    let totalRevenue = 0;
    filteredOrders
      .filter((o) => o.status === 'COMPLETED')
      .forEach((o) => {
        o.items.forEach((item) => {
          totalRevenue += item.quantity * item.priceAtPurchase;
        });
      });

    const totalProducts = await this.prisma.product.count({
      where: { storeId: store.id, deletedAt: null },
    });

    // 4. Biểu đồ Doanh thu (7 ngày gần nhất)
    const revenueChart7Days: any[] = [];
    const chartDays = period === '30d' ? 30 : 7;
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayName = dayNames[d.getDay()];

      const dayOrders = allOrders.filter((o) => {
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

    // 5. Cảnh báo kho hàng (Lô hết hạn, cận date, tồn thấp)
    const prodsWithBatches = await this.prisma.product.findMany({
      where: { storeId: store.id, deletedAt: null },
      select: {
        id: true,
        name: true,
        unit: true,
        imageUrl: true,
        batches: {
          orderBy: { harvestDate: 'desc' },
        },
      },
    });

    const today = new Date();
    const expired: any[] = [];
    const expiringSoon: any[] = [];
    const lowStock: any[] = [];
    const productStockMap = new Map<string, number>();

    for (const prod of prodsWithBatches) {
      let currentProdStock = 0;
      for (const b of prod.batches) {
        currentProdStock += b.quantity;
        const exp = new Date(b.expiryDate);
        const diffMs = exp.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (b.quantity > 0 && exp.getTime() < today.getTime()) {
          expired.push({
            batchId: b.id,
            productName: prod.name,
            quantity: b.quantity,
            unit: prod.unit || 'kg',
            expiryDate: b.expiryDate,
            daysLeft: daysLeft,
          });
        } else if (b.quantity > 0 && daysLeft >= 0 && daysLeft <= 7) {
          expiringSoon.push({
            batchId: b.id,
            productName: prod.name,
            quantity: b.quantity,
            unit: prod.unit || 'kg',
            expiryDate: b.expiryDate,
            daysLeft: daysLeft,
          });
        } else if (b.quantity > 0 && exp.getTime() >= today.getTime() && b.quantity <= 10) {
          lowStock.push({
            batchId: b.id,
            productName: prod.name,
            quantity: b.quantity,
            unit: prod.unit || 'kg',
            expiryDate: b.expiryDate,
          });
        }
      }
      productStockMap.set(prod.id, currentProdStock);
    }

    expiringSoon.sort((a, b) => a.daysLeft - b.daysLeft);
    lowStock.sort((a, b) => a.quantity - b.quantity);

    // 6. PHÂN TÍCH SẢN PHẨM & DOANH THU (TAB 2)
    const prodStatsMap = new Map<string, { id: string; name: string; imageUrl: string | null; unit: string; totalSold: number; revenue: number }>();
    const categoryRevenueMap = new Map<string, number>();

    let completedRevenue = 0;
    let pendingRevenue = 0;
    let cancelledRevenue = 0;

    let codOrders = 0;
    let codRevenue = 0;
    let onlineOrders = 0;
    let onlineRevenue = 0;

    const customerSpendMap = new Map<string, { userId: string; fullName: string; phone: string | null; email: string; ordersCount: number; totalSpent: number }>();

    filteredOrders.forEach((o) => {
      let orderShopAmount = 0;
      o.items.forEach((item) => {
        const itemVal = item.quantity * item.priceAtPurchase;
        orderShopAmount += itemVal;

        if (o.status === 'COMPLETED') {
          // Top sản phẩm
          const pId = item.productId;
          const curr = prodStatsMap.get(pId) || {
            id: pId,
            name: item.product?.name || 'Nông sản',
            imageUrl: item.product?.imageUrl || null,
            unit: item.product?.unit || 'kg',
            totalSold: 0,
            revenue: 0,
          };
          curr.totalSold += item.quantity;
          curr.revenue += itemVal;
          prodStatsMap.set(pId, curr);

          // Cơ cấu danh mục
          const catName = item.product?.category?.name || 'Khác';
          categoryRevenueMap.set(catName, (categoryRevenueMap.get(catName) || 0) + itemVal);
        }
      });

      // Dòng tiền
      if (o.status === 'COMPLETED') {
        completedRevenue += orderShopAmount;

        // Phân loại thanh toán
        const isOnline = o.payment?.provider === 'VNPAY' || o.payment?.provider === 'MOMO';
        if (isOnline) {
          onlineOrders++;
          onlineRevenue += orderShopAmount;
        } else {
          codOrders++;
          codRevenue += orderShopAmount;
        }

        // Khách hàng thân thiết
        if (o.user) {
          const uId = o.user.id;
          const cCurr = customerSpendMap.get(uId) || {
            userId: uId,
            fullName: o.user.fullName,
            phone: o.user.phone,
            email: o.user.email,
            ordersCount: 0,
            totalSpent: 0,
          };
          cCurr.ordersCount += 1;
          cCurr.totalSpent += orderShopAmount;
          customerSpendMap.set(uId, cCurr);
        }
      } else if (o.status === 'CANCELLED') {
        cancelledRevenue += orderShopAmount;
      } else {
        pendingRevenue += orderShopAmount;
      }
    });

    // Sắp xếp top 5 sản phẩm bán chạy nhất
    const topProducts = Array.from(prodStatsMap.values())
      .map((p) => ({
        ...p,
        stock: productStockMap.get(p.id) || 0,
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // Cơ cấu danh mục
    const categoryBreakdown = Array.from(categoryRevenueMap.entries())
      .map(([name, revenue]) => ({
        name,
        revenue,
        percentage: completedRevenue > 0 ? Math.round((revenue / completedRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Cảnh báo hàng bán chậm (tồn > 0 nhưng bán = 0)
    const slowMovingProducts = prodsWithBatches
      .filter((p) => {
        const stock = productStockMap.get(p.id) || 0;
        const sold = prodStatsMap.get(p.id)?.totalSold || 0;
        return stock > 0 && sold === 0;
      })
      .map((p) => ({
        id: p.id,
        name: p.name,
        unit: p.unit || 'kg',
        stock: productStockMap.get(p.id) || 0,
      }))
      .slice(0, 5);

    // 7. PHÂN TÍCH KHÁCH HÀNG & ĐÁNH GIÁ (TAB 3)
    const allCustomers = Array.from(customerSpendMap.values());
    const totalCustomers = allCustomers.length;
    const repeatCustomers = allCustomers.filter((c) => c.ordersCount >= 2).length;
    const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;
    const completedOrdersCount = orderStatusFunnel.completed;
    const averageOrderValue = completedOrdersCount > 0 ? Math.round(completedRevenue / completedOrdersCount) : 0;

    const topCustomers = allCustomers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Đánh giá phản hồi
    const reviews = await this.prisma.review.findMany({
      where: {
        product: { storeId: store.id, deletedAt: null },
        deletedAt: null,
      },
      include: {
        user: { select: { fullName: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = reviews.length;
    let sumRating = 0;
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      sumRating += r.rating;
      if (r.rating >= 1 && r.rating <= 5) {
        ratingBreakdown[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 5.0;
    const recentReviews = reviews.slice(0, 5).map((r) => ({
      id: r.id,
      customerName: r.user?.fullName || 'Khách hàng',
      productName: r.product?.name || 'Nông sản',
      rating: r.rating,
      comment: r.comment || 'Không có nhận xét',
      createdAt: r.createdAt,
    }));

    // Đơn hàng xuất CSV
    const recentOrdersForExport = filteredOrders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      customerName: o.user?.fullName || 'Khách lẻ',
      phone: o.user?.phone || o.phone || 'Chưa cập nhật',
      totalAmount: o.items.reduce((s, it) => s + it.quantity * it.priceAtPurchase, 0),
      paymentMethod: o.payment?.provider || 'COD',
      status: o.status,
      itemsCount: o.items.length,
    }));

    return {
      storeName: store.name,
      period,
      totalOrders,
      totalProducts,
      totalRevenue,
      pendingOrders,
      actionRequiredBatchesCount: expired.length + expiringSoon.length,
      expiringBatchesCount: expiringSoon.length,
      expiredBatchesCount: expired.length,
      orderStatusFunnel,
      alerts: {
        expired: expired.slice(0, 5),
        expiringSoon: expiringSoon.slice(0, 5),
        lowStock: lowStock.slice(0, 5),
      },
      revenueChart7Days,
      topProducts,
      categoryBreakdown,
      cashFlow: {
        completedRevenue,
        pendingRevenue,
        cancelledRevenue,
      },
      paymentSplit: {
        codOrders,
        codRevenue,
        onlineOrders,
        onlineRevenue,
      },
      slowMovingProducts,
      customerMetrics: {
        totalCustomers,
        repeatCustomers,
        repeatRate,
        averageOrderValue,
      },
      topCustomers,
      reviewMetrics: {
        averageRating,
        totalReviews,
        ratingBreakdown,
        recentReviews,
      },
      recentOrdersForExport,
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

        // 2. Tổng số Cửa hàng ĐÃ PHÊ DUYỆT (Chủ shop có quyền SELLER)
    const totalStores = await this.prisma.store.count({
      where: { deletedAt: null, owner: { role: 'SELLER' } },
    });

    // 2b. Danh sách các Gian hàng CHỜ PHÊ DUYỆT (Chủ shop đang mang quyền BUYER)
    const pendingStores = await this.prisma.store.findMany({
      where: { deletedAt: null, owner: { role: 'BUYER' } },
      include: {
        owner: { select: { id: true, fullName: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
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
      pendingStores,
    };
  }
}