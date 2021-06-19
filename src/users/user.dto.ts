import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  id?: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  password: string;
}
