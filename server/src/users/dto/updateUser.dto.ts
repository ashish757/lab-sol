import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
