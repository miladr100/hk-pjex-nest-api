import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './user.dto';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(@Body() createUserDto: UserDto) {
    const generatedId = await this.usersService.createUser(createUserDto);
    return { id: generatedId };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getUsers();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return await this.usersService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() createUserDto: UserDto,
  ) {
    await this.usersService.updateUser(userId, createUserDto);
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeUser(@Param('id') userId: string) {
    const respose = await this.usersService.deleteUser(userId);
    return respose;
  }
}
