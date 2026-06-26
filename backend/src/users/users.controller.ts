import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { checkRole } from '../auth/auth.helper';
import { Role } from '../auth/role.enum';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    // req.user được set bởi JWT strategy
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @Get()
  findAll(@Req() req: any) {
    checkRole(req, [Role.ADMIN]);
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  updateRole(@Req() req: any, @Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    checkRole(req, [Role.ADMIN]);
    return this.usersService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    checkRole(req, [Role.ADMIN]);
    return this.usersService.remove(id);
  }
}
