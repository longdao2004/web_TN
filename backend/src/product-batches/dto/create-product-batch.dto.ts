import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductBatchDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: '2023-10-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  harvestDate!: string;

  @ApiProperty({ example: '2024-10-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  expiryDate!: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0, { message: 'Giá không được âm' })
  @IsNotEmpty()
  price!: number;
}
