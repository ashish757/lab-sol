import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  seasonStartDate?: string;

  @IsString()
  @IsOptional()
  seasonStartTime?: string;

  @IsString()
  @IsOptional()
  seasonEndDate?: string;

  @IsString()
  @IsOptional()
  seasonEndTime?: string;
}
