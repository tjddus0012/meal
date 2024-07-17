import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class createImageURLDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image_url: string;
}
