import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  id?: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  password?: string;

  user_registration?: boolean;

  company_registration?: boolean;

  updated_at?: Date;
}
