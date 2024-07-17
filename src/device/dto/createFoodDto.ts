import { Language } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class createFoodDto {
  @IsString()
  name: string;

  @IsEnum(Language)
  language: Language;

  @IsOptional()
  image_url?: string;
}
