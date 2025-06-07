import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentCounterSchemaDocument = HydratedDocument<PaymentCounter>;

@Schema()
export class PaymentCounter {
  @Prop({
    type: Number,
    default: 0,
  })
  value: number;
}

export const PaymentCounterSchema =
  SchemaFactory.createForClass(PaymentCounter);
