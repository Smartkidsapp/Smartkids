import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from 'src/app/users/schemas/users.schema';

export type PaymentMethodDocument = HydratedDocument<PaymentMethod>;

export enum PaymentMethodTypeEnum {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

export const PAYMENT_METHOD_TYPES = [
  PaymentMethodTypeEnum.STRIPE,
  PaymentMethodTypeEnum.PAYPAL,
];

@Schema()
export class PaymentMethod {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: String, enum: PAYMENT_METHOD_TYPES })
  type: PaymentMethodTypeEnum;

  @Prop({ required: true, type: String })
  value: string; // stripeIntentId or email address

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: Types.ObjectId | UserDocument;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);

PaymentMethodSchema.set('timestamps', true);
PaymentMethodSchema.index(
  {
    user: 1,
    type: -1,
  },
  {
    unique: true,
  },
);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: PaymentMethodDocument = ret as PaymentMethodDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

PaymentMethodSchema.set('toJSON', { ...serializationCfg });
// PaymentMethodSchema.set('toObject', { ...serializationCfg });
