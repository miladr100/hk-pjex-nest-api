import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = ImageRegister & Document;

@Schema()
export class ImageRegister {
  @Prop({ required: true })
  image_url: string;

  @Prop({ required: true })
  id_user_association: string;

  @Prop({ required: true })
  asset_id: string;

  @Prop({ required: true })
  public_id: string;

  @Prop()
  format: string;

  @Prop()
  bytes: number;

  @Prop({ timestamps: true, default: Date.now })
  created_at: Date;

  @Prop({ timestamps: true, default: Date.now })
  updated_at: Date;
}

export const ImageSchema = SchemaFactory.createForClass(ImageRegister);
