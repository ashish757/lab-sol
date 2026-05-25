import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SetupAccountDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  updatedOrgName: string;

  @IsString()
  @IsNotEmpty()
  adminName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
