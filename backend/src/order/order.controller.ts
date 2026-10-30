import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { checkRole } from '../auth/auth.helper';
import { Role } from '../auth/role.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders (Đơn hàng)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 1. Tạo đơn hàng mới: Cho phép Khách mua (BUYER) và Người bán (SELLER) được mua hàng
  @Post()
  createOrder(@Request() req: any, @Body() dto: CreateOrderDto) {
    checkRole(req, [Role.BUYER, Role.SELLER]);
    const userId = req.user.userId;
    return this.orderService.createOrder(userId, dto);
  }

  // 2. Xem lịch sử đơn mua cá nhân: Cả BUYER và SELLER đều có đơn mua cá nhân
  @Get('history')
  getUserOrders(@Request() req: any) {
    checkRole(req, [Role.BUYER, Role.SELLER]);
    const userId = req.user.userId;
    return this.orderService.getUserOrders(userId);
  }

  // 3. Lấy đơn hàng của Gian hàng: Dành cho SELLER (xem đơn shop mình) và ADMIN (giám sát toàn sàn)
  @Get('store')
  getStoreOrders(@Request() req: any) {
    checkRole(req, [Role.SELLER, Role.ADMIN]);
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.orderService.getStoreOrders(userId, userRole);
  }

  // 4. Xem chi tiết một đơn hàng bất kỳ
  @Get(':id')
  getOrderById(@Request() req: any, @Param('id') orderId: string) {
    checkRole(req, [Role.BUYER, Role.SELLER, Role.ADMIN]);
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.orderService.getOrderById(orderId, userId, userRole);
  }

  // 5. Cập nhật trạng thái đơn (Dành cho Người bán xử lý đơn & Admin can thiệp)
  @Patch(':id/status')
  updateOrderStatus(
    @Request() req: any,
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    checkRole(req, [Role.SELLER, Role.ADMIN]);
    return this.orderService.updateOrderStatus(
      orderId,
      updateOrderStatusDto.status,
      req.user.userId,
      req.user.role,
    );
  }

  // 6. Hủy đơn hàng cá nhân: Cho phép BUYER và SELLER hủy đơn của chính mình khi chưa giao
  @Patch(':id/cancel')
  cancelOrder(@Request() req: any, @Param('id') orderId: string) {
    checkRole(req, [Role.BUYER, Role.SELLER]);
    const userId = req.user.userId;
    return this.orderService.cancelOrder(orderId, userId);
  }
}