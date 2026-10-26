import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'Dán ID của Sản phẩm muốn mua vào đây' })
  @IsString({ message: 'productId phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'productId không được để trống' })
  productId!: string;

  @ApiProperty({ example: 1, description: 'Số lượng mua' })
  @IsNumber({}, { message: 'quantity phải là số' })
  @Min(1, { message: 'Số lượng mua tối thiểu là 1' })
  quantity!: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, description: 'Số lượng mới muốn cập nhật' })
  @IsNumber({}, { message: 'quantity phải là số' })
  @Min(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' })
  quantity!: number;
}