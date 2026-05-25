import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class InviteStaffDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum([Role.ORG_STAFF, Role.UNIT_OPERATOR])
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsOptional()
  unitId?: string;
}
