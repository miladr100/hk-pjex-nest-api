import { IsNotEmpty, IsString } from 'class-validator';

export class ImageDto {
  id?: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  id_user_association: string;

  @IsString()
  @IsNotEmpty()
  asset_id: string;

  @IsString()
  @IsNotEmpty()
  public_id: string;

  format?: string;
  bytes?: number;

  updated_at?: Date;
}
