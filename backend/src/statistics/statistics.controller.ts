import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { checkRole } from '../auth/auth.helper';
import { Role } from '../auth/role.enum';

@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('overview')
  async getOverview(@Req() req: any) {
    checkRole(req, [Role.SELLER, Role.ADMIN]);
    // truyền request user id vào service để lấy thống kê
    return this.statisticsService.getOverviewStats(req.user.userId);
  }
}



