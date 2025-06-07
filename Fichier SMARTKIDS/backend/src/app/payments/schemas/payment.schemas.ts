import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentContext } from '../types/payment.types';
import { UserDocument } from 'src/app/users/schemas/users.schema';

export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentTypeEnum {
  RIDE = 'ride',
  SUBSCRIPTION = 'subscription',
}

export const PAYMENT_TYPES = [
  PaymentTypeEnum.RIDE,
  PaymentTypeEnum.SUBSCRIPTION,
];

export enum PaymentStatusEnum {
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
}

export const PAYMENT_STATUSES = [
  PaymentStatusEnum.COMPLETED,
  PaymentStatusEnum.REFUNDED,
];

@Schema()
export class Payment {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String })
  number: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ required: true, type: String, enum: PAYMENT_TYPES })
  type: PaymentTypeEnum;

  @Prop({
    required: true,
    default: PaymentStatusEnum.COMPLETED,
    type: String,
    enum: PAYMENT_STATUSES,
  })
  status: PaymentStatusEnum;

  @Prop({ required: true, type: Types.ObjectId })
  ref: Types.ObjectId; // Either a subscription or a ride.

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: Types.ObjectId | UserDocument;

  @Prop({ required: false, type: Object, default: null })
  context: PaymentContext;

  @Prop({ default: null, type: String })
  paymentIntentId: string;

  @Prop({ default: null, type: String })
  paypalOrderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: PaymentDocument = ret as PaymentDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

PaymentSchema.set('toJSON', { ...serializationCfg });
