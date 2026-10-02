import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Nông sản sạch Sapa' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Chuyên cung cấp rau củ quả tươi từ Sapa' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://link.com/logo.jpg' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  // Thêm đoạn này vào dưới cùng của class CreateStoreDto:
  @ApiPropertyOptional({ example: '0987654321' })
  @IsString()
  @IsOptional()
  phone?: string;
  @ApiPropertyOptional({ example: 'hotro@shop.com' })
  @IsString()
  @IsOptional()
  email?: string;
  @ApiPropertyOptional({ example: 'https://shop.com' })
  @IsString()
  @IsOptional()
  website?: string;
  @ApiPropertyOptional({ example: 'Hà Nội' })
  @IsString()
  @IsOptional()
  address?: string;
}
