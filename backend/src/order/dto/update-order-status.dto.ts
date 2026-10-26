import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PACKING,
    description: 'Trạng thái đơn: PENDING, PACKING, SHIPPING, COMPLETED, CANCELLED',
  })
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ!' })
  status!: OrderStatus;
}