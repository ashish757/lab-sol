import { IsNumber, IsOptional, Min } from 'class-validator';

export class UnlockLogDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  hours?: number;
}
