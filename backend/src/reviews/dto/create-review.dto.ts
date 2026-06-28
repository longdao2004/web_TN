import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 5, description: 'Điểm đánh giá từ 1 đến 5' })
  @IsInt()
  @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
  @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
  @IsNotEmpty()
  rating!: number;

  @ApiPropertyOptional({ example: 'Sản phẩm rất ngon và tươi!' })
  @IsString()
  @IsOptional()
  comment?: string;
}
