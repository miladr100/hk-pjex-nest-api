import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { jwtConstants } from './constants';

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
      user_id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyUser(token: string) {
    if (!(await this.verifyTokenAsync(token)))
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);

    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      const user = await this.userService.getUserByEmail(decoded.email.email);
      return { id: user.id, name: user.name, email: user.email };
    } catch (err) {
      if (err.name == 'JsonWebTokenError')
        throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    }
  }

  async logout(token: string) {
    if (token)
      return {
        statusCode: 200,
        message: 'Usuario deslogado.',
      };
    throw new HttpException('Erro, token inválido.', HttpStatus.BAD_REQUEST);
  }

  async verifyTokenAsync(token: string) {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (err) {
      return false;
    }
  }

  // async signPayload(user: any) {
  //   return sign(user, jwtConstants.secret, { expiresIn: '3600s' });
  // }
}
