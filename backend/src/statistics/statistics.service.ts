import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverviewStats() {
    const totalOrders = await this.prisma.order.count();

    const totalProducts = await this.prisma.product.count();

    const aggregateResult = await this.prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          not: 'CANCELLED',
        },
      },
    });

    const totalRevenue = aggregateResult._sum.totalAmount ?? 0;

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
    };
  }
}
