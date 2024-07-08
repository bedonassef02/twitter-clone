import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ versionKey: false })
export class Account {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
  @Prop()
  phone: string;
  @Prop()
  email: string;
  @Prop()
  country: string;
  @Prop()
  gender: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
