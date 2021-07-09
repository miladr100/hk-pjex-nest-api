import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import toStream = require('buffer-to-stream');

import { ImageRegister, ImageDocument } from './image.entity';
import { ImageDto } from './image.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectModel(ImageRegister.name) private imageModel: Model<ImageDocument>,
    private authService: AuthService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async uploadImageAndRegister(file: Express.Multer.File, token: string) {
    const { secure_url, asset_id, public_id, format, bytes } =
      await this.uploadImageToCloudinary(file);
    const { id } = await this.authService.verifyUser(token);

    const newImg = {
      id_user_association: id,
      image_url: secure_url,
      asset_id,
      public_id,
      format,
      bytes,
    } as ImageDto;

    const createdImgRegistration = new this.imageModel({ ...newImg });
    try {
      const {
        id_user_association,
        image_url,
        asset_id,
        public_id,
        format,
        bytes,
      } = await createdImgRegistration.save();
      return {
        id_user_association,
        image_url,
        asset_id,
        public_id,
        format,
        bytes,
      };
    } catch (err) {
      throw new HttpException(
        'Erro do servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImageRegisterByUrl(url: string, token: string) {
    const { id } = await this.authService.verifyUser(token);

    const imageRegister = await this.imageModel
      .findOne({ image_url: url })
      .exec();

    if (!imageRegister)
      throw new HttpException(
        'Esta imagem não existe.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    if (imageRegister.id_user_association != id)
      throw new HttpException(
        'Esta imagem não pertence a este usuário.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    try {
      await this.imageModel.deleteOne({ _id: imageRegister._id }).exec();
      return null;
    } catch (err) {
      throw new HttpException(
        'Erro do servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
