import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.entity';
import { UserDto } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userDto: UserDto) {
    const findUserExists = await this.getUserByEmail(userDto.email);
    if (findUserExists) {
      throw new HttpException('Este e-mail já existe.', 422);
    }
    const createdUser = new this.userModel(userDto);
    const result = await createdUser.save();
    return result.id as string;
  }

  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    })) as UserDto[];
  }

  async getUserById(id: string) {
    const user = await this.findUserAsync(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    } as UserDto;
  }

  async getUserByEmail(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail }).exec();
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    } as UserDto;
  }

  async updateUser(prodId: string, userDto: UserDto) {
    if (Object.keys(userDto).length == 0)
      throw new HttpException('Erro, nenhum dado enviado.', 400);
    try {
      return this.userModel
        .updateOne({ _id: prodId }, { $set: userDto }, { new: true })
        .exec();
    } catch (err) {
      throw new HttpException('Erro do servidor.', 500);
    }
  }

  async deleteUser(id: string) {
    await this.findUserAsync(id);
    try {
      await this.userModel.deleteOne({ _id: id }).exec();
      return {
        statusCode: 200,
        message: 'Usuario deletado.',
      };
    } catch (err) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  private async findUserAsync(id: string): Promise<UserDocument> {
    let user;
    try {
      user = await this.userModel.findById(id);
      if (user) return user;
      else throw new NotFoundException('Usuário não encontrado.');
    } catch (err) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
