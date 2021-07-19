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

  async getUserRegister(userId: string) {
    await this.userService.findUserAsync(userId);

    const userRegister = await this.userRegisterModel
      .findOne({ user_id: userId })
      .exec();

    if (!userRegister)
      throw new HttpException(
        'Este usuário não tem registro.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return this.getUserRegisterData(userRegister);
  }

  async saveUserRegister(userRegisterDto: UserRegisterDto, userId: string) {
    const user = await this.userService.findUserAsync(userId);

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

    await this.userService.updateUser(userId, {
      name: user.name,
      email: user.email,
      user_registration: true,
    });
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

  getUserRegisterData(data: UserRegisterDocument): UserRegisterDto {
    return {
      id: data._id,
      user_id: data.user_id,
      nationality: data.nationality,
      birthdate: data.birthdate,
      phone: data.phone,
      schoolinfo: data.schoolinfo,
      languageinfo: data.languageinfo,
      zipcode: data.zipcode,
      neighborhood: data.neighborhood,
      street: data.street,
      state: data.state,
      city: data.city,
      number: data.number,
      complement: data.complement,
      updated_at: data.updated_at,
    };
  }
}
