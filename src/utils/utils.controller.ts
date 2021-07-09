import {
  Controller,
  UseGuards,
  Headers,
  Body,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('utils')
export class UtilsController {
  constructor(private cloudinary: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Headers('Authorization') token: string,
  ) {
    return await this.cloudinary.uploadImageAndRegister(
      image,
      token.split(' ')[1],
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('upload/image')
  async deleteUploadedImage(
    @Headers('Authorization') token: string,
    @Body('url') imageUrl: string,
  ) {
    return await this.cloudinary.deleteImageRegisterByUrl(
      imageUrl,
      token.split(' ')[1],
    );
  }
}
