import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(name: string, email: string, password: string) {
    const createdUser = new this.userModel({ name, email, password });
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
    })) as User[];
  }

  async getUserById(id: string) {
    const user = await this.findUserAsync(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    } as User;
  }

  async getUserByEmail(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail }).exec();
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    } as User;
  }

  async updateUser(id: string, name: string, email: string, password: string) {
    const updatedUser = await this.findUserAsync(id);
    if (name) {
      updatedUser.name = name;
    }
    if (email) {
      updatedUser.email = email;
    }
    if (password) {
      updatedUser.password = password;
    }
    updatedUser.save();
  }

  async deleteUser(id: string) {
    try {
      await this.userModel.deleteOne({ _id: id }).exec();
    } catch (err) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  private async findUserAsync(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id);
      return user;
    } catch (err) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
