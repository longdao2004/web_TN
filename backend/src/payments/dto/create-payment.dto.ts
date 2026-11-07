import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '@prisma/client';

export class CreatePaymentDto {
  // Mã đơn hàng chính (hoặc đơn hàng đầu tiên)
  @ApiProperty({ example: 'order-uuid' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  // Danh sách tất cả mã đơn hàng con khi đặt hàng từ nhiều gian hàng
  @ApiProperty({ example: ['order-uuid-1', 'order-uuid-2'], required: false })
  @IsArray()
  @IsOptional()
  orderIds?: string[];

  // Phương thức thanh toán (COD hoặc VNPAY)
  @ApiProperty({ enum: PaymentProvider, example: PaymentProvider.VNPAY })
  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  provider!: PaymentProvider;
}
