import { IsDateString, IsNotEmpty, IsObject } from 'class-validator';

export class UpsertDailyLogDto {
  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @IsNotEmpty()
  @IsObject()
  payload: Record<string, unknown>;
}
