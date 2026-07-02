import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'Dán ID của Sản phẩm muốn mua vào đây' })
  productId!: string;

  @ApiProperty({ example: 1, description: 'Số lượng mua' })
  quantity!: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, description: 'Số lượng mới muốn cập nhật' })
  quantity!: number;
}
