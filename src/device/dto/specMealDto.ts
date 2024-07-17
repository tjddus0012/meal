import { BuildingType } from '@prisma/client';
import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';

export class SpecMealDto {
  @IsNotEmpty()
  @IsEnum(BuildingType)
  buildingType: BuildingType;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
