import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BillingDocument = HydratedDocument<Billing>;
@Schema({ timestamps: true })
export class Billing {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
