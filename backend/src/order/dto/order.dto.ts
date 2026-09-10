import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Đường Cầu Giấy, Hà Nội',
    description: 'Địa chỉ giao hàng',
  })
  shippingAddress!: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Số điện thoại nhận hàng',
  })
  phone!: string;

  @ApiProperty({ required: false, description: 'ID sản phẩm nếu Mua Ngay' })
  productId?: string;

  @ApiProperty({ required: false, description: 'Số lượng nếu Mua Ngay' })
  quantity?: number;
}