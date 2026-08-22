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
  Query
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { checkRole } from '../auth/auth.helper';
import { Role } from '../auth/role.enum';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(req.user.userId, createStoreDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('my-store')
  getMyStore(@Req() req: any) {
    return this.storesService.getMyStore(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('my-store')
  update(@Req() req: any, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(req.user.userId, updateStoreDto);
  }

  // Public API for buyers to see all stores
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('province') province?: string,
    @Query('sort') sort?: string,
  ) {
    return this.storesService.findAll({ search, province, sort });
  }

  // Public API for buyers to see store details
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    checkRole(req, [Role.ADMIN]);
    return this.storesService.remove(id);
  }
}
