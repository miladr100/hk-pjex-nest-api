import { UtilsController } from './utils.controller';
import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [UtilsController],
  providers: [],
})
export class UtilsModule {}
