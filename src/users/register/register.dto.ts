import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UserRegisterDto {
  id?: string;

  user_id?: string;

  @IsString()
  birthdate: Date;

  @IsString()
  phone: string;

  @IsNumber()
  zipcode: number;

  @IsString()
  neighborhood: string;

  @IsString()
  street: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  nationality?: string;

  schoolinfo?: string;

  languageinfo?: string;

  number?: number;

  complement?: string;

  updated_at?: Date;
}
