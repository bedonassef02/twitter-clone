import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: string;
  @Prop()
  type: string;
  @Prop({ default: false })
  seen: boolean;
  @Prop()
  from: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
