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
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Chủ cửa hàng thêm chứng nhận cho sản phẩm' })
  create(@Req() req: any, @Body() createCertificateDto: CreateCertificateDto) {
    return this.certificatesService.create(
      req.user.userId,
      createCertificateDto,
    );
  }

  // API Public
  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy danh sách các chứng nhận của một sản phẩm' })
  findByProduct(@Param('productId') productId: string) {
    return this.certificatesService.findByProduct(productId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Chủ cửa hàng cập nhật chứng nhận' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return this.certificatesService.update(
      req.user.userId,
      id,
      updateCertificateDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa chứng nhận' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.certificatesService.remove(req.user.userId, req.user.role, id);
  }
}
