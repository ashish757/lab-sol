import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InviteOrgDto {
  @IsString()
  @IsNotEmpty()
  orgName: string;

  @IsString()
  @IsOptional()
  orgId?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
