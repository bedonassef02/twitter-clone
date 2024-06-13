import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ default: null })
  profileImage: string;
  @Prop({ default: null })
  coverImage: string;
  @Prop({ default: null })
  bio: string;
  @Prop({ default: null })
  birthDate: Date;
  @Prop({ default: null })
  location: string;
  @Prop({ default: null })
  website: string;
  @Prop({ default: false })
  isPrivate: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
