import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders (Đơn hàng)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Request() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.createOrder(userId, dto);
  }
}