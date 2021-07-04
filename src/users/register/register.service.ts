import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

import { UserRegister, UserRegisterDocument } from './register.entity';
import { UserRegisterDto } from './register.dto';

@Injectable()
export class UserRegisterService {
  constructor(
    @InjectModel(UserRegister.name)
    private userRegisterModel: Model<UserRegisterDocument>,
    private userService: UsersService,
  ) {}

  async saveUserRegister(userRegisterDto: UserRegisterDto, userId: string) {
    await this.userService.findUserAsync(userId);

    const userRegister = await this.userRegisterModel
      .findOne({ user_id: userId })
      .exec();

    if (userRegister)
      throw new HttpException(
        'Este registro de usuário já existe.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const createdUserRegister = new this.userRegisterModel({
      ...userRegisterDto,
      user_id: userId,
    });
    const result = await createdUserRegister.save();
    return result.id as string;
  }

  async updateUserRegister(userRegisterDto: UserRegisterDto, userId: string) {
    if (Object.keys(userRegisterDto).length == 0)
      throw new HttpException(
        'Erro, nenhum dado enviado.',
        HttpStatus.BAD_REQUEST,
      );

    const userRegister = await this.userRegisterModel
      .findOne({ user_id: userId })
      .exec();

    userRegisterDto = { ...userRegisterDto, updated_at: new Date() };

    try {
      return this.userRegisterModel
        .updateOne(
          { _id: userRegister.id },
          { $set: userRegisterDto },
          { new: true },
        )
        .exec();
    } catch (err) {
      throw new HttpException(
        'Erro do servidor.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async deleteUserRegister(userId: string) {
    const userRegister = await this.userRegisterModel
      .findOne({ user_id: userId })
      .exec();

    if (!userRegister)
      throw new HttpException(
        'Este usuário não existe.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.userRegisterModel.deleteOne({ _id: userRegister._id }).exec();
    return await this.userService.deleteUser(userId);
  }
}
