import { HydratedDocument, now } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null })
  repost: string;

  @Prop([String])
  images: string[];
  @Prop({ default: 'post' })
  type: string;

  @Prop({ default: now() })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
