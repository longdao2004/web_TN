import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Đường Cầu Giấy, Hà Nội',
    description: 'Địa chỉ giao hàng',
  })
  @IsString({ message: 'Địa chỉ giao hàng phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  shippingAddress!: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Số điện thoại nhận hàng',
  })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Số điện thoại nhận hàng không được để trống' })
  phone!: string;

  @ApiProperty({ required: false, description: 'ID sản phẩm nếu Mua Ngay' })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({ required: false, description: 'Số lượng nếu Mua Ngay' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    required: false,
    description: 'Danh sách ID các mục trong giỏ hàng được chọn để thanh toán',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cartItemIds?: string[];
    @ApiProperty({
    required: false,
    example: 25000,
    description: 'Phí vận chuyển tổng của đơn hàng',
  })
  @IsNumber({}, { message: 'Phí vận chuyển phải là một số' })
  @Min(0, { message: 'Phí vận chuyển không được âm' })
  @IsOptional()
  shippingFee?: number;

  // 🟢 Phí vận chuyển chi tiết cho từng gian hàng (Key là storeId, Value là số tiền ship)
  @ApiProperty({
    required: false,
    description: 'Phí vận chuyển riêng biệt cho từng gian hàng',
  })
  @IsOptional()
  storeShippingFees?: Record<string, number>;
}