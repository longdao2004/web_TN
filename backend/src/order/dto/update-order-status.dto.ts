import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    example: 'CONFIRMED', 
    description: 'Trạng thái đơn: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED' 
  })
  status!: string;
}