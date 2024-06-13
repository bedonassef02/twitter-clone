import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  followerId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  followingId: string;
  @Prop({ default: false })
  accepted: boolean;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
