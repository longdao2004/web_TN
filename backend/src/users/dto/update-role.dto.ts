import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/role.enum';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, example: Role.SELLER })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
