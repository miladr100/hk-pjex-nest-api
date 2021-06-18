import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async validateUser(userEmail: string, userPassword: string) {
    const user = await this.userService.getUserByEmail(userEmail);

    if (!user)
      throw new HttpException(
        'Erro, e-mail não cadastrado.',
        HttpStatus.UNAUTHORIZED,
      );

    const resultOfCompareHash = await this.bcryptService.comparePasswordAsync(
      userPassword,
      user?.password,
    );

    if (!resultOfCompareHash)
      throw new HttpException('Senha inválida', HttpStatus.UNAUTHORIZED);

    return { id: user.id, name: user.name, email: user.email };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
