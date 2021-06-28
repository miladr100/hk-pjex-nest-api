import { UserRegisterService } from './register.service';
import { UserRegisterController } from './register.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRegister, UserRegisterSchema } from './register.entity';
import { UsersModule } from '../users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: UserRegister.name, schema: UserRegisterSchema },
    ]),
  ],
  controllers: [UserRegisterController],
  providers: [UserRegisterService],
  exports: [],
})
export class UserRegisterModule {}
