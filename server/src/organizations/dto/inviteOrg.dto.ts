import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteOrgDto {
  @IsString()
  @IsNotEmpty()
  orgName: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;
}
