import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  user_registration: boolean;

  @Prop({ default: false })
  company_registration: boolean;

  @Prop({ timestamps: true, default: Date.now })
  created_at: Date;

  @Prop({ timestamps: true, default: Date.now })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
