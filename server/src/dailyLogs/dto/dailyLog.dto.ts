import { IsDateString, IsNotEmpty, IsObject } from 'class-validator';

export class UpsertDailyLogDto {
  @IsNotEmpty()
  @IsDateString()
  logDate: string;

  @IsNotEmpty()
  @IsObject()
  metrics: Record<string, unknown>;
}
