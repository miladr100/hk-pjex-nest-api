import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.entity';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { UserDto } from './user.dto';
import { UserRegisterService } from './register/register.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private bcryptService: BcryptService,
  ) {}

  async createUser(userDto: UserDto) {
    const findUserExists = await this.getUserByEmail(userDto.email);
    if (findUserExists) {
      throw new HttpException('Este e-mail já existe.', 422);
    }

    const salt = await this.bcryptService.bcryptGenSaltAsync();
    const hashPass = await this.bcryptService.hashedPasswordAsync(
      userDto.password,
      salt,
    );

    const createdUser = new this.userModel({ ...userDto, password: hashPass });
    const result = await createdUser.save();
    return result.id as string;
  }

  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      user_registration: user.user_registration,
      company_registration: user.company_registration,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })) as UserDto[];
  }

  async getUserById(id: string) {
    const user = await this.findUserAsync(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      user_registration: user.user_registration,
      company_registration: user.company_registration,
      created_at: user.created_at,
      updated_at: user.updated_at,
    } as UserDto;
  }

  async getUserByEmail(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail }).exec();
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      user_registration: user.user_registration,
      company_registration: user.company_registration,
      created_at: user.created_at,
      updated_at: user.updated_at,
    } as UserDto;
  }

  async updateUser(userId: string, userDto: UserDto) {
    if (Object.keys(userDto).length == 0)
      throw new HttpException('Erro, nenhum dado enviado.', 400);
    try {
      userDto = { ...userDto, updated_at: new Date() };
      return this.userModel
        .updateOne({ _id: userId }, { $set: userDto }, { new: true })
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

  async findUserAsync(id: string): Promise<UserDocument> {
    let user: any;
    try {
      user = await this.userModel.findById(id);
      if (user) return user;
      else throw new NotFoundException('Usuário não encontrado.');
    } catch (err) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
