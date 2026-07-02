import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ example: 'order-uuid' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ enum: PaymentProvider, example: PaymentProvider.VNPAY })
  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  provider!: PaymentProvider;
}
