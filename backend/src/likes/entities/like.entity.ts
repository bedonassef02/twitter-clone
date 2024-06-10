import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
