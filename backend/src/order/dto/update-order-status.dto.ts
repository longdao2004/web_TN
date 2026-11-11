import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PACKING,
    description: 'Trạng thái đơn: PENDING, PACKING, SHIPPING, COMPLETED, CANCELLED',
  })
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ!' })
  status!: OrderStatus;

  // Cho phép gửi kèm lý do hủy đơn khi Admin/Seller chuyển trạng thái sang CANCELLED
  @ApiPropertyOptional({ description: 'Lý do hủy đơn hàng' })
  @IsOptional()
  @IsString()
  cancelReason?: string;
}