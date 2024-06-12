import mongoose, { HydratedDocument, now } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BookmarkDocument = HydratedDocument<Bookmark>;

@Schema()
export class Bookmark {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null })
  post: string;
  @Prop({ default: now() })
  createdAt: Date;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
