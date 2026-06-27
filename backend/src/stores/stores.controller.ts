import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { checkRole } from '../auth/auth.helper';
import { Role } from '../auth/role.enum';

@ApiTags('stores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Req() req: any, @Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(req.user.userId, createStoreDto);
  }

  @Get('my-store')
  getMyStore(@Req() req: any) {
    return this.storesService.getMyStore(req.user.userId);
  }

  @Patch('my-store')
  update(@Req() req: any, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(req.user.userId, updateStoreDto);
  }

  @Get()
  findAll(@Req() req: any) {
    checkRole(req, [Role.ADMIN]);
    return this.storesService.findAll();
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    checkRole(req, [Role.ADMIN]);
    return this.storesService.remove(id);
  }
}
