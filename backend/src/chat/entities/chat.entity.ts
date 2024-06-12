import { HydratedDocument, now } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  senderId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  receiverId: string;
  @Prop()
  content: string;
  @Prop({ default: false })
  seen: boolean;
  @Prop()
  seenAt: Date;
  @Prop({ default: now() })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
