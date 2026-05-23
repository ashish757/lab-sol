import { IsDateString, IsNotEmpty, IsObject } from 'class-validator';

export class InsertDailyLogDto {
  @IsNotEmpty()
  @IsDateString()
  logDate: string;

  @IsNotEmpty()
  @IsObject()
  metrics: Record<string, unknown>;
}
