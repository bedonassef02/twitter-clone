import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  username: string;
  @Prop()
  password: string;
  @Prop()
  googleId: string;

  @Prop()
  twoFactorSecret?: string;
  @Prop({ default: false })
  isTwoFactorAuthenticated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
