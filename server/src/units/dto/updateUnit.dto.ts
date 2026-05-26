import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
