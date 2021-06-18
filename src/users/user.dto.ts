import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
