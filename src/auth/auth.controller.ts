import {
  Controller,
  UseGuards,
  Body,
  Headers,
  Request,
  Post,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() userEmail: string, @Body() userPassword: string) {
    return this.authService.login({ email: userEmail, password: userPassword });
  }

  @Get('auth/user')
  async getUser(@Headers('Authorization') token: string) {
    return await this.authService.verifyUser(token.split(' ')[1]);
  }

  @Post('auth/logout')
  async logoutUser(@Body('token') token: string) {
    return await this.authService.logout(token);
  }
}
