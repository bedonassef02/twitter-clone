import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SecretKeyDocument = HydratedDocument<SecretKey>;

@Schema()
export class SecretKey {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
  @Prop()
  secret: string;
}

export const SecretKeySchema = SchemaFactory.createForClass(SecretKey);
