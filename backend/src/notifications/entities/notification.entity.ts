import { HydratedDocument, now } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false })
  post: string;
  @Prop()
  type: string;
  @Prop({ default: false })
  seen: boolean;
  @Prop()
  from: string;

  @Prop({ default: now() })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
