import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  // --- Thông tin chung của nông sản ---
  @ApiProperty({ example: 'Cà chua hữu cơ Mộc Châu' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  name!: string;

  @ApiPropertyOptional({ example: 'Cà chua hái tại vườn, tươi ngon' })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://link.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Mộc Châu, Sơn La' })
  @IsOptional()
  @IsString({ message: 'Xuất xứ phải là chuỗi ký tự' })
  origin?: string; // Xuất xứ (VD: Đà Lạt)

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString({ message: 'Đơn vị tính phải là chuỗi ký tự' })
  unit?: string; // Đơn vị tính (VD: kg, bó, hộp)

  // --- Khóa ngoại ---
  @ApiProperty({ example: 'category-uuid' })
  @IsNotEmpty({ message: 'Vui lòng chọn danh mục cho sản phẩm' })
  @IsString()
  categoryId!: string;

  @ApiProperty({ example: 'store-uuid' })
  @IsNotEmpty({ message: 'Vui lòng chọn cửa hàng' })
  @IsString()
  storeId!: string;

  // --- Thông tin Lô hàng đầu tiên (Bắt buộc) ---
  @ApiProperty({ example: '2026-06-25T00:00:00Z' })
  @IsNotEmpty({ message: 'Ngày thu hoạch không được để trống' })
  @Type(() => Date)
  @IsDate({ message: 'Ngày thu hoạch không đúng định dạng ngày tháng' })
  harvestDate!: Date;

  @ApiProperty({ example: '2026-07-15T00:00:00Z' })
  @IsNotEmpty({ message: 'Hạn sử dụng không được để trống' })
  @Type(() => Date)
  @IsDate({ message: 'Hạn sử dụng không đúng định dạng ngày tháng' })
  expiryDate!: Date;

  @ApiProperty({ example: 50 })
  @IsNotEmpty({ message: 'Số lượng nhập kho không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số lượng nhập kho phải là số' })
  @Min(1, { message: 'Số lượng nhập kho tối thiểu là 1' })
  quantity!: number;

  @ApiProperty({ example: 35000 })
  @IsNotEmpty({ message: 'Giá bán không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Giá bán phải là số' })
  @Min(0, { message: 'Giá bán không được là số âm' })
  price!: number;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Giá gốc phải là số' })
  @Min(0, { message: 'Giá gốc không được là số âm' })
  originalPrice?: number;

  // --- Bổ sung Quy cách & Điều kiện bảo quản ---
  @ApiPropertyOptional({ example: 'Đóng hộp 500g, hút chân không' })
  @IsOptional()
  @IsString()
  specification?: string;

  @ApiPropertyOptional({ example: 'Bảo quản ngăn mát tủ lạnh 2 - 5°C' })
  @IsOptional()
  @IsString()
  storageCondition?: string;
}