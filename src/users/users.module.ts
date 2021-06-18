import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';

@Module({
  imports: [
    BcryptModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
