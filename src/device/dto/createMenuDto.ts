import {
  BuildingType,
  Food,
  FoodName,
  Language,
  MenuType,
} from '@prisma/client';
import {
  IsDate,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  isEnum,
} from 'class-validator';

class LocalFoodName {
  @IsString()
  name: string;

  @IsEnum(Language)
  language: Language;
}

class LocalFood {
  @IsOptional()
  image_url?: string;

  foodName: LocalFoodName;
}

export class createMenuDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsEnum(BuildingType)
  buildingType: BuildingType;

  @IsNotEmpty()
  @IsEnum(MenuType)
  type: MenuType;

  @IsJSON()
  @IsNotEmpty()
  food: LocalFood[];
}
