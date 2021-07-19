import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from 'src/utils/cloudinary/cloudinary.provider';
import { AuthModule } from 'src/auth/auth.module';
import { ImageRegister, ImageSchema } from './image.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ImageRegister.name, schema: ImageSchema },
    ]),
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
