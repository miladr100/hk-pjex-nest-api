import { CloudinaryModule } from './utils/cloudinary/cloudinary.module';
import { UtilsModule } from './utils/utils.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserRegisterModule } from './users/register/register.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    CloudinaryModule,
    UtilsModule,
    HttpModule,
    BcryptModule,
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    UserRegisterModule,
    ProductsModule,
    MongooseModule.forRoot(process.env.DATABASE_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
