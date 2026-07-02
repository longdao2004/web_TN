import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductBatchesService } from './product-batches.service';
import { CreateProductBatchDto } from './dto/create-product-batch.dto';
import { UpdateProductBatchDto } from './dto/update-product-batch.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('product-batches')
@Controller('product-batches')
export class ProductBatchesController {
  constructor(private readonly productBatchesService: ProductBatchesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Chủ cửa hàng thêm lô hàng mới cho sản phẩm' })
  create(
    @Req() req: any,
    @Body() createProductBatchDto: CreateProductBatchDto,
  ) {
    return this.productBatchesService.create(
      req.user.userId,
      createProductBatchDto,
    );
  }

  // API Public: Cho phép hiển thị các lô hàng (thông tin hạn sử dụng, xuất xứ...)
  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy danh sách các lô hàng của một sản phẩm' })
  findByProduct(@Param('productId') productId: string) {
    return this.productBatchesService.findByProduct(productId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Chủ cửa hàng cập nhật lô hàng' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateProductBatchDto: UpdateProductBatchDto,
  ) {
    return this.productBatchesService.update(
      req.user.userId,
      id,
      updateProductBatchDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lô hàng' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.productBatchesService.remove(
      req.user.userId,
      req.user.role,
      id,
    );
  }
}
