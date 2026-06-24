import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger'; // <-- Thêm thư viện của Swagger
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiBearerAuth() // Hiện ổ khóa bảo mật cho tất cả các API trong file này
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @UseGuards(AuthGuard('jwt')) 
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data') // 1. Báo cho Swagger biết đây là dạng gửi File (Form Data)
  @ApiBody({ // 2. Vẽ giao diện Form cho Swagger
    schema: {
      type: 'object',
      properties: {
        // Nút chọn file ảnh
        image: {
          type: 'string',
          format: 'binary',
          description: 'Bấm để chọn file ảnh từ máy tính của em',
        },
        // Các trường dữ liệu đi kèm
        name: { type: 'string', example: 'Cà chua hữu cơ Mộc Châu' },
        description: { type: 'string', example: 'Cà chua hái tại vườn, tươi ngon' },
        origin: { type: 'string', example: 'Mộc Châu, Sơn La' },
        unit: { type: 'string', example: 'kg' },
        price: { type: 'number', example: 35000 },
        quantity: { type: 'number', example: 50 },
        categoryId: { type: 'string', description: 'Dán ID của Category vào đây' },
        storeId: { type: 'string', description: 'Dán ID của Store vào đây' },
        harvestDate: { type: 'string', example: '2026-06-25T00:00:00Z' },
        expiryDate: { type: 'string', example: '2026-06-30T00:00:00Z' },
      },
    },
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: any 
  ) {
    if (file) {
      // Bơm ảnh lên Cloudinary và lấy link gắn vào DTO
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      createProductDto.imageUrl = uploadResult.secure_url;
    }
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}