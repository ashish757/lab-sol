import { IsDateString, IsNotEmpty, IsObject } from 'class-validator';

export class IpsertDailyLogDto {
  @IsNotEmpty()
  @IsDateString()
  logDate: string;

  @IsNotEmpty()
  @IsObject()
  metrics: Record<string, unknown>;
}
