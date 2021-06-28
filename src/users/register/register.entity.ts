import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRegisterDocument = UserRegister & Document;

@Schema()
export class UserRegister {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ required: true })
  phone: string;

  @Prop()
  nationality: string;

  @Prop()
  schoolinfo: string;

  @Prop()
  languageinfo: string;

  @Prop({ required: true })
  zipcode: number;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  number: number;

  @Prop()
  complement: string;

  @Prop({ timestamps: true, default: Date.now })
  created_at: Date;

  @Prop({ timestamps: true, default: Date.now })
  updated_at: Date;
}

export const UserRegisterSchema = SchemaFactory.createForClass(UserRegister);
