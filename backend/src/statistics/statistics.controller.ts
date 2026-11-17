import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { checkRole } from '../auth/auth.helper';
import { Role } from '../auth/role.enum';

@ApiTags('statistics')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  // 1. Thống kê dành cho Người bán (Seller)
  @UseGuards(AuthGuard('jwt'))
  @Get('overview')
  @ApiOperation({ summary: 'Thống kê tổng quan cho người bán' })
  @ApiQuery({ name: 'period', required: false, description: 'all | 7d | 30d | month' })
  async getOverview(@Req() req: any, @Query('period') period?: string) {
    checkRole(req, [Role.SELLER, Role.ADMIN]);
    return this.statisticsService.getOverviewStats(req.user.userId, period || 'all');
  }

  // 2. Thống kê toàn sàn dành cho Quản trị viên (Admin)
  @UseGuards(AuthGuard('jwt'))
  @Get('admin/overview')
  @ApiOperation({ summary: 'Thống kê toàn sàn dành cho Quản trị viên' })
  async getAdminOverview(@Req() req: any) {
    checkRole(req, [Role.ADMIN]);
    return this.statisticsService.getAdminOverviewStats();
  }
}