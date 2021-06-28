import {
  Controller,
  UseGuards,
  Headers,
  Body,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { UserRegisterDto } from './register.dto';
import { UserRegisterService } from './register.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users/register')
export class UserRegisterController {
  constructor(private userRegisterService: UserRegisterService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async addUserRegister(
    @Param('id') userId: string,
    @Body() createUserRegisterDto: UserRegisterDto,
  ) {
    const response = await this.userRegisterService.saveUserRegister(
      createUserRegisterDto,
      userId,
    );
    return { id: response };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUserRegister(
    @Param('id') userId: string,
    @Body() createUserRegisterDto: UserRegisterDto,
  ) {
    const response = await this.userRegisterService.updateUserRegister(
      createUserRegisterDto,
      userId,
    );
    return null;
  }
}
