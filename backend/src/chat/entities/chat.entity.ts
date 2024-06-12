import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  senderId: string;
  @Prop()
  receiverId: string;
  @Prop()
  content: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
