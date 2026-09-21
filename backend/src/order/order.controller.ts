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

  @Post()
  createOrder(@Request() req: any, @Body() dto: CreateOrderDto) {
    checkRole(req, [Role.BUYER]);
    const userId = req.user.userId;
    return this.orderService.createOrder(userId, dto);
  }
  @Get('history')
  getUserOrders(@Request() req: any) {
    checkRole(req, [Role.BUYER]);

    const userId = req.user.userId;
    return this.orderService.getUserOrders(userId);
  }

  @Get('store')
  getStoreOrders(@Request() req: any) {
    // Chỉ Seller và Admin mới được xem đơn hàng của Store
    checkRole(req, [Role.SELLER, Role.ADMIN]);
    const userId = req.user.userId;
    return this.orderService.getStoreOrders(userId);
  }

  @Get(':id')
  getOrderById(@Request() req: any, @Param('id') orderId: string) {
    checkRole(req, [Role.BUYER]);
    const userId = req.user.userId;
    return this.orderService.getOrderById(orderId, userId);
  }

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
    );
  }

  @Patch(':id/cancel')
  cancelOrder(@Request() req: any, @Param('id') orderId: string) {
    checkRole(req, [Role.BUYER]);
    const userId = req.user.userId;
    return this.orderService.cancelOrder(orderId, userId);
  }
}
