import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SubscriptionPlan } from './subscription-plan.schema';
import { UserDocument } from 'src/app/users/schemas/users.schema';
import { PaymentMethodTypeEnum } from 'src/app/payments/schemas/payment-method.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export const PAYMENT_METHOD_TYPES = [
  PaymentMethodTypeEnum.PAYPAL,
  PaymentMethodTypeEnum.STRIPE,
];

@Schema()
export class Subscription {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId, unique: true })
  user: Types.ObjectId | UserDocument;

  @Prop({ required: true, type: String, enum: PAYMENT_METHOD_TYPES, default: PaymentMethodTypeEnum.STRIPE })
  paymentMethodType: PaymentMethodTypeEnum;

  @Prop({ required: true, type: Types.ObjectId, ref: 'SubscriptionPlan' })
  plan: Types.ObjectId | SubscriptionPlan;

  @Prop({ type: String, default: null })
  stripeSubscriptionId: string | null;

  @Prop({ required: true, type: String, default: 'active' })
  stripePriceId: string;

  @Prop({ type: String, default: null })
  paypalSubscriptionId: string | null;

  @Prop({ type: String, default: null })
  paypalPlanId: string | null;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.set('timestamps', true);
SubscriptionSchema.index({ user: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ paymentMethodType: 1 });

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: SubscriptionDocument = ret as SubscriptionDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

SubscriptionSchema.set('toJSON', { ...serializationCfg });
