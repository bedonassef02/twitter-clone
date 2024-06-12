import { HydratedDocument, now } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type BlockDocument = HydratedDocument<Block>;
@Schema()
export class Block {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  blockedUserId: string;
  @Prop({ default: now() })
  createdAt: Date;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
